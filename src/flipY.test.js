import { flipY } from './flipY';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

describe('flipY function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => flipY(targetBases)).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 88, y: -12 } }),
    ];

    flipY(targetBases);

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(88);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-12);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 52, y: 13 } }),
      new NucleobaseMock({ centerPoint: { x: 1011, y: 817 } }),
    ];

    flipY(targetBases);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(1011);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(13);

    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(52);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(817);
  });

  it('flips X coordinates across centroid X coordinate', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 18, y: 46 } }),
      new NucleobaseMock({ centerPoint: { x: -1, y: 29 } }),
      new NucleobaseMock({ centerPoint: { x: 52, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: -37, y: -15 } }),
      new NucleobaseMock({ centerPoint: { x: 115, y: -200 } }),
      new NucleobaseMock({ centerPoint: { x: 91, y: 6 } }),
    ];

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo(39.666666666666664);

    flipY(targetBases);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(61.33333333333333);
    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(80.33333333333333);
    expect(targetBases[2].getCenterPoint().x).toBeCloseTo(27.33333333333333);
    expect(targetBases[3].getCenterPoint().x).toBeCloseTo(116.33333333333331);
    expect(targetBases[4].getCenterPoint().x).toBeCloseTo(-35.66666666666668);
    expect(targetBases[5].getCenterPoint().x).toBeCloseTo(-11.666666666666671);

    // centroid X coordinate was maintained
    expect(centroid.get().x).toBeCloseTo(39.666666666666664);
  });

  it('maintains Y coordinates', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 18, y: 46 } }),
      new NucleobaseMock({ centerPoint: { x: -1, y: 29 } }),
      new NucleobaseMock({ centerPoint: { x: 52, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: -37, y: -15 } }),
      new NucleobaseMock({ centerPoint: { x: 115, y: -200 } }),
      new NucleobaseMock({ centerPoint: { x: 91, y: 6 } }),
    ];

    flipY(targetBases);

    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(46);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(29);
    expect(targetBases[2].getCenterPoint().y).toBeCloseTo(12);
    expect(targetBases[3].getCenterPoint().y).toBeCloseTo(-15);
    expect(targetBases[4].getCenterPoint().y).toBeCloseTo(-200);
    expect(targetBases[5].getCenterPoint().y).toBeCloseTo(6);
  });
});
