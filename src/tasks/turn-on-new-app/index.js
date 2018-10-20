export const turnOnNewApp = ({
    logger
}) => () => new Promise((resolve, reject) => {

    logger.info({
        function: 'turnOffOldApp',
        params: {
            
        }
    })

    resolve()

})