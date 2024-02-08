import type { Nucleobase } from './Nucleobase';

import { Direction } from './Direction';

import { rotate } from './rotate';

import { flipX } from './flipX';

import { shift } from './shift';

import { displacement } from '@rnacanvas/points';

/**
 * Flips the target bases across the line passing from the first to the last of the target bases.
 */
export function flipSelfX(targetBases: Nucleobase[]): void {
  if (targetBases.length == 0) {
    // nothing to do
    return;
  }

  let firstBase = targetBases[0];

  let { x, y } = firstBase.getCenterPoint();

  // cache the actual numbers just in case the gotten object has live properties
  let cachedFirstBaseCenterPoint = { x, y };

  // note that directly setting the direction of the target bases after flipping them can be tricky to think about
  let direction = new Direction(targetBases);

  let originalDirection = direction.get();

  // make the overall direction of the bases zero
  rotate(targetBases, -originalDirection);

  flipX(targetBases);

  // undo the rotation of the target bases
  rotate(targetBases, originalDirection);

  // maintain the positioning of the first base
  // (and effectively the last base as well)
  shift(targetBases, displacement(firstBase.getCenterPoint(), cachedFirstBaseCenterPoint));
}
