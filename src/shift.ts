import type { Nucleobase } from './Nucleobase';

export type Vector = {
  x: number;
  y: number;
};

/**
 * Shifts the target bases by the given vector
 * (i.e., adds the vector to each of their center points).
 */
export function shift(targetBases: Nucleobase[], vector: Vector): void {
  targetBases.forEach(b => {
    let centerPoint = b.getCenterPoint();

    b.setCenterPoint({
      x: centerPoint.x + vector.x,
      y: centerPoint.y + vector.y,
    });
  });
}
