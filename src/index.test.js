import { assert } from 'chai'
import { existsSync, removeSync } from 'fs-extra'
import { resolve as resolvePath } from 'path'
import { homedir } from 'os'
import pm2 from 'pm2'

import { createSubject } from './infrastructure/rxjs'
import { logger } from './infrastructure/logger'
import { initializeApplicationHandler } from './application-handler'
import { application } from './application'
import { createTasks } from './tasks'
import { getSetting } from './infrastructure/settings'
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
        getSetting
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

    it.only('should perform steps in the application layer', done => {

        const msg = fakeGcpMessage

        const {
            type,
            downloadsDirectory
         } = getSetting('downloadAppRelease')
        const downloadsDirectoryFullPath = resolvePath(homedir(), downloadsDirectory)

        const mockAppDir = resolvePath('mock-app')

        // execSync(`pm2 start index.js --name mock-app-0.0.1`, {
        //     cwd: mockAppDir
        // })

        const pm2AppsRunning = pm2.list((err, processes) => {
            return processes.map(({ name }) => {
                console.log({
                    name
                })
                return name
            })
        })

        console.log({
            pm2AppsRunning
        })

        const expectedApp = resolvePath(downloadsDirectoryFullPath, 'mock-app')
        const expectedZip = resolvePath(downloadsDirectoryFullPath, 'mock-app.zip')

        // application({ ...tasks, msg })
        //     .then(() => {
        //         assert.equal(true, existsSync(downloadsDirectoryFullPath))
        //         assert.equal(true, existsSync(expectedApp))
        //         assert.equal(false, existsSync(expectedZip))
        //         assert.equal(false, pm2.list().some(app => app === 'mock-app-0.0.1'))
        //         removeSync(downloadsDirectoryFullPath)
                // execSync(`pm2 delete mock-app-0.0.2`)
                // done()
            // })
            // .catch(err => {
            //     console.log('error', err)
            // })

    })


})