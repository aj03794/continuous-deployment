import { assert } from 'chai'

import { createSubject } from './infrastructure/rxjs'
import { logger } from './infrastructure/logger'
import { initializeApplicationHandler } from './application-handler'
import { createTasks } from './tasks'

describe('Downloader application', () => {

    const fakeGcpMessage = {
        repository: {
            owner: {
                login: "aj03794"
            },
            clone_url: "https://github.com/aj03794/raspberry-pi-camera.git",
        }
    }

    const tasks = createTasks()

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


})