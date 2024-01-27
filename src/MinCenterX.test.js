import { MinCenterX } from './MinCenterX';

import { NucleobaseMock } from './NucleobaseMock';

describe('MinCenterX class', () => {
  describe('get method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let minCenterX = new MinCenterX(targetBases);

      expect(typeof minCenterX.get()).toBe('number');
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 3819, y: 31 } }),
      ];

      let minCenterX = new MinCenterX(targetBases);

      expect(minCenterX.get()).toBe(3819);
    });

    test('six target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 738, y: 4781 } }),
        new NucleobaseMock({ centerPoint: { x: -379, y: 46 } }),
        new NucleobaseMock({ centerPoint: { x: 42, y: -3819 } }),
        new NucleobaseMock({ centerPoint: { x: 748, y: 5 } }),
        new NucleobaseMock({ centerPoint: { x: 9316, y: 289 } }),
        new NucleobaseMock({ centerPoint: { x: -47, y: 29 } }),
      ];

      let minCenterX = new MinCenterX(targetBases);

      expect(minCenterX.get()).toBe(-379);
    });
  });

  describe('set method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let minCenterX = new MinCenterX(targetBases);

      expect(() => minCenterX.set(5)).not.toThrow();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -472, y: 91 } }),
      ];

      let minCenterX = new MinCenterX(targetBases);

      minCenterX.set(28);

      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(28);

      // is unchanged
      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(91);
    });

    test('five target bases', () => {
      let startingCenterPoints = [
        { x: 4892, y: 41 },
        { x: 31, y: -3819 },
        { x: -8139, y: 7 },
        { x: 57, y: 3819 },
        { x: 2738, y: 4921 },
      ];

      let targetBases = startingCenterPoints.map(centerPoint => new NucleobaseMock({ centerPoint }));

      let minCenterX = new MinCenterX(targetBases);

      minCenterX.set(-7639);

      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().x).toBeCloseTo(startingCenterPoints[i].x + 500);
        expect(b.getCenterPoint().y).toBeCloseTo(startingCenterPoints[i].y);
      });
    });
  });
});
