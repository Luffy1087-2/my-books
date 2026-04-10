export function fileUrlToPath(fileUrl: string): string {
  const sep = process.platform === 'win32' ? '\\' : '/';
  let filePath = fileUrl;
  if (!fileUrl.startsWith('file:')) throw new Error('prefix is not satisfied');
  filePath = filePath.replace('file:', '');
  const hostWays = [`//localhost`, `///`];
  const index = hostWays.map((hw: string) => filePath.startsWith(hw)).findIndex(m => m);
  if (index == -1) throw new Error('format error');
  filePath = filePath.replace(hostWays[index]!, '');
  filePath = filePath.replace(new RegExp('/', 'g'), sep);

  return filePath;
}

export function dirname(path: string) {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string');
  }

  const lastSlashIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  if (lastSlashIndex === -1) {
    return '.';
  }

  const dirname = path.slice(0, lastSlashIndex);
  return dirname;
}
