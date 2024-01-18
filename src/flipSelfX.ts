import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

import { rotate } from './rotate';

import { flipX } from './flipX';

/**
 * Flips the target bases across a line passing through the centroid of the target bases
 * and having a direction equal to the overall direction of the target bases.
 */
export function flipSelfX(targetBases: Nucleobase[]): void {
  let centroid = new Centroid(targetBases);

  let { x, y } = centroid.get();

  // cache the actual numbers just in case the gotten centroid object has live properties
  let originalCentroidX = x;
  let originalCentroidY = y;

  // note that directly setting the direction of the target bases after flipping them can be tricky to think about
  let direction = new Direction(targetBases);

  let originalDirection = direction.get();

  // make the overall direction of the bases zero
  rotate(targetBases, -originalDirection);

  flipX(targetBases);

  // undo the rotation of the target bases
  rotate(targetBases, originalDirection);

  // make sure centroid is maintained
  centroid.set({ x: originalCentroidX, y: originalCentroidY });
}
