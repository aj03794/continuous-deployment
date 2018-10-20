export const doReleaseDownload = ({
	user,
	repo,
    outputDir,
    downloadRelease,
    exec
}) => new Promise((resolve, reject) => {
	console.log(`Downloading ${repo} by ${user} into ${outputDir}`)
	exec(`download-github-release --zipped ${user} ${repo} ${outputDir}`, (err, stdout, stderr) => {
		if (err) {
            console.log('Err', err)
			return reject({
				method: 'doReleaseDownload',
				data: {
					err
				}
			})
		}
		console.log('stdout', stdout)
        console.log('stderr', stderr)
		return resolve({ appLocation: outputDir })
	})
})