import { shift } from './shift';

import { NucleobaseMock } from './NucleobaseMock';

describe('shift function', () => {
  test('an empty array of target bases', () => {
    let targetBases = [];

    expect(() => shift(targetBases, { x: 5, y: 10 })).not.toThrow();
  });

  test('shifting one base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 14, y: 12 } }),
    ];

    shift(targetBases, { x: -60, y: 28 });

    expect(targetBases[0].getCenterPoint()).toStrictEqual({ x: -46, y: 40 });
  });

  test('shifting multiple bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 14, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: 140, y: 437 } }),
      new NucleobaseMock({ centerPoint: { x: -2, y: -88 } }),
      new NucleobaseMock({ centerPoint: { x: 1001, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: -527, y: 2 } }),
    ];

    shift(targetBases, { x: 38, y: -124 });

    expect(targetBases[0].getCenterPoint()).toStrictEqual({ x: 52, y: -112 });
    expect(targetBases[1].getCenterPoint()).toStrictEqual({ x: 178, y: 313 });
    expect(targetBases[2].getCenterPoint()).toStrictEqual({ x: 36, y: -212 });
    expect(targetBases[3].getCenterPoint()).toStrictEqual({ x: 1039, y: -124 });
    expect(targetBases[4].getCenterPoint()).toStrictEqual({ x: -489, y: -122 });
  });

  test('shifting bases by a vector with zero magnitude', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 50, y: 1 } }),
      new NucleobaseMock({ centerPoint: { x: -8, y: 11 } }),
      new NucleobaseMock({ centerPoint: { x: 51, y: 1000 } }),
    ];

    shift(targetBases, { x: 0, y: 0 });

    expect(targetBases[0].getCenterPoint()).toStrictEqual({ x: 50, y: 1 });
    expect(targetBases[1].getCenterPoint()).toStrictEqual({ x: -8, y: 11 });
    expect(targetBases[2].getCenterPoint()).toStrictEqual({ x: 51, y: 1000 });
  });
});
