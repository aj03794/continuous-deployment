export const initializePubSubProviders = ({
    getSetting,
    newPubSubMessage
}) => {

    const { type } = getSetting('pubsub').gcp

    console.log({
        type
    })

    return import(`./gcp/${type}`)
        .then(({
            [type]: pubSub
        }) => {

            console.log(pubSub)

            pubSub({
                getSetting,
                newPubSubMessage
            })
        })

}