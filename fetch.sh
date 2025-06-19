#!/bin/bash
curl="https://kumo.pro.g123-cpp.com/prod/kumo/version.txt"
upstream=$(curl -sL $curl | jq -r '.url[0]')
current=$(tail -1 README.md | tail -c +4)

if [[ "$upstream" != "$current" ]]; then
	echo "1. $upstream" >> README.md
fi

echo "fetched version: $upstream"
