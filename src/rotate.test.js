import { rotate } from './rotate';

import { NucleobaseMock } from './NucleobaseMock';

import { midpoint } from '@rnacanvas/points'

import { distance } from '@rnacanvas/points'

import { direction } from '@rnacanvas/points'

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

    // the anchor point for rotation
    let anchorPoint = midpoint(targetBases[0].getCenterPoint(), targetBases[4].getCenterPoint());

    let originalCenterPoints = targetBases.map(b => b.getCenterPoint());

    let originalDistances = targetBases.map(b => distance(anchorPoint, b.getCenterPoint()));

    let originalDirections = targetBases.map(b => direction(anchorPoint, b.getCenterPoint()));

    rotate(targetBases, 4 * Math.PI / 3);

    targetBases.forEach((b, i) => expect(b.getCenterPoint()).not.toEqual(originalCenterPoints[i]));

    targetBases.forEach((b, i) => {
      expect(distance(anchorPoint, b.getCenterPoint())).toBeCloseTo(originalDistances[i]);
    });

    targetBases.forEach((b, i) => {
      let d = direction(anchorPoint, b.getCenterPoint());
      expect((originalDirections[i] + (4 * Math.PI / 3) - d) % (2 * Math.PI)).toBeCloseTo(0);
    });
  });

  test('rotating by a negative angle', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 100 } }),
      new NucleobaseMock({ centerPoint: { x: -58, y: -2 } }),
      new NucleobaseMock({ centerPoint: { x: 64, y: 800 } }),
    ];

    // the anchor point for rotation
    let anchorPoint = midpoint(targetBases[0].getCenterPoint(), targetBases[2].getCenterPoint());

    let originalCenterPoints = targetBases.map(b => b.getCenterPoint());

    let originalDistances = targetBases.map(b => distance(anchorPoint, b.getCenterPoint()));

    let originalDirections = targetBases.map(b => direction(anchorPoint, b.getCenterPoint()));

    rotate(targetBases, -Math.PI / 4);

    targetBases.forEach((b, i) => expect(b.getCenterPoint()).not.toEqual(originalCenterPoints[i]));

    targetBases.forEach((b, i) => {
      expect(distance(anchorPoint, b.getCenterPoint())).toBeCloseTo(originalDistances[i]);
    });

    targetBases.forEach((b, i) => {
      let d = direction(anchorPoint, b.getCenterPoint());
      expect((originalDirections[i] + (-Math.PI / 4) - d) % (2 * Math.PI)).toBeCloseTo(0);
    });
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
