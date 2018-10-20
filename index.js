import downloadRelease from 'download-github-release'
import { resolve as resolvePath } from 'path'
import { exec } from 'child_process'
import { cwd } from 'process'
import { ensureDirSync, existsSync } from 'fs-extra'
import { address } from 'ip'
import { doReleaseDownload } from './release-download'

export const continuousDeployment = ({
	publish,
	subscribe,
	slack
}) => new Promise((resolve, reject) => {
	const outputDir = resolvePath(cwd(), 'downloads')
	ensureDirSync(outputDir)
	subscribe({
        channel: 'continuous delivery'
    })
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
			slack({
				slackMsg: `DEPLOYING NEW VERSION OF: ${repo} version: ${version}`
			})
			slack({
				slackMsg: {
					repo,
					step: 'Checking if app exists'
				}
			})
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
					slack({
						slackMsg: {
							repo,
							step: `versionAlreadyDownloaded - version: ${verison} - TRUE`,
							
						}
					})
					return resolve()
				}
				slack({
					slackMsg: {
						repo,
						step: `versionAlreadyDownloaded - version: ${version} - FALSE`,
						
					}
				})
				console.log(`${version} from ${repo} has not been downloaded`)
				return Promise.resolve()
			})
			.then(() => {
				slack({
					slackMsg: {
						repo,
						step: 'doReleaseDownload'
					}
				})
				return doReleaseDownload({
					user,
					repo,
					outputDir,
					downloadRelease,
					exec
				})
			})
			.catch(err => {
				slack({
					slackMsg: {
						repo,
						step: 'unzipDir',
						err
					}
				})
				return reject()
			})
			.then(({
				appLocation
			}) => {
				console.log('Alerting app of new version')
				slack({
					slackMsg: {
						repo,
						msg: `Success! Alerting apps that ${version} is available`,
					}
				})
				console.log('appName', repo)
				console.log('appLocation', appLocation)
				console.log('appVersion', version)
				console.log('address', process.argv[2] === 'dev' ? '127.0.0.1' : address())
				return publish({
					channel: 'continuous delivery',
					data: {
						server: {
							port: 4200,
							address: process.argv[2] === 'dev' ? '127.0.0.1' : address()
						},
						appName: repo,
						appLocation,
						appVersion: version
					}
				})
			})
			.catch(err => {
				slack({
					slackMsg: {
						repo,
						msg: `Error Deploying ${repo}-${version}`,
						err
					}
				})
				return reject()
			})
        })
    })
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
