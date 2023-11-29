import { type KeyPhrase } from '@aws-sdk/client-comprehend'

export interface KeyPhraseMap { k: string, v: number }

// count and sort map by count of key (lower case)
export function sortEntriesByValues (arr: KeyPhrase[]): Map<string, number> {
  const occ = arr.reduce((occ: any, val: KeyPhrase) => {
    const slug: string | undefined = val?.Text?.toLowerCase()
    const k = slug?.toLowerCase() ?? 'undefined'
    const v: number = occ.get(k) ?? 0

    return occ.set(k, 1 + (v))
  }, new Map<string, number>())

  return new Map<string, number>([...occ.entries()].sort((a, b) => b[1] - a[1]))
};

export function mapToCsv (map: Map<string, number>): string {
  let text = ''
  map.forEach((v, k, m) => {
    text += `${k},${v}\n`
  })
  return text
};

export function chunkText (text: string | undefined, limit: number): RegExpMatchArray {
  const regexp: RegExp = new RegExp(`[\\s\\S]{1,${limit}}`, 'g')
  const ret: RegExpMatchArray | null | undefined = text?.match(regexp)

  if (ret == null || ret.length === 0 || ret === undefined) {
    throw new Error('No text extracted')
  }

  return ret
}
