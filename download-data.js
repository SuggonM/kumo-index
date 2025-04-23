import { createWriteStream } from 'node:fs';
import { dirname } from 'node:path';
import { mkdirp } from 'mkdirp';
import fetch from 'node-fetch';
import { version, filePaths, fileURLs } from './indexer.js';

console.log(`Downloading data from version ${version} ...`);

for (const [i, url] of fileURLs.entries()) {
	const response = await fetch(url);

	const filePath = filePaths[i];
	const dlPath = `./${version}`;
	await mkdirp(`${dlPath}/${dirname(filePath)}`);
	const stream = createWriteStream(`${dlPath}/${filePath}`)

	const download = response.body.pipe(stream);
	download.on('finish', () =>
		console.log(`\t[${i+1}/${filePaths.length}]\t~/${filePath}`)
	);
}
