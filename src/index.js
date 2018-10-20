import { createSubject } from './infrastructure/rxjs'
import { logger } from './infrastructure/logger'
import { initializePubSubProviders } from './infrastructure/pubsub'
import { initalizeApplicationHandler } from './application-handler'
import { createTasks } from './tasks'

const {
	next: newPubSubMessage,
	filter: pubSubMessageFilter,
	subscribe: pubSubMessageSubscription
} = createSubject()

const tasks = createTasks()

initalizeApplicationHandler({
	pubSubMessageSubscription,
    logger,
    ...tasks
})