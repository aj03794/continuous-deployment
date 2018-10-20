import { deleteZip as deleteZipCreator } from './delete-zip'
import { downloadAppRelease as downloadAppReleaseCreator } from './download-app-release'

export const createTasks = () => {

    const deleteZip = deleteZipCreator()
    const downloadAppRelease = downloadAppReleaseCreator()

    return {
        deleteZip,
        downloadAppRelease
    }

}