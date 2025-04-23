import { version, filePaths, fileURLs } from './indexer.js';

const fileVersion = document.querySelector('#fileversion');
const fileCount = document.querySelector('#filecount');
const fileRoot = document.querySelector('#fileroot');
const fileList = document.querySelector('#filelist');

fileVersion.textContent = version;
fileCount.textContent = filePaths.length;
fileRoot.textContent = `https://kumo.pro.g123-cpp.com/${version}/StreamingAssets/`;
fileRoot.href = fileRoot.textContent;

for (const [i, filePath] of filePaths.entries()) {
	const fileEntry = document.createElement('li');
	const fileEntryLink = document.createElement('a');
	fileEntryLink.textContent = `./${filePath}`;
	fileEntryLink.href = fileURLs[i];
	fileEntry.appendChild(fileEntryLink);
	fileList.appendChild(fileEntry);
}
