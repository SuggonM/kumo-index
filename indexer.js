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

const platformDirs = {
	main: baseURL,
	windows: `${baseURL}_Windows`
};

const files = {
	main: new Map(),
	windows: new Map()
};

for (const [platform, baseURL] of Object.entries(platformDirs)) {
	const listingURL = `${baseURL}/update.txt`;
	const listingRes = await fetch(listingURL);
	const listingCSV = await listingRes.text();

	const csvParsed = csvParse(listingCSV, {
		delimiter: ';',
		columns: [ 'filePath', 'fileSize', 'md5sum', 'streamDirNum' ],
		skipRecordsWithError: true
	});

	csvParsed.forEach(metadata => {
		const fileURL = resolveFileURL(metadata, platform);
		files[platform].set(metadata.filePath, fileURL);
	});
}

function resolveFileURL(metadata, platform = '') {
	const platformURL = platformDirs[platform];

	if (metadata.streamDirNum === '0') {
		return `${platformURL}/${metadata.filePath}`;
	}
	return `${platformURL}/${metadata.filePath.replace('/', `/${metadata.streamDirNum}/`)}`;
}

const windowsExtraPaths = new Set(files.windows.keys()).difference(files.main);
const filesWindowsExtra = new Map();

windowsExtraPaths.forEach(filePath => {
	const fileURLwindows = files.windows.get(filePath);
	filesWindowsExtra.set(filePath, fileURLwindows);
});

export {
	version,
	platformDirs,
	files,
	filesWindowsExtra
};
