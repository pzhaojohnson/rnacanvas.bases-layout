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

(Basically, nucleobases just have to have a `getCenterPoint()` method and a `setCenterPoint()` method.

```typescript
interface Nucleobase {
  getCenterPoint(): { x: number, y: number };

  setCenterPoint(p: { x: number, y: number }): void;
}
```
