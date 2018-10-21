export const turnOffOldApp = ({
    logger,
    pm2
}) => ({
    msg
}) => new Promise((resolve, reject) => {

    console.log('msg', msg)

    const {
        release: {
            tag_name
        },
        repository: {
            name
        }
    } = msg

    logger.info({
        function: 'turnOffOldApp',
        params: {
            pm2Delete: {
                process: 'mock-app-0.0.1'
            }
        }
    })

    pm2.delete('mock-app-0.0.1', err => {
        if (err) {
            return reject(err)
        }
        return resolve()
    })

})