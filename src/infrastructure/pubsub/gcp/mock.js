export const mock = ({
    newPubSubMessage
}) => {

    setTimeout(() => {
        newPubSubMessage({
            release: {
                tag_name: '0.0.136'
            },
            repository: {
                name: "raspberry-pi-camera",
                owner: {
                    login: "aj03794"
                },
                clone_url: "https://github.com/aj03794/raspberry-pi-camera.git",
            }
        })
    }, 300)

}