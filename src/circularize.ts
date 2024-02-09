import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

import { rotate } from './rotate';

export type Options = {
  /**
   * The (radial) spacing between bases after being circularized.
   *
   * Can be positive, zero or negative.
   */
  spacing: number;

  /**
   * The (radial) distance between the first and last bases after being circularized.
   *
   * Can be positive, zero or negative.
   */
  terminiGap: number;
};

/**
 * Arranges the target bases in a circle (with the specified spacing and termini gap).
 *
 * Arranges the target bases around the circle in order of increasing direction angle
 * (i.e., counterclockwise in the standard Cartesian coordinate system).
 *
 * Maintains centroid and overall direction of the target bases.
 */
export function circularize(targetBases: Nucleobase[], options: Options): void {
  let { spacing, terminiGap } = options;

  if (targetBases.length < 2) {
    // nothing needs to be done
    return;
  }

  let centroid = new Centroid(targetBases);

  let { x, y } = centroid.get();

  // cache the actual numbers just in case the gotten object has live properties
  let originalCentroidX = x;
  let originalCentroidY = y;

  let originalDirection = (new Direction(targetBases)).get();

  let circumference = spacing * (targetBases.length - 1);
  circumference += terminiGap;

  // to avoid division that would result in a nonfinite number
  if (Math.abs(circumference) < 1e-5) {
    // a circle with circumference 1e-5 should look the same as a circle with circumference 0 on screen
    circumference = 1e-5;
  }

  let radius = circumference / (2 * Math.PI);

  // will result in the overall direction of the target bases being initially zero after circularization
  let startingAngle = (
    (Math.PI / 2)
    + ((2 * Math.PI) * (0.5 * terminiGap / circumference))
  );

  targetBases.forEach((b, i) => {
    let angle = startingAngle + ((2 * Math.PI) * (i * spacing) / circumference);

    // use a centroid of (0, 0) to initially lay out the bases in a circle
    b.setCenterPoint({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  });

  // note that the overall direction of the target bases cannot be directly set when the termini gap is zero
  rotate(targetBases, originalDirection);

  centroid.set({ x: originalCentroidX, y: originalCentroidY });
}
