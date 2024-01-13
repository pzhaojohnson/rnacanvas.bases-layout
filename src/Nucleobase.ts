export type Point = {
  x: number;
  y: number;
};

export interface Nucleobase {
  getCenterPoint(): Point;

  setCenterPoint(centerPoint: Point): void;
}
