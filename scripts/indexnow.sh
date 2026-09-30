#!/bin/sh
# Meldt alle URL's uit sitemap.xml aan bij IndexNow (Bing, Yandex e.a.).
# Draaien NA elke live deploy: sh scripts/indexnow.sh
KEY=11d8868433074608bc5520a00778147f
URLS=$(curl -s https://www.funkiness.ai/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//' | sed 's/.*/"&"/' | paste -sd, -)
curl -s -o /dev/null -w "IndexNow: HTTP %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"www.funkiness.ai\",\"key\":\"$KEY\",\"keyLocation\":\"https://www.funkiness.ai/$KEY.txt\",\"urlList\":[$URLS]}"
