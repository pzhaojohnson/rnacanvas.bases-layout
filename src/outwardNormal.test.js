import { outwardNormal } from './outwardNormal';

import { NucleobaseMock } from './NucleobaseMock';

test('`function outwardNormal()`', () => {
  let seq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }));

  let b = seq[0];

  // empty structures
  expect(() => outwardNormal(b, [])).toThrow();
  expect(() => outwardNormal(b, [], [])).toThrow();

  // structures with only one base
  expect(outwardNormal(b, [b])).toBeCloseTo(Math.PI / 2);
  expect(outwardNormal(b, [b], [])).toBeCloseTo(Math.PI / 2);

  // the target base is not present in the provided structure
  b = new NucleobaseMock({ centerPoint: { x: 0, y: 0 } });
  expect(() => outwardNormal(b, seq)).toThrow();
  expect(() => outwardNormal(b, seq, [])).toThrow();

  // the first base
  seq[0].setCenterPoint({ x: 12, y: -6 });
  seq[1].setCenterPoint({ x: 37, y: 18 });
  expect(outwardNormal(seq[0], seq)).toBeCloseTo(Math.atan2(18 - (-6), 37 - 12) + (Math.PI / 2));

  // a middle base
  seq[2].setCenterPoint({ x: -20, y: 33 });
  seq[3].setCenterPoint({ x: -5, y: -9 });
  seq[4].setCenterPoint({ x: 9, y: 2 });
  expect(outwardNormal(seq[3], seq)).toBeCloseTo(Math.atan2(2 - 33, 9 - (-20)) + (Math.PI / 2) + Math.PI);

  // the last base
  seq.at(-2).setCenterPoint({ x: 20, y: 21 });
  seq.at(-1).setCenterPoint({ x: 58, y: 72 });
  expect(outwardNormal(seq.at(-1), seq)).toBeCloseTo(Math.atan2(72 - 21, 58 - 20) + (Math.PI / 2));

  // a paired base
  seq[2].setCenterPoint({ x: -20, y: 33 });
  seq[3].setCenterPoint({ x: -5, y: -9 });
  seq[4].setCenterPoint({ x: 9, y: 2 });
  seq[6].setCenterPoint({ x: -11, y: -12 });
  expect(outwardNormal(seq[3], seq, [[seq[3], seq[6]]]) - (2 * Math.PI)).toBeCloseTo(Math.atan2(2 - 33, 9 - (-20)) + (Math.PI / 2));

  // the outward normal angle would otherwise be flipped
  // (if the base was unpaired)
  seq[2].setCenterPoint({ x: -20, y: 33 });
  seq[3].setCenterPoint({ x: -5, y: -9 });
  seq[4].setCenterPoint({ x: 9, y: 2 });
  seq[6].setCenterPoint({ x: -11, y: -12 });
  expect(outwardNormal(seq[3], seq, [])).toBeCloseTo(Math.atan2(2 - 33, 9 - (-20)) + (Math.PI / 2) + Math.PI);
});
