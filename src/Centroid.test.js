import { Centroid } from './Centroid';

import { NucleobaseMock } from './NucleobaseMock';

describe('Centroid class', () => {
  describe('get method', () => {
    test('an empty array of target bases', () => {
      let targetBases = [];

      let centroid = new Centroid(targetBases);

      expect(centroid.get().x).toBeNaN();
      expect(centroid.get().y).toBeNaN();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 55, y: -128 } }),
      ];

      let centroid = new Centroid(targetBases);

      expect(centroid.get().x).toBeCloseTo(55);
      expect(centroid.get().y).toBeCloseTo(-128);
    });

    test('multiple target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 5, y: 191 } }),
        new NucleobaseMock({ centerPoint: { x: 88, y: 992 } }),
        new NucleobaseMock({ centerPoint: { x: 185, y: -3 } }),
        new NucleobaseMock({ centerPoint: { x: -39, y: 0 } }),
      ];

      let centroid = new Centroid(targetBases);

      expect(centroid.get().x).toBeCloseTo(59.75);
      expect(centroid.get().y).toBeCloseTo(295);
    });
  });

  describe('set method', () => {
    test('an empty array of target bases', () => {
      let targetBases = [];

      let centroid = new Centroid(targetBases);

      expect(() => centroid.set({ x: 100, y: 200 })).not.toThrow();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -10, y: 12 } }),
      ];

      let centroid = new Centroid(targetBases);

      centroid.set({ x: 96, y: 502 });

      expect(centroid.get().x).toBeCloseTo(96);
      expect(centroid.get().y).toBeCloseTo(502);

      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(96);
      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(502);
    });

    test('multiple target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 9, y: 64 } }),
        new NucleobaseMock({ centerPoint: { x: 662, y: -111 } }),
        new NucleobaseMock({ centerPoint: { x: -14, y: -557 } }),
        new NucleobaseMock({ centerPoint: { x: 22, y: 821 } }),
      ];

      let centroid = new Centroid(targetBases);

      centroid.set({ x: 1012, y: -808 });

      expect(centroid.get().x).toBeCloseTo(1012);
      expect(centroid.get().y).toBeCloseTo(-808);

      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(851.25);
      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-798.25);

      expect(targetBases[1].getCenterPoint().x).toBeCloseTo(1504.25);
      expect(targetBases[1].getCenterPoint().y).toBeCloseTo(-973.25);

      expect(targetBases[2].getCenterPoint().x).toBeCloseTo(828.25);
      expect(targetBases[2].getCenterPoint().y).toBeCloseTo(-1419.25);

      expect(targetBases[3].getCenterPoint().x).toBeCloseTo(864.25);
      expect(targetBases[3].getCenterPoint().y).toBeCloseTo(-41.25);
    });
  });
});
