import type { Nucleobase } from './Nucleobase';

import { max } from '@rnacanvas/math';

import { shift } from './shift';

/**
 * The maximum X coordinate of the center points of the target bases.
 */
export class MaxCenterX {
  constructor(private targetBases: Nucleobase[]) {}

  /**
   * It is not firmly defined what this returns for an empty array of target bases.
   */
  get(): number {
    return max(this.targetBases.map(b => b.getCenterPoint().x));
  }

  /**
   * Shifts the target bases horizontally such that the maximum X coordinate of their center points
   * becomes the given value.
   */
  set(x: number): void {
    let current = this.get();

    shift(this.targetBases, {
      x: x - current,
      y: 0,
    });
  }
}
