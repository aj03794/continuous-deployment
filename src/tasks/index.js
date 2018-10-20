import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import { homedir } from 'os'
import downloadRelease from 'download-github-release'
import { ensureDir } from 'fs-extra'

import { deleteZip as deleteZipCreator } from './delete-zip'
import { downloadAppRelease as downloadAppReleaseCreator } from './download-app-release'
import { unzipApp as unzipAppCreator} from './unzip-app'
import { turnOffOldApp as turnOffOldAppCreator } from './turn-off-old-app'
import { turnOnNewApp as turnOnNewAppCreator } from './turn-on-new-app'  

export const createTasks = ({
    logger,
    getSetting
}) => {

    const {
       type,
       downloadsDirectory
    } = getSetting('downloadAppRelease')
    const downloadsDirectoryFullPath = resolvePath(homedir(), downloadsDirectory)

    const deleteZip = deleteZipCreator({ logger })
    const downloadAppRelease = downloadAppReleaseCreator({
        exec,
        downloadRelease,
        type,
        logger,
        downloadsDirectoryFullPath,
        resolvePath,
        ensureDir
    })
    const unzipApp = unzipAppCreator({ logger })
    const turnOffOldApp = turnOffOldAppCreator({ logger })
    const turnOnNewApp = turnOnNewAppCreator({ logger })

    return {
        deleteZip,
        downloadAppRelease,
        unzipApp,
        turnOffOldApp,
        turnOnNewApp
    }

}