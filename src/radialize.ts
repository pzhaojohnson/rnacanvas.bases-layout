import type { Nucleobase } from './Nucleobase';

import { NucleobaseMock } from './NucleobaseMock';

import { PositionPairs } from '@rnacanvas/base-pairs';

import { sorted as sortedPositionPairs } from '@rnacanvas/position-pairs';

import { Stem as RawStem } from '@rnacanvas/base-pairs';

import { Stems as RawStems } from '@rnacanvas/base-pairs';

import type { Linker as RawLinker } from '@rnacanvas/base-pairs';

import { Linkers as RawLinkers } from '@rnacanvas/base-pairs';

import { Centroid } from './Centroid';

import { Direction } from './Direction';

import { circularize } from './circularize';

import { stemmify } from './stemmify';

import { round } from './round';

import { shift } from './shift';

import { min, max } from '@rnacanvas/math';

import { displacement, distance } from '@rnacanvas/points';

class IntegerRange {
  static from(start: number) {
    return {
      to: (end: number) => ({
        /**
         * Returns the integer range from the start number to the end number, inclusive.
         *
         * Assumes that the start and end numbers are integers
         * and that the end number is greater than or equal to the start number.
         */
        inclusive: () => {
          let length = end - start + 1;

          return Array.from({ length }, (_, i) => start + i);
        },
      }),
    };
  }
}

/**
 * A sequence of bases.
 */
export type Sequence = Nucleobase[];

export type BasePair = [Nucleobase, Nucleobase];

/**
 * A sequence of bases and pairs among those bases.
 */
export type RawStructure = [Sequence, BasePair[]];

class MountainPlotTraversal {
  /**
   * Returns the mountain plot traversal of a target structure.
   */
  static of(...targetStructure: RawStructure): number[] {
    let [seq, basePairs] = targetStructure;

    // don't forget to sort!
    let positionPairs = (new PositionPairs(...targetStructure)).get();
    positionPairs = sortedPositionPairs(positionPairs);

    let indexPairs = positionPairs.map(pp => pp.map(p => p - 1));

    let mountainPlotTraversal: number[] = [];

    let h = 0;

    seq.forEach((b, i) => {
      let ip = indexPairs.find(ip => ip.includes(i));

      if (ip && i == min(ip)) {
        mountainPlotTraversal.push(h);
        h += 1;
      } else if (ip && i == max(ip)) {
        h -= 1
        mountainPlotTraversal.push(h);
      } else {
        mountainPlotTraversal.push(h);
      }
    });

    return mountainPlotTraversal;
  }
}

class Structure {
  private rawForm: RawStructure;

  readonly mountainPlotTraversal: ReturnType<typeof MountainPlotTraversal.of>;

  readonly positionPairs: [number, number][];

  readonly indexPairs: [number, number][];

  readonly pairedBases: Set<Nucleobase>;

  readonly pairedIndices: Set<number>;

  constructor(...rawForm: RawStructure) {
    let [seq, basePairs] = rawForm;

    this.rawForm = rawForm;

    this.mountainPlotTraversal = MountainPlotTraversal.of(...rawForm);

    this.positionPairs = (new PositionPairs(...rawForm)).get();

    this.indexPairs = this.positionPairs.map(pp => [pp[0] - 1, pp[1] - 1]);

    this.pairedBases = new Set(basePairs.flat());

    this.pairedIndices = new Set(
      seq
        .map((b, i) => ({ b, i }))
        .filter(bi => this.pairedBases.has(bi.b))
        .map(bi => bi.i)
    );
  }

  [Symbol.iterator]() { return this.rawForm.values(); }

  get sequence() {
    return this.rawForm[0];
  }

  get basePairs() {
    return this.rawForm[1];
  }
}

class IndexPair {
  static correspondingTo(bp: BasePair) {
    return {
      in: (targetStructure: Structure) => {
        return bp.map(b => targetStructure.sequence.indexOf(b));
      },
    };
  }
}

class Stem {
  static composedOf(basePairs: RawStem<Nucleobase>) {
    if (basePairs.length == 0) {
      throw new Error('All stems must have at least one base-pair.');
    }

    let bottomBasePair = basePairs[0];
    let topBasePair = basePairs[basePairs.length - 1];

    // the 5' side of the stem
    let side5 = basePairs.map(bp => bp[0]);

    // the 3' side of the stem (with bases sorted in ascending order by sequence position)
    let side3 = basePairs.map(bp => bp[1]).reverse();

    let firstBase = bottomBasePair[0];
    let lastBase = bottomBasePair[1];

    // all of the bases in the stem (in ascending order by sequence position)
    let flat = [...side5, ...side3];

    return {
      [Symbol.iterator]() { return basePairs.values(); },

      bottomBasePair, topBasePair,

      side5, side3,

      flat: () => flat,

      firstBase, lastBase,

      stemmify: () => {
        return {
          /**
           * Stemmifies the bases in the stem with the specified options.
           *
           * Uses the first base in the stem as an anchor.
           */
          with: (options: { basePairLength: number, basePairSpacing: number }) => {
            let { basePairLength, basePairSpacing } = options;

            // cache the actual numbers just in case the gotten object as live properties
            let anchorPoint = { ...firstBase.getCenterPoint() };

            stemmify(flat, { basePairLength, basePairSpacing });

            shift(flat, displacement(firstBase.getCenterPoint(), anchorPoint));
          },
        };
      },
    };
  }
}

class Stems {
  /**
   * Returns all stems in the target structure.
   */
  static in(targetStructure: Structure) {
    return {
      [Symbol.iterator]() {
        return (new RawStems(targetStructure.sequence, targetStructure.basePairs))
          .get()
          .map(stackedBasePairs => Stem.composedOf(stackedBasePairs))
          .values();
      },
    };
  }
}

class Linker {
  static composedOf(consecutiveBases: RawLinker<Nucleobase>) {
    if (consecutiveBases.length < 2) {
      throw new Error('Linkers must have at least two bases.');
    }

    let firstBase = consecutiveBases[0];
    let lastBase = consecutiveBases[consecutiveBases.length - 1];

    let unpairedBases = consecutiveBases.slice(1, -1);

    return {
      in: (parentStructure: Structure) => {
        let firstIndex = parentStructure.sequence.indexOf(firstBase);
        let lastIndex = parentStructure.sequence.indexOf(lastBase);

        let indices = IntegerRange.from(firstIndex).to(lastIndex).inclusive();

        let isHairpinLoop = (
          parentStructure.indexPairs.find(ip => ip.includes(firstIndex) && ip.includes(lastIndex)) ? true : false
        );

        let isInOutermostLoop = indices.every(i => parentStructure.mountainPlotTraversal[i] == 0);

        // keep in mind the case of a hairpin loop with zero unpaired bases
        let isBetweenSiblingStems = (
          (new Set(indices.map(i => parentStructure.mountainPlotTraversal[i]))).size == 1
          && !isHairpinLoop
        );

        return {
          [Symbol.iterator]() { return consecutiveBases.values(); },

          indices,

          firstBase, lastBase,
          firstIndex, lastIndex,

          unpairedBases: {
            [Symbol.iterator]() { return unpairedBases.values(); },

            stemmify: () => ({
              with: (options: { spacing: number }) => {
                let { spacing } = options;

                if (unpairedBases.length < 3) {
                  // nothing to do
                  return;
                }

                let firstUnpairedBase = unpairedBases[0];
                let lastUnpairedBase = unpairedBases[unpairedBases.length - 1];

                // cache the actual numbers just in case the gotten object has live properties
                let anchorPoint = { ...firstUnpairedBase.getCenterPoint() };

                stemmify(unpairedBases, {
                  basePairLength: distance(firstUnpairedBase.getCenterPoint(), lastUnpairedBase.getCenterPoint()),
                  basePairSpacing: spacing,
                });

                shift(unpairedBases, displacement(firstUnpairedBase.getCenterPoint(), anchorPoint));
              },
            }),
          },

          /**
           * Throws if this linker does not have at least three unpaired bases
           * or if this linker has an even number of unpaired bases.
           */
          get middleThreeUnpairedBases(): [Nucleobase, Nucleobase, Nucleobase] | never {
            if (unpairedBases.length < 3) {
              throw new Error('This linker has less than three unpaired bases.');
            } else if (unpairedBases.length % 2 == 0) {
              throw new Error('This linker has an even number of unpaired bases.');
            }

            let i = Math.floor(unpairedBases.length / 2);

            return [
              unpairedBases[i - 1],
              unpairedBases[i],
              unpairedBases[i + 1],
            ];
          },

          isHairpinLoop: () => isHairpinLoop,

          isInOutermostLoop: () => isInOutermostLoop,

          isBetweenSiblingStems: () => isBetweenSiblingStems,

          round() {
            return {
              /**
               * Rounds the linker with the specified options.
               */
              with: (options: { spacing: number }) => {
                let { spacing } = options;

                round(consecutiveBases, { spacing });
              },
            };
          },
        };
      }
    };
  }
}

class Linkers {
  /**
   * Returns all linkers in the target structure.
   */
  static in(targetStructure: Structure) {
    let linkers = (new RawLinkers(targetStructure.sequence, targetStructure.basePairs))
      .get()
      .map(consecutiveBases => Linker.composedOf(consecutiveBases).in(targetStructure));

    return {
      [Symbol.iterator]() { return linkers.values(); },

      thatAreHairpinLoops: {
        [Symbol.iterator]() { return linkers.filter(li => li.isHairpinLoop()).values(); },
      },

      inOutermostLoop: {
        [Symbol.iterator]() { return linkers.filter(li => li.isInOutermostLoop()).values(); },
      },

      notInOutermostLoop: {
        [Symbol.iterator]() { return linkers.filter(li => !li.isInOutermostLoop()).values(); },

        betweenSiblingStems: {
          [Symbol.iterator]() {
            return linkers
              .filter(li => !li.isInOutermostLoop())
              .filter(li => li.isBetweenSiblingStems())
              .values();
          },
        },
      },

      notBetweenSiblingStems: {
        [Symbol.iterator]() { return linkers.filter(li => !li.isBetweenSiblingStems()).values(); },
      },
    };
  }
}

class Loop {
  static closedBy(closingStem: ReturnType<typeof Stem.composedOf>) {
    return {
      in: (parentStructure: Structure) => {
        let closingBasePair = closingStem.topBasePair;
        let closingIndexPair = IndexPair.correspondingTo(closingBasePair).in(parentStructure);

        // the first index in the loop
        let firstIndex = min(closingIndexPair);

        let enclosedBases = parentStructure.sequence.filter((b, i) => (
          i > min(closingIndexPair)
          && i < max(closingIndexPair)
          && parentStructure.mountainPlotTraversal[i] == parentStructure.mountainPlotTraversal[firstIndex] + 1
        ));

        let enclosedIndices = enclosedBases.map(b => parentStructure.sequence.indexOf(b));

        let enclosedPairedBases = enclosedBases.filter(b => parentStructure.pairedBases.has(b));
        let enclosedPairedIndices = enclosedIndices.filter(i => parentStructure.pairedIndices.has(i));

        let rawForm = [closingBasePair[0], ...enclosedBases, closingBasePair[1]];

        return {
          [Symbol.iterator]() { return rawForm.values(); },

          parentStructure,

          closingStem,

          closingBasePair,
          closingIndexPair,

          enclosedBases,
          enclosedIndices,

          enclosedPairedBases,
          enclosedPairedIndices,

          get platform() {
            if (enclosedPairedIndices.length == 0) {
              throw new Error('This loop does not have a platform.');
            }

            let firstPlatformIndex = min(enclosedPairedIndices);
            let lastPlatformIndex = max(enclosedPairedIndices);

            let rawPlatform = parentStructure.sequence.filter((b, i) => (
              i >= firstPlatformIndex
              && i <= lastPlatformIndex
              && enclosedIndices.includes(i)
              && [i - 1, i, i + 1].some(j => enclosedPairedIndices.includes(j))
            ));

            return {
              [Symbol.iterator]() { return rawPlatform.values(); },

              firstIndex: firstPlatformIndex,
              lastIndex: lastPlatformIndex,

              arch() {
                return {
                  with: (options: { spacing: number }) => {
                    let { spacing } = options;

                    // ensure is at least zero
                    let numCenteringBasesPerSide = max([
                      rawPlatform.length - 2,
                      firstPlatformIndex - min(closingIndexPair) - 1,
                      max(closingIndexPair) - lastPlatformIndex - 1,
                      0,
                    ]);

                    // upstream mock bases used to center the loop platform
                    let upstreamCenteringBases = IntegerRange.from(1).to(numCenteringBasesPerSide).inclusive()
                      .map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }));

                    // downstream mock bases used to center the loop platform
                    let downstreamCenteringBases = upstreamCenteringBases
                      .map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }));

                    // cache the actual numbers just in case the gotten object has live properties
                    let anchorPoint = { ...closingBasePair[0].getCenterPoint() };

                    circularize([
                      closingBasePair[0],
                      ...upstreamCenteringBases,
                      ...rawPlatform,
                      ...downstreamCenteringBases,
                      closingBasePair[1],
                    ], { spacing, terminiGap: spacing });

                    shift(
                      [...closingBasePair, ...rawPlatform],
                      displacement(closingBasePair[0].getCenterPoint(), anchorPoint),
                    );
                  },
                };
              },
            };
          },
        };
      },
    };
  }
}

class OutermostLoop {
  /**
   * Returns the outermost loop of the target structure.
   */
  static of(targetStructure: Structure) {
    let rawForm = targetStructure.sequence.filter((b, i) => targetStructure.mountainPlotTraversal[i] == 0);

    return {
      [Symbol.iterator]() { return rawForm.values(); },
    };
  }
}

export type Options = {
  /**
   * How much space to include between bases (approximately) in general.
   */
  spacing: number;

  /**
   * The spacing between stacked base-pairs in stems.
   */
  basePairSpacing: number;

  /**
   * Spacing around unpaired bases in hairpin loops.
   */
  hairpinLoopSpacing?: number;
};

/**
 * Arranges the sequence of bases into a radialized layout
 * (in the same vein as the NAView layout algorithm)
 * according to the array of base-pairs provided.
 *
 * It is not firmly defined exactly how this function will lay out the sequence of bases,
 * just that it will do so in some manner of radial layout.
 *
 * Maintains the original centroid and overall direction of the sequence of bases.
 *
 * This function assumes that all provided base-pairs are valid
 * (e.g., no contradictory base-pairs, no repeat base-pairs, etc.).
 *
 * This function also cannot currently handle pseudoknotted base-pairs well.
 */
export function radialize(seq: Nucleobase[], basePairs: BasePair[], options: Options): void {
  let { spacing, basePairSpacing } = options;

  let hairpinLoopSpacing = options.hairpinLoopSpacing ?? spacing;

  let targetStructure = new Structure(seq, basePairs);

  if (seq.length < 2) {
    // nothing to do
    return;
  }

  if (basePairs.length == 0) {
    circularize(seq, { spacing, terminiGap: 2 * spacing });
    return;
  }

  // cache the actual numbers just in case the gotten object has live properties
  let originalCentroid = { ...(new Centroid(seq)).get() };

  let originalDirection = (new Direction(seq)).get();

  let stems = Stems.in(targetStructure);

  let linkers = Linkers.in(targetStructure);

  let outermostLoop = OutermostLoop.of(targetStructure);

  circularize([...outermostLoop], { spacing, terminiGap: 2 * spacing });

  // all loops closed by stems
  let closedLoops = [...stems].map(st => Loop.closedBy(st).in(targetStructure));

  // only do this for closed loops that enclose additional stems
  closedLoops
    .filter(loop => loop.enclosedPairedBases.length > 0)
    .forEach(loop => {
      loop.closingStem.stemmify().with({ basePairLength: spacing, basePairSpacing });

      loop.platform.arch().with({ spacing });

      // restore the positioning of the closing base-pair of the loop
      loop.closingStem.stemmify().with({ basePairLength: spacing, basePairSpacing });
    });

  // stemmify hairpin stems
  closedLoops
    .filter(loop => loop.enclosedPairedBases.length == 0)
    .forEach(loop => loop.closingStem.stemmify().with({ basePairLength: spacing, basePairSpacing }));

  [...linkers.notBetweenSiblingStems].forEach(li => li.round().with({ spacing }));

  // do after linkers that are not between sibling stems in general
  [...linkers.thatAreHairpinLoops].forEach(li => li.round().with({ spacing: hairpinLoopSpacing }));

  // only do this for linkers with at least three unpaired bases
  [...linkers.notInOutermostLoop.betweenSiblingStems]
    .filter(li => [...li.unpairedBases].length >= 3)
    .forEach(li => {
      li.unpairedBases.stemmify().with({ spacing });

      // center the middle base of the linker
      if ([...li.unpairedBases].length % 2 != 0) {
        round(li.middleThreeUnpairedBases, { spacing });
      }
    });

  // restore original direction and centroid
  (new Direction(seq)).set(originalDirection);
  (new Centroid(seq)).set(originalCentroid);
}
