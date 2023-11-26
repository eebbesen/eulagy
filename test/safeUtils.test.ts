import * as Utils from '../src/utils';

const kp: { Score: number; Text: string; BeginOffset: number; EndOffset: number; }[] = [ 
       { Score: 0.9989810585975647,
          Text: 'Our Statement',
          BeginOffset: 0,
          EndOffset: 13 },
        { Score: 0.9646416306495667,
          Text: 'Rights and Responsibilities',
          BeginOffset: 17,
          EndOffset: 44 },
        { Score: 0.9958744049072266,
          Text: 'our STATEMENT',
          BeginOffset: 60,
          EndOffset: 69 },
        { Score: 0.9955416321754456,
          Text: 'Service',
          BeginOffset: 73,
          EndOffset: 80 },
        { Score: 0.9994470477104187,
          Text: 'our previous Statement',
          BeginOffset: 95,
          EndOffset: 117 } ];

describe('sortEntriesByValues', () => {
  it('sorts key phrases by count descending', () => {
    const sorted: Map<string, number> = Utils.sortEntriesByValues(kp)

    expect(sorted.size).toBe(4);
    expect(sorted.get('our statement')).toBe(2);
    expect(sorted.get('rights and responsibilities')).toBe(1);
    expect(sorted.get('service')).toBe(1);
    expect(sorted.get('our previous statement')).toBe(1);
  });
});

describe('mapToCsv', () => {
  it('Maps to csv', () => {
    const map: Map<string, number> = Utils.sortEntriesByValues(kp);
    const result: string = Utils.mapToCsv(map);
    expect(result.replace(/\n/g, '')).toEqual('our statement,2rights and responsibilities,1service,1our previous statement,1');
  });  
});
