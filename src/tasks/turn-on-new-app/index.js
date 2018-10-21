export const turnOnNewApp = ({
    logger
}) => () => new Promise((resolve, reject) => {

    logger.info({
        function: 'turnOffNewApp',
        params: {
            
        }
    })

    resolve()

})