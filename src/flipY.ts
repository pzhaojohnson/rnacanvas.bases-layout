import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

/**
 * Flips the target bases across a vertical line running through the centroid of the target bases.
 */
export function flipY(targetBases: Nucleobase[]): void {
  let centroidX = (new Centroid(targetBases)).get().x;

  targetBases.forEach(b => {
    let centerPoint = b.getCenterPoint();

    let diffX = centerPoint.x - centroidX;

    b.setCenterPoint({
      x: centroidX - diffX,
      y: centerPoint.y,
    });
  });
}
