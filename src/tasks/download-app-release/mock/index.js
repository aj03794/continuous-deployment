export const execute = ({
    logger,
    exec,
    downloadsDirectoryFullPath,
    resolvePath,
    appName,
    tagName
}) => new Promise((resolve, reject) => {

    const mockAppLocation = resolvePath(__dirname, '../../../../', 'mock-app_0.0.2')
    const opts = {
        cwd: mockAppLocation
    }

    const execCommand = `zip -r ${downloadsDirectoryFullPath}/${appName}_${tagName}.zip *`

    logger.info({
        function: 'mockDownloadAppRelease',
        params: {
            execCommand,
            opts
        }
    })

    exec(execCommand, opts, (err, stdout, stderr) => {
        if (err) {
            return reject(err)
        }
        logger.info({
            function: 'mockDownloadAppRelease',
            msg: `Finished downloading zip`
        })
        return resolve()
    })

})