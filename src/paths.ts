import fs from 'fs';
import path from 'path';

const appRootDir = fs.realpathSync(path.join(__dirname, '..'));
export const resolveRelative = (relativePath: string) =>
  path.resolve(appRootDir, relativePath);

export const paths = {
  appRootDir,
  appServer: resolveRelative('server'),
  appNodeModules: resolveRelative('node_modules'),
};
