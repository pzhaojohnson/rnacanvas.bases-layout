import type { Nucleobase } from './Nucleobase';

import { NucleobaseMock } from './NucleobaseMock';

import { knotless } from '@rnacanvas/base-pairs';

import { mountainPlotTraversal } from '@rnacanvas/position-pairs';

import { consecutivePairs } from '@rnacanvas/base-pairs';

import { Stems } from '@rnacanvas/base-pairs';

import { stemmify } from './stemmify';

import { Centroid } from './Centroid';

import { shift } from './shift';

import { Direction } from './Direction';

import { rotate } from './rotate';

import { circularize } from './circularize';

import { round } from './round';

import { min, max } from '@rnacanvas/math';

import { distance, displacement } from '@rnacanvas/points';

import { Point } from '@rnacanvas/points.oopified';

type BasePair = [Nucleobase, Nucleobase];

type Options = {
  /**
   * How much space to put between bases (approximately) in general.
   */
  spacing: number;

  /**
   * The spacing between stacked base-pairs in stems.
   */
  basePairSpacing: number;

  /**
   * The spacing between the unpaired bases in hairpin loops.
   */
  hairpinLoopSpacing?: number;
};

/**
 * Untangle the bases of a structure
 * specified by a sequence of bases and the base-pairs among the bases.
 */
export function untangle(sequence: Nucleobase[], basePairs: BasePair[], options: Options) {
  let { spacing } = options;

  if (sequence.length == 0) {
    return; // nothing to do
  } else if (basePairs.length == 0) {
    arrangeUnstructured(sequence, options);
    return;
  }

  // placeholder variable
  let _: unknown;

  // ignore pseudoknots
  [_, basePairs] = knotless(sequence, basePairs);

  let originalSequence = [...sequence];
  let originalCentroid = Point.matching((new Centroid(originalSequence)).get());

  // add an extra mock nucleobase to create a small termini gap
  sequence = [...sequence, new NucleobaseMock({ centerPoint: { x: 0, y: 0 } })];

  let structure = new Structure(sequence, basePairs);

  let allLoops = structure.loops;

  allLoops.sort((loop1, loop2) => centralityScore(loop1, structure) - centralityScore(loop2, structure));

  let centralLoop = allLoops[0];

  let maxCentralLoopLinkerSize = max(centralLoop.linkers.map(li => li.length));

  let basesToCircularize = centralLoop.linkers.flatMap(li => [
    first(li),
    ...Array.from({ length: maxCentralLoopLinkerSize - 2 }).map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } })),
    last(li),
  ]);

  circularize(basesToCircularize, { spacing, terminiGap: spacing });

  // effectively sets the direction of the first stem in the central loop to zero
  rotate(basesToCircularize, -((new Direction(basesToCircularize)).get()));

  (new Centroid(basesToCircularize)).set(originalCentroid);

  centralLoop.linkers.forEach(li => round(li, { spacing }));

  centralLoop.emanatingStems.forEach(st => arrangeSpannedBases(st.bottomBasePair, structure, options));

  if ('outerStem' in centralLoop) {
    // swap order
    let joiningBasePair: BasePair = [centralLoop.outerStem.topBasePair[1], centralLoop.outerStem.topBasePair[0]];

    // swap order of leading and trailing bases
    let joinedBases = [
      ...sequence.slice(structure.indexOf(joiningBasePair[0])),
      ...sequence.slice(0, structure.indexOf(joiningBasePair[1]) + 1),
    ];

    let joinedBasesSet = new Set(joinedBases);

    let joinedStructure = new Structure(joinedBases, basePairs.filter(bp => bp.every(b => joinedBasesSet.has(b))));

    arrangeSpannedBases(joiningBasePair, joinedStructure, options);
  }
}

function arrangeUnstructured(sequence: Nucleobase[], options: Options): void | never {
  let { spacing } = options;

  let originalCentroid = Point.matching((new Centroid(sequence)).get());

  circularize(sequence, { spacing, terminiGap: 2 * spacing });

  (new Direction(sequence)).set(Math.PI / 2);

  (new Centroid(sequence)).set(originalCentroid);
}

/**
 * The spanning base-pair is assumed to already be positioned properly
 * and to be the bottom base-pair of a stem.
 */
function arrangeSpannedBases(spanningBasePair: BasePair, parentStructure: Structure, options: Options) {
  let { spacing } = options;

  let basePairSpacing = options.basePairSpacing ?? spacing;
  let hairpinLoopSpacing = options.hairpinLoopSpacing ?? spacing;

  let closingStem = parentStructure.stems.find(st => st.bottomBasePair[0] === spanningBasePair[0]);
  if (!closingStem) { throw new Error('Closing stem not found.'); }

  let anchorPoint = Point.matching(spanningBasePair[0].getCenterPoint());

  stemmify(closingStem.bases, { basePairSpacing, basePairLength: spacing });

  shift(closingStem.bases, displacement(spanningBasePair[0].getCenterPoint(), anchorPoint));

  let loop = parentStructure.loop(closingStem.topBasePair);

  if (loop.innerStems.length > 0) {
    arcLoop(closingStem.topBasePair, parentStructure, options);
  } else {
    round(loop.bases, { spacing: hairpinLoopSpacing });
  }

  loop.innerStems.forEach(st => arrangeSpannedBases(st.bottomBasePair, parentStructure, options));

  let linkersBetweenSiblingStems = consecutivePairs(loop.innerStems).map(([st1, st2]) => [
    st1.bottomBasePair[1], ...parentStructure.interveningBases(st1.bottomBasePair[1], st2.bottomBasePair[0]), st2.bottomBasePair[0],
  ]);

  linkersBetweenSiblingStems.filter(li => li.length >= 5).forEach(li => {
    // the unpaired bases in the linker
    let unpairedBases = li.slice(1, -1);

    let anchorPoint = Point.matching(unpairedBases[0].getCenterPoint());

    let basePairLength = distance(first(unpairedBases).getCenterPoint(), last(unpairedBases).getCenterPoint());

    stemmify(unpairedBases, { basePairLength, basePairSpacing });

    let middleBases = unpairedBases.length % 2 == 0 ? middleFour(unpairedBases) : middleThree(unpairedBases);

    round(middleBases, {
      spacing: unpairedBases.length >= 5 ? basePairSpacing : basePairLength,
    });

    shift(unpairedBases, displacement(unpairedBases[0].getCenterPoint(), anchorPoint));
  });
}

function arcLoop(closingBasePair: BasePair, parentStructure: Structure, options: Options) {
  let { spacing } = options;

  let closingIndexPair = [parentStructure.indexOf(closingBasePair[0]), parentStructure.indexOf(closingBasePair[1])];

  let loop = parentStructure.loop(closingBasePair);

  let innerPairedIndices = loop.innerStems.flatMap(st => st.bottomBasePair.map(b => parentStructure.indexOf(b)));

  let firstPlatformIndex = min(innerPairedIndices);
  let lastPlatformIndex = max(innerPairedIndices);

  let platform = parentStructure.sequence.filter((b, i) => (
    i >= firstPlatformIndex
    && i <= lastPlatformIndex
    && parentStructure.mountainPlotTraversal[i] == parentStructure.mountainPlotTraversal[firstPlatformIndex]
    && [i - 1, i, i + 1].some(j => innerPairedIndices.includes(j))
  ));

  let numCenteringBasesPerSide = max([
    platform.length - 2,
    firstPlatformIndex - min(closingIndexPair) - 1,
    max(closingIndexPair) - lastPlatformIndex - 1,
  ]);

  // ensure is at least zero
  numCenteringBasesPerSide = max([numCenteringBasesPerSide, 0]);

  // upstream mock bases used to center the loop platform
  let upstreamCenteringBases = Array.from({ length: numCenteringBasesPerSide })
    .map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }));

  // downstream mock bases used to center the loop platform
  let downstreamCenteringBases = upstreamCenteringBases
    .map(() => new NucleobaseMock({ centerPoint: { x: 0, y: 0 } }));

  let anchorPoint = Point.matching(closingBasePair[0].getCenterPoint());

  circularize([
    closingBasePair[0],
    ...upstreamCenteringBases,
    ...platform,
    ...downstreamCenteringBases,
    closingBasePair[1],
  ], { spacing, terminiGap: spacing });

  shift([...closingBasePair, ...platform], displacement(closingBasePair[0].getCenterPoint(), anchorPoint));

  round(parentStructure.sequence.slice(closingIndexPair[0], firstPlatformIndex + 1), { spacing });
  round(parentStructure.sequence.slice(lastPlatformIndex, closingIndexPair[1] + 1), { spacing });
}

class Structure {
  #indices;

  #positions;

  #partners;

  #positionPairs: [number, number][];

  readonly mountainPlotTraversal;

  readonly stems;

  constructor(readonly sequence: Nucleobase[], readonly basePairs: BasePair[]) {
    this.#indices = new Map<Nucleobase, number>();
    this.sequence.forEach((b, i) => this.#indices.set(b, i));

    this.#positions = new Map<Nucleobase, number>();
    this.sequence.forEach((b, i) => this.#positions.set(b, i + 1));

    this.#partners = new Map<Nucleobase, Nucleobase>();
    this.basePairs.forEach(bp => this.#partners.set(bp[0], bp[1]));
    this.basePairs.forEach(bp => this.#partners.set(bp[1], bp[0]));

    this.#positionPairs = this.basePairs.map(bp => [this.positionOf(bp[0]), this.positionOf(bp[1])]);

    this.mountainPlotTraversal = mountainPlotTraversal(this.sequence, this.#positionPairs);

    this.stems = (new Stems(this.sequence, this.basePairs)).get().map(st => new Stem(st));
  }

  indexOf(b: Nucleobase): number | never {
    let i = this.#indices.get(b);

    if (typeof i != 'number') {
      throw new Error('Base not found.');
    }

    return i;
  }

  positionOf(b: Nucleobase): number | never {
    let p = this.#positions.get(b);

    if (typeof p != 'number') {
      throw new Error('Base not found.');
    }

    return p;
  }

  spannedBases(bp: BasePair) {
    let i1 = this.indexOf(bp[0]);
    let i2 = this.indexOf(bp[1]);

    return this.sequence.slice(min([i1, i2]) + 1, max([i1, i2]));
  }

  numSpannedBases(bp: BasePair): number | never {
    return this.spannedBases(bp).length;
  }

  joinedBases(bp: BasePair) {
    let i1 = this.indexOf(bp[0]);
    let i2 = this.indexOf(bp[1]);

    return [
      ...this.sequence.slice(0, min([i1, i2]) + 1),
      ...this.sequence.slice(max([i1, i2])),
    ];
  }

  numJoinedBases(bp: BasePair): number | never {
    return this.joinedBases(bp).length;
  }

  interveningBases(b1: Nucleobase, b2: Nucleobase) {
    let i1 = this.indexOf(b1);
    let i2 = this.indexOf(b2);

    return this.sequence.slice(min([i1, i2]) + 1, max([i1, i2]));
  }

  /**
   * All loops in the structure.
   */
  get loops() {
    return [
      this.outermostLoop,
      ...this.stems.map(st => this.loop(st.topBasePair)),
    ];
  }

  /**
   * Returns the loop closed by the specified base-pair.
   */
  loop(closingBasePair: BasePair) {
    let closingIndexPair = [this.indexOf(closingBasePair[0]), this.indexOf(closingBasePair[1])];

    // the mountain plot height of the inner bases in the loop
    let innerMPTHeight = this.mountainPlotTraversal[closingIndexPair[0]] + 1;

    let innerBases = this.spannedBases(closingBasePair).filter(b => this.mountainPlotTraversal[this.indexOf(b)] == innerMPTHeight);

    let innerBasesSet = new Set(innerBases);

    // all bases in the loop
    let bases = [closingBasePair[0], ...innerBases, closingBasePair[1]];

    let innerStems = this.stems.filter(st => innerBasesSet.has(st.bottomBasePair[0]));

    let emanatingStems = innerStems;

    let outerStem = this.stems.find(st => closingBasePair.includes(st.topBasePair[0]));
    if (!outerStem) { throw new Error('Outer stem not found.'); }

    let linkers = consecutivePairs(innerStems).map(([st1, st2]) => [
      st1.bottomBasePair[1],
      ...this.interveningBases(st1.bottomBasePair[1], st2.bottomBasePair[0]),
      st2.bottomBasePair[0],
    ]);

    if (innerStems.length > 0) {
      linkers.unshift([
        closingBasePair[0],
        ...this.interveningBases(closingBasePair[0], first(innerStems).bottomBasePair[0]),
        first(innerStems).bottomBasePair[0],
      ]);

      linkers.push([
        last(innerStems).bottomBasePair[1],
        ...this.interveningBases(last(innerStems).bottomBasePair[1], closingBasePair[1]),
        closingBasePair[1],
      ]);
    }

    return {
      bases,
      closingBasePair,
      outerStem,
      innerStems,
      emanatingStems,
      linkers,
    };
  }

  get outermostLoop() {
    let emanatingStems = this.stems.filter(st => this.mountainPlotTraversal[this.indexOf(st.bottomBasePair[0])] == 0);

    let stems = emanatingStems;

    let linkers = consecutivePairs(stems).map(([st1, st2]) => [
      st1.bottomBasePair[1],
      ...this.interveningBases(st1.bottomBasePair[1], st2.bottomBasePair[0]),
      st2.bottomBasePair[0],
    ]);

    if (stems.length > 0) {
      // the linker spanning the termini gap
      linkers.push([
        ...this.sequence.slice(this.indexOf(last(stems).bottomBasePair[1])),
        ...this.sequence.slice(0, this.indexOf(first(stems).bottomBasePair[0]) + 1),
      ]);
    }

    return {
      stems,
      emanatingStems,
      linkers,
    };
  }
}

/**
 * A stem is not to be edited after being created.
 */
class Stem {
  #basePairs: BasePair[];

  /**
   * The base-pairs of the stem are assumed to already be sorted
   * from bottom to top and internally
   * (i.e., upstream partner listed before downstream partner within individual base-pairs).
   */
  constructor(basePairs: BasePair[]) {
    if (basePairs.length == 0) {
      throw new Error('A stem must have at least one base-pair.');
    }

    this.#basePairs = basePairs;
  }

  get bottomBasePair(): BasePair {
    return first(this.#basePairs);
  }

  get topBasePair(): BasePair {
    return last(this.#basePairs);
  }

  /**
   * The 5' side of the stem.
   */
  get side5() {
    return this.#basePairs.map(bp => bp[0]);
  }

  /**
   * The 3' side of the stem.
   */
  get side3() {
    let side3 = this.#basePairs.map(bp => bp[1]);
    side3.reverse();
    return side3;
  }

  /**
   * The bases in the stem (in sequence order).
   */
  get bases() {
    return [...this.side5, ...this.side3];
  }
}

type Loop = InstanceType<typeof Structure>['loops'][number];

/**
 * The lower the score, the more "central" the loop is in the parent structure.
 */
function centralityScore(loop: Loop, parentStructure: Structure) {
  let score = max(loop.emanatingStems.map(st => parentStructure.numSpannedBases(st.bottomBasePair)));

  if ('closingBasePair' in loop) {
    score = max([score, parentStructure.numJoinedBases(loop.closingBasePair) - 2]);
  }

  return score;
}

/**
 * Returns the first item in the array.
 *
 * Throws for empty arrays.
 */
function first<T>(items: T[]): T | never {
  if (items.length == 0) {
    throw new Error('The array is empty.');
  }

  return items[0];
}

/**
 * Returns the last item in the array.
 *
 * Throws for empty arrays.
 */
function last<T>(items: T[]): T | never {
  if (items.length == 0) {
    throw new Error('The array is empty.');
  }

  return items[items.length - 1];
}

/**
 * Returns the middle three items in the array.
 *
 * Throws for arrays with less than three items
 * and even numbers of items.
 */
function middleThree<T>(items: T[]): T[] | never {
  if (items.length < 3) {
    throw new Error('The array has less than three items.');
  } else if (items.length % 2 == 0) {
    throw new Error('The array has an even number of items.');
  }

  let middleIndex = Math.floor(items.length / 2);

  return items.slice(middleIndex - 1, middleIndex + 2);
}

/**
 * Returns the middle four items in the array.
 *
 * Throws for arrays with less than four items
 * or an odd number of items.
 */
function middleFour<T>(items: T[]): T[] | never {
  if (items.length < 4) {
    throw new Error('The array has less than four items.');
  } else if (items.length % 2 != 0) {
    throw new Error('The array has an odd number of items.');
  }

  return items.slice(
    Math.floor(items.length / 2) - 2,
    Math.floor(items.length / 2) + 2,
  );
}
