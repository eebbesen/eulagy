import * as Utils from '../src/utils'

const kp: Array<{ Score: number, Text: string, BeginOffset: number, EndOffset: number }> = [
  {
    Score: 0.9989810585975647,
    Text: 'Our Statement',
    BeginOffset: 0,
    EndOffset: 13
  },
  {
    Score: 0.9646416306495667,
    Text: 'Rights and Responsibilities',
    BeginOffset: 17,
    EndOffset: 44
  },
  {
    Score: 0.9958744049072266,
    Text: 'our STATEMENT',
    BeginOffset: 60,
    EndOffset: 69
  },
  {
    Score: 0.9955416321754456,
    Text: 'Service',
    BeginOffset: 73,
    EndOffset: 80
  },
  {
    Score: 0.9994470477104187,
    Text: 'our previous Statement',
    BeginOffset: 95,
    EndOffset: 117
  }]

describe('sortEntriesByValues', () => {
  it('sorts key phrases by count descending', () => {
    const sorted: Map<string, number> = Utils.sortEntriesByValues(kp)

    expect(sorted.size).toBe(4)
    expect(sorted.get('our statement')).toBe(2)
    expect(sorted.get('rights and responsibilities')).toBe(1)
    expect(sorted.get('service')).toBe(1)
    expect(sorted.get('our previous statement')).toBe(1)
  })
})

describe('mapToCsv', () => {
  it('Maps to csv', () => {
    const map: Map<string, number> = Utils.sortEntriesByValues(kp)
    const result: string = Utils.mapToCsv(map)
    expect(result.replace(/\n/g, '')).toEqual('our statement,2rights and responsibilities,1service,1our previous statement,1')
  })
})

describe('chunkText', () => {
  it('returns the correct amount of text when limit is less than text length', () => {
    const text: string = 'Hello, this is some test text'
    const ret: RegExpMatchArray = Utils.chunkText(text, 10)
    expect(ret[0]).toEqual('Hello, thi')
    expect(ret.length).toEqual(3)
  })

  it('returns the correct amount of text when limit is more than text length', () => {
    const text: string = 'Hello, this is some test text'
    const ret: RegExpMatchArray = Utils.chunkText(text, 100)
    expect(ret[0]).toEqual(text)
    expect(ret.length).toEqual(1)
  })

  it('throws error when no return', () => {
    expect(() => Utils.chunkText('', 1)).toThrow('No text extracted')
  })
})

describe('propertyCheck', () => {
  const originalProcessEnv = process.env
  afterEach(() => { process.env = originalProcessEnv })

  it('throws error when empty BUCKET_NAME', () => {
    process.env = { ...process.env, BUCKET_NAME: '' }
    expect(() => Utils.bucketProperty()).toThrow('No bucket name specified. BUCKET_NAME environment variable required.')
  })

  it('throws error when null BUCKET_NAME', () => {
    let undefinedVal
    process.env = { ...process.env, BUCKET_NAME: undefinedVal }
    expect(() => Utils.bucketProperty()).toThrow('No bucket name specified. BUCKET_NAME environment variable required.')
  })

  it('throws error when no BUCKET_NAME key', () => {
    delete process.env.BUCKET_NAME
    expect(() => Utils.bucketProperty()).toThrow('No bucket name specified. BUCKET_NAME environment variable required.')
  })

  it('accepts populated value', () => {
    process.env = { ...process.env, BUCKET_NAME: 'someval' }
    Utils.bucketProperty()
  })

})
