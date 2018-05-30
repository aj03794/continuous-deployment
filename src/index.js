import { redis } from './pubsub/redis'
import { handleReleaseDownload } from './download-release'

const { publish, subscribe } = redis()

handleReleaseDownload({
	publish,
	subscribe
})
