import { MinCenterY } from './MinCenterY';

import { NucleobaseMock } from './NucleobaseMock';

describe('MinCenterY class', () => {
  describe('get method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let minCenterY = new MinCenterY(targetBases);

      expect(typeof minCenterY.get()).toBe('number');
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 237.985592995518, y: -245.59746057619913 } }),
      ];

      let minCenterY = new MinCenterY(targetBases);

      expect(minCenterY.get()).toBe(-245.59746057619913);
    });

    test('eight target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 114.99492002340884, y: 102.07520966929138 } }),
        new NucleobaseMock({ centerPoint: { x: -82.43886488232255, y: -165.0465254289616 } }),
        new NucleobaseMock({ centerPoint: { x: 234.56368005743212, y: 163.06120159704938 } }),
        new NucleobaseMock({ centerPoint: { x: -227.45083995688452, y: -129.40276291025322 } }),
        new NucleobaseMock({ centerPoint: { x: 22.582634754669584, y: -134.38149983712378 } }),
        new NucleobaseMock({ centerPoint: { x: 84.5907991629744, y: 102.6446905313685 } }),
        new NucleobaseMock({ centerPoint: { x: 108.1278120674827, y: -52.40342603588721 } }),
        new NucleobaseMock({ centerPoint: { x: -154.894835601164, y: 186.11702574747414 } }),
      ];

      let minCenterY = new MinCenterY(targetBases);

      expect(minCenterY.get()).toBe(-165.0465254289616);
    });
  });

  describe('set method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let minCenterY = new MinCenterY(targetBases);

      expect(() => minCenterY.set(10)).not.toThrow();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 207.1301197054495, y: 147.8548060492704 } }),
      ];

      let minCenterY = new MinCenterY(targetBases);

      minCenterY.set(401);

      // was shifted
      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(401);

      // was not changed
      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(207.1301197054495);
    });

    test('nine target bases', () => {
      let startingCenterPoints = [
        { x: 246.9229742007015, y: 126.21208693413575 },
        { x: -103.58211677046336, y: -216.5604467816774 },
        { x: 211.42850622142095, y: -140.5826347515058 },
        { x: -101.41631394200357, y: 68.9016485862802 },
        { x: 121.82380655939693, y: -17.162298276000342 },
        { x: -162.4382795437531, y: 9.521059515234299 },
        { x: 27.730116207642993, y: -71.52603157953763 },
        { x: 215.19823267252082, y: 139.39979348079368 },
        { x: 59.41287966046872, y: -233.56161607214588 },
      ];

      let targetBases = startingCenterPoints.map(centerPoint => new NucleobaseMock({ centerPoint }));

      let minCenterY = new MinCenterY(targetBases);

      minCenterY.set(42.8);

      // Y coordinates were shifted
      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().y).toBeCloseTo(startingCenterPoints[i].y + (42.8 - (-233.56161607214588)));
      });

      // X coordinates were not changed
      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().x).toBeCloseTo(startingCenterPoints[i].x);
      });
    });
  });
});
