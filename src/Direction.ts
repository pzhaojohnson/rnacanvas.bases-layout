import type { Nucleobase } from './Nucleobase';

import { displacement } from '@rnacanvas/points';

import { direction } from '@rnacanvas/vectors';

import { rotate } from './rotate';

/**
 * The overall direction of a series of bases.
 *
 * Is the sum of the vectors connecting the bases sequentially
 * (i.e., is the vector from the first to the last base).
 */
export class Direction {
  constructor(private targetBases: Nucleobase[]) {}

  /**
   * Returns zero if there are less than two target bases.
   */
  get(): number {
    if (this.targetBases.length < 2) {
      return 0;
    }

    let first = this.targetBases[0];
    let last = this.targetBases[this.targetBases.length - 1];

    return direction(
      displacement(
        first.getCenterPoint(),
        last.getCenterPoint(),
      )
    );
  }

  /**
   * Rotates the target bases such that the given angle becomes their new direction.
   */
  set(a: number): void {
    let current = this.get();

    let diff = a - current;

    rotate(this.targetBases, diff);
  }
}
