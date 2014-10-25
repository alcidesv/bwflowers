#!/bin/bash

node_modules/.bin/tsc src/index.ts --out lib/index.js

ln -sf ../../lib/index.js  demo/js/bwflowers-bundle.js
ln -sf ../../lib/index.js.map demo/js/index.js.map
ln -sf ../../src/utils/jquery-2.1.1.js demo/js/jquery.js
ln -sf ../../src/utils/mersenne_twister.js demo/js/mersenne_twister.js
ln -sf ../../src/utils/underscore.js demo/js/underscore.js

mkdir -p bundle
cp lib/index.js bundle/bwflowers-bundle.js