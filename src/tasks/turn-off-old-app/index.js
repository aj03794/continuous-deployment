export const turnOffOldApp = ({
    logger
}) => () => new Promise((resolve, reject) => {

    logger.info({
        function: 'turnOffOldApp',
        params: {
            
        }
    })

    resolve()

})