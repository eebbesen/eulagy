#!/bin/bash

echo 'removing node_modules'
rm -rf node_modules/*
npm install --omit=dev
echo 'running tsc to generate .js files'
tsc
export VER=`grep version package.json | perl -nle 'print $& if m{\\d.\\d.\\d}'`
zip -r builds/eulagy-$VER.zip package.json node_modules
zip -j builds/eulagy-$VER.zip dist/*.js
npm install