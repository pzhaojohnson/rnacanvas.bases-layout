import { MaxCenterY } from './MaxCenterY';

import { NucleobaseMock } from './NucleobaseMock';

describe('MaxCenterY class', () => {
  describe('get method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let maxCenterY = new MaxCenterY(targetBases);

      expect(typeof maxCenterY.get()).toBe('number');
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -63.05248013857312, y: -147.81202845791486 } }),
      ];

      let maxCenterY = new MaxCenterY(targetBases);

      expect(maxCenterY.get()).toBe(-147.81202845791486);
    });

    test('seven target bases', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -236.84485183414316, y: -8.810117224274506 } }),
        new NucleobaseMock({ centerPoint: { x: -231.6765513669805, y: 185.36363099275098 } }),
        new NucleobaseMock({ centerPoint: { x: -83.7176137967246, y: -15.566649902281853 } }),
        new NucleobaseMock({ centerPoint: { x: -219.9778476548738, y: 176.69365862011443 } }),
        new NucleobaseMock({ centerPoint: { x: -108.3088746206027, y: 28.189606166723934 } }),
        new NucleobaseMock({ centerPoint: { x: 113.94604963619292, y: 205.72572141557288 } }),
        new NucleobaseMock({ centerPoint: { x: 136.84407367284666, y: -78.99788190020041 } }),
      ];

      let maxCenterY = new MaxCenterY(targetBases);

      expect(maxCenterY.get()).toBe(205.72572141557288);
    });
  });

  describe('set method', () => {
    test('zero target bases', () => {
      let targetBases = [];

      let maxCenterY = new MaxCenterY(targetBases);

      expect(() => maxCenterY.set(-10)).not.toThrow();
    });

    test('one target base', () => {
      let targetBases = [
        new NucleobaseMock({ centerPoint: { x: -152.16762342471247, y: 185.95721217725804 } }),
      ];

      let maxCenterY = new MaxCenterY(targetBases);

      maxCenterY.set(-82.09);

      expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-82.09);

      // was not changed
      expect(targetBases[0].getCenterPoint().x).toBeCloseTo(-152.16762342471247);
    });

    test('eight target bases', () => {
      let startingCenterPoints = [
        { x: -86.33635002295713, y: 235.21366854633686 },
        { x: -159.7940610868377, y: -191.08249051299453 },
        { x: 54.708878516762184, y: -59.54480830796095 },
        { x: 74.81505624291509, y: 30.61147229284046 },
        { x: -53.937178687041836, y: -239.83437219243996 },
        { x: 247.8663697241459, y: -221.8485498546171 },
        { x: 28.855472402790383, y: -81.36625053105894 },
        { x: -191.69421370759034, y: -88.33848841458612 },
      ];

      let targetBases = startingCenterPoints.map(centerPoint => new NucleobaseMock({ centerPoint }));

      let maxCenterY = new MaxCenterY(targetBases);

      maxCenterY.set(1172);

      // Y coordinates were shifted
      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().y).toBeCloseTo(startingCenterPoints[i].y + (1172 - 235.21366854633686));
      });

      // X coordinates were not changed
      targetBases.forEach((b, i) => {
        expect(b.getCenterPoint().x).toBeCloseTo(startingCenterPoints[i].x);
      });
    });
  });
});
