import type { Nucleobase } from './Nucleobase';

import { Direction } from './Direction';

import { Centroid } from './Centroid';

export type Options = {
  /**
   * The distance between each base after linearization.
   *
   * Can be positive, zero or negative.
   */
  spacing: number;
};

/**
 * Arranges the target bases in a line with the specified spacing.
 *
 * Maintains the overall direction and centroid of the target bases.
 */
export function linearize(targetBases: Nucleobase[], options: Options): void {
  let { spacing } = options;

  if (targetBases.length < 2) {
    // nothing to do
    return;
  }

  let direction = new Direction(targetBases);

  let originalDirection = direction.get();

  let centroid = new Centroid(targetBases);

  let { x, y } = centroid.get();

  // cache actual numbers just in case the gotten object has live properties
  let originalCentroid = { x, y };

  // first arrange in a horizontal line
  targetBases.forEach((b, i) => {
    b.setCenterPoint({
      x: i * spacing,
      y: 0,
    });
  });

  direction.set(originalDirection);

  centroid.set(originalCentroid);
}
