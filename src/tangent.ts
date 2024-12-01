import type { Nucleobase } from './Nucleobase';

import { Direction } from './Direction';

/**
 * Returns the angle (in radians) that is the direction of the tangent to the base
 * in the parent sequence.
 *
 * Throws if the base is not present in the provided sequence.
 *
 * @param b
 * @param parentSequence The sequence that the base is in.
 */
export function tangent(b: Nucleobase, parentSequence: Nucleobase[]): number | never {
  let i = parentSequence.indexOf(b);

  if (i == -1) {
    throw new Error('The target base is not present in the parent sequence.');
  }

  let j = i - 1;
  let k = i + 2;

  // otherwise the `slice()` method of arrays won't work
  j = Math.max(j, 0);

  return (new Direction(parentSequence.slice(j, k))).get();
}
