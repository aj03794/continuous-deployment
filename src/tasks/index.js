import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import { homedir } from 'os'
import downloadRelease from 'download-github-release'
import { ensureDir, remove } from 'fs-extra'
import pm2 from 'pm2'

import { checkIfOldVersionOfAppIsRunning } from '../infrastructure/pm2'
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

    const deleteZip = deleteZipCreator({
        logger,
        downloadsDirectoryFullPath,
        remove
    })
    const downloadAppRelease = downloadAppReleaseCreator({
        exec,
        downloadRelease,
        type,
        logger,
        downloadsDirectoryFullPath,
        resolvePath,
        ensureDir
    })
    const unzipApp = unzipAppCreator({
        logger,
        exec,
        downloadsDirectoryFullPath
    })
    const turnOffOldApp = turnOffOldAppCreator({
        logger,
        pm2,
        exec,
        checkIfOldVersionOfAppIsRunning
    })
    const turnOnNewApp = turnOnNewAppCreator({
        logger,
        pm2,
        downloadsDirectoryFullPath
    })

    return {
        deleteZip,
        downloadAppRelease,
        unzipApp,
        turnOffOldApp,
        turnOnNewApp
    }

}