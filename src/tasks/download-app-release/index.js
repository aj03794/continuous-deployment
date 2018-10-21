export const downloadAppRelease = ({
    ensureDir,
    ...args
}) => ({
    msg
}) => {

    const {
        logger,
        downloadsDirectoryFullPath,
        type
    } = args

    const {
        repository: {
            name,
            owner: {
                login
            },
            clone_url
        }
    } = msg

    logger.info({
        function: 'downloadAppRelease',
        params: {
            type,
            downloadsDirectoryFullPath
        }
    })

    return ensureDir(downloadsDirectoryFullPath)
            .then(() => {
                return import(`./${type}`)
                    .then(({
                        execute
                    }) => execute({
                        ...args,
                        logger,
                        appName: name,
                        login,
                        clone_url
                    }))
            })


}