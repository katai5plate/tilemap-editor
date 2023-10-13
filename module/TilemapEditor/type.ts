export interface XY {
  x: number;
  y: number;
}
export type Tile = XY & {
  tilesetIdx: number;
  tileSymbol: string;
  isFlippedX: boolean;
};
export type QS<E> = E | null | undefined;
export interface Layer {
  tiles: Record<number, Tile>;
  visible: boolean;
  name: string;
  animatedTiles: {};
  opacity: number;
}
