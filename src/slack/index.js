export const slack = ({
    publish,
    channel = 'slack',
}) => ({
    slackMsg,
    slackChannel='cd'
}) => new Promise((resolve, reject) => {
    publish({
        channel,
        data: {
            slackData: {
                channel: slackChannel,
                msg: slackMsg
            }
        }
    })
    resolve()
})