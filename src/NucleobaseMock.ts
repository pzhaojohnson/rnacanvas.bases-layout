import type { Nucleobase } from './Nucleobase';

import type { Point } from './Nucleobase';

/**
 * Primarily meant to help facilitate testing of this package.
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
