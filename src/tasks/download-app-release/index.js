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
        release: {
            tag_name: tagName
        },
        repository: {
            name,
            owner: {
                login
            }
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
                        tagName,
                        user: login
                    }))
            })


}