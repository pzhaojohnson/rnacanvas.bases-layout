import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

import { distance } from '@rnacanvas/points';

import { displacement } from '@rnacanvas/points';

import { direction } from '@rnacanvas/vectors';

/**
 * Rotates the target bases counterclockwise (in the standard Cartesian coordinate system)
 * by the specified angle (in radians).
 *
 * (Maintains the centroid of the target bases.)
 */
export function rotate(targetBases: Nucleobase[], angle: number): void {
  if (targetBases.length == 0) {
    return;
  }

  let centroid = (new Centroid(targetBases)).get();

  targetBases.forEach(b => {
    let centerPoint = b.getCenterPoint();

    let d = distance(centroid, centerPoint);

    let a = direction(displacement(centroid, centerPoint));
    a += angle;

    b.setCenterPoint({
      x: centroid.x + (d * Math.cos(a)),
      y: centroid.y + (d * Math.sin(a)),
    });
  });
}
