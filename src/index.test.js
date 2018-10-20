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

process.argv[2] = 'dev'

describe('Downloader application', () => {

    const fakeGcpMessage = {
        repository: {
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

    it('should pass', done => {
        done()
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

        const {
            type,
            downloadsDirectory
         } = getSetting('downloadAppRelease')
         const downloadsDirectoryFullPath = resolvePath(homedir(), downloadsDirectory)

        application(tasks)
            .then(() => {
                assert.equal(true, existsSync(downloadsDirectoryFullPath))
                removeSync(downloadsDirectoryFullPath)
                done()
            })

    })


})