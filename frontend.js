import { version, platformDirs, files, filesWindowsExtra } from './indexer.js';

const fileVersion = document.querySelector('#fileversion');
const fileCount = document.querySelector('#filecount');
const fileRoot = document.querySelector('#fileroot');
const fileList = document.querySelector('#filelist');
const fileRootWindows = document.querySelector('#fileroot-windows');
const fileListWindows = document.querySelector('#filelist-windows');

fileVersion.textContent = version;
fileCount.textContent = files.main.size;
fileRoot.textContent = platformDirs.main;
fileRoot.href = fileRoot.textContent + '/update.txt';
fileRootWindows.textContent = platformDirs.windows;
fileRootWindows.href = fileRoot.textContent + '/update.txt';

files.main.entries().forEach(file =>
	addFileEntry(file, fileList)
);
filesWindowsExtra.entries().forEach(windowsFile =>
	addFileEntry(windowsFile, fileListWindows)
);

function addFileEntry([filePath, url], listContainer) {
	const fileEntry = document.createElement('li');
	const fileEntryLink = document.createElement('a');
	fileEntryLink.textContent = `./${filePath}`;
	fileEntryLink.href = url;
	fileEntry.appendChild(fileEntryLink);
	listContainer.appendChild(fileEntry);
}

if (!fileList.children.length) {
	fileList.textContent = 'Error fetching or processing version directory list';
	fileList.style.color = 'red';
}
if (!fileListWindows.children.length) {
	fileListWindows.textContent = '0';
}

const url = new URL(window.location);
const hasVersionParam = url.searchParams.get('version');
if (!hasVersionParam) {
	url.searchParams.set('version', version);
	window.history.pushState(null, null, url);
}
