import { flipSelfX } from './flipSelfX';

import { NucleobaseMock } from './NucleobaseMock';

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
      { x: 12, y: 19 },
      { x: 79.16087308003235, y: -22.163298302344387 },
      { x: -6.090541632983026, y: 30.564268391269195 },
      { x: -27.188358932902176, y: 23.15602263540824 },
      { x: 80.00000000000001, y: 37.00000000000001 },
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
      { x: 1012, y: -2 },
      { x: 851.1350243902439, y: -21.376780487804893 },
      { x: 67.72175609756107, y: -406.12819512195153 },
      { x: 17.814829268292726, y: -200.04253658536618 },
      { x: 305.0000000000001, y: -51.0000000000002 },
    ];

    expectedCoordinates.forEach((cs, i) => {
      expect(targetBases[i].getCenterPoint().x).toBeCloseTo(cs.x);
      expect(targetBases[i].getCenterPoint().y).toBeCloseTo(cs.y);
    });
  });

  it('maintains the coordinates of the first and last bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 1, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: 22, y: 9 } }),
      new NucleobaseMock({ centerPoint: { x: 37, y: -8 } }),
      new NucleobaseMock({ centerPoint: { x: 18, y: -12 } }),
    ];

    flipSelfX(targetBases);

    // were maintained
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(1);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(12);

    // were maintained
    expect(targetBases[3].getCenterPoint().x).toBeCloseTo(18);
    expect(targetBases[3].getCenterPoint().y).toBeCloseTo(-12);

    expect(targetBases.length).toBe(4);
  });
});
