export function arrayToQueryValues(values: (string | number)[]): string {
  const valuesString = values.reduce((p: string, c: string | number) => `${p}${c}, `
    , ''
  );

  return valuesString.slice(0, -2);
}
