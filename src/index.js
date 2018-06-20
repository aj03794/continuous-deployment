import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { continuousDeployment } from './continuous-deployment'


const { publisherCreator, subscriberCreator } = redis({
	host: process.argv[2] === 'dev' ? '127.0.0.1' : 'main.local'
})
Promise.all([
	publisherCreator(),
	subscriberCreator()
])
.then(([
	{ publish },
	{ subscribe }
]) => {
	const slack = slackCreator({ publish })
	return continuousDeployment({
		publish,
		subscribe,
		slack
	})
})
