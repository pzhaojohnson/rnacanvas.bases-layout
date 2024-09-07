import type { Nucleobase } from './Nucleobase';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

import { knotless } from '@rnacanvas/base-pairs';

import { PositionPairs } from '@rnacanvas/base-pairs';

import { mountainPlotTraversal } from '@rnacanvas/position-pairs';

import { circularize } from './circularize';

import type { Stem } from '@rnacanvas/base-pairs';

import { Stems } from '@rnacanvas/base-pairs';

import { stemmify } from './stemmify';

import { shift } from './shift';

import { displacement } from '@rnacanvas/points';

import { min, max } from '@rnacanvas/math';

import { isBetweenExclusive } from '@rnacanvas/math';

import { round } from './round';

type BasePair = [Nucleobase, Nucleobase];

type Options = {
  /**
   * Controls the spacing between consecutive bases in general.
   */
  spacing: number;

  /**
   * The spacing between stacked base-pairs in stems.
   */
  basePairSpacing?: number;

  /**
   * Controls the spacing between consecutive bases in hairpin loops.
   */
  hairpinLoopSpacing?: number;

  /**
   * Controls the spacing between the first and last bases
   * in the outermost loop of the structure.
   */
  terminiGap?: number;
};

/**
 * Arranges the bases in the structure into stems and loops
 * based on the base-pairs present,
 * with no attempt to avoid overlaps among bases.
 *
 * This would correspond to a polygonal layout,
 * as reported by Shapiro et al., 1982.
 *
 * Pseudoknots in the input structure are ignored
 * using the incremental range heuristic reported by Smit et al., 2008.
 */
export function arrange(seq: Nucleobase[], basePairs: BasePair[], options: Options): void {
  let { spacing } = options;

  let basePairSpacing = options.basePairSpacing ?? spacing;

  let hairpinLoopSpacing = options.hairpinLoopSpacing ?? spacing;

  let terminiGap = options.terminiGap ?? spacing;

  let { x, y } = (new Centroid(seq)).get();
  let originalCentroid = { x, y };

  let originalDirection = (new Direction(seq)).get();

  // remove pseudoknots
  [, basePairs] = knotless(seq, basePairs);

  let pps = (new PositionPairs(seq, basePairs)).get();

  let mpt = mountainPlotTraversal(seq, pps);

  // the bases in the outermost loop
  let outermostLoopBases = seq.filter((b, i) => mpt[i] == 0);

  circularize(outermostLoopBases, { spacing, terminiGap });

  let allStems = (new Stems(seq, basePairs)).get();

  let outermostLoopBasesSet = new Set(outermostLoopBases);

  // the stems in the outermost loop
  let outermostLoopStems = allStems.filter(st => outermostLoopBasesSet.has(st[0][0]));

  // recursively arranges a stem, its inner loop and the stems that it encloses
  let arrangeStem = (st: Stem<Nucleobase>) => {
    let bottomBasePair = st[0];

    let { x, y } = (new Centroid(bottomBasePair)).get();
    let originalBottomBasePairCentroid = { x, y };

    let d = (new Direction(st[0])).get();

    // the bases in the stem (in sequence order)
    let bs = [...st.map(bp => bp[0]), ...st.map(bp => bp[1]).reverse()];

    stemmify(bs, { basePairLength: spacing, basePairSpacing });

    (new Direction(bs)).set(d);

    // restore the centroid of the bottom base-pair
    shift(bs, displacement((new Centroid(bottomBasePair)).get(), originalBottomBasePairCentroid));

    let topBasePair = st[st.length - 1];
    let topIndexPair = topBasePair.map(b => seq.indexOf(b));

    // the bases in the inner loop of the stem
    let innerLoopBases = seq.filter((b, i) => (
      isBetweenExclusive(i, min(topIndexPair), max(topIndexPair))
      && mpt[i] == mpt[min(topIndexPair)] + 1
    ));

    let innerLoopBasesSet = new Set(innerLoopBases);

    // the stems in the inner loop of the stem
    let innerLoopStems = allStems.filter(st => innerLoopBasesSet.has(st[0][0]));

    round([topBasePair[0], ...innerLoopBases, topBasePair[1]], {
      spacing: innerLoopStems.length > 0 ? spacing : hairpinLoopSpacing,
    });

    innerLoopStems.forEach(st => arrangeStem(st));
  };

  outermostLoopStems.forEach(st => arrangeStem(st));

  // restore original direction and centroid
  (new Direction(seq)).set(originalDirection);
  (new Centroid(seq)).set(originalCentroid);
}
