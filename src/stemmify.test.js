import { stemmify } from './stemmify';

import { NucleobaseMock } from './NucleobaseMock';

import { distance } from '@rnacanvas/points';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

describe('stemmify function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => stemmify(targetBases, { basePairLength: 1, basePairSpacing: 2 }))
      .not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 23, y: 84 } }),
    ];

    stemmify(targetBases, { basePairLength: 2, basePairSpacing: 1.5 });

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(23);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(84);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 12, y: 31 } }),
      new NucleobaseMock({ centerPoint: { x: -88, y: 2 } }),
    ];

    stemmify(targetBases, { basePairLength: 5, basePairSpacing: 3 });

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo((12 + (-88)) / 2);
    expect(centroid.get().y).toBeCloseTo((31 + 2) / 2);

    let direction = new Direction(targetBases);

    expect(direction.get()).toBeCloseTo(Math.atan2(2 - 31, (-88) - 12));

    expect(distance(targetBases[0].getCenterPoint(), targetBases[1].getCenterPoint())).toBeCloseTo(5);
  });

  test('an even number of target bases (greater than two)', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 8, y: -6 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: -9 } }),
      new NucleobaseMock({ centerPoint: { x: 26, y: -11 } }),
      new NucleobaseMock({ centerPoint: { x: 79, y: 39 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: 21 } }),
      new NucleobaseMock({ centerPoint: { x: -4, y: 5 } }),
      new NucleobaseMock({ centerPoint: { x: 1, y: -28 } }),
    ];

    expect(targetBases.length).toBe(8);

    stemmify(targetBases, { basePairLength: 6.5, basePairSpacing: 3.1 });

    expect(targetBases.map(b => b.getCenterPoint().x.toFixed(6))).toStrictEqual(
      ['19.791517', '16.837447', '13.883377', '10.929307', '8.958483', '11.912553', '14.866623', '17.820693']
    );

    expect(targetBases.map(b => b.getCenterPoint().y.toFixed(6))).toStrictEqual(
      ['3.062112', '4.002043', '4.941974', '5.881906', '-0.312112', '-1.252043', '-2.191974', '-3.131906']
    );
  });

  test('an odd number of target bases (greater than two)', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 1, y: 0 } }),
      new NucleobaseMock({ centerPoint: { x: 23, y: 30 } }),
      new NucleobaseMock({ centerPoint: { x: -6, y: 29 } }),
      new NucleobaseMock({ centerPoint: { x: 61, y: 59 } }),
      new NucleobaseMock({ centerPoint: { x: 45, y: 41 } }),
      new NucleobaseMock({ centerPoint: { x: 59, y: 28 } }),
      new NucleobaseMock({ centerPoint: { x: 92, y: -31 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: -18 } }),
      new NucleobaseMock({ centerPoint: { x: -4, y: 22 } }),
    ];

    expect(targetBases.length).toBe(9);

    stemmify(targetBases, { basePairLength: 4, basePairSpacing: 1.5 });

    expect(targetBases.map(b => b.getCenterPoint().x.toFixed(6))).toStrictEqual([
      '26.793639',
      '28.256338',
      '29.719037',
      '31.181737',
      '32.644436',
      '30.295252',
      '28.832553',
      '27.369854',
      '25.907154',
    ]);

    expect(targetBases.map(b => b.getCenterPoint().y.toFixed(6))).toStrictEqual([
      '15.453219',
      '15.785650',
      '16.118082',
      '16.450514',
      '16.782945',
      '20.351045',
      '20.018613',
      '19.686182',
      '19.353750',
    ]);
  });

  it('maintains centroid', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 3 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: -12 } }),
      new NucleobaseMock({ centerPoint: { x: 28, y: 29 } }),
      new NucleobaseMock({ centerPoint: { x: 4, y: 88 } }),
      new NucleobaseMock({ centerPoint: { x: -1, y: 22 } }),
    ];

    stemmify(targetBases, { basePairLength: 8, basePairSpacing: 2 });

    let centroid = new Centroid(targetBases);

    expect(centroid.get().x).toBeCloseTo((5 + 2 + 28 + 4 + (-1)) / 5);
    expect(centroid.get().y).toBeCloseTo((3 + (-12) + 29 + 88 + 22) / 5);
  });

  it('maintains overall direction of the target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 3 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: -12 } }),
      new NucleobaseMock({ centerPoint: { x: 28, y: 29 } }),
      new NucleobaseMock({ centerPoint: { x: 4, y: 88 } }),
      new NucleobaseMock({ centerPoint: { x: -1, y: 22 } }),
    ];

    stemmify(targetBases, { basePairLength: 4.5, basePairSpacing: 6 });

    let direction = new Direction(targetBases);

    expect(direction.get()).toBeCloseTo(Math.atan2(22 - 3, (-1) - 5));
  });

  test('zero base-pair length', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 4 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 23 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: -4 } }),
      new NucleobaseMock({ centerPoint: { x: -8, y: -11 } }),
      new NucleobaseMock({ centerPoint: { x: 9, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: 0 } }),
    ];

    stemmify(targetBases, { basePairLength: 0, basePairSpacing: 1 });

    expect(targetBases.map(b => b.getCenterPoint().x.toFixed(6))).toStrictEqual(
      ['1.924329', '1.666667', '1.409004', '1.409004', '1.666667', '1.924329']
    );

    expect(targetBases.map(b => b.getCenterPoint().y.toFixed(6))).toStrictEqual(
      ['1.367098', '2.333333', '3.299568', '3.299568', '2.333333', '1.367098']
    );
  });

  test('negative base-pair length', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 4 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 23 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: -4 } }),
      new NucleobaseMock({ centerPoint: { x: -8, y: -11 } }),
      new NucleobaseMock({ centerPoint: { x: 9, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: 0 } }),
    ];

    stemmify(targetBases, { basePairLength: -3.5, basePairSpacing: 1 });

    expect(targetBases.map(b => b.getCenterPoint().x.toFixed(6))).toStrictEqual(
      ['0.233418', '-0.024244', '-0.281907', '3.099915', '3.357578', '3.615240']
    );

    expect(targetBases.map(b => b.getCenterPoint().y.toFixed(6))).toStrictEqual(
      ['0.916189', '1.882424', '2.848659', '3.750478', '2.784243', '1.818008']
    );
  });

  test('zero base-pair spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 4 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 23 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: -4 } }),
      new NucleobaseMock({ centerPoint: { x: -8, y: -11 } }),
      new NucleobaseMock({ centerPoint: { x: 9, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: 0 } }),
    ];

    stemmify(targetBases, { basePairLength: 5, basePairSpacing: 0 });

    expect(targetBases.map(b => b.getCenterPoint().x.toFixed(6))).toStrictEqual(
      ['4.082254', '4.082254', '4.082254', '-0.748921', '-0.748921', '-0.748921']
    );

    expect(targetBases.map(b => b.getCenterPoint().y.toFixed(6))).toStrictEqual(
      ['2.977490', '2.977490', '2.977490', '1.689177', '1.689177', '1.689177']
    );
  });

  test('negative base-pair spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 5, y: 4 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 23 } }),
      new NucleobaseMock({ centerPoint: { x: 12, y: -4 } }),
      new NucleobaseMock({ centerPoint: { x: -8, y: -11 } }),
      new NucleobaseMock({ centerPoint: { x: 9, y: 2 } }),
      new NucleobaseMock({ centerPoint: { x: -10, y: 0 } }),
    ];

    stemmify(targetBases, { basePairLength: 4.5, basePairSpacing: -2 });

    expect(targetBases.map(b => b.getCenterPoint().x.toFixed(6))).toStrictEqual(
      ['4.356021', '3.840695', '3.325370', '-1.022687', '-0.507362', '0.007963']
    );

    expect(targetBases.map(b => b.getCenterPoint().y.toFixed(6))).toStrictEqual(
      ['0.980604', '2.913074', '4.845544', '3.686062', '1.753592', '-0.178878']
    );
  });
});
