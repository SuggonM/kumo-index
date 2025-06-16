import { parse as csvParse } from 'csv-parse/sync';

const isBrowser = (typeof window !== 'undefined');
const proxy = isBrowser ? 'https://corsproxy.io/?url=' : '';

const versionURL = 'https://kumo.pro.g123-cpp.com/prod/kumo/version.txt';
const versionRes = await fetch(proxy + versionURL);
const versionJson = await versionRes.json()
const version = versionJson.url[0];

const baseURL = `https://kumo.pro.g123-cpp.com/${version}`;

const listingURL = `${baseURL}/update.txt`;
const listingRes = await fetch(proxy + listingURL);
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
		? `${baseURL}/StreamingAssets/${metadata.filePath}`
		: `${baseURL}/StreamingAssets/${metadata.filePath.replace('/', `/${metadata.streamDirNum}/`)}`
	);
});

export {
	version,
	filePaths,
	fileURLs
};
