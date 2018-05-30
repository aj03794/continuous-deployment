import downloadRelease from 'download-github-release'
import { resolve as resolvePath } from 'path'
import { exec, spawn } from 'child_process'
import { cwd } from 'process'
import { ensureDirSync, removeSync, existsSync } from 'fs-extra'
import unzip from 'unzip'
import { address } from 'ip'

export const handleReleaseDownload = ({
	publish,
	subscribe
}) => {
	const outputDir = resolvePath(cwd(), 'downloads')
	ensureDirSync(outputDir)
	subscribe({
        channel: 'continuous delivery'
    })
    .then(({ connect }) => connect())
    .then(({ allMsgs, filterMsgs }) => {
        filterMsgs(msg => {
            if (msg.data) {
				const {
					githubUser: user,
					repoName: repo,
					version
				} = JSON.parse(msg.data[1])
				if(user && repo && version) {
					console.log('user, repo, and version, exist')
					return true
				}
				return false
            }
            return false
						// return  msg
        }).subscribe(msg => {
            console.log('filteredMsg', msg)
			const {
				githubUser: user,
				repoName: repo,
				version
			} = JSON.parse(msg.data[1])
			checkIfAppExists({
				outputDir,
				folder: `${repo}-${version}`,
				repo
			})
			.then(({
				versionAlreadyDownloaded
			}) => {
				if (versionAlreadyDownloaded) {
					console.log(`${version} from ${repo} already is downloaded`)
					return Promise.reject({
						method: 'handleReleaseDownload',
						data: {
							reason: 'Version of app already exists',
							err: null
						}
					})
				}
				console.log(`${version} from ${repo} has not been downloaded`)
				return Promise.resolve()
			})
			.then(() => doReleaseDownload({
				user,
				repo,
				outputDir
			}))
			.then(() => unzipDir({
				zipLocation: outputDir,
				zipName: `${repo}-${version}`,
				repo
			}))
			.then(({
				appLocation
			}) => {
				console.log('Alerting app of new version')
				console.log('address', address())
				publish()
				.then(({ connect }) => connect())
				.then(({ send }) => send({
					channel: 'continuous delivery',
					data: {
						server: {
							port: 4200,
							address: address()
						},
						appName: repo,
						appLocation,
						appVersion: version
					}
				}))
			})
			.catch(err => console.log('ERROR - handleReleaseDownload', err))
        })
    })
}

const unzipDir = ({
	zipLocation,
	zipName,
	repo
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
	  console.log(`unzipDir exited with code ${code}`);
		deleteFileOrFolder({
			location: resolvePath(zipLocation, `${zipName}.zip`)
		})
		.then(() => resolve({
			appLocation: resolvePath(zipLocation, repo, zipName)
		}))
	})

})

const deleteFileOrFolder = ({
	location
}) => new Promise((resolve, reject) => {
	console.log('Deleting file/folder:', location)
	removeSync(location)
	resolve()
})

const doReleaseDownload = ({
	user,
	repo,
	outputDir
}) => new Promise((resolve, reject) => {
	console.log(`Downloading ${repo} by ${user} into ${outputDir}`)
	exec(`download-github-release --zipped ${user} ${repo} ${outputDir}`, (err, stdout, stderr) => {
		if (err) {
			console.log('err', err)
		}
		console.log('stdout', stdout)
		console.log('stderr', stderr)
		resolve()
	})

	// use request
	// url https://api.github.com/repos/aj03794/raspberry-pi-camera/releases/latest
	// from this we can the assets URL
})

const checkIfAppExists = ({
	outputDir,
	folder,
	repo
}) => new Promise((resolve, reject) => {
	const location = resolvePath(outputDir, repo, folder)
	console.log('Checking if app exists', resolvePath(outputDir, repo, folder))
	console.log(existsSync(location))
	resolve({
		versionAlreadyDownloaded: existsSync(location)
	})
})
