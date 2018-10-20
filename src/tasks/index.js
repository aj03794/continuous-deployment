import { exec } from 'child_process'
import downloadRelease from 'download-github-release'

import { deleteZip as deleteZipCreator } from './delete-zip'
import { downloadAppRelease as downloadAppReleaseCreator } from './download-app-release'
import { unzipApp as unzipAppCreator} from './unzip-app'
import { turnOffOldApp as turnOffOldAppCreator } from './turn-off-old-app'
import { turnOnNewApp as turnOnNewAppCreator } from './turn-on-new-app'  

export const createTasks = () => {

    const deleteZip = deleteZipCreator()
    const downloadAppRelease = downloadAppReleaseCreator({ exec, downloadRelease })
    const unzipApp = unzipAppCreator()
    const turnOffOldApp = turnOffOldAppCreator()
    const turnOnNewApp = turnOnNewAppCreator()

    return {
        deleteZip,
        downloadAppRelease,
        unzipApp,
        turnOffOldApp,
        turnOnNewApp
    }

}