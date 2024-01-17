import { Direction } from './Direction';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

describe('Direction class', () => {
  describe('get method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBe(0);
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 42, y: -37 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBe(0);
    });

    test('two target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 89, y: 120 } }),
        new NucleobaseMock({ centerPoint: { x: 400, y: 1000 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(1.2310876895430296);
    });

    test('six target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -88, y: 112 } }),
        new NucleobaseMock({ centerPoint: { x: 2, y: 50 } }),
        new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }),
        new NucleobaseMock({ centerPoint: { x: 10562, y: -87 } }),
        new NucleobaseMock({ centerPoint: { x: 59, y: 11 } }),
        new NucleobaseMock({ centerPoint: { x: 82, y: -728 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(-1.371112441419795);
    });
  });

  describe('set method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let direction = new Direction(targetBases);

      expect(() => direction.set(Math.PI / 2)).not.toThrow();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 57, y: 23 } }),
      ];

      let direction = new Direction(targetBases);

      expect(() => direction.set(Math.PI / 3)).not.toThrow();

      // was not moved
      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(57);
      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(23);
    });

    test('two target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 84, y: -12 } }),
        new NucleobaseMock({ centerPoint: { x: 187, y: 203 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(1.1240326667257081);

      direction.set(-0.5);

      expect(direction.get()).toBeCloseTo(-0.5);

      // bases were moved
      expect(targetBases[0].getCenterPoint().x).not.toBeCloseTo(84);
      expect(targetBases[1].getCenterPoint().y).not.toBeCloseTo(203);
    });

    test('five target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 771, y: 992 } }),
        new NucleobaseMock({ centerPoint: { x: -1, y: 81 } }),
        new NucleobaseMock({ centerPoint: { x: -9, y: 27 } }),
        new NucleobaseMock({ centerPoint: { x: 1257, y: 55 } }),
        new NucleobaseMock({ centerPoint: { x: 901, y: 9 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(-1.439311105323674);

      direction.set(0.27);

      expect(direction.get()).toBeCloseTo(0.27);

      // bases were moved
      expect(targetBases[0].getCenterPoint().x).not.toBeCloseTo(771);
      expect(targetBases[1].getCenterPoint().y).not.toBeCloseTo(81);
      expect(targetBases[2].getCenterPoint().x).not.toBeCloseTo(-9);
      expect(targetBases[3].getCenterPoint().y).not.toBeCloseTo(55);
      expect(targetBases[4].getCenterPoint().x).not.toBeCloseTo(901);
    });

    test('an input angle far above pi', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 8, y: 87 } }),
        new NucleobaseMock({ centerPoint: { x: -11, y: 17 } }),
        new NucleobaseMock({ centerPoint: { x: 3, y: 22 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(-1.6475682180646747);

      direction.set(1000);

      expect(direction.get()).toBeCloseTo(0.9735361584480913);
    });

    test('an input angle far below pi', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 50, y: 37 } }),
        new NucleobaseMock({ centerPoint: { x: 2, y: 8 } }),
        new NucleobaseMock({ centerPoint: { x: -11, y: 123 } }),
      ];

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(2.187738217342432);

      direction.set(-560);

      expect(direction.get()).toBeCloseTo(-0.7965076610176354);
    });

    it('maintains centroid', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: 124, y: 4134 } }),
        new NucleobaseMock({ centerPoint: { x: 8, y: 0 } }),
        new NucleobaseMock({ centerPoint: { x: 99, y: -2 } }),
        new NucleobaseMock({ centerPoint: { x: 551, y: 7 } }),
      ];

      let centroid = new Centroid(targetBases);

      expect(centroid.get().x).toBeCloseTo(195.5);
      expect(centroid.get().y).toBeCloseTo(1034.75);

      let direction = new Direction(targetBases);

      expect(direction.get()).toBeCloseTo(-1.4676981844274177);

      direction.set(0.62);
      expect(direction.get()).toBeCloseTo(0.62);

      // centroid was maintained
      expect(centroid.get().x).toBeCloseTo(195.5);
      expect(centroid.get().y).toBeCloseTo(1034.75);

      // bases were moved
      expect(targetBases[0].getCenterPoint().x).not.toBeCloseTo(124);
      expect(targetBases[1].getCenterPoint().y).not.toBeCloseTo(0);
      expect(targetBases[2].getCenterPoint().x).not.toBeCloseTo(99);
      expect(targetBases[3].getCenterPoint().y).not.toBeCloseTo(7);
    });
  });
});
