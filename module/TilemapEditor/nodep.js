//@ts-check
import { any, force } from "../helper.js";
import _ from "./state.js";
import { drawGrid, getEmptyLayer } from "./utils.js";

export const getEmptyMap = (
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
  width: mapWidth * _.mul$SIZE_OF_CROP,
  height: mapHeight * _.mul$SIZE_OF_CROP,
  gridColor,
});

export const getTileData = (x = NaN, y = NaN) => {
  const tilesetTiles =
    _.mul$tileSets[force(_.init$tilesetDataSel).value].tileData;
  let data;
  if (Number.isNaN(x) && Number.isNaN(y)) {
    const { x: sx, y: sy } = _.mul$selection[0];
    return tilesetTiles[`${sx}-${sy}`];
  } else {
    data = tilesetTiles[`${x}-${y}`];
  }
  return data;
};

export const shouldHideSymbols = () =>
  _.mul$SIZE_OF_CROP < 10 && _.mul$ZOOM < 2;

export const getAppState = () => {
  // TODO we need for tilesets to load - rapidly refreshing the browser may return empty tilesets object!
  if (
    Object.keys(_.mul$tileSets).length === 0 &&
    _.mul$tileSets.constructor === Object
  )
    return null;
  return {
    tileMapData: { tileSets: _.mul$tileSets, maps: _.mul$maps },
    appState: {
      undoStack: _.clearUndoStack$undoStack,
      undoStepPosition: _.mul$undoStepPosition,
      currentLayer: _.setLayer$currentLayer,
      PREV_ACTIVE_TOOL: _.mul$PREV_ACTIVE_TOOL,
      ACTIVE_TOOL: _.mul$ACTIVE_TOOL,
      ACTIVE_MAP: _.mul$ACTIVE_MAP,
      SHOW_GRID: _.init$SHOW_GRID,
      selection: _.mul$selection,
    },
    //Todo tileSize and the others
    // undo stack is lost
  };
};
export const onUpdateState = () => {
  _.init$apiOnUpdateCallback(getAppState());
};

export const draw = (shouldDrawGrid = true) => {
  const ctx = force(force(_.init$canvas).getContext("2d"));
  ctx.clearRect(0, 0, _.mul$WIDTH, _.mul$HEIGHT);
  ctx.canvas.width = _.mul$WIDTH;
  ctx.canvas.height = _.mul$HEIGHT;
  if (shouldDrawGrid && !_.init$SHOW_GRID)
    drawGrid(
      _.mul$WIDTH,
      _.mul$HEIGHT,
      ctx,
      _.mul$SIZE_OF_CROP * _.mul$ZOOM,
      _.mul$maps[_.mul$ACTIVE_MAP].gridColor
    );
  const shouldHideHud = shouldHideSymbols();

  _.mul$maps[_.mul$ACTIVE_MAP].layers.forEach((layer) => {
    if (!layer.visible) return;
    ctx.globalAlpha = layer.opacity;
    if (_.mul$ZOOM !== 1) {
      any(ctx).webkitImageSmoothingEnabled = false;
      any(ctx).mozImageSmoothingEnabled = false;
      any(ctx).msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    }
    //static tiles on this layer
    Object.keys(layer.tiles).forEach((key) => {
      const [positionX, positionY] = key.split("-").map(Number);
      const { x, y, tilesetIdx, isFlippedX } = layer.tiles[key];
      const tileSize =
        _.mul$tileSets[tilesetIdx]?.tileSize || _.mul$SIZE_OF_CROP;

      if (!(tilesetIdx in _.reloadTilesets$TILESET_ELEMENTS)) {
        //texture not found
        ctx.fillStyle = "red";
        ctx.fillRect(
          positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM
        );
        return;
      }
      if (isFlippedX) {
        ctx.save(); //Special canvas crap to flip a slice, cause drawImage cant do it
        ctx.translate(ctx.canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(
          _.reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize,
          ctx.canvas.width -
            positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM -
            _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          _.reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize,
          positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM
        );
      }
    });
    // animated tiles
    Object.keys(layer.animatedTiles || {}).forEach((key) => {
      const [positionX, positionY] = key.split("-").map(Number);
      const { start, width, height, frameCount, isFlippedX } =
        layer.animatedTiles[key];
      const { x, y, tilesetIdx } = start;
      const tileSize =
        _.mul$tileSets[tilesetIdx]?.tileSize || _.mul$SIZE_OF_CROP;

      if (!(tilesetIdx in _.reloadTilesets$TILESET_ELEMENTS)) {
        //texture not found
        ctx.fillStyle = "yellow";
        ctx.fillRect(
          positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM * width,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM * height
        );
        ctx.fillStyle = "blue";
        ctx.fillText(
          "X",
          positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM + 5,
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM + 10
        );
        return;
      }
      const frameIndex =
        force(_.init$tileDataSel).value === "frames" || frameCount === 1
          ? Math.round(Date.now() / 120) % frameCount
          : 1; //30fps

      if (isFlippedX) {
        ctx.save(); //Special canvas crap to flip a slice, cause drawImage cant do it
        ctx.translate(ctx.canvas.width, 0);
        ctx.scale(-1, 1);

        const positionXFlipped =
          ctx.canvas.width -
          positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM -
          _.mul$SIZE_OF_CROP * _.mul$ZOOM;
        if (shouldDrawGrid && !shouldHideHud) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(250,240,255, 0.7)";
          ctx.rect(
            positionXFlipped,
            positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
            _.mul$SIZE_OF_CROP * _.mul$ZOOM * width,
            _.mul$SIZE_OF_CROP * _.mul$ZOOM * height
          );
          ctx.stroke();
        }
        ctx.drawImage(
          _.reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
          x * tileSize + frameIndex * tileSize * width,
          y * tileSize,
          tileSize * width, // src width
          tileSize * height, // src height
          positionXFlipped,
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM, //target y
          _.mul$SIZE_OF_CROP * _.mul$ZOOM * width, // target width
          _.mul$SIZE_OF_CROP * _.mul$ZOOM * height // target height
        );
        if (shouldDrawGrid && !shouldHideHud) {
          ctx.fillStyle = "white";
          ctx.fillText(
            "🔛",
            positionXFlipped + 5,
            positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM + 10
          );
        }
        ctx.restore();
      } else {
        if (shouldDrawGrid && !shouldHideHud) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(250,240,255, 0.7)";
          ctx.rect(
            positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
            positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM,
            _.mul$SIZE_OF_CROP * _.mul$ZOOM * width,
            _.mul$SIZE_OF_CROP * _.mul$ZOOM * height
          );
          ctx.stroke();
        }
        ctx.drawImage(
          _.reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
          x * tileSize + frameIndex * tileSize * width, //src x
          y * tileSize, //src y
          tileSize * width, // src width
          tileSize * height, // src height
          positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM, //target x
          positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM, //target y
          _.mul$SIZE_OF_CROP * _.mul$ZOOM * width, // target width
          _.mul$SIZE_OF_CROP * _.mul$ZOOM * height // target height
        );
        if (shouldDrawGrid && !shouldHideHud) {
          ctx.fillStyle = "white";
          ctx.fillText(
            "⭕",
            positionX * _.mul$SIZE_OF_CROP * _.mul$ZOOM + 5,
            positionY * _.mul$SIZE_OF_CROP * _.mul$ZOOM + 10
          );
        }
      }
    });
  });
  if (_.init$SHOW_GRID)
    drawGrid(
      _.mul$WIDTH,
      _.mul$HEIGHT,
      ctx,
      _.mul$SIZE_OF_CROP * _.mul$ZOOM,
      _.mul$maps[_.mul$ACTIVE_MAP].gridColor
    );
  onUpdateState();
};

export const getSelectedTile = (event) => {
  const { x, y } = event.target.getBoundingClientRect();
  const tileSize =
    _.mul$tileSets[force(_.init$tilesetDataSel).value].tileSize * _.mul$ZOOM;
  const tx = Math.floor(Math.max(event.clientX - x, 0) / tileSize);
  const ty = Math.floor(Math.max(event.clientY - y, 0) / tileSize);
  // add start tile, add end tile, add all tiles inbetween
  const newSelection = [];
  if (_.init$tileSelectStart !== null) {
    for (let ix = _.init$tileSelectStart.x; ix < tx + 1; ix++) {
      for (let iy = _.init$tileSelectStart.y; iy < ty + 1; iy++) {
        const data = getTileData(ix, iy);
        newSelection.push({ ...data, x: ix, y: iy });
      }
    }
  }
  if (newSelection.length > 0) return newSelection;

  const data = getTileData(tx, ty);
  return [{ ...data, x: tx, y: ty }];
};
