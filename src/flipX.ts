import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

/**
 * Flips the target bases across a horizontal line running through the centroid of the target bases.
 */
export function flipX(targetBases: Nucleobase[]): void {
  let centroidY = (new Centroid(targetBases)).get().y;

  targetBases.forEach(b => {
    let centerPoint = b.getCenterPoint();

    let diffY = centerPoint.y - centroidY;

    b.setCenterPoint({
      x: centerPoint.x,
      y: centroidY - diffY,
    });
  });
}
