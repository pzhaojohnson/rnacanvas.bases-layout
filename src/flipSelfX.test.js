import { flipSelfX } from './flipSelfX';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

describe('flipSelfX function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => flipSelfX(targetBases)).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 59, y: 14 } }),
    ];

    flipSelfX(targetBases);

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(59);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(14);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: -112, y: 28 } }),
      new NucleobaseMock({ centerPoint: { x: 33, y: 74 } }),
    ];

    flipSelfX(targetBases);

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(-112);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(28);

    // was not moved
    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(33);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(74);
  });

  test('five target bases with an original direction between 0 and pi / 2', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 19 } }),
      new NucleobaseMock({ centerPoint: { x: 50, y: 88 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: -20, y: -4 } }),
      new NucleobaseMock({ centerPoint: { x: 80, y: 37 } }),
    ];

    flipSelfX(targetBases);

    let expectedCoordinates = [
      { x: 9.22360549717057, y: 29.48860145513339 },
      { x: 76.38447857720291, y: -11.674696847210996 },
      { x: -8.866936135812455, y: 41.05286984640259 },
      { x: -29.964753435731605, y: 33.64462409054163 },
      { x: 77.22360549717058, y: 47.4886014551334 },
    ];

    expectedCoordinates.forEach((cs, i) => {
      expect(targetBases[i].getCenterPoint().x).toBeCloseTo(cs.x);
      expect(targetBases[i].getCenterPoint().y).toBeCloseTo(cs.y);
    });
  });

  test('five target bases with an original direction between -pi and -pi / 2', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 1012, y: -2 } }),
      new NucleobaseMock({ centerPoint: { x: 850, y: -5 } }),
      new NucleobaseMock({ centerPoint: { x: 21, y: 268 } }),
      new NucleobaseMock({ centerPoint: { x: 0, y: 57 } }),
      new NucleobaseMock({ centerPoint: { x: 305, y: -51 } }),
    ];

    flipSelfX(targetBases);

    let expectedCoordinates = [
      { x: 998.8656780487805, y: 187.50950243902454 },
      { x: 838.0007024390244, y: 168.13272195121965 },
      { x: 54.58743414634159, y: -216.61869268292696 },
      { x: 4.68050731707325, y: -10.533034146341635 },
      { x: 291.86567804878064, y: 138.50950243902435 },
    ];

    expectedCoordinates.forEach((cs, i) => {
      expect(targetBases[i].getCenterPoint().x).toBeCloseTo(cs.x);
      expect(targetBases[i].getCenterPoint().y).toBeCloseTo(cs.y);
    });
  });

  it('maintains centroid', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 1, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: 22, y: 9 } }),
      new NucleobaseMock({ centerPoint: { x: 37, y: -8 } }),
      new NucleobaseMock({ centerPoint: { x: 18, y: -12 } }),
    ];

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo(19.5);
    expect(centroid.get().y).toBeCloseTo(0.25);

    flipSelfX(targetBases);

    // was maintained
    expect(centroid.get().x).toBeCloseTo(19.5);
    expect(centroid.get().y).toBeCloseTo(0.25);
  });
});
