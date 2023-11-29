#!/bin/bash

echo 'removing node_modules'
rm -rf node_modules/* > /dev/null
echo 'done clearing node_modules'

echo 'npm install --omit=dev'
npm install --omit=dev > /dev/null
echo 'npm install complete'

echo 'running tsc to generate .js files for prod only'
rm -rf distProd/*
tsc -p tsconfig.prod.json
echo 'production .js in ./distProd'

export VER=`grep version package.json | perl -nle 'print $& if m{\\d.\\d.\\d}'`
echo "release version will be ${VER}"

zip -r builds/eulagy-$VER.zip package.json node_modules > /dev/null
zip -j builds/eulagy-$VER.zip distProd/*.js > /dev/null
echo "release package builds/eulagy-${VER}.zip"

echo 'npm install again to reset development'
npm install
