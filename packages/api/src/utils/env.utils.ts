import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function getEnvByKey(key: string): string {
  const envs = typeof process !== 'undefined' ? process.env : (import.meta as any).env
  const varByKey = envs['VITE_' + key] ?? envs[key];
  if (!varByKey) throw new TypeError(key + ' is not present');

  return varByKey;
}

export function getEnvPath(scriptUrl: string, envDir: string = 'my-books') {
  const filePath = fileURLToPath(scriptUrl);
  const dirName = dirname(filePath);
  const rightPath = dirName.substring(0, dirName.indexOf(envDir) + envDir.length + 1) + '.env';

  return rightPath;
}
