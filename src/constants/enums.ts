export const TOOLS = {
  BRUSH: 0,
  ERASE: 1,
  PAN: 2,
  PICK: 3,
  RAND: 4,
  FILL: 5,
};

export const RANDOM_LETTERS = new Array(10680)
  .fill(1)
  .map((_, i) => String.fromCharCode(165 + i));

export const ZOOM_LEVELS = [0.25, 0.5, 1, 2, 3, 4];
