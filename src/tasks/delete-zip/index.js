export const deleteZip = ({
    logger,
    remove,
    downloadsDirectoryFullPath
}) => ({
    msg
}) => {

    const {
        release: {
            tag_name
        },
        repository: {
            name
        }
    } = msg

    const location = `${downloadsDirectoryFullPath}/${name}-${tag_name}.zip`

    logger.info({
        function: 'deleteZip',
        params: {
            remove: {
                location
            }
        }
    })


    return remove(location)

}