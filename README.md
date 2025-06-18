# kumo-index
Asset directory listing for game [蜘蛛ですが、なにか? 迷宮の支配者](https://g123.jp/game/kumo)

For archived versions and overall version history, see this repo's [branches](/../../branches).

## API
### [`indexer.js`](indexer.js)
Fetches file list (`.csv`) and parses into array

- `version`: current game version; can be overridden manually
	- `?version=` url query in browser
	- `process.env.VERSION` in server
- `platformBaseURLs`: known directories from which assets are served, based on user-agent/OS-platform; currently `main` (non-windows) and `windows`
- `files`: `Map` of asset path and its URL, resolved from the csv file
- `filesWindowsExtra`: `Map` of `windows` assets that are not present in `main`

```js
import { version, platformBaseURLs,
	files, filesWindowsExtra } from './indexer.js';
console.log('Current version:', version);
console.log('All assets:', files.main);
console.log('Index download url:', files.main.get('update.txt'));
console.log('windows-exclusive assets:', filesWindowsExtra);
```

There is also a rough script for scraping all files using [`download-data.js`](download-data.js):
```console
$ node ./download-data.js
```

> [!Caution]
> Use VPN or a secure container when downloading files in bulk, to avoid IP bans. \
> If you're simply looking for something that works, here is a [snapshot of `v1.1.0r34`](https://1024terabox.com/s/1eULCjOm25BFUgQ_QFMvSDA) (April 2025).

## How-it-works
1. *https://kumo.pro.g123-cpp.com/prod/kumo/version.txt* (json) contains the current version of the game
2. *[https://kumo.pro.g123-cpp.com/`<version>`/StreamingAssets/update.txt](https://kumo.pro.g123-cpp.com/\<version>/StreamingAssets/update.txt)* (csv) contains the directory listing for that `<version>`
3. You then [analyze the patterns](https://github.com/SuggonM/kumo-index/blob/ca99bbc1194e64c3878a7a282345ed5a0ebf2c59/indexer.js#L29-L31) and interpret the list into corresponding `StreamingAssets/` paths

## Extra Data Endpoints
- GET request to *https://h5.g123.jp/api/v1/session?appId=kumo* generates a unique 418-byte auth `code` for your account (expires after 7 days)
- Sending that `code` to [*https://kumo.pro.g123-cpp.com/kumo/index.html?code=`<code>`*](https://kumo.pro.g123-cpp.com/kumo/index.html?code=\<code>) grants anonymous access to the account until auth code expiry

## Next Steps?
The `.data` files are typical UnityFS assets, which can be ripped and transformed into readable files (skeletons, textures, audios, json, etc.)
