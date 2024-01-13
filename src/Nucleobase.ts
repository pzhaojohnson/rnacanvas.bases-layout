export type Point = {
  x: number;
  y: number;
};

/**
 * A base in a nucleic acid structure drawing.
 */
export interface Nucleobase {
  getCenterPoint(): Point;

  setCenterPoint(centerPoint: Point): void;
}
