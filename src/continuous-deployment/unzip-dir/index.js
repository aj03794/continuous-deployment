export const unzipDir = ({
	zipLocation,
	zipName,
	repo,
	unzip,
	spawn,
	removeSync,
	ensureDirSync,
	resolvePath
}) => new Promise((resolve, reject) => {
	console.log(`unzipping ${zipName}`)
	ensureDirSync(resolvePath(zipLocation, repo))
	const ls = spawn(`unzip`, [`${zipName}`, `-d${repo}/${zipName}`], { cwd: zipLocation });

	ls.stdout.on('data', (data) => {
	  // console.log(`stdout: ${data}`);
	});

	ls.stderr.on('data', (data) => {
	  console.log(`unzipDir stderr: ${data}`)
	})

	ls.on('close', (code) => {
		console.log(`unzipDir exited with code ${code}`)
		if(code !== 0) {
			return reject({
				method: 'unzipDir',
				data: {
					err
				}
			})
		}
		return deleteFileOrFolder({
			location: resolvePath(zipLocation, `${zipName}.zip`),
			removeSync
		})
		.then(() => resolve({
			appLocation: resolvePath(zipLocation, repo, zipName)
		}))
		.catch(err => {
			return reject(err)
		})
	})

})

const deleteFileOrFolder = ({
	location,
	removeSync
}) => new Promise((resolve, reject) => {
	console.log('Deleting file/folder:', location)
	removeSync(location)
	resolve()
})