import type { Nucleobase } from './Nucleobase';

import { distance } from '@rnacanvas/points';

import { displacement } from '@rnacanvas/points';

import { direction } from '@rnacanvas/vectors';

/**
 * Arranges the target bases in a straight line,
 * maintaining the original positions of the first and last bases
 * and spacing intervening bases evenly between the first and last bases.
 */
export function straighten(targetBases: Nucleobase[]): void {
  if (targetBases.length < 3) {
    // nothing to do
    return;
  }

  let firstBase = targetBases[0];
  let lastBase = targetBases[targetBases.length - 1];

  let ends = [firstBase.getCenterPoint(), lastBase.getCenterPoint()];

  let d = distance(ends[0], ends[1]);

  let a = direction(displacement(ends[0], ends[1]));

  let spacing = d / (targetBases.length - 1);

  let spacingX = spacing * Math.cos(a);
  let spacingY = spacing * Math.sin(a);

  let { x, y } = ends[0];

  targetBases.forEach(b => {
    b.setCenterPoint({ x, y });

    x += spacingX;
    y += spacingY;
  });
}
