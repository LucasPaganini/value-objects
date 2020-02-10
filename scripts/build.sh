#!/bin/bash

# Clean the last build
rimraf dist dist-tsc

# Build typescript files in dist-tsc/
tsc

# Copy 
# - non typescript files on src/ 
# - the typescript build on dist-tsc/  
# to dist/
copyfiles --up=1 "dist-tsc/**/*" "src/**/!(*.ts)" dist

# Clean the typescript build
rimraf dist-tsc
