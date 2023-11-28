// count and sort map by count of key (lower case)
export function sortEntriesByValues (arr: any[]): Map<string, number> {
  const occ = arr.reduce((occ, val) => occ.set(val.Text.toLowerCase(), 1 + (occ.get(val.Text.toLowerCase()) || 0)), new Map())
  return new Map([...occ.entries()].sort((a, b) => b[1] - a[1]))
};

export function mapToCsv (map: Map<string, number>): string {
  let text = ''
  map.forEach((v, k, m) => {
    text += `${k},${v}\n`
  })
  return text
};
