//@ts-check
import { getEmptyLayer } from "./utils";

export const getEmptyMap = (
  { SIZE_OF_CROP },
  name = "map",
  mapWidth = 20,
  mapHeight = 20,
  tileSize = 32,
  gridColor = "#00FFFF"
) => ({
  layers: [
    getEmptyLayer("bottom"),
    getEmptyLayer("middle"),
    getEmptyLayer("top"),
  ],
  name,
  mapWidth,
  mapHeight,
  tileSize,
  width: mapWidth * SIZE_OF_CROP,
  height: mapHeight * SIZE_OF_CROP,
  gridColor,
});
