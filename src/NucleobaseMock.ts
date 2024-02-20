import type { Nucleobase } from './Nucleobase';

import type { Point } from './Nucleobase';

/**
 * Primarily meant to help facilitate testing of this package.
 *
 * Can also be used as an intermediary to help speed up layout operations on a set of bases
 * (i.e., by creating a one-to-one set of mock bases,
 * performing layout operations on the mock bases,
 * and then applying the resulting layout of the mock bases to the original bases in a single step).
 */
export class NucleobaseMock implements Nucleobase {
  constructor(private props: { centerPoint: Point }) {}

  getCenterPoint(): Point {
    return this.props.centerPoint;
  }

  setCenterPoint(centerPoint: Point) {
    this.props.centerPoint = centerPoint;
  }
}
