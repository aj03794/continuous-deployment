import { exec } from "child_process";

export const turnOffOldApp = ({
    logger,
    pm2,
    checkIfOldVersionOfAppIsRunning
}) => ({
    msg
}) => new Promise((resolve, reject) => {

    const {
        release: {
            tag_name
        },
        repository: {
            name
        }
    } = msg

    const appName = `${name}_${tag_name}`

    logger.info({
        function: 'turnOffOldApp',
    })
    
    checkIfOldVersionOfAppIsRunning({
        newApp: appName
    })
    .then(oldApp => {
        if (oldApp) {
            return pm2.delete(oldApp, err => {
                if (err) {
                    return reject(err)
                }
                logger.info(`Finished deleting ${oldApp}`)
                return resolve()
            })
        }
        return resolve()
    })
    .catch(() => {
        resolve()
    })

})