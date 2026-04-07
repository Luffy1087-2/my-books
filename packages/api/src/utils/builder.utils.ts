export function arrayToQueryValues(values: (string | number)[], wrapInQuotes: boolean = false): string {
  const valuesString = values.reduce((p: string, c: string | number) => {
    const val = wrapInQuotes && typeof c === 'string' ? `'${c}'` : c;

    return `${p}${val}, `;
  },
    ''
  );

  return valuesString.slice(0, -2);
}