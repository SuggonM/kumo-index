#!/bin/bash
curl="https://kumo.pro.g123-cpp.com/prod/kumo/version.txt"
upstream=$(curl -sL $curl | jq -r '.url[0]')
current=$(tail -1 README.md | tail -c +4)

if [[ "$upstream" != "$current" ]]; then
	echo "1. $upstream" >> README.md
	export new_version="$upstream"
fi

echo "fetched version: $upstream"
[[ -z $new_version ]] && echo "version list up-to-date" || true
