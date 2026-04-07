import { fileURLToPath } from 'url';
import path from 'path';

export function getEnvPath(scriptUrl: string, envDir: string = 'my-books') {
  const dirName = path.dirname(fileURLToPath(scriptUrl));
  const rightPath = dirName.substring(0, dirName.indexOf(envDir) + envDir.length + 1) + '.env';

  return rightPath;
}