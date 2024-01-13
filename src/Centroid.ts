import type { Nucleobase } from './Nucleobase';

import { centroid } from '@rnacanvas/points';

import { displacement } from '@rnacanvas/points';

import { shift } from './shift';

export type Point = {
  x: number;
  y: number;
};

/**
 * The central point of the target bases
 * (i.e., the average of the center points of all the target bases).
 */
export class Centroid {
  constructor(private targetBases: Nucleobase[]) {}

  /**
   * Returns a point with X and Y coordinates of NaN for an empty array of target bases.
   */
  get(): Point {
    let centerPoints = this.targetBases.map(b => b.getCenterPoint());

    return centroid(centerPoints);
  }

  set(point: Point): void {
    let current = this.get();

    let vector = displacement(current, point);

    shift(this.targetBases, vector);
  }
}
