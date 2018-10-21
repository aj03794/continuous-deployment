export const execute = ({
    logger,
    exec,
    downloadsDirectoryFullPath,
    resolvePath,
    appName
}) => new Promise((resolve, reject) => {

    const mockAppLocation = resolvePath(__dirname, '../../../../', 'mock-app_0.0.2')

    logger.info({
        function: 'mockDownloadAppRelease',
        params: {
            appName,
            mockAppLocation,
            downloadsDirectoryFullPath
        }
    })

    const execCommand = `zip -r ${downloadsDirectoryFullPath}/${appName}.zip mock-app_0.0.2/`

    exec(execCommand,(err, stdout, stderr) => {
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