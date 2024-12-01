import { tangent } from './tangent';

import { NucleobaseMock } from './NucleobaseMock';

test('`function tangent()`', () => {
  let b = new NucleobaseMock({ centerPoint: { x: 0, y: 0 } });

  let parentSequence = [1, 2, 3, 4, 5, 6, 7, 8].map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }));

  // an empty sequence
  expect(() => tangent(b, [])).toThrow();

  // the base is not present in the provided sequence
  expect(parentSequence.includes(b)).toBeFalsy();
  expect(() => tangent(b, parentSequence)).toThrow();

  // a sequence with only one base
  expect(tangent(b, [b])).toBe(0);

  // the first base of the parent sequence
  b.setCenterPoint({ x: 23, y: 83 });
  parentSequence[0].setCenterPoint({ x: -12, y: 8 });
  expect(tangent(b, [b, ...parentSequence])).toBeCloseTo(Math.atan2(8 - 83, (-12) - 23));

  // the last base of the parent sequence
  b.setCenterPoint({ x: -104, y: 88 });
  parentSequence.at(-1).setCenterPoint({ x: 32, y: 57 });
  expect(tangent(b, [...parentSequence, b])).toBeCloseTo(Math.atan2(88 - 57, (-104) - 32));

  // a middle base in the parent sequence
  expect(parentSequence.length).toBeGreaterThan(6);
  b.setCenterPoint({ x: 41, y: -7 });
  parentSequence[3].setCenterPoint({ x: 18, y: -9 });
  parentSequence[4].setCenterPoint({ x: -32, y: 77 });
  expect(tangent(b, [...parentSequence.slice(0, 4), b, ...parentSequence.slice(4)])).toBeCloseTo(Math.atan2(77 - (-9), (-32) - 18));
});
