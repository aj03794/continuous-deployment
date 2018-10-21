export const execute = ({
    appName,
    user,
    downloadsDirectoryFullPath,
    exec,
    logger
}) => new Promise((resolve, reject) => {

	console.log(`Downloading ${appName} by ${user} into ${downloadsDirectoryFullPath}`)
	exec(`download-github-release --zipped ${user} ${appName} ${downloadsDirectoryFullPath}`, (err, stdout, stderr) => {
		if (err) {
			return reject(err)
        }
        return resolve()
	})
})