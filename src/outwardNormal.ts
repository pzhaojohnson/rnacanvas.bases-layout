import type { Nucleobase } from './Nucleobase';

import { tangent } from './tangent';

import { flipAway } from '@rnacanvas/math';

import { direction } from '@rnacanvas/points';

import { other } from '@rnacanvas/base-pairs';

/**
 * Returns the angle (in radians) that points "outward" from the parent structure
 * at the given base.
 *
 * Throws if the target base is not present in the provided structure.
 *
 * @param b
 * @param parentStructure The structure containing the base.
 */
export function outwardNormal(b: Nucleobase, ...parentStructure: Structure): number | never {
  let seq = parentStructure[0];

  let basePairs = parentStructure[1] ?? [];

  let angle = tangent(b, seq) + (Math.PI / 2);

  let i = seq.indexOf(b);

  if (i < 0) {
    throw new Error('The target base is not present in the provided structure.');
  }

  if (seq.length > 1 && i < seq.length - 1) {
    let nextBase = seq[i + 1];

    angle = flipAway(angle, direction(b.getCenterPoint(), nextBase.getCenterPoint()));
  }

  let bp = basePairs.find(bp => bp.includes(b));

  // flipping away from a base-pair takes precedence
  if (bp) {
    angle = flipAway(angle, direction(b.getCenterPoint(), other(b, bp).getCenterPoint()));
  }

  return angle;
}

type Sequence = Nucleobase[];

type BasePair = [Nucleobase, Nucleobase];

type Structure = [Sequence, BasePair[]?];
