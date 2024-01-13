import { NucleobaseMock } from './NucleobaseMock';

describe('NucleobaseMock class', () => {
  test('creating a nucleobase mock and getting and setting its center point', () => {
    let b = new NucleobaseMock({ centerPoint: { x: 5, y: 16 } });
    expect(b.getCenterPoint()).toStrictEqual({ x: 5, y: 16 });

    b.setCenterPoint({ x: -81, y: 216.5 });
    expect(b.getCenterPoint()).toStrictEqual({ x: -81, y: 216.5 });

    b.setCenterPoint({ x: 0.005, y: 38198 });
    expect(b.getCenterPoint()).toStrictEqual({ x: 0.005, y: 38198 });
  });
});
