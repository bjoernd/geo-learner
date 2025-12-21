#!/bin/bash
set -e

TARGET_HOST="minecraft.local"
TARGET_PATH="/var/www/geo-learner/dist"

echo "Building app..."
cd "$(dirname "$0")/app"
npm run build

echo "Deploying to ${TARGET_HOST}:${TARGET_PATH}..."
rsync -avz --delete dist/ "${TARGET_HOST}:${TARGET_PATH}/"

echo "Done."
