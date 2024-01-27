import type { Nucleobase } from './Nucleobase';

import { min } from '@rnacanvas/math';

import { shift } from './shift';

/**
 * The minimum Y coordinate of the center points of the target bases.
 */
export class MinCenterY {
  constructor(private targetBases: Nucleobase[]) {}

  /**
   * It is not firmly defined what this returns for an empty array of target bases.
   */
  get(): number {
    return min(this.targetBases.map(b => b.getCenterPoint().y));
  }

  /**
   * Shifts the target bases vertically such that the minimum Y coordinate of their center points
   * becomes the given value.
   */
  set(y: number): void {
    let current = this.get();

    shift(this.targetBases, {
      x: 0,
      y: y - current,
    });
  }
}
