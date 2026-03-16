  export function arrayToQueryValues(values: string[], wrapInQuotes: boolean = false): string {
    return values.reduce((p: string, c: string) => {
        const val = wrapInQuotes ? `${c}` : c;

        return `${p}${val}, `;
      }, 
      ''
    ).substring(0,-1);
  }

  export function cleanParam(param: string | undefined): string | undefined {
    if (!param) return undefined;
    const match = param!.trim().match(/[\w\s\.-]+/i);
    return match ? match[0] : undefined;
  }