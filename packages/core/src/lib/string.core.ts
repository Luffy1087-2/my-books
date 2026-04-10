export function cleanParam(param: string | undefined): string | undefined {
  if (!param) return undefined;
  const match = param!.trim().match(/[\w\s\.-]+/i);
  return match ? match[0] : undefined;
}

export function trimLines(str: string) {
  return str
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}
