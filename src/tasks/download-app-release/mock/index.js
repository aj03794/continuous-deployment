export const execute = ({
    logger,
    exec,
    downloadsDirectoryFullPath,
    resolvePath,
    appName
}) => new Promise((resolve, reject) => {

    const mockAppLocation = resolvePath(__dirname, '../../../../', 'mock-app')

    logger.info({
        function: 'mockDownloadAppRelease',
        params: {
            mockAppLocation,
            downloadsDirectoryFullPath
        }
    })

    const execCommand = `zip -r ${downloadsDirectoryFullPath}/${appName}.zip mock-app/`

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