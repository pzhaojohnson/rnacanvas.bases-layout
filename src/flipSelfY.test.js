import { flipSelfY } from './flipSelfY';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

describe('flipSelfY function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => flipSelfY(targetBases)).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 54 } }),
    ];

    flipSelfY(targetBases);

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(12);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(54);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 154, y: 92 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 887 } }),
    ];

    flipSelfY(targetBases);

    // switched coordinates with base 2
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(2);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(887);

    // switched coordinates with base 1
    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(154);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(92);
  });

  test('five target bases with an original direction between 0 and pi / 2', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 2, y: -36 } }),
      new NucleobaseMock({ centerPoint: { x: 54, y: 3 } }),
      new NucleobaseMock({ centerPoint: { x: -68, y: 1012 } }),
      new NucleobaseMock({ centerPoint: { x: 100, y: 852 } }),
      new NucleobaseMock({ centerPoint: { x: 19, y: 5 } }),
    ];

    flipSelfY(targetBases);

    let flippedCoordinates = [
      { x: 293.0020304568527, y: 665.8284263959391 },
      { x: 302.1482233502539, y: 601.4751269035532 },
      { x: -498.03959390862957, y: -25.154314720812295 },
      { x: -266.11269035532985, y: -30.97766497461936 },
      { x: 276.0020304568528, y: 624.8284263959391 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(flippedCoordinates[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(flippedCoordinates[i].y);
    });
  });

  test('five target bases with an original direction between 0 and -pi / 2', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 98, y: 30 } }),
      new NucleobaseMock({ centerPoint: { x: 110, y: 79 } }),
      new NucleobaseMock({ centerPoint: { x: -7, y: -88 } }),
      new NucleobaseMock({ centerPoint: { x: 251, y: 1 } }),
      new NucleobaseMock({ centerPoint: { x: 197, y: 12 } }),
    ];

    flipSelfY(targetBases);

    let flippedCoordinates = [
      { x: 167.7312, y: 17.3216 },
      { x: 173.74720000000002, y: 67.4096 },
      { x: 224.4752000000001, y: -130.08639999999997 },
      { x: 14.315200000000019, y: 44.03359999999997 },
      { x: 68.7312, y: 35.3216 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(flippedCoordinates[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(flippedCoordinates[i].y);
    });
  });

  it('maintains centroid', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 81, y: 48 } }),
      new NucleobaseMock({ centerPoint: { x: -4, y: 156 } }),
      new NucleobaseMock({ centerPoint: { x: 122, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 39, y: -2 } }),
    ];

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo(59.5);
    expect(centroid.get().y).toBeCloseTo(50.5);

    flipSelfY(targetBases);

    // was maintained
    expect(centroid.get().x).toBeCloseTo(59.5);
    expect(centroid.get().y).toBeCloseTo(50.5);
  });
});
