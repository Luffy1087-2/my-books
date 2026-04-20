import { dirname, fileUrlToPath } from './polyfill.core.js';

function getEnvSource() {
  try {
    return process.env;
  } catch {
    return (import.meta as any).env
  }
}

export function getEnvByKey(key: string): string {
  const envs = getEnvSource();
  const varByKey = envs['VITE_' + key] ?? envs[key];
  if (!varByKey) throw new TypeError(key + ' is not present');

  return varByKey;
}

export function getEnvPath(scriptUrl: string, envDir: string = 'my-books') {
  const filePath = fileUrlToPath(scriptUrl);
  const dirName = dirname(filePath);
  const rightPath = dirName.substring(0, dirName.indexOf(envDir) + envDir.length + 1) + '.env';

  return rightPath;
}
