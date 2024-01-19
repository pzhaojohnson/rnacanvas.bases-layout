import { circularize } from './circularize';

import { NucleobaseMock } from './NucleobaseMock';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

describe('circularize function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => circularize(targetBases, { spacing: 1, terminiGap: 2 }))
      .not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 91, y: -37 } }),
    ];

    circularize(targetBases, { spacing: 12, terminiGap: 2 });

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(91);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-37);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 31, y: 25 } }),
      new NucleobaseMock({ centerPoint: { x: 6, y: 9 } }),
    ];

    circularize(targetBases, { spacing: 4, terminiGap: 3 });

    let circularizedCenterPoints = [
      { x: 19.41483491349421, y: 17.58549434463629 },
      { x: 17.585165086505793, y: 16.414505655363705 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(circularizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(circularizedCenterPoints[i].y);
    });
  });

  test('eight target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 7, y: 6 } }),
      new NucleobaseMock({ centerPoint: { x: 4, y: -21 } }),
      new NucleobaseMock({ centerPoint: { x: -12, y: 3 } }),
      new NucleobaseMock({ centerPoint: { x: 0, y: 15 } }),
      new NucleobaseMock({ centerPoint: { x: 88, y: 64 } }),
      new NucleobaseMock({ centerPoint: { x: 53, y: 5 } }),
      new NucleobaseMock({ centerPoint: { x: 22, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 11, y: -17 } }),
    ];

    circularize(targetBases, { spacing: 3, terminiGap: 10 });

    let circularizedCenterPoints = [
      { x: 24.800861073652253, y: 11.677215897012275 },
      { x: 21.856587977112092, y: 11.916709324450666 },
      { x: 19.303221275722123, y: 10.431307137489412 },
      { x: 18.056074291268477, y: 7.753486088956751 },
      { x: 18.56221569135554, y: 4.843173038456122 },
      { x: 20.640207390355044, y: 2.743636978350096 },
      { x: 23.545145225609954, y: 2.2075051455879477 },
      { x: 26.23568707492452, y: 3.426966389696724 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(circularizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(circularizedCenterPoints[i].y);
    });
  });

  it('maintains centroid', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 47 } }),
      new NucleobaseMock({ centerPoint: { x: 57, y: 13 } }),
      new NucleobaseMock({ centerPoint: { x: 31, y: 1 } }),
      new NucleobaseMock({ centerPoint: { x: -40, y: 22 } }),
    ];

    let centroid = new Centroid(targetBases);

    circularize(targetBases, { spacing: 5, terminiGap: 2 });

    // was maintained
    expect(centroid.get().x).toBeCloseTo(15);
    expect(centroid.get().y).toBeCloseTo(20.75);
  });

  it('maintains overall direction of the target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 72, y: 8 } }),
      new NucleobaseMock({ centerPoint: { x: 1, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 55, y: -20 } }),
      new NucleobaseMock({ centerPoint: { x: -12, y: 18 } }),
    ];

    let direction = new Direction(targetBases);

    circularize(targetBases, { spacing: 6, terminiGap: 3 });

    // was maintained
    expect(direction.get()).toBeCloseTo(3.0231026944316555);
  });

  test('zero spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 87, y: 41 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: -54 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: -10 } }),
      new NucleobaseMock({ centerPoint: { x: -4, y: 5 } }),
      new NucleobaseMock({ centerPoint: { x: -100, y: 2 } }),
    ];

    circularize(targetBases, { spacing: 0, terminiGap: 50 });

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(-0.4);
      expect(b.getCenterPoint().y).toBeCloseTo(-3.2);
    });
  });

  test('negative spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 8, y: 19 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 91 } }),
      new NucleobaseMock({ centerPoint: { x: -29, y: 12 } }),
      new NucleobaseMock({ centerPoint: { x: -71, y: 1 } }),
      new NucleobaseMock({ centerPoint: { x: 48, y: 0 } }),
    ];

    circularize(targetBases, { spacing: -10, terminiGap: 2 });

    let circularizedCenterPoints = [
      { x: -11.268129067286122, y: 20.881921668128 },
      { x: -2.579486934036148, y: 22.806082057507272 },
      { x: -5.214577720556314, y: 31.306152167249863 },
      { x: -13.468011708984275, y: 27.978131325607634 },
      { x: -9.469794569137143, y: 20.027712781507237 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(circularizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(circularizedCenterPoints[i].y);
    });
  });

  test('zero termini gap', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 10, y: -68 } }),
      new NucleobaseMock({ centerPoint: { x: 5, y: 3 } }),
      new NucleobaseMock({ centerPoint: { x: 40, y: 200 } }),
      new NucleobaseMock({ centerPoint: { x: -12, y: 6 } }),
      new NucleobaseMock({ centerPoint: { x: -56, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 33, y: 12 } }),
    ];

    circularize(targetBases, { spacing: 3, terminiGap: 0 });

    let circularizedCenterPoints = [
      { x: 1.4213467036542327, y: 26.04969615603274 },
      { x: 2.3793764919501244, y: 23.41181050167087 },
      { x: 5.18420231847335, y: 23.507799478218846 },
      { x: 5.9596502234923285, y: 26.205009582632684 },
      { x: 3.634077558775732, y: 27.775988125412113 },
      { x: 1.4213467036542333, y: 26.049696156032745 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(circularizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(circularizedCenterPoints[i].y);
    });
  });

  test('negative termini gap', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 10, y: 39 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: -11 } }),
      new NucleobaseMock({ centerPoint: { x: -5, y: 11 } }),
      new NucleobaseMock({ centerPoint: { x: 99, y: -20 } }),
      new NucleobaseMock({ centerPoint: { x: 50, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: 47, y: 0 } }),
    ];

    circularize(targetBases, { spacing: 1, terminiGap: -18 });

    let circularizedCenterPoints = [
      { x: 31.996394525981135, y: 4.423918928059528 },
      { x: 32.97482722900131, y: 4.576738168416848 },
      { x: 33.91220500371486, y: 4.257352536248087 },
      { x: 34.5937858985617, y: 3.538929430868988 },
      { x: 34.863427944472626, y: 2.5860509277849224 },
      { x: 34.65935939826838, y: 1.617010008621626 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(circularizedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(circularizedCenterPoints[i].y);
    });
  });

  test('a circumference of zero', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: -12 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: 9 } }),
    ];

    circularize(targetBases, { spacing: 0, terminiGap: 0 });

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(6.666666666666667);
      expect(b.getCenterPoint().y).toBeCloseTo(-0.3333333333333333);
    });
  });

  test('a positive circumference close to zero', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: -12 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: 9 } }),
    ];

    circularize(targetBases, { spacing: 0, terminiGap: 1e-12 });

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(6.666666666666667);
      expect(b.getCenterPoint().y).toBeCloseTo(-0.3333333333333333);
    });
  });

  test('a negative circumference close to zero', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: -12 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: 9 } }),
    ];

    circularize(targetBases, { spacing: 0, terminiGap: -1e-12 });

    targetBases.forEach(b => {
      expect(b.getCenterPoint().x).toBeCloseTo(6.666666666666667);
      expect(b.getCenterPoint().y).toBeCloseTo(-0.3333333333333333);
    });
  });
});
