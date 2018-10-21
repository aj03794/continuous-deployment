// Subscribe to gcp events
// Reach out to github and download the release into downloads folder
// Unzip the download
// Delete the zip
// Turn off old version of the app running
// Turn on the new version of the app

export const application = ({
    downloadAppRelease,
    unzipApp,
    turnOffOldApp,
    turnOnNewApp,
    deleteZip,
    msg
}) => {

    return downloadAppRelease({ msg })
            .then(() => unzipApp({ msg }))
            .then(() => deleteZip({ msg }))
            // .then(() => turnOffOldApp({ msg }))
            // .then(() => turnOnNewApp({ msg }))

}