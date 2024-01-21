import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

import { linearize } from './linearize';

import { displacement } from '@rnacanvas/points';

import { shift } from './shift';

import { rotate } from './rotate';

export type Options = {
  /**
   * The distance between the two bases in a base-pair.
   *
   * Can be positive, zero or negative.
   */
  basePairLength: number;

  /**
   * The spacing between stacked base-pairs.
   */
  basePairSpacing: number;
};

/**
 * Arranges the target bases into a stem, pairing the first base with the last base, the second base with the
 * second-to-last base, etc.
 *
 * If there are an odd number of target bases, the middle base is tacked on to the end of the 5' side of the stem.
 *
 * Places the 3' side of the stem in the direction of increasing angles relative to the 5' side of the stem
 * (i.e., counterclockwise in the standard Cartesian coordinate system).
 */
export function stemmify(targetBases: Nucleobase[], options: Options): void {
  let { basePairLength, basePairSpacing } = options;

  if (targetBases.length < 2) {
    // nothing to do
    return;
  }

  let i = Math.ceil(targetBases.length / 2);

  // the 5' and 3' sides of the stem
  let side5 = targetBases.slice(0, i);
  let side3 = targetBases.slice(i);

  let centroid = new Centroid(targetBases);

  let { x, y } = centroid.get();

  // cache actual numbers just in case gotten object has live properties
  let originalCentroid = { x, y };

  let originalDirection = (new Direction(targetBases)).get();

  // linearize the two sides
  linearize(side5, { spacing: basePairSpacing });
  linearize(side3, { spacing: basePairSpacing });

  // make vertical
  (new Direction(side5)).set(-Math.PI / 2);

  // make vertical and pointing the other way
  (new Direction(side3)).set(Math.PI / 2);

  let firstBase = targetBases[0];
  let lastBase = targetBases[targetBases.length - 1];

  // align the two sides (base-pair length apart from each other)
  shift(side5, displacement(firstBase.getCenterPoint(), { x: 0, y: 0 }));
  shift(side3, displacement(lastBase.getCenterPoint(), { x: basePairLength, y: 0 }));

  // rotate (instead of setting direction directly) in case base-pair length is zero
  rotate(targetBases, originalDirection);

  centroid.set(originalCentroid);
}
