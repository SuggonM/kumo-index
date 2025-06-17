import { parse as csvParse } from 'csv-parse/sync';

const isBrowser = (typeof window !== 'undefined');
if (isBrowser) {
	const proxy = 'https://corsproxy.io/?url=';
	const proxyFetch = fetch;
	fetch = url => proxyFetch(proxy + url);
}

const versionQuery = isBrowser
	? new URL(window.location).searchParams.get('version')
	: process.env.VERSION;

async function latestVersion() {
	const versionURL = 'https://kumo.pro.g123-cpp.com/prod/kumo/version.txt';
	const versionRes = await fetch(versionURL);
	const versionJson = await versionRes.json();
	const latest = versionJson.url[0];
	return latest;
}

const version = versionQuery || await latestVersion();

const baseURL = `https://kumo.pro.g123-cpp.com/${version}/StreamingAssets`;

const listingURL = `${baseURL}/update.txt`;
const listingRes = await fetch(listingURL);
const listingCSV = await listingRes.text();

const files = csvParse(listingCSV, {
	delimiter: ';',
	columns: [ 'filePath', 'fileSize', 'MD5hash', 'streamDirNum' ],
	skipRecordsWithError: true
});

const fileURLs = [];
const filePaths = [];

files.forEach(metadata => {
	filePaths.push(metadata.filePath);
	fileURLs.push(
		(metadata.streamDirNum === '0')
		? `${baseURL}/${metadata.filePath}`
		: `${baseURL}/${metadata.filePath.replace('/', `/${metadata.streamDirNum}/`)}`
	);
});

export {
	version,
	filePaths,
	fileURLs
};
