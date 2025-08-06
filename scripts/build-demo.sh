#!/bin/bash

# Move to the monkeyts directory
cd packages/monkeyts

# Build UMD bundle
npm run build:umd

# Ensure the demo directory exists
mkdir -p ../../docs/public/demo

# Copy the UMD bundle to the docs/public/demo directory
cp public/demo/monkeyts.umd.js ../../docs/public/demo/

