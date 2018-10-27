import { assert } from 'chai'
import { existsSync, removeSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { homedir } from 'os'

import { createSubject } from './infrastructure/rxjs'
import { logger } from './infrastructure/logger'
import { initializeApplicationHandler } from './application-handler'
import { application } from './application'
import { createTasks } from './tasks'
import { getSetting } from './infrastructure/settings'
import { checkIfOldVersionOfAppIsRunning } from './infrastructure/pm2'
import { execSync } from 'child_process'

process.argv[2] = 'dev'

describe('Downloader application', () => {

    // mock-app corresponds to the mock-app directory that lives at the
    // root of the project dir - it is purely for testing purposes
    const fakeGcpMessage = {
        release: {
            tag_name: '0.0.2'
        },
        repository: {
            name: "mock-app",
            owner: {
                login: "aj03794"
            },
            clone_url: "https://github.com/aj03794/raspberry-pi-camera.git",
        }
    }

    const tasks = createTasks({
        logger,
        getSetting,
        checkIfOldVersionOfAppIsRunning
    })

    it('should call application function inside of application-handler', done => {

        const {
            next: newPubSubMessage,
            filter: pubSubMessageFilter,
            subscribe: pubSubMessageSubscription
        } = createSubject()

        initializeApplicationHandler({
            pubSubMessageSubscription,
            logger,
            ...tasks
        })
        .then(() => {
            newPubSubMessage(fakeGcpMessage)
        })
        .then(() => {
            done()
        })

    })

    it.only('should perform tasks in the application layer with an existing application', done => {

        const msg = fakeGcpMessage

        const {
            type,
            downloadsDirectory
         } = getSetting('downloadAppRelease')
        const downloadsDirectoryFullPath = resolvePath(homedir(), downloadsDirectory)

        const mockAppDir = resolvePath('mock-app_0.0.2')

        execSync(`pm2 start index.js --name mock-app_0.0.1 --no-autorestart`, {
            cwd: mockAppDir
        })

        const expectedApp = resolvePath(downloadsDirectoryFullPath, 'mock-app_0.0.2')
        const expectedZip = resolvePath(downloadsDirectoryFullPath, 'mock-app_0.0.2.zip')

        application({ ...tasks, msg })
            .then(() => {
                console.log('then block of application')
                assert.equal(true, existsSync(downloadsDirectoryFullPath))
                assert.equal(true, existsSync(expectedApp))
                assert.equal(false, existsSync(expectedZip))
                assert.equal('false\n', execSync(`pm2 list | grep mock-app_0.0.1 && echo true || echo false`).toString())
                assert.equal('true\n', execSync(`pm2 list | grep mock-app_0.0.2 >/dev/null 2>&1 && echo true || echo false`).toString())
                removeSync(downloadsDirectoryFullPath)
                execSync(`pm2 delete mock-app_0.0.2`)
                done()
            })
            .catch(err => {
                console.log('error', err)
            })
        

    })

    it.only('should perform tasks in the application layer with a new app', done => {

        const msg = fakeGcpMessage

        const {
            type,
            downloadsDirectory
         } = getSetting('downloadAppRelease')
        const downloadsDirectoryFullPath = resolvePath(homedir(), downloadsDirectory)

        const expectedApp = resolvePath(downloadsDirectoryFullPath, 'mock-app_0.0.2')
        const expectedZip = resolvePath(downloadsDirectoryFullPath, 'mock-app_0.0.2.zip')

        application({ ...tasks, msg })
            .then(() => {
                console.log('then block of application')
                assert.equal(true, existsSync(downloadsDirectoryFullPath))
                assert.equal(true, existsSync(expectedApp))
                assert.equal(false, existsSync(expectedZip))
                assert.equal('true\n', execSync(`pm2 list | grep mock-app_0.0.2 >/dev/null 2>&1 && echo true || echo false`).toString())
                removeSync(downloadsDirectoryFullPath)
                execSync(`pm2 delete mock-app_0.0.2`)
                done()
            })
            .catch(err => {
                console.log('error', err)
            })
        

    })

    it.only('should pass', done => {
        done()
    })


})