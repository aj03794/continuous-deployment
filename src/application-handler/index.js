import { queue } from 'async'
import { application } from '../application'

export const initializeApplicationHandler = ({
    pubSubMessageSubscription,
    logger,
    ...tasks
}) => {

    console.log('tasks', tasks)

    const q = queue((msg, cb) => {
        return executeMsg(msg).then(cb)
    })

    pubSubMessageSubscription(q.push)

    const executeMsg = msg => {

        console.log('msg', msg)

        return application({ ...tasks, msg})
                .then(() => {
                    logger.info('Finished')
                })
                .catch(err => {
                    console.log(err)
                    logger.info('adsfasfd')
                    logger.error('Error', err)
                })

    }

    return Promise.resolve()

}