export const downloadAppRelease = ({
    ensureDir,
    ...args
}) => () => {

    const {
        logger,
        downloadsDirectoryFullPath,
        type
    } = args

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
                    }) => execute({ ...args, logger }))
            })


}