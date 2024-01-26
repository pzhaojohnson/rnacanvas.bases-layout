import { round } from './round';

import { NucleobaseMock } from './NucleobaseMock';

import { distance } from '@rnacanvas/points';

describe('round function', () => {
  test('zero target bases', () => {
    let targetBases = [];

    expect(() => round(targetBases, { spacing: 2 })).not.toThrow();
  });

  test('one target base', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 106, y: -82 } }),
    ];

    round(targetBases, { spacing: 5 });

    // was not moved
    expect(targetBases[0].getCenterPoint().x).toBeCloseTo(106);
    expect(targetBases[0].getCenterPoint().y).toBeCloseTo(-82);
  });

  test('two target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 500, y: 308 } }),
      new NucleobaseMock({ centerPoint: { x: 28, y: -41 } }),
    ];

    round(targetBases, { spacing: 20 });

    // should not have been moved
    let roundedCenterPoints = [
      { x: 500, y: 308 },
      { x: 28, y: -41 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('three target bases', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: -149.1433580942434, y: -42.19735743877874 } }),
      new NucleobaseMock({ centerPoint: { x: 86.60012240633063, y: -199.61673767060705 } }),
      new NucleobaseMock({ centerPoint: { x: 97.15205527094128, y: 213.11159558046154 } }),
    ];

    round(targetBases, { spacing: 300 });

    let roundedCenterPoints = [
      { x: -149.14335809424344, y: -42.19735743877874 },
      { x: 116.57465028734416, y: -52.079817943298096 },
      { x: 97.1520552709413, y: 213.11159558046148 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('spacing of zero', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 29, y: 532 } }),
      new NucleobaseMock({ centerPoint: { x: 81, y: 27 } }),
      new NucleobaseMock({ centerPoint: { x: -8329, y: -931 } }),
      new NucleobaseMock({ centerPoint: { x: 422, y: 39 } }),
      new NucleobaseMock({ centerPoint: { x: 21, y: 492 } }),
    ];

    round(targetBases, { spacing: 0 });

    // just straightens
    let roundedCenterPoints = [
      { x: 29, y: 532 },
      { x: 27, y: 522 },
      { x: 25, y: 512 },
      { x: 23, y: 502 },
      { x: 21, y: 492 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('negative spacing', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 29, y: 532 } }),
      new NucleobaseMock({ centerPoint: { x: 81, y: 27 } }),
      new NucleobaseMock({ centerPoint: { x: -8329, y: -931 } }),
      new NucleobaseMock({ centerPoint: { x: 422, y: 39 } }),
      new NucleobaseMock({ centerPoint: { x: 21, y: 492 } }),
    ];

    round(targetBases, { spacing: -10 });

    // just straightens
    let roundedCenterPoints = [
      { x: 29, y: 532 },
      { x: 27, y: 522 },
      { x: 25, y: 512 },
      { x: 23, y: 502 },
      { x: 21, y: 492 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('an arc length smaller than the chord length', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 48, y: 35 } }),
      new NucleobaseMock({ centerPoint: { x: -8329, y: 3901 } }),
      new NucleobaseMock({ centerPoint: { x: 42, y: 78 } }),
      new NucleobaseMock({ centerPoint: { x: 892, y: 4 } }),
      new NucleobaseMock({ centerPoint: { x: 4267, y: 4627 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: -842 } }),
    ];

    let firstBase = targetBases[0];
    let lastBase = targetBases[targetBases.length - 1];

    let chordLength = 878.1537450811219;
    expect(distance(firstBase.getCenterPoint(), lastBase.getCenterPoint())).toBeCloseTo(chordLength);

    let spacing = 20;
    let arcLength = spacing * (targetBases.length - 1);
    expect(arcLength).toBeLessThan(chordLength);

    round(targetBases, { spacing });

    // just straightens
    let roundedCenterPoints = [
      { x: 48, y: 35 },
      { x: 38.99999999999998, y: -140.39999999999998 },
      { x: 29.999999999999957, y: -315.79999999999995 },
      { x: 20.999999999999936, y: -491.19999999999993 },
      { x: 11.999999999999913, y: -666.5999999999999 },
      { x: 2.99999999999989, y: -841.9999999999999 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('an arc length just slightly larger than the chord length', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 48, y: 35 } }),
      new NucleobaseMock({ centerPoint: { x: -8329, y: 3901 } }),
      new NucleobaseMock({ centerPoint: { x: 42, y: 78 } }),
      new NucleobaseMock({ centerPoint: { x: 892, y: 4 } }),
      new NucleobaseMock({ centerPoint: { x: 4267, y: 4627 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: -842 } }),
    ];

    let firstBase = targetBases[0];
    let lastBase = targetBases[targetBases.length - 1];

    let chordLength = 878.1537450811219;
    expect(distance(firstBase.getCenterPoint(), lastBase.getCenterPoint())).toBeCloseTo(chordLength);

    let arcLength = chordLength + 1e-6;
    let spacing = arcLength / (targetBases.length - 1);
    expect(spacing * (targetBases.length - 1)).toBeGreaterThan(chordLength);

    round(targetBases, { spacing });

    // just straightens
    let roundedCenterPoints = [
      { x: 48, y: 35 },
      { x: 38.99999999999998, y: -140.39999999999998 },
      { x: 29.999999999999957, y: -315.79999999999995 },
      { x: 20.999999999999936, y: -491.19999999999993 },
      { x: 11.999999999999913, y: -666.5999999999999 },
      { x: 2.99999999999989, y: -841.9999999999999 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('zero chord length', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 78, y: 542 } }),
      new NucleobaseMock({ centerPoint: { x: 387, y: -4829 } }),
      new NucleobaseMock({ centerPoint: { x: -6372, y: 4268 } }),
      new NucleobaseMock({ centerPoint: { x: 842, y: 718 } }),
      new NucleobaseMock({ centerPoint: { x: 356, y: -48 } }),
      new NucleobaseMock({ centerPoint: { x: 83, y: -381 } }),
      new NucleobaseMock({ centerPoint: { x: -319, y: 4829 } }),
      new NucleobaseMock({ centerPoint: { x: 78, y: 542 } }),
    ];

    let firstBase = targetBases[0];
    let lastBase = targetBases[targetBases.length - 1];

    expect(distance(firstBase.getCenterPoint(), lastBase.getCenterPoint())).toBe(0);

    round(targetBases, { spacing: 10 });

    // just circularizes
    let roundedCenterPoints = [
      { x: 78, y: 542 },
      { x: 69.28973584302435, y: 537.8053578588915 },
      { x: 67.13847825326002, y: 528.3800825229272 },
      { x: 73.16616807345724, y: 520.8215985606668 },
      { x: 82.83383192654276, y: 520.8215985606668 },
      { x: 88.86152174673987, y: 528.3800825229272 },
      { x: 86.71026415697554, y: 537.8053578588915 },
      { x: 78, y: 542 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('a very small chord length', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 78, y: 542 } }),
      new NucleobaseMock({ centerPoint: { x: 387, y: -4829 } }),
      new NucleobaseMock({ centerPoint: { x: -6372, y: 4268 } }),
      new NucleobaseMock({ centerPoint: { x: 842, y: 718 } }),
      new NucleobaseMock({ centerPoint: { x: 356, y: -48 } }),
      new NucleobaseMock({ centerPoint: { x: 83, y: -381 } }),
      new NucleobaseMock({ centerPoint: { x: -319, y: 4829 } }),
      new NucleobaseMock({ centerPoint: { x: 78 + 1e-6, y: 542 + 1e-6 } }),
    ];

    let firstBase = targetBases[0];
    let lastBase = targetBases[targetBases.length - 1];

    let chordLength = distance(firstBase.getCenterPoint(), lastBase.getCenterPoint());
    expect(chordLength).toBeGreaterThan(0);
    expect(chordLength).toBeLessThan(1e-5);

    round(targetBases, { spacing: 10 });

    // just circularizes
    let roundedCenterPoints = [
      { x: 78, y: 542 },
      { x: 74.80697354873075, y: 532.8748530579076 },
      { x: 79.95048113232997, y: 524.6890083018217 },
      { x: 89.55735677776192, y: 523.606573561761 },
      { x: 96.39342745187696, y: 530.4426442439429 },
      { x: 95.31099270047991, y: 540.0495198880975 },
      { x: 87.12514793832452, y: 545.1930274620372 },
      { x: 78.000001, y: 542.000001 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('an arc and chord that form a minor circular segment', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 478, y: 4728 } }),
      new NucleobaseMock({ centerPoint: { x: -371, y: -5 } }),
      new NucleobaseMock({ centerPoint: { x: 78, y: 39 } }),
      new NucleobaseMock({ centerPoint: { x: 2, y: 82 } }),
      new NucleobaseMock({ centerPoint: { x: -4728, y: 4829 } }),
      new NucleobaseMock({ centerPoint: { x: 947, y: 578 } }),
      new NucleobaseMock({ centerPoint: { x: 3617, y: -7428 } }),
      new NucleobaseMock({ centerPoint: { x: -85, y: -819 } }),
      new NucleobaseMock({ centerPoint: { x: 3, y: 758 } }),
    ];

    round(targetBases, { spacing: 550 });

    let roundedCenterPoints = [
      { x: 478.0000000000007, y: 4728 },
      { x: 93.38200493553268, y: 4335.976567933606 },
      { x: -211.3510102073892, y: 3879.083623253533 },
      { x: -425.49985093629175, y: 3373.362704731279 },
      { x: -541.545738571348, y: 2836.569704237125 },
      { x: -555.4142950171049, y: 2287.5514563084826 },
      { x: -466.61859442250807, y: 1745.5840246555833 },
      { x: -278.2762591768201, y: 1229.6959184050843 },
      { x: 3.0000000000022737, y: 757.9999999999975 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('an arc and chord that form a major circular segment', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 28.736251321897953, y: 241.90423001385983 } }),
      new NucleobaseMock({ centerPoint: { x: 5.472717720468864, y: 67.90005318587322 } }),
      new NucleobaseMock({ centerPoint: { x: 130.26165281114885, y: -32.6165521412407 } }),
      new NucleobaseMock({ centerPoint: { x: -149.15218242163064, y: 181.46505952462041 } }),
      new NucleobaseMock({ centerPoint: { x: -200.3607772925653, y: -99.71311468624145 } }),
      new NucleobaseMock({ centerPoint: { x: 113.9862499589056, y: 83.23695421900021 } }),
      new NucleobaseMock({ centerPoint: { x: 241.50263783336703, y: -13.67377262080683 } }),
      new NucleobaseMock({ centerPoint: { x: 179.111739836296, y: -135.53055519820046 } }),
      new NucleobaseMock({ centerPoint: { x: 98.07117728010337, y: -92.48209929891848 } }),
      new NucleobaseMock({ centerPoint: { x: 30.37812866161204, y: 181.72478725404363 } }),
    ];

    round(targetBases, { spacing: 100 });

    let roundedCenterPoints = [
      { x: 28.736251321897953, y: 241.90423001385983 },
      { x: -22.815207935265207, y: 325.5162117714948 },
      { x: -114.59923787268586, y: 360.5048998496252 },
      { x: -208.7276112163786, y: 332.42704778340703 },
      { x: -266.34436136073714, y: 252.87312551816234 },
      { x: -263.66543212794625, y: 154.6828012333952 },
      { x: -201.79667907579855, y: 78.38880513439395 },
      { x: -106.27737497752139, y: 55.48511570314949 },
      { x: -16.537659315941667, y: 95.42632096739852 },
      { x: 30.378128661612067, y: 181.72478725404392 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });

  test('an arc and chord that form a semicircle', () => {
    let targetBases = [
      new NucleobaseMock({ centerPoint: { x: 146.24673221043793, y: 86.93453639848173 } }),
      new NucleobaseMock({ centerPoint: { x: -230.7470180733119, y: 68.13317717308286 } }),
      new NucleobaseMock({ centerPoint: { x: 204.92728143808802, y: -155.76180950872765 } }),
      new NucleobaseMock({ centerPoint: { x: 31.206926136237882, y: -120.94217589206701 } }),
      new NucleobaseMock({ centerPoint: { x: 45.973858417720976, y: -40.14469708595371 } }),
      new NucleobaseMock({ centerPoint: { x: -28.273430305835177, y: 166.07784106978085 } }),
      new NucleobaseMock({ centerPoint: { x: -64.87178935703142, y: 240.88570116522402 } }),
      new NucleobaseMock({ centerPoint: { x: -169.62489189336705, y: 175.00615397302556 } }),
    ];

    let firstBase = targetBases[0];
    let lastBase = targetBases[targetBases.length - 1];

    let chord = [firstBase.getCenterPoint(), lastBase.getCenterPoint()];
    let chordLength = distance(...chord);
    expect(chordLength).toBeCloseTo(327.91994867066586);

    let spacing = 73.58506440780756;
    let semicircularArcLength = 327.91994867066586 * Math.PI / 2;
    expect(spacing * (targetBases.length - 1)).toBeCloseTo(semicircularArcLength);

    round(targetBases, { spacing });

    let roundedCenterPoints = [
      { x: 146.24673221043793, y: 86.93453639848173 },
      { x: 149.7125913158746, y: 159.8212330691652 },
      { x: 121.21086998700578, y: 226.99365756161941 },
      { x: 66.38668368368674, y: 275.14748738939034 },
      { x: -3.901365122189799, y: 294.74526598712123 },
      { x: -75.73186633827189, y: 281.9054129525499 },
      { x: -134.87790825542896, y: 239.1710186496368 },
      { x: -169.62489189336702, y: 175.00615397302562 },
    ];

    targetBases.forEach((b, i) => {
      expect(b.getCenterPoint().x).toBeCloseTo(roundedCenterPoints[i].x);
      expect(b.getCenterPoint().y).toBeCloseTo(roundedCenterPoints[i].y);
    });
  });
});
