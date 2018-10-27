import { checkIfOldVersionOfAppIsRunning } from './infrastructure/pm2'
import { createSubject } from './infrastructure/rxjs'
import { logger } from './infrastructure/logger'
import { initializePubSubProviders } from './infrastructure/pubsub'
import { initializeApplicationHandler } from './application-handler'
import { createTasks } from './tasks'
import { getSetting } from './infrastructure/settings'

const {
	next: newPubSubMessage,
	filter: pubSubMessageFilter,
	subscribe: pubSubMessageSubscription
} = createSubject()

const tasks = createTasks({
	logger,
	getSetting,
	checkIfOldVersionOfAppIsRunning
})

initializeApplicationHandler({
	pubSubMessageSubscription,
    logger,
    ...tasks
})
.then(() => {
	initializePubSubProviders({ newPubSubMessage, getSetting })
})