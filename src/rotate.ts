import type { Nucleobase } from './Nucleobase';

import { midpoint } from '@rnacanvas/points';

import { distance } from '@rnacanvas/points';

import { displacement } from '@rnacanvas/points';

import { direction } from '@rnacanvas/vectors';

/**
 * Rotates the target bases counterclockwise (in the standard Cartesian coordinate system)
 * by the specified angle (in radians).
 *
 * Rotates the target bases about the midpoint between the first and last bases
 * in the target bases array.
 */
export function rotate(targetBases: Nucleobase[], angle: number): void {
  if (targetBases.length < 2) {
    return;
  }

  let firstBase = targetBases[0];
  let lastBase = targetBases[targetBases.length - 1];

  let anchorPoint = midpoint(firstBase.getCenterPoint(), lastBase.getCenterPoint());

  targetBases.forEach(b => {
    let centerPoint = b.getCenterPoint();

    let d = distance(anchorPoint, centerPoint);

    let a = direction(displacement(anchorPoint, centerPoint));
    a += angle;

    b.setCenterPoint({
      x: anchorPoint.x + (d * Math.cos(a)),
      y: anchorPoint.y + (d * Math.sin(a)),
    });
  });
}
