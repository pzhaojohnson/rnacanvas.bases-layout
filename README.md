# Installation

With `npm`:

```
npm install @rnacanvas/bases-layout
```

# Usage

All exports of this package can be accessed using named imports.

```typescript
// some example imports
import { stemmify } from '@rnacanvas/bases-layout';
import { Centroid, shift } from '@rnacanvas/bases-layout';
import { circularize, round } from '@rnacanvas/bases-layout';
```

# Exports

## `Nucleobase`

The `Nucleobase` interface defines the expected interface for nucleobases used throughout this package.

(Basically, nucleobases just have to have a `getCenterPoint()` method and a `setCenterPoint()` method.)

```typescript
interface Nucleobase {
  getCenterPoint(): { x: number, y: number };

  setCenterPoint(p: { x: number, y: number }): void;
}
```

## `NucleobaseMock`

The `NucleobaseMock` class is a simple class that just stores the coordinates of a center point
(and is primarily used for testing purposes).

It is often possible, though, to improve the performance of layout operations on nucleobases
by performing them on mock nucleobases first
and then copying the final coordinates of the mock nucleobases to the actual nucleobases that one is working with.

```typescript
let b = new NucleobaseMock({ centerPoint: { x: 92.3, y: -57.2 } });

b.getCenterPoint(); // { x: 92.3, y: -57.2 }

b.setCenterPoint({ x: 111.5, y: 63 });
```

## `Centroid`

The `Centroid` class represents the centroid of a collection of nucleobases
(where the centroid is defined as the "average" of the center points of all the bases).

Setting this will move the bases.

```typescript
let bases = [
  new NucleobaseMock({ centerPoint: { x: 10, y: 22 } }),
  new NucleobaseMock({ centerPoint: { x: 2, y: 8 } }),
  new NucleobaseMock({ centerPoint: { x: 0, y: -12 } }),
];

let centroid = new Centroid(bases);

centroid.get(); // { x: 4, y: 6 }

// move the bases such that their centroid is now (33, 41)
centroid.set({ x: 33, y: 41 });
```

## `Direction`

The `Direction` class represents the overall direction of an ordered collection of nucleobases
(i.e., it is the direction of the vector that results from traversing the bases in order
and adding the individual vectors connecting each consecutive pair of bases).

This is also equal to simply the direction of the vector from the first base to the last base.

This class expresses direction values in radians.

The `set` method of this class can also be used to rotate the target bases
such that their overall direction becomes the specified direction.

```typescript
let bases = [
  new NucleobaseMock({ centerPoint: { x: 124, y: 4134 } }),
  new NucleobaseMock({ centerPoint: { x: 8, y: 0 } }),
  new NucleobaseMock({ centerPoint: { x: 99, y: -2 } }),
  new NucleobaseMock({ centerPoint: { x: 551, y: 7 } }),
];

let direction = new Direction(bases);

direction.get(); // -1.4676981844274177

// rotates the target bases such their overall direction becomes 0.62
direction.set(0.62);
```

## `shift()`

Shifts the target bases by the given displacement vector.

```typescript
let bases = [
  new NucleobaseMock({ centerPoint: { x: 14, y: 12 } }),
  new NucleobaseMock({ centerPoint: { x: 140, y: 437 } }),
  new NucleobaseMock({ centerPoint: { x: -2, y: -88 } }),
];

shift(bases, { x: 38, y: -124 });

bases[0].getCenterPoint(); // { x: 52, y: -112 }
bases[1].getCenterPoint(); // { x: 178, y: 313 }
bases[2].getCenterPoint(); // { x: 36, y: -212 }
```

## `rotate()`

Rotates the target bases by the given angle (specified in radians).

Bases are rotated in the direction of increasing direction angles
(i.e., counterclockwise in the standard Cartesian coordinate system).

```typescript
let bases = [
  new NucleobaseMock({ centerPoint: { x: 12, y: 100 } }),
  new NucleobaseMock({ centerPoint: { x: -58, y: -2 } }),
  new NucleobaseMock({ centerPoint: { x: 64, y: 800 } }),
];

let direction = new Direction(bases);
direction.get(); // 1.496646807136276

rotate(bases, Math.PI / 4);

direction.get(); // 2.282044970533724
```

## `straighten()`

Arranges the target bases in a straight line,
maintaining the original positions of the first and last bases
and spacing the bases evenly.

```typescript
let bases = [
  new NucleobaseMock({ centerPoint: { x: 81, y: 7 } }),
  new NucleobaseMock({ centerPoint: { x: 92, y: 12 } }),
  new NucleobaseMock({ centerPoint: { x: 401, y: -42 } }),
  new NucleobaseMock({ centerPoint: { x: -3819, y: 4829 } }),
];

straighten(bases);
```

## `linearize()`

Arranges the target bases in a straight line
(with the specified spacing between the center points of each consecutive pair of bases).

```typescript
linearize(bases, { spacing: 20 });
```
