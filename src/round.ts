import type { Nucleobase } from './Nucleobase';

import type { Point } from './Nucleobase';

import { distance } from '@rnacanvas/points';

import { displacement } from '@rnacanvas/points';

import { direction } from '@rnacanvas/vectors';

import { straighten } from './straighten';

import { circularize } from './circularize';

import { shift } from './shift';

import { CircularSegment } from '@rnacanvas/circles';

export type Options = {
  /**
   * The radial distance between bases in the circular arc.
   */
  spacing: number;
};

/**
 * Arranges the bases in a circular arc, maintaining the positions of the first and last bases.
 *
 * The arc is interpreted to go from the first to the last base in the direction of increasing angles
 * (i.e., counterclockwise in the standard Cartesian coordinate system).
 *
 * If the spacing between bases is not large enough for their arc to be round,
 * then the target bases will be straightened, with intervening bases spaced evenly
 * between the first and last bases.
 */
export function round(targetBases: Nucleobase[], options: Options): void {
  let { spacing } = options;

  if (targetBases.length < 3) {
    // nothing to do
    return;
  }

  let firstBase = targetBases[0];
  let lastBase = targetBases[targetBases.length - 1];

  let chord: [Point, Point] = [firstBase.getCenterPoint(), lastBase.getCenterPoint()];

  let chordLength = distance(chord[0], chord[1]);

  let arcLength = spacing * (targetBases.length - 1);

  // draw straight even if the arc length is slightly more than the chord length
  // (to avoid possible number overflow when calculating the parent circle)
  if (arcLength - chordLength < 1e-3) {
    straighten(targetBases);
    return;
  }

  // just circularize if the chord length is very small
  // (to avoid possible number overflow caused by dividing by a very small chord length)
  if (chordLength < 1e-3) {
    // cache
    let { x, y } = firstBase.getCenterPoint();

    circularize(targetBases, { spacing, terminiGap: chordLength });

    // restore the positioning of the first base (and effectively the last base as well)
    shift(targetBases, displacement(firstBase.getCenterPoint(), { x, y }));

    return;
  }

  let circularSegment = new CircularSegment(chord, { arcLength });

  let c = circularSegment.parentCircleCenterPoint;

  let r = circularSegment.parentCircleRadius;

  let a = direction(displacement(c, firstBase.getCenterPoint()));

  let angularSpacing = circularSegment.arcAngle / (targetBases.length - 1);

  targetBases.forEach(b => {
    b.setCenterPoint({
      x: c.x + (r * Math.cos(a)),
      y: c.y + (r * Math.sin(a)),
    });

    a += angularSpacing;
  });
}
