import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { continuousDeployment } from './continuous-deployment'

const { publish, subscribe } = redis()

const slack = slackCreator({ publish })

continuousDeployment({
	publish,
	subscribe,
	slack
})
