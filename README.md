> [!Important]
> Due to the changes in game's asset directory tree, this branch has been archived. It only supports versions from `v1.1.0r11`[^1] to `v1.1.0r37`[^2].[^3]
>
> The [`index.html`](./index.html) on this branch is still functional and can be hosted locally.

# kumo-index
Asset directory listing for game [蜘蛛ですが、なにか? 迷宮の支配者](https://g123.jp/game/kumo)

## API
### [`indexer.js`](indexer.js)
Fetches file list (`.csv`) and parses into array

- `version`: current game version
- `filePaths`: asset paths as-is from the csv file
- `fileURLs`: direct file links, resolved from the corresponding `filePath`

```js
import { version, filePaths, fileURLs } from './indexer.js';
console.log('Current version:', version);
console.log('Asset_1 path:', filePaths[0]);
console.log('Asset_1 download url:', fileURLs[0]);
```

There is also a rough script for scraping all files in [`download-data.js`](download-data.js)

```console
$ node ./download-data.js
```

> [!Caution]
> Use VPN or a secure container when downloading files in bulk, to avoid IP bans. \
> If you're simply looking for something that works, here is a [snapshot of `v1.1.0r34`](https://1024terabox.com/s/1eULCjOm25BFUgQ_QFMvSDA) (April 2025).

## How-it-works
1. *https://kumo.pro.g123-cpp.com/prod/kumo/version.txt* (json) contains the current version of the game
2. *[https://kumo.pro.g123-cpp.com/`<version>`/update.txt](https://kumo.pro.g123-cpp.com/\<version>/update.txt)* (csv) contains the directory listing for that `<version>`
3. You then [analyze the patterns](https://github.com/SuggonM/kumo-index/blob/ca99bbc1194e64c3878a7a282345ed5a0ebf2c59/indexer.js#L29-L31) and interpret the list into corresponding `StreamingAssets/` paths

## Extra Data Endpoints
- GET request to *https://h5.g123.jp/api/v1/session?appId=kumo* generates a unique 418-byte auth `code` for your account (expires after 7 days)
- Sending that `code` to [*https://kumo.pro.g123-cpp.com/kumo/index.html?code=`<code>`*](https://kumo.pro.g123-cpp.com/kumo/index.html?code=\<code>) grants anonymous access to the account until code expiry

## Next Steps?
The `.data` files are typical UnityFS assets, which can be ripped and transformed into readable files (skeletons, textures, audios, json, etc.)

[^1]: `r11`: Nov 2024 - a month after game release
[^2]: `r37`: May 2025 - slime collab event opening
[^3]: `curl -I https://kumo.pro.g123-cpp.com/v1.1.0r[11-37]/update.txt | grep last-modified`
