#!/bin/bash

# Clean the last build
rimraf dist dist-tsc &&

# Build typescript files in dist-tsc/
tsc -p tsconfig.spec.json &&

# Copy 
# - non typescript files on src/ 
# - the typescript build on dist-tsc/  
# to dist/
copyfiles --up=1 "dist-tsc/**/*" "src/**/!(*.ts)" dist &&

# Run tests with jasmine
node scripts/jasmine.js &&

# Clean the build
rimraf dist dist-tsc
