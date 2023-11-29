#!/bin/bash

set -e
setopt localoptions rmstarsilent

echo 'removing node_modules'
rm -rf node_modules/* 
echo 'done clearing node_modules'

echo 'npm install --omit=dev'
npm install --omit=dev       

echo 'running tsc to generate .js files for prod only'
rm -rf distProd/*
tsc -p tsconfig.prod.json
echo 'production .js in ./distProd/src'

VER=`grep version package.json | perl -nle 'print $& if m{\\d.\\d.\\d}'`
echo "release version will be ${VER}"

PTH=`pwd`
zip -r builds/eulagy-$VER.zip package.json node_modules 2>&1 1>/dev/null
cd distProd/src
zip builds/eulagy-$VER.zip ./**/*.js 2>&1 1>/dev/null
echo "release package builds/eulagy-${VER}.zip"

echo 'npm install again to reset development'
npm install

echo 'build complete!'
