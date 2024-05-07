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
