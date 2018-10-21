import pm2 from 'pm2'
import { exec } from 'child_process'

export const checkIfOldVersionOfAppIsRunning = ({
    newApp
}) => new Promise((resolve, reject) => {

    pm2.list((err, processes) => {
        const existingApps = processes.map(({ name }) => {
            const nameAndVersion = name.split('_')
            return {
                appName: nameAndVersion[0],
                appVersion: nameAndVersion[1] 
            }
        })


        console.log({ existingApps })
        const newAppWithoutVersion = newApp.split('_')[0]
        console.log({ newAppWithoutVersion })
        const match = existingApps.find(({ appName }) => appName === newAppWithoutVersion)
        console.log({ match })
        if (match) {
            const oldApp = `${match.appName}_${match.appVersion}`
            console.log({
                oldApp
            })
            return resolve(oldApp)
        }
        console.log('No match')
        reject()
    })

})