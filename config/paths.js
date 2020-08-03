const fs = require('fs');
const path = require('path');

const appRootDir = fs.realpathSync(path.join(__dirname, '..'));
const resolveRelative = relativePath => path.resolve(appRootDir, relativePath);

const paths = {
  appRootDir,
  appServer: resolveRelative('server'),
  appTemp: resolveRelative('temp'),
  appNodeModules: resolveRelative('node_modules'),
};

module.exports = {
  ...paths,
  resolveRelative,
}
