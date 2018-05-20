import { redis } from './pubsub/redis'
import { x } from './download-release'

const { publish, subscribe } = redis()

x({
	publish,
	subscribe
})
