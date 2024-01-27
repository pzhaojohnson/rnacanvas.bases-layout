import { MaxCenterX } from './MaxCenterX';

import { NucleobaseMock } from './NucleobaseMock';

describe('MaxCenterX class', () => {
  describe('get method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let maxCenterX = new MaxCenterX(targetBases);

      expect(typeof maxCenterX.get()).toBe('number');
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 4627, y: 38199 } }),
      ];

      let maxCenterX = new MaxCenterX(targetBases);

      expect(maxCenterX.get()).toBe(4627);
    });

    test('five target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -82.79057139883326, y: -136.23951072886308 } }),
        new NucleobaseMock({ centerPoint: { x: 74.1640800500096, y: 37.33587564418474 } }),
        new NucleobaseMock({ centerPoint: { x: 1.6255206869064693, y: -128.5595786996264 } }),
        new NucleobaseMock({ centerPoint: { x: 97.48959892206818, y: 156.74754221086994 } }),
        new NucleobaseMock({ centerPoint: { x: 16.425902434859438, y: -17.186511516488423 } }),
      ];

      let maxCenterX = new MaxCenterX(targetBases);

      expect(maxCenterX.get()).toBe(97.48959892206818);
    });
  });

  describe('set method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let maxCenterX = new MaxCenterX(targetBases);

      expect(() => maxCenterX.set(10)).not.toThrow();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 781, y: -428 } }),
      ];

      let maxCenterX = new MaxCenterX(targetBases);

      maxCenterX.set(82);

      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(82);

      // was not changed
      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-428);
    });

    test('seven target bases', () => {
      let startingCenterPoints = [
        { x: -139.53225934002356, y: 162.52479638148088 },
        { x: 198.08578836340195, y: 173.91937583135297 },
        { x: 49.21928917172568, y: -150.80926126239447 },
        { x: -146.22410413705688, y: -123.54539164008338 },
        { x: -243.93668991414506, y: 27.150500160673232 },
        { x: -37.32187252130393, y: -60.99793273631437 },
        { x: 36.535299983384334, y: -160.41118659013665 },
      ];

      let targetBases = startingCenterPoints.map(centerPoint => new NucleobaseMock({ centerPoint }));

      let maxCenterX = new MaxCenterX(targetBases);

      maxCenterX.set(-918);

      // X coordinates were shifted
      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().x).toBeCloseTo(startingCenterPoints[i].x + ((-918) - 198.08578836340195));
      });

      // Y coordinates were not changed
      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().y).toBeCloseTo(startingCenterPoints[i].y);
      });
    });
  });
});
