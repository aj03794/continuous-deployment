export const deleteZip = ({
    logger,
    remove,
    downloadsDirectoryFullPath
}) => ({
    msg
}) => {

    const {
        repository: {
            name
        }
    } = msg

    const location = `${downloadsDirectoryFullPath}/${name}.zip`

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