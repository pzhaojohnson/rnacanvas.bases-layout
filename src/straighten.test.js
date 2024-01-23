import { straighten } from './straighten';

import { NucleobaseMock } from './NucleobaseMock';

import { distance } from '@rnacanvas/points';

describe('straighten function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => straighten(targetBases)).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 19 } }),
    ];

    straighten(targetBases);

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(5);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(19);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 33, y: -6 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 20 } }),
    ];

    straighten(targetBases);

    // should not have been moved
    let straightenedCenterPoints = [
      { x: 33, y: -6 },
      { x: 12, y: 20 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(straightenedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(straightenedCenterPoints[i].y);
    });
  });

  test('three target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 25, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: -1032, y: -341 } }),
      new NucleobaseMock({ centerPoint: { x: 421, y: 54 } }),
    ];

    straighten(targetBases);

    let straightenedCenterPoints = [
      { x: 25, y: 2 },
      { x: (25 + 421) / 2, y: (2 + 54) / 2 },
      { x: 421, y: 54 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(straightenedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(straightenedCenterPoints[i].y);
    });
  });

  test('seven target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 81, y: 7 } }),
      new NucleobaseMock({ centerPoint: { x: 92, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: 401, y: -42 } }),
      new NucleobaseMock({ centerPoint: { x: -3819, y: 4829 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: -453 } }),
      new NucleobaseMock({ centerPoint: { x: 958, y: 31 } }),
      new NucleobaseMock({ centerPoint: { x: 57, y: 25 } }),
    ];

    expect(targetBases.length).toBe(7);

    straighten(targetBases);

    let straightenedCenterPoints = [
      { x: 81, y: 7 },
      { x: 77, y: 10 },
      { x: 73, y: 13 },
      { x: 69, y: 16 },
      { x: 65, y: 19 },
      { x: 61, y: 22 },
      { x: 57, y: 25 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(straightenedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(straightenedCenterPoints[i].y);
    });
  });

  test('when the first and last bases are right on top of each other', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 201, y: -34 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: -212 } }),
      new NucleobaseMock({ centerPoint: { x: 33, y: 11 } }),
      new NucleobaseMock({ centerPoint: { x: 1000, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: 201, y: -34 } }),
    ];

    expect(targetBases.length).toBe(5);

    expect(distance(targetBases[0].getCenterPoint(), targetBases[4].getCenterPoint())).toBeCloseTo(0);

    straighten(targetBases);

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(201);
      expect(b.getCenterPoint().y).toBeCloseTo(-34);
    });
  });
});
