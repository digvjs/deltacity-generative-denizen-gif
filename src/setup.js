const fs = require('fs');
const {basePath} = require('../lib/PathHelper')
const buildDir = `${basePath}/build`

/**
 * Build setup..
 * Runs before starting script
 */
const buildSetup = () => {
    if (fs.existsSync(buildDir)) {
        fs.rmdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir)
};



module.exports = {
    buildSetup,
}