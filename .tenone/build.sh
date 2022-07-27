#!/usr/bin/env bash

export APP_VERSION=$(date "+%Y%m%d")-${GIT_COMMIT:0:8}
export APP_DIST_DIR=dist
export IS_UPLOAD_CDN=enable
node -v
yarn -v
yarn
yarn build:${APP_ENV} && yarn upload:cos