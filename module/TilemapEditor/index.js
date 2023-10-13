import { tilemapEditorRootHTML } from "../constants/html.js";
import {
  toBase64,
  drawGrid,
  decoupleReferenceFromObj,
  getEmptyLayer,
} from "./utils.js";
import _ from "./state.js";
import { setLayer, updateLayers, updateTilesetGridContainer } from "./dep.js";
import {
  getEmptyMap,
  getTileData,
  getAppState,
  draw,
  getSelectedTile,
  setActiveTool,
  updateSelection,
} from "./nodep.js";
import { TOOLS } from "../constants/enums.js";

const main = function (exports) {
  exports.toBase64 = toBase64;

  Object.keys(_.state$el).forEach((key) => {
    _.state$el[key] = () => document.getElementById(key);
  });

  const RANDOM_LETTERS = new Array(10680)
    .fill(1)
    .map((_, i) => String.fromCharCode(165 + i));

  const setMouseIsTrue = (e) => {
    if (e.button === 0) {
      _.mul$isMouseDown = true;
    } else if (e.button === 1) {
      _.mul$PREV_ACTIVE_TOOL = _.mul$ACTIVE_TOOL;
      setActiveTool(TOOLS.PAN);
    }
  };

  const setMouseIsFalse = (e) => {
    if (e.button === 0) {
      _.mul$isMouseDown = false;
    } else if (e.button === 1 && _.mul$ACTIVE_TOOL === TOOLS.PAN) {
      setActiveTool(_.mul$PREV_ACTIVE_TOOL);
    }
  };

  const removeTile = (key) => {
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

  const isFlippedOnX = () => document.getElementById("toggleFlipX").checked;
  const addSelectedTiles = (key, tiles) => {
    const [x, y] = key.split("-");
    const tilesPatch = tiles || _.mul$selection; // tiles is opt override for selection for fancy things like random patch of tiles
    const { x: startX, y: startY } = tilesPatch[0]; // add selection override
    const selWidth = _.updateSelection$selectionSize[0];
    const selHeight = _.updateSelection$selectionSize[1];
    _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[key] =
      tilesPatch[0];
    const isFlippedX = isFlippedOnX();
    for (let ix = 0; ix < selWidth; ix++) {
      for (let iy = 0; iy < selHeight; iy++) {
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
  const getCurrentFrames = () =>
    _.mul$tileSets[_.init$tilesetDataSel.value]?.frames[
      _.init$tileFrameSel.value
    ];
  const getSelectedFrameCount = () => getCurrentFrames()?.frameCount || 1;
  const shouldNotAddAnimatedTile = () =>
    (_.init$tileDataSel.value !== "frames" && getSelectedFrameCount() !== 1) ||
    Object.keys(_.mul$tileSets[_.init$tilesetDataSel.value]?.frames).length ===
      0;
  const addTile = (key) => {
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
      const isFlippedX = isFlippedOnX();
      const [x, y] = key.split("-");
      _.mul$maps[_.mul$ACTIVE_MAP].layers[
        _.setLayer$currentLayer
      ].animatedTiles[key] = {
        ...getCurrentFrames(),
        isFlippedX,
        layer: _.setLayer$currentLayer,
        xPos: Number(x) * _.mul$SIZE_OF_CROP,
        yPos: Number(y) * _.mul$SIZE_OF_CROP,
      };
    }
  };

  const addRandomTile = (key) => {
    // TODO add probability for empty
    if (shouldNotAddAnimatedTile()) {
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[key] =
        _.mul$selection[Math.floor(Math.random() * _.mul$selection.length)];
    } else {
      // do the same, but add random from frames instead
      const tilesetTiles = _.mul$tileSets[_.init$tilesetDataSel.value].tileData;
      const { frameCount, tiles, width } = getCurrentFrames();
      const randOffset = Math.floor(Math.random() * frameCount);
      const randXOffsetTiles = tiles.map(
        (tile) => tilesetTiles[`${tile.x + randOffset * width}-${tile.y}`]
      );
      addSelectedTiles(key, randXOffsetTiles);
    }
  };

  const fillEmptyOrSameTiles = (key) => {
    const pickedTile =
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].tiles[key];
    Array.from(
      { length: _.mul$mapTileWidth * _.mul$mapTileHeight },
      (x, i) => i
    ).map((tile) => {
      const x = tile % _.mul$mapTileWidth;
      const y = Math.floor(tile / _.mul$mapTileWidth);
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

  const selectMode = (mode = null) => {
    if (mode !== null) _.init$tileDataSel.value = mode;
    document.getElementById("tileFrameSelContainer").style.display =
      _.init$tileDataSel.value === "frames" ? "flex" : "none";
    // tilesetContainer.style.top = tileDataSel.value ===  "frames" ? "45px" : "0";
    updateTilesetGridContainer({ drawGrid, getCurrentFrames });
  };
  const getTile = (key, allLayers = false) => {
    const layers = _.mul$maps[_.mul$ACTIVE_MAP].layers;
    _.getTile$editedEntity = undefined;
    const clicked = allLayers
      ? [...layers].reverse().find((layer, index) => {
          if (layer.animatedTiles && key in layer.animatedTiles) {
            setLayer(
              {
                currentLayer: _.setLayer$currentLayer,
                maps: _.mul$maps,
                ACTIVE_MAP: _.mul$ACTIVE_MAP,
                addToUndoStack,
                updateLayers,
              },
              layers.length - index - 1
            );
            _.getTile$editedEntity = layer.animatedTiles[key];
          }
          if (key in layer.tiles) {
            setLayer(
              {
                currentLayer: _.setLayer$currentLayer,
                maps: _.mul$maps,
                ACTIVE_MAP: _.mul$ACTIVE_MAP,
                addToUndoStack,
                updateLayers,
              },
              layers.length - index - 1
            );
            return layer.tiles[key];
          }
        })?.tiles[key] //TODO this doesnt work on animatedTiles
      : layers[_.setLayer$currentLayer].tiles[key];

    if (clicked && !_.getTile$editedEntity) {
      _.mul$selection = [clicked];

      // console.log("clicked", clicked, "entity data",editedEntity)
      document.getElementById("toggleFlipX").checked = !!clicked?.isFlippedX;
      // TODO switch to different tileset if its from a different one
      // if(clicked.tilesetIdx !== tilesetDataSel.value) {
      //     tilesetDataSel.value = clicked.tilesetIdx;
      //     reloadTilesets();
      //     updateTilesetGridContainer({ drawGrid, getCurrentFrames });
      // }
      selectMode("");
      updateSelection();
      return true;
    } else if (_.getTile$editedEntity) {
      // console.log("Animated tile found", editedEntity)
      _.mul$selection = _.getTile$editedEntity.tiles;
      document.getElementById("toggleFlipX").checked =
        _.getTile$editedEntity.isFlippedX;
      setLayer(
        {
          currentLayer: _.setLayer$currentLayer,
          maps: _.mul$maps,
          ACTIVE_MAP: _.mul$ACTIVE_MAP,
          addToUndoStack,
          updateLayers,
        },
        _.getTile$editedEntity.layer
      );
      _.init$tileFrameSel.value = _.getTile$editedEntity.name;
      updateSelection();
      selectMode("frames");
      return true;
    } else {
      return false;
    }
  };

  const toggleTile = (event) => {
    if (
      _.mul$ACTIVE_TOOL === TOOLS.PAN ||
      !_.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].visible
    )
      return;

    const { x, y } = getSelectedTile(event)[0];
    const key = `${x}-${y}`;

    // console.log(event.button)
    if (event.shiftKey) {
      removeTile(key);
    } else if (
      event.ctrlKey ||
      event.button === 2 ||
      _.mul$ACTIVE_TOOL === TOOLS.PICK
    ) {
      const pickedTile = getTile(key, true);
      if (_.mul$ACTIVE_TOOL === TOOLS.BRUSH && !pickedTile)
        setActiveTool(TOOLS.ERASE);
      //picking empty tile, sets tool to eraser
      else if (
        _.mul$ACTIVE_TOOL === TOOLS.FILL ||
        _.mul$ACTIVE_TOOL === TOOLS.RAND
      )
        setActiveTool(TOOLS.BRUSH); //
    } else {
      if (_.mul$ACTIVE_TOOL === TOOLS.BRUSH) {
        addTile(key); // also works with animated
      } else if (_.mul$ACTIVE_TOOL === TOOLS.ERASE) {
        removeTile(key); // also works with animated
      } else if (_.mul$ACTIVE_TOOL === TOOLS.RAND) {
        addRandomTile(key);
      } else if (_.mul$ACTIVE_TOOL === TOOLS.FILL) {
        fillEmptyOrSameTiles(key);
      }
    }
    draw();
    addToUndoStack();
  };

  const clearCanvas = () => {
    addToUndoStack();
    _.mul$maps[_.mul$ACTIVE_MAP].layers = [
      getEmptyLayer("bottom"),
      getEmptyLayer("middle"),
      getEmptyLayer("top"),
    ];
    setLayer(
      {
        currentLayer: _.setLayer$currentLayer,
        maps: _.mul$maps,
        ACTIVE_MAP: _.mul$ACTIVE_MAP,
        addToUndoStack,
        updateLayers,
      },
      0
    );
    updateLayers({
      maps: _.mul$maps,
      ACTIVE_MAP: _.mul$ACTIVE_MAP,
      currentLayer: _.setLayer$currentLayer,
      layersElement: _.init$layersElement,
      addToUndoStack,
    });
    draw();
    addToUndoStack();
  };

  const downloadAsTextFile = (input, fileName = "tilemap-editor.json") => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        typeof input === "string" ? input : JSON.stringify(input)
      );
    const dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", fileName);
    dlAnchorElem.click();
  };
  const exportJson = () => {
    downloadAsTextFile({ tileSets: _.mul$tileSets, maps: _.mul$maps });
  };

  const exportImage = () => {
    draw(false);
    const data = _.init$canvas.toDataURL();
    const image = new Image();
    image.src = data;
    image.crossOrigin = "anonymous";
    const w = window.open("");
    w.document.write(image.outerHTML);
    draw();
  };

  const getTilesAnalisis = (ctx, width, height, sizeOfTile) => {
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
  const drawAnaliticsReport = () => {
    const prevZoom = _.mul$ZOOM;
    _.mul$ZOOM = 1; // needed for correct eval
    updateZoom();
    draw(false);
    const { analizedTiles, uniqueTiles } = getTilesAnalisis(
      _.init$canvas.getContext("2d"),
      _.mul$WIDTH,
      _.mul$HEIGHT,
      _.mul$SIZE_OF_CROP
    );
    const data = _.init$canvas.toDataURL();
    const image = new Image();
    image.src = data;
    const ctx = _.init$canvas.getContext("2d");
    _.mul$ZOOM = prevZoom;
    updateZoom();
    draw(false);
    Object.values(analizedTiles).map((t) => {
      // Fill the heatmap
      t.coords.forEach((c, i) => {
        const fillStyle = `rgba(255, 0, 0, ${1 / t.times - 0.35})`;
        ctx.fillStyle = fillStyle;
        ctx.fillRect(
          c.x * _.mul$ZOOM,
          c.y * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM,
          _.mul$SIZE_OF_CROP * _.mul$ZOOM
        );
      });
    });
    drawGrid(
      _.mul$WIDTH,
      _.mul$HEIGHT,
      ctx,
      _.mul$SIZE_OF_CROP * _.mul$ZOOM,
      "rgba(255,213,0,0.5)"
    );
    ctx.fillStyle = "white";
    ctx.font = "bold 17px arial";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.lineWidth = 3;
    ctx.fillText(`Unique tiles: ${uniqueTiles}`, 4, _.mul$HEIGHT - 30);
    ctx.fillText(
      `Map size: ${_.mul$mapTileWidth}x${_.mul$mapTileHeight}`,
      4,
      _.mul$HEIGHT - 10
    );
  };
  const exportUniqueTiles = () => {
    const ctx = _.init$canvas.getContext("2d");
    const prevZoom = _.mul$ZOOM;
    _.mul$ZOOM = 1; // needed for correct eval
    updateZoom();
    draw(false);
    const { analizedTiles } = getTilesAnalisis(
      _.init$canvas.getContext("2d"),
      _.mul$WIDTH,
      _.mul$HEIGHT,
      _.mul$SIZE_OF_CROP
    );
    ctx.clearRect(0, 0, _.mul$WIDTH, _.mul$HEIGHT);
    const gridWidth = _.init$tilesetImage.width / _.mul$SIZE_OF_CROP;
    Object.values(analizedTiles).map((t, i) => {
      const positionX = i % gridWidth;
      const positionY = Math.floor(i / gridWidth);
      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = _.mul$SIZE_OF_CROP;
      tileCanvas.height = _.mul$SIZE_OF_CROP;
      const tileCtx = tileCanvas.getContext("2d");
      tileCtx.putImageData(t.tileData, 0, 0);
      ctx.drawImage(
        tileCanvas,
        0,
        0,
        _.mul$SIZE_OF_CROP,
        _.mul$SIZE_OF_CROP,
        positionX * _.mul$SIZE_OF_CROP,
        positionY * _.mul$SIZE_OF_CROP,
        _.mul$SIZE_OF_CROP,
        _.mul$SIZE_OF_CROP
      );
    });
    const data = _.init$canvas.toDataURL();
    const image = new Image();
    image.src = data;
    image.crossOrigin = "anonymous";
    const w = window.open("");
    w.document.write(image.outerHTML);
    _.mul$ZOOM = prevZoom;
    updateZoom();
    draw();
  };

  exports.getLayers = () => {
    return _.mul$maps[_.mul$ACTIVE_MAP].layers;
  };

  const renameCurrentTileSymbol = () => {
    const setTileData = (x = null, y = null, newData, key = "") => {
      const tilesetTiles = _.mul$tileSets[_.init$tilesetDataSel.value].tileData;
      if (x === null && y === null) {
        const { x: sx, y: sy } = _.mul$selection[0];
        tilesetTiles[`${sx}-${sy}`] = newData;
      }
      if (key !== "") {
        tilesetTiles[`${x}-${y}`][key] = newData;
      } else {
        tilesetTiles[`${x}-${y}`] = newData;
      }
    };
    const { x, y, tileSymbol } = _.mul$selection[0];
    const newSymbol = window.prompt("Enter tile symbol", tileSymbol || "*");
    if (newSymbol !== null) {
      setTileData(x, y, newSymbol, "tileSymbol");
      updateSelection();
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
      addToUndoStack();
    }
  };

  const getFlattenedData = () => {
    const result = Object.entries(_.mul$maps).map(([key, map]) => {
      console.log({ map });
      const layers = map.layers;
      const flattenedData = Array(layers.length)
        .fill([])
        .map(() => {
          return Array(map.mapHeight)
            .fill([])
            .map((row) => {
              return Array(map.mapWidth)
                .fill([])
                .map((column) => ({
                  tile: null,
                  tileSymbol: " ", // a space is an empty tile
                }));
            });
        });
      layers.forEach((layerObj, lrIndex) => {
        Object.entries(layerObj.tiles).forEach(([key, tile]) => {
          const [x, y] = key.split("-");
          if (Number(y) < map.mapHeight && Number(x) < map.mapWidth) {
            flattenedData[lrIndex][Number(y)][Number(x)] = {
              tile,
              tileSymbol: tile.tileSymbol || "*",
            };
          }
        });
      });
      return { map: key, tileSet: map.tileSet, flattenedData };
    });
    return result;
  };
  const getExportData = () => {
    const exportData = {
      maps: _.mul$maps,
      tileSets: _.mul$tileSets,
      flattenedData: getFlattenedData(),
      activeMap: _.mul$ACTIVE_MAP,
      downloadAsTextFile,
    };
    console.log("Exported ", exportData);
    return exportData;
  };

  const updateMapSize = (size) => {
    if (size?.mapWidth && size?.mapWidth > 1) {
      _.mul$mapTileWidth = size?.mapWidth;
      _.mul$WIDTH = _.mul$mapTileWidth * _.mul$SIZE_OF_CROP * _.mul$ZOOM;
      _.mul$maps[_.mul$ACTIVE_MAP].mapWidth = _.mul$mapTileWidth;
      document.querySelector(
        ".canvas_resizer[resizerdir='x']"
      ).style = `left:${_.mul$WIDTH}px`;
      document.querySelector(".canvas_resizer[resizerdir='x'] input").value =
        String(_.mul$mapTileWidth);
      document.getElementById("canvasWidthInp").value = String(
        _.mul$mapTileWidth
      );
    }
    if (size?.mapHeight && size?.mapHeight > 1) {
      _.mul$mapTileHeight = size?.mapHeight;
      _.mul$HEIGHT = _.mul$mapTileHeight * _.mul$SIZE_OF_CROP * _.mul$ZOOM;
      _.mul$maps[_.mul$ACTIVE_MAP].mapHeight = _.mul$mapTileHeight;
      document.querySelector(
        ".canvas_resizer[resizerdir='y']"
      ).style = `top:${_.mul$HEIGHT}px`;
      document.querySelector(".canvas_resizer[resizerdir='y'] input").value =
        String(_.mul$mapTileHeight);
      document.getElementById("canvasHeightInp").value = String(
        _.mul$mapTileHeight
      );
    }
    draw();
  };

  const setActiveMap = (id) => {
    _.mul$ACTIVE_MAP = id;
    document.getElementById("gridColorSel").value =
      _.mul$maps[_.mul$ACTIVE_MAP].gridColor || "#00FFFF";
    draw();
    updateMapSize({
      mapWidth: _.mul$maps[_.mul$ACTIVE_MAP].mapWidth,
      mapHeight: _.mul$maps[_.mul$ACTIVE_MAP].mapHeight,
    });
    updateLayers({
      maps: _.mul$maps,
      ACTIVE_MAP: _.mul$ACTIVE_MAP,
      currentLayer: _.setLayer$currentLayer,
      layersElement: _.init$layersElement,
      addToUndoStack,
    });
  };

  const clearUndoStack = () => {
    _.clearUndoStack$undoStack = [];
    _.mul$undoStepPosition = -1;
  };
  const addToUndoStack = () => {
    if (
      Object.keys(_.mul$tileSets).length === 0 ||
      Object.keys(_.mul$maps).length === 0
    )
      return;
    const oldState =
      _.clearUndoStack$undoStack.length > 0
        ? JSON.stringify({
            maps: _.clearUndoStack$undoStack[_.mul$undoStepPosition].maps,
            tileSets:
              _.clearUndoStack$undoStack[_.mul$undoStepPosition].tileSets,
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
  const restoreFromUndoStackData = () => {
    _.mul$maps = decoupleReferenceFromObj(
      _.clearUndoStack$undoStack[_.mul$undoStepPosition].maps
    );
    const undoTileSets = decoupleReferenceFromObj(
      _.clearUndoStack$undoStack[_.mul$undoStepPosition].tileSets
    );
    const undoIMAGES = decoupleReferenceFromObj(
      _.clearUndoStack$undoStack[_.mul$undoStepPosition].IMAGES
    );
    if (JSON.stringify(_.mul$IMAGES) !== JSON.stringify(undoIMAGES)) {
      // images needs to happen before tilesets
      _.mul$IMAGES = undoIMAGES;
      reloadTilesets();
    }
    if (JSON.stringify(undoTileSets) !== JSON.stringify(_.mul$tileSets)) {
      // done to prevent the below, which is expensive
      _.mul$tileSets = undoTileSets;
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    }
    _.mul$tileSets = undoTileSets;
    updateTilesetDataList();

    const undoLayer = decoupleReferenceFromObj(
      _.clearUndoStack$undoStack[_.mul$undoStepPosition].currentLayer
    );
    const undoActiveMap = decoupleReferenceFromObj(
      _.clearUndoStack$undoStack[_.mul$undoStepPosition].ACTIVE_MAP
    );
    if (undoActiveMap !== _.mul$ACTIVE_MAP) {
      setActiveMap(undoActiveMap);
      updateMaps();
    }
    updateLayers({
      maps: _.mul$maps,
      ACTIVE_MAP: _.mul$ACTIVE_MAP,
      currentLayer: _.setLayer$currentLayer,
      layersElement: _.init$layersElement,
      addToUndoStack,
    }); // needs to happen after active map is set and maps are updated
    setLayer(
      {
        currentLayer: _.setLayer$currentLayer,
        maps: _.mul$maps,
        ACTIVE_MAP: _.mul$ACTIVE_MAP,
        addToUndoStack,
        updateLayers,
      },
      undoLayer
    );
    draw();
  };
  const undo = () => {
    if (_.mul$undoStepPosition === 0) return;
    _.mul$undoStepPosition -= 1;
    restoreFromUndoStackData();
  };
  const redo = () => {
    if (_.mul$undoStepPosition === _.clearUndoStack$undoStack.length - 1)
      return;
    _.mul$undoStepPosition += 1;
    restoreFromUndoStackData();
  };
  const zoomLevels = [0.25, 0.5, 1, 2, 3, 4];

  const updateZoom = () => {
    _.init$tilesetImage.style = `transform: scale(${_.mul$ZOOM});transform-origin: left top;image-rendering: auto;image-rendering: crisp-edges;image-rendering: pixelated;`;
    _.init$tilesetContainer.style.width = `${
      _.init$tilesetImage.width * _.mul$ZOOM
    }px`;
    _.init$tilesetContainer.style.height = `${
      _.init$tilesetImage.height * _.mul$ZOOM
    }px`;
    document.getElementById("zoomLabel").innerText = `${_.mul$ZOOM}x`;
    updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    updateSelection(false);
    updateMapSize({
      mapWidth: _.mul$mapTileWidth,
      mapHeight: _.mul$mapTileHeight,
    });
    _.mul$WIDTH = _.mul$mapTileWidth * _.mul$SIZE_OF_CROP * _.mul$ZOOM; // needed when setting zoom?
    _.mul$HEIGHT = _.mul$mapTileHeight * _.mul$SIZE_OF_CROP * _.mul$ZOOM;
    _.mul$zoomIndex =
      zoomLevels.indexOf(_.mul$ZOOM) === -1
        ? 0
        : zoomLevels.indexOf(_.mul$ZOOM);
  };
  const zoomIn = () => {
    if (_.mul$zoomIndex >= zoomLevels.length - 1) return;
    _.mul$zoomIndex += 1;
    _.mul$ZOOM = zoomLevels[_.mul$zoomIndex];
    updateZoom();
  };
  const zoomOut = () => {
    if (_.mul$zoomIndex === 0) return;
    _.mul$zoomIndex -= 1;
    _.mul$ZOOM = zoomLevels[_.mul$zoomIndex];
    updateZoom();
  };

  const toggleSymbolsVisible = (override = null) => {
    if (override === null)
      _.toggleSymbolsVisible$DISPLAY_SYMBOLS =
        !_.toggleSymbolsVisible$DISPLAY_SYMBOLS;
    document.getElementById("setSymbolsVisBtn").innerHTML =
      _.toggleSymbolsVisible$DISPLAY_SYMBOLS ? "👁️" : "👓";
    updateTilesetGridContainer({ drawGrid, getCurrentFrames });
  };

  const getCurrentAnimation = (getAnim) =>
    _.mul$tileSets[_.init$tilesetDataSel.value]?.frames[
      _.init$tileFrameSel.value
    ]?.animations?.[getAnim || _.init$tileAnimSel.value];
  const updateTilesetDataList = (populateFrames = false) => {
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

    if (!populateFrames)
      populateWithOptions(
        _.init$tileDataSel,
        _.mul$tileSets[_.init$tilesetDataSel.value]?.tags,
        `<option value="">Symbols (${
          _.mul$tileSets[_.init$tilesetDataSel.value]?.tileCount || "?"
        })</option><option value="frames">Objects</option>`
      );
    else {
      populateWithOptions(
        _.init$tileFrameSel,
        _.mul$tileSets[_.init$tilesetDataSel.value]?.frames,
        ""
      );
      populateWithOptions(
        _.init$tileAnimSel,
        _.mul$tileSets[_.init$tilesetDataSel.value]?.frames[
          _.init$tileFrameSel.value
        ]?.animations,
        ""
      );
    }

    document.getElementById("tileFrameCount").value =
      getCurrentFrames()?.frameCount || 1;
    const currentAnim = getCurrentAnimation();
    _.state$el.animStart().max = _.state$el.tileFrameCount().value;
    _.state$el.animEnd().max = _.state$el.tileFrameCount().value;
    if (currentAnim) {
      console.log({ currentAnim });
      _.state$el.animStart().value = currentAnim.start || 1;
      _.state$el.animEnd().value = currentAnim.end || 1;
      _.state$el.animLoop().checked = currentAnim.loop || false;
      _.state$el.animSpeed().value = currentAnim.speed || 1;
    }
  };

  const reevaluateTilesetsData = () => {
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
      if (key === 0) {
        // console.log({gridWidth,gridHeight,tileCount, tileSize})
      }
      symbolStartIdx += tileCount;
    });
    // console.log("UPDATED TSETS", tileSets)
  };
  const setCropSize = (newSize) => {
    if (newSize === _.mul$SIZE_OF_CROP && _.init$cropSize.value === newSize)
      return;
    _.mul$tileSets[_.init$tilesetDataSel.value].tileSize = newSize;
    _.mul$IMAGES.forEach((ts, idx) => {
      if (ts.src === _.init$tilesetImage.src)
        _.mul$IMAGES[idx].tileSize = newSize;
    });
    _.mul$SIZE_OF_CROP = newSize;
    _.init$cropSize.value = _.mul$SIZE_OF_CROP;
    document.getElementById("gridCropSize").value = _.mul$SIZE_OF_CROP;
    // console.log("NEW SIZE", tilesetDataSel.value,tileSets[tilesetDataSel.value], newSize,ACTIVE_MAP, maps)
    updateZoom();
    updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    // console.log(tileSets, IMAGES)
    reevaluateTilesetsData();
    updateTilesetDataList();
    draw();
  };

  // Note: only call this when tileset images have changed
  const reloadTilesets = () => {
    const getEmptyTileSet = ({
      src,
      name = "tileset",
      gridWidth,
      gridHeight,
      tileData = {},
      symbolStartIdx,
      tileSize = _.mul$SIZE_OF_CROP,
      tags = {},
      frames = {},
      width,
      height,
      description = "n/a",
    }) => {
      return {
        src,
        name,
        gridWidth,
        gridHeight,
        tileCount: gridWidth * gridHeight,
        tileData,
        symbolStartIdx,
        tileSize,
        tags,
        frames,
        description,
        width,
        height,
      };
    };

    _.reloadTilesets$TILESET_ELEMENTS = [];
    _.init$tilesetDataSel.innerHTML = "";
    // Use to prevent old data from erasure
    const oldTilesets = { ..._.mul$tileSets };
    _.mul$tileSets = {};
    // let symbolStartIdx = 0;
    // Generate tileset data for each of the loaded images
    _.mul$IMAGES.forEach((tsImage, idx) => {
      const newOpt = document.createElement("option");
      newOpt.innerText = tsImage.name || `tileset ${idx}`;
      newOpt.value = idx;
      _.init$tilesetDataSel.appendChild(newOpt);
      const tilesetImgElement = document.createElement("img");
      tilesetImgElement.src = tsImage.src;
      tilesetImgElement.crossOrigin = "Anonymous";
      _.reloadTilesets$TILESET_ELEMENTS.push(tilesetImgElement);
    });

    Promise.all(
      Array.from(_.reloadTilesets$TILESET_ELEMENTS)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    ).then(() => {
      // console.log("TILESET ELEMENTS", TILESET_ELEMENTS)
      _.reloadTilesets$TILESET_ELEMENTS.forEach((tsImage, idx) => {
        const tileSize = tsImage.tileSize || _.mul$SIZE_OF_CROP;
        _.mul$tileSets[idx] = getEmptyTileSet({
          tags: oldTilesets[idx]?.tags,
          frames: oldTilesets[idx]?.frames,
          tileSize,
          animations: oldTilesets[idx]?.animations,
          src: tsImage.src,
          name: `tileset ${idx}`,
          width: tsImage.width,
          height: tsImage.height,
        });
      });
      // console.log("POPULATED", tileSets)
      reevaluateTilesetsData();
      _.init$tilesetImage.src = _.reloadTilesets$TILESET_ELEMENTS[0].src;
      _.init$tilesetImage.crossOrigin = "Anonymous";
      updateSelection(false);
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    });
    // finally current tileset loaded
    _.init$tilesetImage.addEventListener("load", () => {
      draw();
      updateLayers({
        maps: _.mul$maps,
        ACTIVE_MAP: _.mul$ACTIVE_MAP,
        currentLayer: _.setLayer$currentLayer,
        layersElement: _.init$layersElement,
        addToUndoStack,
      });
      if (_.mul$selection.length === 0) _.mul$selection = [getTileData(0, 0)];
      updateSelection(false);
      updateTilesetDataList();
      updateTilesetDataList(true);
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
      document.getElementById(
        "tilesetSrcLabel"
      ).innerHTML = `src: <a href="${_.init$tilesetImage.src}">${_.init$tilesetImage.src}</a>`;
      document.getElementById("tilesetSrcLabel").title =
        _.init$tilesetImage.src;
      const tilesetExtraInfo = _.mul$IMAGES.find(
        (ts) => ts.src === _.init$tilesetImage.src
      );

      // console.log("CHANGED TILESET", tilesetExtraInfo, IMAGES)

      if (tilesetExtraInfo) {
        if (tilesetExtraInfo.link) {
          document.getElementById(
            "tilesetHomeLink"
          ).innerHTML = `link: <a href="${tilesetExtraInfo.link}">${tilesetExtraInfo.link}</a> `;
          document.getElementById("tilesetHomeLink").title =
            tilesetExtraInfo.link;
        } else {
          document.getElementById("tilesetHomeLink").innerHTML = "";
        }
        if (tilesetExtraInfo.description) {
          document.getElementById("tilesetDescriptionLabel").innerText =
            tilesetExtraInfo.description;
          document.getElementById("tilesetDescriptionLabel").title =
            tilesetExtraInfo.description;
        } else {
          document.getElementById("tilesetDescriptionLabel").innerText = "";
        }
        if (tilesetExtraInfo.tileSize) {
          setCropSize(tilesetExtraInfo.tileSize);
        }
      }
      setCropSize(_.mul$tileSets[_.init$tilesetDataSel.value].tileSize);
      updateZoom();
      document.querySelector(
        '.canvas_resizer[resizerdir="x"]'
      ).style = `left:${_.mul$WIDTH}px;`;

      if (_.mul$undoStepPosition === -1) addToUndoStack(); //initial undo stack entry
    });
  };

  const updateMaps = () => {
    _.init$mapsDataSel.innerHTML = "";
    let lastMap = _.mul$ACTIVE_MAP;
    Object.keys(_.mul$maps).forEach((key, idx) => {
      const newOpt = document.createElement("option");
      newOpt.innerText = _.mul$maps[key].name; //`map ${idx}`;
      newOpt.value = key;
      _.init$mapsDataSel.appendChild(newOpt);
      if (idx === Object.keys(_.mul$maps).length - 1) lastMap = key;
    });
    _.init$mapsDataSel.value = lastMap;
    setActiveMap(lastMap);
    document.getElementById("removeMapBtn").disabled =
      Object.keys(_.mul$maps).length === 1;
  };
  const loadData = (data) => {
    try {
      clearUndoStack();
      _.mul$WIDTH = _.init$canvas.width * _.mul$ZOOM;
      _.mul$HEIGHT = _.init$canvas.height * _.mul$ZOOM;
      _.mul$selection = [{}];
      _.mul$ACTIVE_MAP = data ? Object.keys(data.maps)[0] : "Map_1";
      _.mul$maps = data
        ? { ...data.maps }
        : {
            [_.mul$ACTIVE_MAP]: getEmptyMap(
              "Map 1",
              _.mul$mapTileWidth,
              _.mul$mapTileHeight
            ),
          };
      _.mul$tileSets = data ? { ...data.tileSets } : {};
      reloadTilesets();
      _.init$tilesetDataSel.value = "0";
      _.init$cropSize.value = data
        ? _.mul$tileSets[_.init$tilesetDataSel.value]?.tileSize ||
          _.mul$maps[_.mul$ACTIVE_MAP].tileSize
        : _.mul$SIZE_OF_CROP;
      document.getElementById("gridCropSize").value = _.init$cropSize.value;
      updateMaps();
      updateMapSize({
        mapWidth: _.mul$maps[_.mul$ACTIVE_MAP].mapWidth,
        mapHeight: _.mul$maps[_.mul$ACTIVE_MAP].mapHeight,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Create the tilemap-editor in the dom and its events
  exports.init = (
    attachToId,
    {
      tileMapData, // the main data
      tileSize,
      mapWidth,
      mapHeight,
      tileSetImages,
      applyButtonText,
      onApply,
      tileSetLoaders,
      tileMapExporters,
      tileMapImporters,
      onUpdate = () => {},
      onMouseUp = null,
      appState,
    }
  ) => {
    // Call once on element to add behavior, toggle on/off isDraggable attr to enable
    const draggable = ({
      element,
      onElement = null,
      isDrag = false,
      onDrag = null,
      limitX = false,
      limitY = false,
      onRelease = null,
    }) => {
      element.setAttribute("isDraggable", isDrag);
      let isMouseDown = false;
      let mouseX;
      let mouseY;
      let elementX = 0;
      let elementY = 0;
      const onMouseMove = (event) => {
        if (!isMouseDown || element.getAttribute("isDraggable") === "false")
          return;
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        // element.style.position = "relative"
        if (!limitX) element.style.left = elementX + deltaX + "px";
        if (!limitY) element.style.top = elementY + deltaY + "px";
        console.log("DRAGGING", {
          deltaX,
          deltaY,
          x: elementX + deltaX,
          y: elementY + deltaY,
        });
        if (onDrag)
          onDrag({
            deltaX,
            deltaY,
            x: elementX + deltaX,
            y: elementY + deltaY,
            mouseX,
            mouseY,
          });
      };
      const onMouseDown = (event) => {
        if (element.getAttribute("isDraggable") === "false") return;

        mouseX = event.clientX;
        mouseY = event.clientY;
        console.log("MOUSEX", mouseX);
        isMouseDown = true;
      };
      const onMouseUp = () => {
        if (!element.getAttribute("isDraggable") === "false") return;
        isMouseDown = false;
        elementX = parseInt(element.style.left) || 0;
        elementY = parseInt(element.style.top) || 0;
        if (onRelease) onRelease({ x: elementX, y: elementY });
      };
      (onElement || element).addEventListener("pointerdown", onMouseDown);
      document.addEventListener("pointerup", onMouseUp);
      document.addEventListener("pointermove", onMouseMove);
    };

    const addLayer = () => {
      const newLayerName = prompt(
        "Enter layer name",
        `Layer${_.mul$maps[_.mul$ACTIVE_MAP].layers.length + 1}`
      );
      if (newLayerName !== null) {
        _.mul$maps[_.mul$ACTIVE_MAP].layers.push(getEmptyLayer(newLayerName));
        updateLayers({
          maps: _.mul$maps,
          ACTIVE_MAP: _.mul$ACTIVE_MAP,
          currentLayer: _.setLayer$currentLayer,
          layersElement: _.init$layersElement,
          addToUndoStack,
        });
      }
    };

    // Attach
    const attachTo = document.getElementById(attachToId);
    if (attachTo === null) return;

    _.init_state$apiTileSetLoaders = tileSetLoaders || {};
    _.init_state$apiTileSetLoaders.base64 = {
      name: "Fs (as base64)",
      onSelectImage: (setSrc, file, base64) => {
        setSrc(base64);
      },
    };
    _.init_state$apiTileMapExporters = tileMapExporters;
    _.init_state$apiTileMapExporters.exportAsImage = {
      name: "Export Map as image",
      transformer: exportImage,
    };
    _.init_state$apiTileMapExporters.saveData = {
      name: "Download Json file",
      transformer: exportJson,
    };
    _.init_state$apiTileMapExporters.analizeTilemap = {
      name: "Analize tilemap",
      transformer: drawAnaliticsReport,
    };
    _.init_state$apiTileMapExporters.exportTilesFromMap = {
      name: "Extract tileset from map",
      transformer: exportUniqueTiles,
    };
    _.init_state$apiTileMapImporters = tileMapImporters;
    _.init_state$apiTileMapImporters.openData = {
      name: "Open Json file",
      onSelectFiles: (setData, files) => {
        const readFile = new FileReader();
        readFile.onload = (e) => {
          const json = JSON.parse(e.target.result);
          setData(json);
        };
        readFile.readAsText(files[0]);
      },
      acceptFile: "application/JSON",
    };
    _.init$apiOnUpdateCallback = onUpdate;

    if (onMouseUp) {
      _.init$apiOnMouseUp = onMouseUp;
      document
        .getElementById("tileMapEditor")
        .addEventListener("pointerup", function () {
          _.init$apiOnMouseUp(getAppState(), _.init_state$apiTileMapExporters);
        });
    }

    const importedTilesetImages =
      (tileMapData?.tileSets && Object.values(tileMapData?.tileSets)) ||
      tileSetImages;
    _.mul$IMAGES = importedTilesetImages;
    _.mul$SIZE_OF_CROP = importedTilesetImages?.[0]?.tileSize || tileSize || 32; //to the best of your ability, predict the init tileSize
    _.mul$mapTileWidth = mapWidth || 12;
    _.mul$mapTileHeight = mapHeight || 12;
    // const canvasWidth = mapTileWidth * tileSize * ZOOM;
    // const canvasHeight = mapTileHeight * tileSize * ZOOM;

    if (_.mul$SIZE_OF_CROP < 12) _.mul$ZOOM = 2; // Automatically start with zoom 2 when the tilesize is tiny
    // Attach elements
    attachTo.innerHTML = tilemapEditorRootHTML({
      width: _.mul$WIDTH,
      height: _.mul$HEIGHT,
      mapTileWidth: _.mul$mapTileWidth,
    });
    attachTo.className = "tilemap_editor_root";
    _.init$tilesetImage = document.createElement("img");
    _.init$cropSize = document.getElementById("cropSize");

    _.init$confirmBtn = document.getElementById("confirmBtn");
    if (onApply) {
      _.init$confirmBtn.innerText = applyButtonText || "Ok";
    } else {
      _.init$confirmBtn.style.display = "none";
    }
    _.init$canvas = document.getElementById("mapCanvas");
    _.init$tilesetContainer = document.querySelector(".tileset-container");
    _.init$tilesetSelection = document.querySelector(
      ".tileset-container-selection"
    );
    // tilesetGridContainer = document.getElementById("tilesetGridContainer");
    _.init$layersElement = document.getElementById("layers");
    _.init$objectParametersEditor = document.getElementById(
      "objectParametersEditor"
    );

    _.init$tilesetContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    _.init$tilesetContainer.addEventListener("pointerdown", (e) => {
      _.init$tileSelectStart = getSelectedTile(e)[0];
    });
    _.init$tilesetContainer.addEventListener("pointermove", (e) => {
      if (_.init$tileSelectStart !== null) {
        _.mul$selection = getSelectedTile(e);
        updateSelection();
      }
    });

    const setFramesToSelection = (objectName, animName = "") => {
      console.log({ animName, objectName });
      if (objectName === "" || typeof objectName !== "string") return;
      _.mul$tileSets[_.init$tilesetDataSel.value].frames[objectName] = {
        ...(_.mul$tileSets[_.init$tilesetDataSel.value].frames[objectName] ||
          {}),
        width: _.updateSelection$selectionSize[0],
        height: _.updateSelection$selectionSize[1],
        start: _.mul$selection[0],
        tiles: _.mul$selection,
        name: objectName,
        //To be set when placing tile
        layer: undefined,
        isFlippedX: false,
        xPos: 0,
        yPos: 0, //TODO free position
      };
    };
    _.init$tilesetContainer.addEventListener("pointerup", (e) => {
      setTimeout(() => {
        document.getElementById("tilesetDataDetails").open = false;
      }, 100);

      _.mul$selection = getSelectedTile(e);
      updateSelection();
      _.mul$selection = getSelectedTile(e);
      _.init$tileSelectStart = null;

      const viewMode = _.init$tileDataSel.value;
      if (viewMode === "" && e.button === 2) {
        renameCurrentTileSymbol();
        return;
      }
      if (e.button === 0) {
        if (
          _.toggleSymbolsVisible$DISPLAY_SYMBOLS &&
          viewMode !== "" &&
          viewMode !== "frames"
        ) {
          _.mul$selection.forEach((selected) => {
            addToUndoStack();
            const { x, y } = selected;
            const tileKey = `${x}-${y}`;
            const tagTiles =
              _.mul$tileSets[_.init$tilesetDataSel.value]?.tags[viewMode]
                ?.tiles;
            if (tagTiles) {
              if (tileKey in tagTiles) {
                delete tagTiles[tileKey];
              } else {
                tagTiles[tileKey] = { mark: "O" };
              }
            }
          });
        } else if (viewMode === "frames") {
          setFramesToSelection(_.init$tileFrameSel.value);
        }
        updateTilesetGridContainer({ drawGrid, getCurrentFrames });
      }
    });
    _.init$tilesetContainer.addEventListener("dblclick", (e) => {
      const viewMode = _.init$tileDataSel.value;
      if (viewMode === "") {
        renameCurrentTileSymbol();
      }
    });
    document.getElementById("addLayerBtn").addEventListener("click", () => {
      addToUndoStack();
      addLayer();
    });
    // Maps DATA callbacks
    _.init$mapsDataSel = document.getElementById("mapsDataSel");
    _.init$mapsDataSel.addEventListener("change", (e) => {
      addToUndoStack();
      setActiveMap(e.target.value);
      addToUndoStack();
    });
    document.getElementById("addMapBtn").addEventListener("click", () => {
      const suggestMapName = `Map ${Object.keys(_.mul$maps).length + 1}`;
      const result = window.prompt("Enter new map key...", suggestMapName);
      if (result !== null) {
        addToUndoStack();
        const newMapKey = result.trim().replaceAll(" ", "_") || suggestMapName;
        if (newMapKey in _.mul$maps) {
          alert("A map with this key already exists.");
          return;
        }
        _.mul$maps[newMapKey] = getEmptyMap(result.trim());
        addToUndoStack();
        updateMaps();
      }
    });
    document.getElementById("duplicateMapBtn").addEventListener("click", () => {
      const makeNewKey = (key) => {
        const suggestedNew = `${key}_copy`;
        if (suggestedNew in _.mul$maps) {
          return makeNewKey(suggestedNew);
        }
        return suggestedNew;
      };
      addToUndoStack();
      const newMapKey = makeNewKey(_.mul$ACTIVE_MAP);
      _.mul$maps[newMapKey] = {
        ...JSON.parse(JSON.stringify(_.mul$maps[_.mul$ACTIVE_MAP])),
        name: newMapKey,
      }; // todo prompt to ask for name
      updateMaps();
      addToUndoStack();
    });
    document.getElementById("removeMapBtn").addEventListener("click", () => {
      addToUndoStack();
      delete _.mul$maps[_.mul$ACTIVE_MAP];
      setActiveMap(Object.keys(_.mul$maps)[0]);
      updateMaps();
      addToUndoStack();
    });
    // Tileset DATA Callbacks //tileDataSel
    _.init$tileDataSel = document.getElementById("tileDataSel");
    _.init$tileDataSel.addEventListener("change", () => {
      selectMode();
    });
    document.getElementById("addTileTagBtn").addEventListener("click", () => {
      const getEmptyTilesetTag = (name, code, tiles = {}) => ({
        name,
        code,
        tiles,
      });
      const result = window.prompt("Name your tag", "solid()");
      if (result !== null) {
        if (result in _.mul$tileSets[_.init$tilesetDataSel.value].tags) {
          alert("Tag already exists");
          return;
        }
        _.mul$tileSets[_.init$tilesetDataSel.value].tags[result] =
          getEmptyTilesetTag(result, result);
        updateTilesetDataList();
        addToUndoStack();
      }
    });
    document
      .getElementById("removeTileTagBtn")
      .addEventListener("click", () => {
        if (
          _.init$tileDataSel.value &&
          _.init$tileDataSel.value in
            _.mul$tileSets[_.init$tilesetDataSel.value].tags
        ) {
          delete _.mul$tileSets[_.init$tilesetDataSel.value].tags[
            _.init$tileDataSel.value
          ];
          updateTilesetDataList();
          addToUndoStack();
        }
      });
    // Tileset frames
    _.init$tileFrameSel = document.getElementById("tileFrameSel");
    _.init$tileFrameSel.addEventListener("change", (e) => {
      _.state$el.tileFrameCount().value = getCurrentFrames()?.frameCount || 1;
      updateTilesetDataList(true);
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    });
    _.state$el.animStart().addEventListener("change", (e) => {
      getCurrentAnimation().start = Number(_.state$el.animStart().value);
    });
    _.state$el.animEnd().addEventListener("change", (e) => {
      getCurrentAnimation().end = Number(_.state$el.animEnd().value);
    });
    document.getElementById("addTileFrameBtn").addEventListener("click", () => {
      const result = window.prompt(
        "Name your object",
        `obj${
          Object.keys(_.mul$tileSets[_.init$tilesetDataSel.value]?.frames || {})
            .length
        }`
      );
      if (result !== null) {
        if (result in _.mul$tileSets[_.init$tilesetDataSel.value].frames) {
          alert("Object already exists");
          return;
        }
        _.mul$tileSets[_.init$tilesetDataSel.value].frames[result] = {
          frameCount: Number(_.state$el.tileFrameCount().value),
          animations: {
            a1: {
              start: 1,
              end: Number(_.state$el.tileFrameCount().value) || 1, //todo move in here
              name: "a1",
              loop: _.state$el.animLoop().checked,
              speed: Number(_.state$el.animSpeed().value),
            },
          },
        };
        setFramesToSelection(result);
        updateTilesetDataList(true);
        _.init$tileFrameSel.value = result;
        updateTilesetGridContainer({ drawGrid, getCurrentFrames });
      }
    });
    document
      .getElementById("removeTileFrameBtn")
      .addEventListener("click", () => {
        if (
          _.init$tileFrameSel.value &&
          _.init$tileFrameSel.value in
            _.mul$tileSets[_.init$tilesetDataSel.value].frames &&
          confirm(
            `Are you sure you want to delete ${_.init$tileFrameSel.value}`
          )
        ) {
          delete _.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ];
          updateTilesetDataList(true);
          updateTilesetGridContainer({ drawGrid, getCurrentFrames });
        }
      });
    const renameKeyInObjectForSelectElement = (
      selectElement,
      objectPath,
      typeLabel
    ) => {
      const oldValue = selectElement.value;
      const result = window.prompt("Rename your animation", `${oldValue}`);
      if (result && result !== oldValue) {
        if (!objectPath) return;
        if (result in objectPath) {
          alert(`${typeLabel} with the ${result} name already exists. Aborted`);
          return;
        }
        if (result.length < 2) {
          alert(
            `${typeLabel} name needs to be longer than one character. Aborted`
          ); //so animations and objects never overlap with symbols
          return;
        }
        Object.defineProperty(
          objectPath,
          result,
          Object.getOwnPropertyDescriptor(objectPath, oldValue)
        );
        delete objectPath[oldValue];
        updateTilesetDataList(true);
        selectElement.value = result;
        updateTilesetDataList(true);
      }
    };
    _.state$el.renameTileFrameBtn().addEventListener("click", () => {
      // could be a generic function
      renameKeyInObjectForSelectElement(
        _.init$tileFrameSel,
        _.mul$tileSets[_.init$tilesetDataSel.value]?.frames,
        "object"
      );
    });
    _.state$el.tileFrameCount().addEventListener("change", (e) => {
      if (_.init$tileFrameSel.value === "") return;
      getCurrentFrames().frameCount = Number(e.target.value);
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    });

    // animations
    _.init$tileAnimSel = document.getElementById("tileAnimSel");
    _.init$tileAnimSel.addEventListener("change", (e) => {
      //swap with tileAnimSel
      console.log("anim select", e, _.init$tileAnimSel.value);
      _.state$el.animStart().value = getCurrentAnimation()?.start || 1;
      _.state$el.animEnd().value = getCurrentAnimation()?.end || 1;
      _.state$el.animLoop().checked = getCurrentAnimation()?.loop || false;
      _.state$el.animSpeed().value = getCurrentAnimation()?.speed || 1;
      updateTilesetGridContainer({ drawGrid, getCurrentFrames });
    });
    document.getElementById("addTileAnimBtn").addEventListener("click", () => {
      const result = window.prompt(
        "Name your animation",
        `anim${
          Object.keys(
            _.mul$tileSets[_.init$tilesetDataSel.value]?.frames[
              _.init$tileFrameSel.value
            ]?.animations || {}
          ).length
        }`
      );
      if (result !== null) {
        if (
          !_.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ]?.animations
        ) {
          _.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ].animations = {};
        }
        if (
          result in
          _.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ]?.animations
        ) {
          alert("Animation already exists");
          return;
        }
        _.mul$tileSets[_.init$tilesetDataSel.value].frames[
          _.init$tileFrameSel.value
        ].animations[result] = {
          start: 1,
          end: Number(_.state$el.tileFrameCount().value || 1),
          loop: _.state$el.animLoop().checked,
          speed: Number(_.state$el.animSpeed().value || 1),
          name: result,
        };
        // setFramesToSelection(tileFrameSel.value, result);
        updateTilesetDataList(true);
        _.init$tileAnimSel.value = result;
        updateTilesetGridContainer({ drawGrid, getCurrentFrames });
      }
    });
    document
      .getElementById("removeTileAnimBtn")
      .addEventListener("click", () => {
        console.log(
          "delete",
          _.init$tileAnimSel.value,
          _.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ].animations
        );
        if (
          _.init$tileAnimSel.value &&
          _.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ]?.animations &&
          _.init$tileAnimSel.value in
            _.mul$tileSets[_.init$tilesetDataSel.value].frames[
              _.init$tileFrameSel.value
            ]?.animations &&
          confirm(`Are you sure you want to delete ${_.init$tileAnimSel.value}`)
        ) {
          delete _.mul$tileSets[_.init$tilesetDataSel.value].frames[
            _.init$tileFrameSel.value
          ].animations[_.init$tileAnimSel.value];
          updateTilesetDataList(true);
          updateTilesetGridContainer({ drawGrid, getCurrentFrames });
        }
      });
    _.state$el.renameTileAnimBtn().addEventListener("click", () => {
      renameKeyInObjectForSelectElement(
        _.init$tileAnimSel,
        _.mul$tileSets[_.init$tilesetDataSel.value]?.frames[
          _.init$tileFrameSel.value
        ]?.animations,
        "animation"
      );
    });

    _.state$el.animLoop().addEventListener("change", () => {
      getCurrentAnimation().loop = _.state$el.animLoop().checked;
    });
    _.state$el.animSpeed().addEventListener("change", (e) => {
      getCurrentAnimation().speed = _.state$el.animSpeed().value;
    });
    // Tileset SELECT callbacks
    _.init$tilesetDataSel = document.getElementById("tilesetDataSel");
    _.init$tilesetDataSel.addEventListener("change", (e) => {
      _.init$tilesetImage.src =
        _.reloadTilesets$TILESET_ELEMENTS[e.target.value].src;
      _.init$tilesetImage.crossOrigin = "Anonymous";
      updateTilesetDataList();
    });
    _.state$el.tileFrameCount().addEventListener("change", () => {
      _.state$el.animStart().max = _.state$el.tileFrameCount().value;
      _.state$el.animEnd().max = _.state$el.tileFrameCount().value;
    });

    const replaceSelectedTileSet = (src) => {
      addToUndoStack();
      _.mul$IMAGES[Number(_.init$tilesetDataSel.value)].src = src;
      reloadTilesets();
    };
    const addNewTileSet = (src) => {
      console.log("add new tileset" + src);
      addToUndoStack();
      _.mul$IMAGES.push({ src });
      reloadTilesets();
    };
    exports.addNewTileSet = addNewTileSet;
    // replace tileset
    document
      .getElementById("tilesetReplaceInput")
      .addEventListener("change", (e) => {
        toBase64(e.target.files[0]).then((base64Src) => {
          if (_.init_state$selectedTileSetLoader.onSelectImage) {
            _.init_state$selectedTileSetLoader.onSelectImage(
              replaceSelectedTileSet,
              e.target.files[0],
              base64Src
            );
          }
        });
      });
    document
      .getElementById("replaceTilesetBtn")
      .addEventListener("click", () => {
        if (_.init_state$selectedTileSetLoader.onSelectImage) {
          document.getElementById("tilesetReplaceInput").click();
        }
        if (_.init_state$selectedTileSetLoader.prompt) {
          _.init_state$selectedTileSetLoader.prompt(replaceSelectedTileSet);
        }
      });
    // add tileset
    document
      .getElementById("tilesetReadInput")
      .addEventListener("change", (e) => {
        toBase64(e.target.files[0]).then((base64Src) => {
          if (_.init_state$selectedTileSetLoader.onSelectImage) {
            _.init_state$selectedTileSetLoader.onSelectImage(
              addNewTileSet,
              e.target.files[0],
              base64Src
            );
          }
        });
      });
    // remove tileset
    document.getElementById("addTilesetBtn").addEventListener("click", () => {
      if (_.init_state$selectedTileSetLoader.onSelectImage) {
        document.getElementById("tilesetReadInput").click();
      }
      if (_.init_state$selectedTileSetLoader.prompt) {
        _.init_state$selectedTileSetLoader.prompt(addNewTileSet);
      }
    });
    const tileSetLoadersSel = document.getElementById("tileSetLoadersSel");
    Object.entries(_.init_state$apiTileSetLoaders).forEach(([key, loader]) => {
      const tsLoaderOption = document.createElement("option");
      tsLoaderOption.value = key;
      tsLoaderOption.innerText = loader.name;
      tileSetLoadersSel.appendChild(tsLoaderOption);
      // apiTileSetLoaders[key].load = () => tileSetLoaders
    });

    tileSetLoadersSel.value = "base64";
    _.init_state$selectedTileSetLoader =
      _.init_state$apiTileSetLoaders[tileSetLoadersSel.value];
    tileSetLoadersSel.addEventListener("change", (e) => {
      _.init_state$selectedTileSetLoader =
        _.init_state$apiTileSetLoaders[e.target.value];
    });
    exports.tilesetLoaders = _.init_state$apiTileSetLoaders;

    const deleteTilesetWithIndex = (index, cb = null) => {
      if (confirm(`Are you sure you want to delete this image?`)) {
        addToUndoStack();
        _.mul$IMAGES.splice(index, 1);
        reloadTilesets();
        if (cb) cb();
      }
    };
    exports.IMAGES = _.mul$IMAGES;
    exports.deleteTilesetWithIndex = deleteTilesetWithIndex;
    document
      .getElementById("removeTilesetBtn")
      .addEventListener("click", () => {
        //Remove current tileset
        if (_.init$tilesetDataSel.value !== "0") {
          deleteTilesetWithIndex(Number(_.init$tilesetDataSel.value));
        }
      });

    // Canvas callbacks
    _.init$canvas.addEventListener("pointerdown", setMouseIsTrue);
    _.init$canvas.addEventListener("pointerup", setMouseIsFalse);
    _.init$canvas.addEventListener("pointerleave", setMouseIsFalse);
    _.init$canvas.addEventListener("pointerdown", toggleTile);
    _.init$canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    draggable({
      onElement: _.init$canvas,
      element: document.getElementById("canvas_wrapper"),
    });
    _.init$canvas.addEventListener("pointermove", (e) => {
      if (_.mul$isMouseDown && _.mul$ACTIVE_TOOL !== 2) toggleTile(e);
    });
    // Canvas Resizer ===================
    document
      .getElementById("canvasWidthInp")
      .addEventListener("change", (e) => {
        updateMapSize({ mapWidth: Number(e.target.value) });
      });
    document
      .getElementById("canvasHeightInp")
      .addEventListener("change", (e) => {
        updateMapSize({ mapHeight: Number(e.target.value) });
      });
    // draggable({
    //   element: document.querySelector(".canvas_resizer[resizerdir='x']"),
    //   onElement: document.querySelector(".canvas_resizer[resizerdir='x'] span"),
    //   isDrag: true,
    //   limitY: true,
    //   onRelease: ({ x }) => {
    //     const getSnappedPos = (pos) =>
    //       Math.round(pos / _.mul$SIZE_OF_CROP) * $sizeOfCrop;
    //     const snappedX = getSnappedPos(x);
    //     console.log("SNAPPED GRID", x, snappedX);
    //     updateMapSize({ mapWidth: snappedX });
    //   },
    // });

    document
      .querySelector(".canvas_resizer[resizerdir='y'] input")
      .addEventListener("change", (e) => {
        updateMapSize({ mapHeight: Number(e.target.value) });
      });
    document
      .querySelector(".canvas_resizer[resizerdir='x'] input")
      .addEventListener("change", (e) => {
        updateMapSize({ mapWidth: Number(e.target.value) });
      });
    document
      .getElementById("toolButtonsWrapper")
      .addEventListener("click", (e) => {
        console.log("ACTIVE_TOOL", e.target.value);
        if (e.target.getAttribute("name") === "tool")
          setActiveTool(Number(e.target.value));
      });
    document.getElementById("gridCropSize").addEventListener("change", (e) => {
      setCropSize(Number(e.target.value));
    });
    _.init$cropSize.addEventListener("change", (e) => {
      setCropSize(Number(e.target.value));
    });

    document
      .getElementById("clearCanvasBtn")
      .addEventListener("click", clearCanvas);
    if (onApply) {
      _.init$confirmBtn.addEventListener("click", () =>
        onApply.onClick(getExportData())
      );
    }

    document.getElementById("renameMapBtn").addEventListener("click", () => {
      const newName = window.prompt(
        "Change map name:",
        _.mul$maps[_.mul$ACTIVE_MAP].name || "Map"
      );
      if (newName !== null && _.mul$maps[_.mul$ACTIVE_MAP].name !== newName) {
        if (
          Object.values(_.mul$maps)
            .map((map) => map.name)
            .includes(newName)
        ) {
          alert(`${newName} already exists`);
          return;
        }
        _.mul$maps[_.mul$ACTIVE_MAP].name = newName;
        updateMaps();
      }
    });

    const fileMenuDropDown = document.getElementById("fileMenuDropDown");
    const makeMenuItem = (name, value, description) => {
      const menuItem = document.createElement("span");
      menuItem.className = "item";
      menuItem.innerText = name;
      menuItem.title = description || name;
      menuItem.value = value;
      fileMenuDropDown.appendChild(menuItem);
      return menuItem;
    };
    Object.entries(tileMapExporters).forEach(([key, exporter]) => {
      makeMenuItem(exporter.name, key, exporter.description).onclick = () => {
        exporter.transformer(getExportData());
      };
      _.init_state$apiTileMapExporters[key].getData = () =>
        exporter.transformer(getExportData());
    });
    exports.exporters = _.init_state$apiTileMapExporters;

    Object.entries(_.init_state$apiTileMapImporters).forEach(
      ([key, importer]) => {
        makeMenuItem(importer.name, key, importer.description).onclick = () => {
          if (importer.onSelectFiles) {
            const input = document.createElement("input");
            input.type = "file";
            input.id = `importerInput-${key}`;
            if (importer.acceptFile) input.accept = importer.acceptFile;
            input.style.display = "none";
            input.addEventListener("change", (e) => {
              importer.onSelectFiles(loadData, e.target.files);
            });
            input.click();
          }
        };
        // apiTileMapImporters[key].setData = (files) => importer.onSelectFiles(loadData, files);
      }
    );
    document.getElementById("toggleFlipX").addEventListener("change", (e) => {
      document.getElementById("flipBrushIndicator").style.transform = e.target
        .checked
        ? "scale(-1, 1)"
        : "scale(1, 1)";
    });
    document.addEventListener("keypress", (e) => {
      if (e.ctrlKey) {
        if (e.code === "KeyZ") undo();
        if (e.code === "KeyY") redo();
      }
    });
    document.getElementById("gridColorSel").addEventListener("change", (e) => {
      console.log("grid col", e.target.value);
      _.mul$maps[_.mul$ACTIVE_MAP].gridColor = e.target.value;
      draw();
    });
    document.getElementById("showGrid").addEventListener("change", (e) => {
      _.init$SHOW_GRID = e.target.checked;
      draw();
    });

    document.getElementById("undoBtn").addEventListener("click", undo);
    document.getElementById("redoBtn").addEventListener("click", redo);
    document.getElementById("zoomIn").addEventListener("click", zoomIn);
    document.getElementById("zoomOut").addEventListener("click", zoomOut);
    document
      .getElementById("setSymbolsVisBtn")
      .addEventListener("click", () => toggleSymbolsVisible());
    // Scroll zoom in/out - use wheel instead of scroll event since theres no scrollbar on the map
    _.init$canvas.addEventListener("wheel", (e) => {
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    });

    loadData(tileMapData);
    if (appState) {
      _.mul$ACTIVE_MAP = appState.ACTIVE_MAP;
      _.init$mapsDataSel.value = _.mul$ACTIVE_MAP;
      setActiveMap(appState.ACTIVE_MAP);
      _.mul$PREV_ACTIVE_TOOL = appState.PREV_ACTIVE_TOOL;
      _.mul$ACTIVE_TOOL = appState.ACTIVE_TOOL;
      setActiveTool(appState.ACTIVE_TOOL);
      setLayer(
        {
          currentLayer: _.setLayer$currentLayer,
          maps: _.mul$maps,
          ACTIVE_MAP: _.mul$ACTIVE_MAP,
          addToUndoStack,
          updateLayers,
        },
        appState.currentLayer
      );
      _.mul$selection = appState.selection;
      updateSelection(false);
      _.init$SHOW_GRID = appState.SHOW_GRID;
    }

    // Animated tiles when on frames mode
    const animateTiles = () => {
      if (_.init$tileDataSel.value === "frames") draw();
      requestAnimationFrame(animateTiles);
    };
    requestAnimationFrame(animateTiles);
  };

  exports.getState = () => {
    return getAppState();
  };

  exports.onUpdate = _.init$apiOnUpdateCallback;
  exports.onMouseUp = _.init$apiOnMouseUp;

  exports.getTilesets = () => _.mul$tileSets;
};

const exports = function () {};
main(exports);
export default exports;
