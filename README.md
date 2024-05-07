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
