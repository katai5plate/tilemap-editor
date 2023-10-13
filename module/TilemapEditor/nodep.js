//@ts-check
import { RANDOM_LETTERS, TOOLS, ZOOM_LEVELS } from "../constants/enums.js";
import { any, force, tag, tagCanvas, tagInput } from "../helper.js";
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

export const setActiveTool = (toolIdx) => {
  const toolButtonsWrapper = document.getElementById("toolButtonsWrapper");
  const canvas_wrapper = document.getElementById("canvas_wrapper");

  _.mul$ACTIVE_TOOL = toolIdx;
  const actTool = tagInput(
    force(toolButtonsWrapper).querySelector(`input[id="tool${toolIdx}"]`)
  );

  if (actTool) actTool.checked = true;
  force(canvas_wrapper).setAttribute(
    "isDraggable",
    `${_.mul$ACTIVE_TOOL === TOOLS.PAN}`
  );
  draw();
};

export const updateSelection = (autoSelectTool = true) => {
  const tilesetDataSel = force(_.init$tilesetDataSel);
  const tilesetSelection = force(_.init$tilesetSelection);
  if (!_.mul$tileSets[tilesetDataSel.value]) return;
  const selected = _.mul$selection[0];
  if (!selected) return;
  const { x, y } = selected;
  const { x: endX, y: endY } = _.mul$selection[_.mul$selection.length - 1];
  const selWidth = endX - x + 1;
  const selHeight = endY - y + 1;
  _.updateSelection$selectionSize = [selWidth, selHeight];

  console.log(_.mul$tileSets[tilesetDataSel.value].tileSize);

  const tileSize = _.mul$tileSets[tilesetDataSel.value].tileSize;

  tilesetSelection.style.left = `${x * tileSize * _.mul$ZOOM}px`;
  tilesetSelection.style.top = `${y * tileSize * _.mul$ZOOM}px`;
  tilesetSelection.style.width = `${selWidth * tileSize * _.mul$ZOOM}px`;
  tilesetSelection.style.height = `${selHeight * tileSize * _.mul$ZOOM}px`;

  // Autoselect tool upon selecting a tile
  if (
    autoSelectTool &&
    ![TOOLS.BRUSH, TOOLS.RAND, TOOLS.FILL].includes(_.mul$ACTIVE_TOOL)
  )
    setActiveTool(TOOLS.BRUSH);

  // show/hide param editor

  if (force(_.init$tileDataSel).value === "frames" && _.getTile$editedEntity)
    force(_.init$objectParametersEditor).classList.add("entity");
  else force(_.init$objectParametersEditor).classList.remove("entity");
  onUpdateState();
};

export const setMouseIsTrue = (e) => {
  if (e.button === 0) {
    _.mul$isMouseDown = true;
  } else if (e.button === 1) {
    _.mul$PREV_ACTIVE_TOOL = _.mul$ACTIVE_TOOL;
    setActiveTool(TOOLS.PAN);
  }
};

export const setMouseIsFalse = (e) => {
  if (e.button === 0) {
    _.mul$isMouseDown = false;
  } else if (e.button === 1 && _.mul$ACTIVE_TOOL === TOOLS.PAN) {
    setActiveTool(_.mul$PREV_ACTIVE_TOOL);
  }
};

export const removeTile = (key) => {
  delete _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[
    key
  ];
  if (
    key in
    (_.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer]
      .animatedTiles || {})
  )
    delete _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer]
      .animatedTiles[key];
};

const addSelectedTiles = (key, tiles) => {
  const [x, y] = key.split("-");
  const tilesPatch = tiles || _.mul$selection; // tiles is opt override for selection for fancy things like random patch of tiles
  const { x: startX, y: startY } = tilesPatch[0]; // add selection override
  const selWidth = _.updateSelection$selectionSize[0];
  const selHeight = _.updateSelection$selectionSize[1];
  _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[key] =
    tilesPatch[0];
  for (let ix = 0; ix < selWidth; ix++) {
    for (let iy = 0; iy < selHeight; iy++) {
      const isFlippedX = force(
        tagInput(document.getElementById("toggleFlipX"))
      ).checked;
      const tileX = isFlippedX ? Number(x) - ix : Number(x) + ix; //placed in reverse when flipped on x
      const coordKey = `${tileX}-${Number(y) + iy}`;
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[
        coordKey
      ] = {
        ...tilesPatch.find(
          (tile) => tile.x === startX + ix && tile.y === startY + iy
        ),
        isFlippedX,
      };
    }
  }
};

export const getCurrentFrames = () =>
  _.mul$tileSets[force(_.init$tilesetDataSel).value]?.frames[
    force(_.init$tileFrameSel).value
  ];

export const getSelectedFrameCount = () => getCurrentFrames()?.frameCount || 1;

export const shouldNotAddAnimatedTile = () =>
  (force(_.init$tileDataSel).value !== "frames" &&
    getSelectedFrameCount() !== 1) ||
  Object.keys(_.mul$tileSets[force(_.init$tilesetDataSel).value]?.frames)
    .length === 0;

export const addTile = (key) => {
  if (shouldNotAddAnimatedTile()) {
    addSelectedTiles(key);
  } else {
    // if animated tile mode and has more than one frames, add/remove to animatedTiles
    if (
      !_.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer]
        .animatedTiles
    )
      _.mul$maps[_.mul$ACTIVE_MAP].layers[
        _.setLayer$currentLayer
      ].animatedTiles = {};
    const [x, y] = key.split("-");
    _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].animatedTiles[
      key
    ] = {
      ...getCurrentFrames(),
      isFlippedX: force(tagInput(document.getElementById("toggleFlipX")))
        .checked,
      layer: _.setLayer$currentLayer,
      xPos: Number(x) * _.mul$SIZE_OF_CROP,
      yPos: Number(y) * _.mul$SIZE_OF_CROP,
    };
  }
};

export const addRandomTile = (key) => {
  // TODO add probability for empty
  if (shouldNotAddAnimatedTile()) {
    _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[key] =
      _.mul$selection[Math.floor(Math.random() * _.mul$selection.length)];
  } else {
    // do the same, but add random from frames instead
    const tilesetTiles =
      _.mul$tileSets[force(_.init$tilesetDataSel).value].tileData;
    const { frameCount, tiles, width } = getCurrentFrames();
    const randOffset = Math.floor(Math.random() * frameCount);
    const randXOffsetTiles = tiles.map(
      (tile) => tilesetTiles[`${tile.x + randOffset * width}-${tile.y}`]
    );
    addSelectedTiles(key, randXOffsetTiles);
  }
};

export const fillEmptyOrSameTiles = (key) => {
  const pickedTile =
    _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[key];
  const [w, h] = [_.mul$mapTileWidth, _.mul$mapTileHeight].map(force);
  Array.from({ length: w * h }, (x, i) => i).map((tile) => {
    const x = tile % w;
    const y = Math.floor(tile / w);
    const coordKey = `${x}-${y}`;
    const filledTile =
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[
        coordKey
      ];

    if (
      pickedTile &&
      filledTile &&
      filledTile.x === pickedTile.x &&
      filledTile.y === pickedTile.y
    ) {
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[
        coordKey
      ] = _.mul$selection[0]; // Replace all clicked on tiles with selected
    } else if (
      !pickedTile &&
      !(
        coordKey in
        _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles
      )
    ) {
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[
        coordKey
      ] = _.mul$selection[0]; // when clicked on empty, replace all empty with selection
    }
  });
};

export const updateTilesetGridContainer = () => {
  const viewMode = force(_.init$tileDataSel).value;

  const tilesetData = _.mul$tileSets[force(_.init$tilesetDataSel).value];
  if (!tilesetData) return;

  const { tileCount, gridWidth, tileData, tags } = tilesetData;
  // console.log("COUNT", tileCount)
  const hideSymbols =
    !_.toggleSymbolsVisible$DISPLAY_SYMBOLS || shouldHideSymbols();
  const canvas = force(tagCanvas(document.getElementById("tilesetCanvas")));

  const img =
    _.reloadTilesets$TILESET_ELEMENTS[force(_.init$tilesetDataSel).value];

  canvas.width = img.width * _.mul$ZOOM;
  canvas.height = img.height * _.mul$ZOOM;

  const ctx = force(canvas.getContext("2d"));
  if (_.mul$ZOOM !== 1) {
    any(ctx).webkitImageSmoothingEnabled = false;
    any(ctx).mozImageSmoothingEnabled = false;
    any(ctx).msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // console.log("WIDTH EXCEEDS?", canvas.width % SIZE_OF_CROP)

  const tileSizeSeemsIncorrect = canvas.width % _.mul$SIZE_OF_CROP !== 0;
  drawGrid(
    ctx.canvas.width,
    ctx.canvas.height,
    ctx,
    _.mul$SIZE_OF_CROP * _.mul$ZOOM,
    tileSizeSeemsIncorrect ? "red" : "cyan"
  );
  Array.from({ length: tileCount }, (x, i) => i).map((tile) => {
    if (viewMode === "frames") {
      const frameData = getCurrentFrames();
      if (!frameData || Object.keys(frameData).length === 0) return;

      const { width, height, start, tiles, frameCount } = frameData;

      _.mul$selection = [...tiles];
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        _.mul$SIZE_OF_CROP * _.mul$ZOOM * (start.x + width),
        _.mul$SIZE_OF_CROP * _.mul$ZOOM * start.y,
        _.mul$SIZE_OF_CROP * _.mul$ZOOM * (width * (frameCount - 1)),
        _.mul$SIZE_OF_CROP * _.mul$ZOOM * height
      );
    } else if (!hideSymbols) {
      const x = tile % gridWidth;
      const y = Math.floor(tile / gridWidth);
      const tileKey = `${x}-${y}`;
      const innerTile =
        viewMode === ""
          ? tileData[tileKey]?.tileSymbol
          : viewMode === "frames"
          ? tile
          : tags[viewMode]?.tiles[tileKey]?.mark || "-";

      ctx.fillStyle = "white";
      ctx.font = "11px arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.lineWidth = 2;
      const posX =
        x * _.mul$SIZE_OF_CROP * _.mul$ZOOM +
        (_.mul$SIZE_OF_CROP * _.mul$ZOOM) / 3;
      const posY =
        y * _.mul$SIZE_OF_CROP * _.mul$ZOOM +
        (_.mul$SIZE_OF_CROP * _.mul$ZOOM) / 2;
      ctx.fillText(innerTile, posX, posY);
    }
  });
};

export const selectMode = (mode = null) => {
  if (mode !== null) force(_.init$tileDataSel).value = mode;
  force(document.getElementById("tileFrameSelContainer")).style.display =
    force(_.init$tileDataSel).value === "frames" ? "flex" : "none";
  // tilesetContainer.style.top = tileDataSel.value === "frames" ? "45px" : "0";
  updateTilesetGridContainer();
};

export const downloadAsTextFile = (input, fileName = "tilemap-editor.json") => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(
      typeof input === "string" ? input : JSON.stringify(input)
    );
  const dlAnchorElem = force(document.getElementById("downloadAnchorElem"));
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", fileName);
  dlAnchorElem.click();
};

export const getTilesAnalisis = (ctx, width, height, sizeOfTile) => {
  const analizedTiles = {};
  let uuid = 0;
  for (let y = 0; y < height; y += sizeOfTile) {
    for (let x = 0; x < width; x += sizeOfTile) {
      // console.log(x, y);
      const tileData = ctx.getImageData(x, y, sizeOfTile, sizeOfTile);
      const index = tileData.data.toString();
      if (analizedTiles[index]) {
        analizedTiles[index].coords.push({ x: x, y: y });
        analizedTiles[index].times++;
      } else {
        analizedTiles[index] = {
          uuid: uuid++,
          coords: [{ x: x, y: y }],
          times: 1,
          tileData: tileData,
        };
      }
    }
  }
  const uniqueTiles = Object.values(analizedTiles).length - 1;
  // console.log("TILES:", {analizedTiles, uniqueTiles})
  return { analizedTiles, uniqueTiles };
};

export const updateMapSize = (size) => {
  const [mapTileWidth, mapTileHeight] = [
    _.mul$mapTileWidth,
    _.mul$mapTileHeight,
  ].map(force);
  if (size?.mapWidth && size?.mapWidth > 1) {
    _.mul$mapTileWidth = size?.mapWidth;
    _.mul$WIDTH = mapTileWidth * _.mul$SIZE_OF_CROP * _.mul$ZOOM;
    _.mul$maps[_.mul$ACTIVE_MAP].mapWidth = mapTileWidth;
    force(
      tag(document.querySelector(".canvas_resizer[resizerdir='x']"))
      // ).style = `left:${_.mul$WIDTH}px`;
    ).style.left = `${_.mul$WIDTH}px`;
    force(
      tagInput(document.querySelector(".canvas_resizer[resizerdir='x'] input"))
    ).value = String(mapTileWidth);
    force(tagInput(document.getElementById("canvasWidthInp"))).value =
      String(mapTileWidth);
  }
  if (size?.mapHeight && size?.mapHeight > 1) {
    _.mul$mapTileHeight = size?.mapHeight;
    _.mul$HEIGHT = mapTileHeight * _.mul$SIZE_OF_CROP * _.mul$ZOOM;
    _.mul$maps[_.mul$ACTIVE_MAP].mapHeight = mapTileHeight;
    force(
      tag(document.querySelector(".canvas_resizer[resizerdir='y']"))
      // ).style = `top:${_.mul$HEIGHT}px`;
    ).style.top = `${_.mul$HEIGHT}px`;
    force(
      tagInput(document.querySelector(".canvas_resizer[resizerdir='y'] input"))
    ).value = String(mapTileHeight);
    force(tagInput(document.getElementById("canvasHeightInp"))).value =
      String(mapTileHeight);
  }
  draw();
};

export const clearUndoStack = () => {
  _.clearUndoStack$undoStack = [];
  _.mul$undoStepPosition = -1;
};

export const addToUndoStack = () => {
  if (
    Object.keys(_.mul$tileSets).length === 0 ||
    Object.keys(_.mul$maps).length === 0
  )
    return;
  const oldState =
    _.clearUndoStack$undoStack.length > 0
      ? JSON.stringify({
          maps: _.clearUndoStack$undoStack[_.mul$undoStepPosition].maps,
          tileSets: _.clearUndoStack$undoStack[_.mul$undoStepPosition].tileSets,
          currentLayer:
            _.clearUndoStack$undoStack[_.mul$undoStepPosition].currentLayer,
          ACTIVE_MAP:
            _.clearUndoStack$undoStack[_.mul$undoStepPosition].ACTIVE_MAP,
          IMAGES: _.clearUndoStack$undoStack[_.mul$undoStepPosition].IMAGES,
        })
      : undefined;
  const newState = JSON.stringify({
    maps: _.mul$maps,
    tileSets: _.mul$tileSets,
    currentLayer: _.setLayer$currentLayer,
    ACTIVE_MAP: _.mul$ACTIVE_MAP,
    IMAGES: _.mul$IMAGES,
  });
  if (newState === oldState) return; // prevent updating when no changes are present in the data!

  _.mul$undoStepPosition += 1;
  _.clearUndoStack$undoStack.length = _.mul$undoStepPosition;
  _.clearUndoStack$undoStack.push(
    JSON.parse(
      JSON.stringify({
        maps: _.mul$maps,
        tileSets: _.mul$tileSets,
        currentLayer: _.setLayer$currentLayer,
        ACTIVE_MAP: _.mul$ACTIVE_MAP,
        IMAGES: _.mul$IMAGES,
        undoStepPosition: _.mul$undoStepPosition,
      })
    )
  );
  // console.log("undo stack updated", undoStack, undoStepPosition)
};

export const updateZoom = () => {
  const [tilesetImage, tilesetContainer] = [
    force(_.init$tilesetImage),
    force(_.init$tilesetContainer),
  ];
  // tilesetImage.style = `transform: scale(${_.mul$ZOOM});transform-origin: left top;image-rendering: auto;image-rendering: crisp-edges;image-rendering: pixelated;`;
  tilesetImage.setAttribute(
    "style",
    `transform: scale(${_.mul$ZOOM});transform-origin: left top;image-rendering: auto;image-rendering: crisp-edges;image-rendering: pixelated;`
  );
  tilesetContainer.style.width = `${tilesetImage.width * _.mul$ZOOM}px`;
  tilesetContainer.style.height = `${tilesetImage.height * _.mul$ZOOM}px`;
  force(document.getElementById("zoomLabel")).innerText = `${_.mul$ZOOM}x`;
  updateTilesetGridContainer();
  updateSelection(false);
  updateMapSize({
    mapWidth: _.mul$mapTileWidth,
    mapHeight: _.mul$mapTileHeight,
  });
  _.mul$WIDTH = force(_.mul$mapTileWidth) * _.mul$SIZE_OF_CROP * _.mul$ZOOM; // needed when setting zoom?
  _.mul$HEIGHT = force(_.mul$mapTileHeight) * _.mul$SIZE_OF_CROP * _.mul$ZOOM;
  _.mul$zoomIndex =
    ZOOM_LEVELS.indexOf(_.mul$ZOOM) === -1
      ? 0
      : ZOOM_LEVELS.indexOf(_.mul$ZOOM);
};

export const getCurrentAnimation = (getAnim) =>
  _.mul$tileSets[force(_.init$tilesetDataSel).value]?.frames[
    force(_.init$tileFrameSel).value
  ]?.animations?.[getAnim || force(_.init$tileAnimSel).value];

export const updateTilesetDataList = (populateFrames = false) => {
  const populateWithOptions = (selectEl, options, newContent) => {
    if (!options) return;
    const value = selectEl.value + "";
    selectEl.innerHTML = newContent;
    Object.keys(options).forEach((opt) => {
      const newOption = document.createElement("option");
      newOption.innerText = opt;
      newOption.value = opt;
      selectEl.appendChild(newOption);
    });
    if (
      value in options ||
      (["", "frames", "animations"].includes(value) && !populateFrames)
    )
      selectEl.value = value;
  };

  const tilesetDataSel = force(_.init$tilesetDataSel);

  if (!populateFrames)
    populateWithOptions(
      _.init$tileDataSel,
      _.mul$tileSets[tilesetDataSel.value]?.tags,
      `<option value="">Symbols (${
        _.mul$tileSets[tilesetDataSel.value]?.tileCount || "?"
      })</option><option value="frames">Objects</option>`
    );
  else {
    populateWithOptions(
      _.init$tileFrameSel,
      _.mul$tileSets[tilesetDataSel.value]?.frames,
      ""
    );
    populateWithOptions(
      _.init$tileAnimSel,
      _.mul$tileSets[tilesetDataSel.value]?.frames[
        force(_.init$tileFrameSel).value
      ]?.animations,
      ""
    );
  }

  force(tagInput(document.getElementById("tileFrameCount"))).value =
    getCurrentFrames()?.frameCount || 1;
  const currentAnim = getCurrentAnimation();
  // FIXME: ???
  //@ts-ignore
  _.state$el.animStart().max = _.state$el.tileFrameCount().value;
  //@ts-ignore
  _.state$el.animEnd().max = _.state$el.tileFrameCount().value;
  if (currentAnim) {
    console.log({ currentAnim });
    //@ts-ignore
    _.state$el.animStart().value = currentAnim.start || 1;
    //@ts-ignore
    _.state$el.animEnd().value = currentAnim.end || 1;
    //@ts-ignore
    _.state$el.animLoop().checked = currentAnim.loop || false;
    //@ts-ignore
    _.state$el.animSpeed().value = currentAnim.speed || 1;
  }
};

export const reevaluateTilesetsData = () => {
  let symbolStartIdx = 0;
  Object.entries(_.mul$tileSets).forEach(([key, old]) => {
    const tileData = {};
    // console.log("OLD DATA",old)
    const tileSize = old.tileSize || _.mul$SIZE_OF_CROP;
    const gridWidth = Math.ceil(old.width / tileSize);
    const gridHeight = Math.ceil(old.height / tileSize);
    const tileCount = gridWidth * gridHeight;

    Array.from({ length: tileCount }, (x, i) => i).map((tile) => {
      const x = tile % gridWidth;
      const y = Math.floor(tile / gridWidth);
      const oldTileData = old?.[`${x}-${y}`]?.tileData;
      const tileSymbol = RANDOM_LETTERS[Math.floor(symbolStartIdx + tile)];
      tileData[`${x}-${y}`] = {
        ...oldTileData,
        x,
        y,
        tilesetIdx: key,
        tileSymbol,
      };
      _.mul$tileSets[key] = {
        ...old,
        tileSize,
        gridWidth,
        gridHeight,
        tileCount,
        symbolStartIdx,
        tileData,
      };
    });
    // if (key === 0) {
    //   // console.log({gridWidth,gridHeight,tileCount, tileSize})
    // }
    symbolStartIdx += tileCount;
  });
  // console.log("UPDATED TSETS", tileSets)
};

export const setCropSize = (newSize) => {
  if (
    newSize === _.mul$SIZE_OF_CROP &&
    force(_.init$cropSize).value === newSize
  )
    return;
  _.mul$tileSets[force(_.init$tilesetDataSel).value].tileSize = newSize;
  _.mul$IMAGES.forEach((ts, idx) => {
    if (ts.src === force(_.init$tilesetImage).src)
      _.mul$IMAGES[idx].tileSize = newSize;
  });
  _.mul$SIZE_OF_CROP = newSize;
  force(_.init$cropSize).value = `${_.mul$SIZE_OF_CROP}`;
  force(
    tagInput(document.getElementById("gridCropSize"))
  ).value = `${_.mul$SIZE_OF_CROP}`;
  // console.log("NEW SIZE", tilesetDataSel.value,tileSets[tilesetDataSel.value], newSize,ACTIVE_MAP, maps)
  updateZoom();
  updateTilesetGridContainer();
  // console.log(tileSets, IMAGES)
  reevaluateTilesetsData();
  updateTilesetDataList();
  draw();
};
