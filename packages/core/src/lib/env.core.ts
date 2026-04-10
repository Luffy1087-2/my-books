import { dirname, fileUrlToPath } from './polyfill.core.js';

export function getEnvByKey(key: string): string {
  const envs = process.env;
  const varByKey = envs['REACT_APP_' + key] ?? envs[key];
  if (!varByKey) throw new TypeError(key + ' is not present');

  return varByKey;
}

export function getEnvPath(scriptUrl: string, envDir: string = 'my-books') {
  const filePath = fileUrlToPath(scriptUrl);
  const dirName = dirname(filePath);
  const rightPath = dirName.substring(0, dirName.indexOf(envDir) + envDir.length + 1) + '.env';

  return rightPath;
}
