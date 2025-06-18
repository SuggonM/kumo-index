import { createWriteStream } from 'node:fs';
import { dirname } from 'node:path';
import { mkdirp } from 'mkdirp';
import fetch from 'node-fetch';
import { version, files, filesWindowsExtra } from './indexer.js';

console.log(`Downloading data from version ${version} ...`);

const iteratorSize = files.windows.size;
function* filesIterator() {
	yield* files.main.entries();
	yield* filesWindowsExtra.entries();
}

let i = 1;

for (const [filePath, url] of filesIterator()) {
	const response = await fetch(url);

	const dlPath = `./${version}`;
	await mkdirp(`${dlPath}/${dirname(filePath)}`);
	const stream = createWriteStream(`${dlPath}/${filePath}`);

	const download = response.body.pipe(stream);
	download.on('finish', () =>
		console.log(`\t[${i++}/${iteratorSize}]\t~/${filePath}`)
	);
}
