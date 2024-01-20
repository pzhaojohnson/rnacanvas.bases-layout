import { linearize } from './linearize';

import { NucleobaseMock } from './NucleobaseMock';

import { distance } from '@rnacanvas/points';

import { Direction } from './Direction';

import { Centroid } from './Centroid';

describe('linearize function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => linearize(targetBases, { spacing: 1 }))
      .not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 57, y: 88 } }),
    ];

    linearize(targetBases, { spacing: 6 });

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(57);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(88);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: -2, y: 29 } }),
      new NucleobaseMock({ centerPoint: { x: 31, y: 72 } }),
    ];

    linearize(targetBases, { spacing: 9 });

    let linearizedCenterPoints = [
      { x: 11.760315466874273, y: 46.93010803259375 },
      { x: 17.239684533125725, y: 54.06989196740625 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(linearizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(linearizedCenterPoints[i].y);
    });

    expect(distance(targetBases[0].getCenterPoint(), targetBases[1].getCenterPoint())).toBeCloseTo(9);
  });

  test('eight target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 9, y: 7 } }),
      new NucleobaseMock({ centerPoint: { x: 81, y: 46 } }),
      new NucleobaseMock({ centerPoint: { x: -12, y: 34 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 101 } }),
      new NucleobaseMock({ centerPoint: { x: 0, y: 91 } }),
      new NucleobaseMock({ centerPoint: { x: -2.5, y: -82 } }),
      new NucleobaseMock({ centerPoint: { x: 37, y: -1 } }),
      new NucleobaseMock({ centerPoint: { x: 28, y: 1 } }),
    ];

    linearize(targetBases, { spacing: 6 });

    let linearizedCenterPoints = [
      { x: -2.212735967816972, y: 30.948758726679046 },
      { x: 3.508760022987877, y: 29.141970519056464 },
      { x: 9.230256013792726, y: 27.335182311433876 },
      { x: 14.951752004597576, y: 25.528394103811294 },
      { x: 20.673247995402424, y: 23.72160589618871 },
      { x: 26.394743986207274, y: 21.914817688566124 },
      { x: 32.11623997701212, y: 20.10802948094354 },
      { x: 37.83773596781697, y: 18.301241273320954 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(linearizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(linearizedCenterPoints[i].y);
    });

    for (let i = 0; i < targetBases.length - 1; i++) {
      expect(distance(targetBases[i].getCenterPoint(), targetBases[i + 1].getCenterPoint())).toBeCloseTo(6);
    }
  });

  it('maintains overall direction', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 54, y: 16 } }),
      new NucleobaseMock({ centerPoint: { x: 10, y: 55 } }),
      new NucleobaseMock({ centerPoint: { x: 20, y: 5 } }),
      new NucleobaseMock({ centerPoint: { x: -39, y: 3 } }),
    ];

    let direction = new Direction(targetBases);

    linearize(targetBases, { spacing: 5.5 });

    expect(direction.get()).toBeCloseTo(-3.0027076380695803);
  });

  it('maintains centroid', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 7, y: 34 } }),
      new NucleobaseMock({ centerPoint: { x: 88, y: -20 } }),
      new NucleobaseMock({ centerPoint: { x: 61, y: -9 } }),
      new NucleobaseMock({ centerPoint: { x: 18, y: 2 } }),
    ];

    let centroid = new Centroid(targetBases);

    linearize(targetBases, { spacing: 2 });

    expect(centroid.get().x).toBeCloseTo(43.5);
    expect(centroid.get().y).toBeCloseTo(1.75);
  });

  test('zero spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 24 } }),
      new NucleobaseMock({ centerPoint: { x: 11, y: -1 } }),
      new NucleobaseMock({ centerPoint: { x: 24, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: -9 } }),
      new NucleobaseMock({ centerPoint: { x: -3, y: -5 } }),
    ];

    linearize(targetBases, { spacing: 0 });

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(9.2);
      expect(b.getCenterPoint().y).toBeCloseTo(2.2);
    });
  });

  test('negative spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 8, y: 7 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: -10 } }),
      new NucleobaseMock({ centerPoint: { x: -30, y: 21 } }),
      new NucleobaseMock({ centerPoint: { x: -17, y: 52 } }),
      new NucleobaseMock({ centerPoint: { x: 1, y: 55 } }),
    ];

    linearize(targetBases, { spacing: -4 });

    let linearizedCenterPoints = [
      { x: -6.04554485542617, y: 17.08373615149375 },
      { x: -6.622772427713085, y: 21.041868075746873 },
      { x: -7.2, y: 25 },
      { x: -7.7772275722869155, y: 28.958131924253127 },
      { x: -8.35445514457383, y: 32.916263848506254 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(linearizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(linearizedCenterPoints[i].y);
    });

    for (let i = 0; i < targetBases.length - 1; i++) {
      expect(distance(targetBases[i].getCenterPoint(), targetBases[i + 1].getCenterPoint())).toBeCloseTo(4);
    }
  });
});
