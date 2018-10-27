export const turnOnNewApp = ({
    logger,
    downloadsDirectoryFullPath,
    pm2
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

    const options = {
        name: appName,
        cwd: downloadsDirectoryFullPath,
        script: `${downloadsDirectoryFullPath}/${appName}/index.js`
    }


    logger.info({
        function: 'turnOnNewApp',
        params: {
            pm2: {
                options
            }
        }
    })
    
    return pm2.start(options, err => {
        if (err) {
            return reject(err)
        }
        console.log(`Started ${appName}`)
        return resolve()
    })

})