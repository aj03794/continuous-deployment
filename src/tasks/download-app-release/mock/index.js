export const execute = ({
    logger,
    exec,
    downloadsDirectoryFullPath,
    resolvePath
}) => new Promise((resolve, reject) => {

    const mockAppLocation = resolvePath(__dirname, '../../../../', 'mock-app')
    logger.info({
        function: 'mockDownloadAppRelease',
        params: {
            mockAppLocation,
            downloadsDirectoryFullPath
        }
    })

    resolve()

})