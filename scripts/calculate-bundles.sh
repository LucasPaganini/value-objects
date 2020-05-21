#!/bin/bash

# Unpacked core js files (no `lib/`)
npm run --silent build &&
copyfiles --up=1 "dist/**/*.js" tmp &&
rimraf tmp/lib dist &&
unpacked_size=$(node scripts/get-size.js tmp) &&

# Minified bundle
copyfiles --up=1 "tmp/**/*" tmp2 &&
rimraf tmp &&
parcel build tmp2/main.js --no-source-maps --no-cache --out-file="bundle.js" --out-dir="tmp" --bundle-node-modules --log-level="0" &&
rimraf tmp2  &&
minified_bundle_size=$(node scripts/get-size.js tmp) &&

# Gzipped minified bundle 
gziped_size=$(gzip-size tmp/bundle.js --level=9) &&

# Display
echo "Unpacked: $unpacked_size" &&
echo "Minified bundle: $minified_bundle_size" &&
echo "Gzipped minified bundle $gziped_size" &&

# Clean 
rimraf tmp