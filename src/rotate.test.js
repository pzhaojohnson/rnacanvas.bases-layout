import { rotate } from './rotate';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

describe('rotate function', () => {
  test('an empty array of target bases', () => {
    let targetBases = [];

    expect(() => rotate(targetBases, Math.PI / 3)).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 57, y: 821 } }),
    ];

    rotate(targetBases, 2 * Math.PI / 3);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(57);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(821);
  });

  test('multiple target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 10, y: 72 } }),
      new NucleobaseMock({ centerPoint: { x: -23, y: 22 } }),
      new NucleobaseMock({ centerPoint: { x: 888, y: -1000 } }),
      new NucleobaseMock({ centerPoint: { x: 512, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 7, y: -4 } }),
    ];

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo(278.8);
    expect(centroid.get().y).toBeCloseTo(-182);

    rotate(targetBases, 4 * Math.PI / 3);

    // maintains centroid
    expect(centroid.get().x).toBeCloseTo(278.8);
    expect(centroid.get().y).toBeCloseTo(-182);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(633.1704526);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-76.21237146);

    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(606.3691824);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(-22.63353314);

    expect(targetBases[2].getCenterPoint().x).toBeCloseTo(-734.2087803);
    expect(targetBases[2].getCenterPoint().y).toBeCloseTo(-300.582676);

    expect(targetBases[3].getCenterPoint().x).toBeCloseTo(319.8166235);
    expect(targetBases[3].getCenterPoint().y).toBeCloseTo(-474.9571242);

    expect(targetBases[4].getCenterPoint().x).toBeCloseTo(568.8525219);
    expect(targetBases[4].getCenterPoint().y).toBeCloseTo(-35.61429525);
  });

  test('rotating by a negative angle', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 100 } }),
      new NucleobaseMock({ centerPoint: { x: -58, y: -2 } }),
      new NucleobaseMock({ centerPoint: { x: 64, y: 800 } }),
    ];

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo(6);
    expect(centroid.get().y).toBeCloseTo(299.3333333);

    rotate(targetBases, -Math.PI / 4);

    // maintains centroid
    expect(centroid.get().x).toBeCloseTo(6);
    expect(centroid.get().y).toBeCloseTo(299.3333333);

    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(-130.707311);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(154.1407409);

    expect(targetBases[1].getCenterPoint().x).toBeCloseTo(-252.3296774);
    expect(targetBases[1].getCenterPoint().y).toBeCloseTo(131.5133239);

    expect(targetBases[2].getCenterPoint().x).toBeCloseTo(401.0369884);
    expect(targetBases[2].getCenterPoint().y).toBeCloseTo(612.3459351);
  });

  test('multiple target bases all on top of each other', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 50 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 50 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 50 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 50 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 50 } }),
    ];

    rotate(targetBases, 4 * Math.PI / 3);

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(12);
      expect(b.getCenterPoint().y).toBeCloseTo(50);
    });
  });
});
