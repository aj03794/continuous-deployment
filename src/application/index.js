// Subscribe to gcp events
// Reach out to github and download the release into downloads folder
// Unzip the download
// Delete the zip
// Turn off old version of the app running
// Turn on the new version of the app

export const application = ({
    downloadRelease,
    unzipRelease,
    deleteReleaseZip,
    turnOffOldApp,
    turnOnNewApp
}) => {

    downloadRelease()
        .then(unzipRelease)
        .then(deleteReleaseZip)
        .then(turnOffOldApp)
        .then(turnOnNewApp)

}