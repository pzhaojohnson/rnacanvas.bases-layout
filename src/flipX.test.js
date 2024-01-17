import { flipX } from './flipX';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

describe('flipX function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => flipX(targetBases)).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 59, y: 3819 } }),
    ];

    flipX(targetBases);

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(59);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(3819);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: -47, y: 16 } }),
      new NucleobaseMock({ centerPoint: { x: 36, y: 5 } }),
    ];

    flipX(targetBases);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(-47);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(5);

    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(36);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(16);
  });

  it('maintains X coordinates', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 55, y: 78 } }),
      new NucleobaseMock({ centerPoint: { x: -200, y: 421 } }),
      new NucleobaseMock({ centerPoint: { x: 4, y: -100 } }),
      new NucleobaseMock({ centerPoint: { x: 4718, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 37, y: 2 } }),
    ];

    flipX(targetBases);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(55);
    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(-200);
    expect(targetBases[2].getCenterPoint().x).toBeCloseTo(4);
    expect(targetBases[3].getCenterPoint().x).toBeCloseTo(4718);
    expect(targetBases[4].getCenterPoint().x).toBeCloseTo(37);
  });

  it('flips Y coordinates across centroid Y coordinate', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 55, y: 78 } }),
      new NucleobaseMock({ centerPoint: { x: -200, y: 421 } }),
      new NucleobaseMock({ centerPoint: { x: 4, y: -100 } }),
      new NucleobaseMock({ centerPoint: { x: 4718, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 37, y: 2 } }),
    ];

    let centroid = new Centroid(targetBases);

    expect(centroid.get().y).toBeCloseTo(80.2);

    flipX(targetBases);

    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(82.4);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(-260.6);
    expect(targetBases[2].getCenterPoint().y).toBeCloseTo(260.4);
    expect(targetBases[3].getCenterPoint().y).toBeCloseTo(160.4);
    expect(targetBases[4].getCenterPoint().y).toBeCloseTo(158.4);

    // maintains centroid Y coordinate
    expect(centroid.get().y).toBeCloseTo(80.2);
  });
});
