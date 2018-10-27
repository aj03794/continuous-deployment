export const unzipApp = ({
    logger,
    downloadsDirectoryFullPath,
    ensureDir,
    exec
}) => ({
    msg
}) => new Promise((resolve, reject) => {

    const {
        release: {
            tag_name
        },
        repository: {
            name
        }
    } = msg

    const app = `${name}-${tag_name}`
    const appFolderFullPath = `${downloadsDirectoryFullPath}/${app}`
    const command = `unzip -qq ${app}.zip -d ${appFolderFullPath}`

    const opts = {
        cwd: downloadsDirectoryFullPath
    }

    logger.info({
        function: 'unzipApp',
        params: {
            ensureDir: {
                appFolderFullPath
            },
            exec: {
                command,
                opts
            }
        }
    })

    ensureDir(appFolderFullPath)
    .then(() => {
        exec(command, opts, (err, stdout, stderr) => {
            if (err) {
                return reject(err.message)
            }
            logger.info({
                stderr,
                stdout
            })
            logger.info({
                function: 'unzipApp',
                msg: `Finished unzipping app`
            })
            return resolve()
        })
    })
    .catch(err => {
        reject(err)
    })
   

})