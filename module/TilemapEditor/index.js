import html from "../constants/html";
import { getEmptyMap } from "./split";
import {
  toBase64,
  drawGrid,
  decoupleReferenceFromObj,
  getEmptyLayer,
} from "./utils";

// memo: グローバルかつ再代入の変数の識別子
// g$init$ -- init で書き換わる
// g$mul$ -- 複数個所で書き換わる
// g$state$ -- 状態管理オブジェクト

const main = function (exports) {
  exports.toBase64 = toBase64;

  let g$init$tilesetImage,
    g$init$canvas,
    g$init$tilesetContainer,
    g$init$tilesetSelection,
    g$init$cropSize,
    g$init$confirmBtn,
    g$init$layersElement,
    g$init$tileDataSel,
    g$init$tileFrameSel,
    g$init$tileAnimSel,
    g$init$tilesetDataSel,
    g$init$mapsDataSel,
    g$init$objectParametersEditor;
  let g$mul$mapTileHeight, g$mul$mapTileWidth;

  const g$state$el = {
    tileFrameCount: "",
    animStart: "",
    animEnd: "",
    renameTileFrameBtn: "",
    renameTileAnimBtn: "",
    animSpeed: "",
    animLoop: "",
  };
  Object.keys(g$state$el).forEach((key) => {
    g$state$el[key] = () => document.getElementById(key);
  });

  const TOOLS = {
    BRUSH: 0,
    ERASE: 1,
    PAN: 2,
    PICK: 3,
    RAND: 4,
    FILL: 5,
  };

  let g$reloadTilesets$TILESET_ELEMENTS = [],
    g$mul$IMAGES = [{ src: "" }],
    g$mul$ZOOM = 1,
    g$mul$SIZE_OF_CROP = 32,
    g$mul$WIDTH = 0,
    g$mul$HEIGHT = 0,
    g$mul$PREV_ACTIVE_TOOL = 0,
    g$mul$ACTIVE_TOOL = 0,
    g$mul$ACTIVE_MAP = "",
    toggleSymbolsVisible$DISPLAY_SYMBOLS = false,
    g$init$SHOW_GRID = false;

  let g$mul$selection = [],
    g$setLayer$currentLayer = 0,
    g$mul$isMouseDown = false,
    g$mul$maps = {},
    g$mul$tileSets = {};

  let g$init_state$apiTileSetLoaders = {},
    g$init_state$selectedTileSetLoader = {},
    g$init_state$apiTileMapExporters = {},
    g$init_state$apiTileMapImporters = {},
    g$init$apiOnUpdateCallback = () => {},
    g$init$apiOnMouseUp = () => {};

  let g$getTile$editedEntity;

  // const getSnappedPos = (pos) => Math.round(pos / $sizeOfCrop) * $sizeOfCrop;

  const setLayer = (newLayer) => {
    g$setLayer$currentLayer = Number(newLayer);

    const oldActivedLayer = document.querySelector(".layer.active");
    if (oldActivedLayer) {
      oldActivedLayer.classList.remove("active");
    }

    document
      .querySelector(`.layer[tile-layer="${newLayer}"]`)
      ?.classList.add("active");
    document.getElementById("activeLayerLabel").innerHTML = `
            Editing Layer: ${g$mul$maps[g$mul$ACTIVE_MAP].layers[newLayer]?.name} 
            <div class="dropdown left">
                <div class="item nohover">Layer: ${g$mul$maps[g$mul$ACTIVE_MAP].layers[newLayer]?.name} </div>
                <div class="item">
                    <div class="slider-wrapper">
                      <label for="layerOpacitySlider">Opacity</label>
                      <input type="range" min="0" max="1" value="1" id="layerOpacitySlider" step="0.01">
                      <output for="layerOpacitySlider" id="layerOpacitySliderValue">${g$mul$maps[g$mul$ACTIVE_MAP].layers[newLayer]?.opacity}</output>
                    </div>
                </div>
            </div>
        `;
    document.getElementById("layerOpacitySlider").value =
      g$mul$maps[g$mul$ACTIVE_MAP].layers[newLayer]?.opacity;
    document
      .getElementById("layerOpacitySlider")
      .addEventListener("change", (e) => {
        addToUndoStack();
        document.getElementById("layerOpacitySliderValue").innerText =
          e.target.value;
        g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].opacity =
          Number(e.target.value);
        draw();
        updateLayers();
      });
  };

  const setLayerIsVisible = (layer, override = null) => {
    const layerNumber = Number(layer);
    g$mul$maps[g$mul$ACTIVE_MAP].layers[layerNumber].visible =
      override ?? !g$mul$maps[g$mul$ACTIVE_MAP].layers[layerNumber].visible;
    document.getElementById(`setLayerVisBtn-${layer}`).innerHTML = g$mul$maps[
      g$mul$ACTIVE_MAP
    ].layers[layerNumber].visible
      ? "👁️"
      : "👓";
    draw();
  };

  const trashLayer = (layer) => {
    const layerNumber = Number(layer);
    g$mul$maps[g$mul$ACTIVE_MAP].layers.splice(layerNumber, 1);
    updateLayers();
    setLayer(g$mul$maps[g$mul$ACTIVE_MAP].layers.length - 1);
    draw();
  };

  const addLayer = () => {
    const newLayerName = prompt(
      "Enter layer name",
      `Layer${g$mul$maps[g$mul$ACTIVE_MAP].layers.length + 1}`
    );
    if (newLayerName !== null) {
      g$mul$maps[g$mul$ACTIVE_MAP].layers.push(getEmptyLayer(newLayerName));
      updateLayers();
    }
  };

  const updateLayers = () => {
    g$init$layersElement.innerHTML = g$mul$maps[g$mul$ACTIVE_MAP].layers
      .map((layer, index) => {
        return `
              <div class="layer">
                <div id="selectLayerBtn-${index}" class="layer select_layer" tile-layer="${index}" title="${
          layer.name
        }">${layer.name} ${layer.opacity < 1 ? ` (${layer.opacity})` : ""}</div>
                <span id="setLayerVisBtn-${index}" vis-layer="${index}"></span>
                <div id="trashLayerBtn-${index}" trash-layer="${index}" ${
          g$mul$maps[g$mul$ACTIVE_MAP].layers.length > 1
            ? ""
            : `disabled="true"`
        }>🗑️</div>
              </div>
            `;
      })
      .reverse()
      .join("\n");

    g$mul$maps[g$mul$ACTIVE_MAP].layers.forEach((_, index) => {
      document
        .getElementById(`selectLayerBtn-${index}`)
        .addEventListener("click", (e) => {
          setLayer(e.target.getAttribute("tile-layer"));
          addToUndoStack();
        });
      document
        .getElementById(`setLayerVisBtn-${index}`)
        .addEventListener("click", (e) => {
          setLayerIsVisible(e.target.getAttribute("vis-layer"));
          addToUndoStack();
        });
      document
        .getElementById(`trashLayerBtn-${index}`)
        .addEventListener("click", (e) => {
          trashLayer(e.target.getAttribute("trash-layer"));
          addToUndoStack();
        });
      setLayerIsVisible(index, true);
    });
    setLayer(g$setLayer$currentLayer);
  };

  const getTileData = (x = null, y = null) => {
    const tilesetTiles = g$mul$tileSets[g$init$tilesetDataSel.value].tileData;
    let data;
    if (x === null && y === null) {
      const { x: sx, y: sy } = g$mul$selection[0];
      return tilesetTiles[`${sx}-${sy}`];
    } else {
      data = tilesetTiles[`${x}-${y}`];
    }
    return data;
  };
  const setTileData = (x = null, y = null, newData, key = "") => {
    const tilesetTiles = g$mul$tileSets[g$init$tilesetDataSel.value].tileData;
    if (x === null && y === null) {
      const { x: sx, y: sy } = g$mul$selection[0];
      tilesetTiles[`${sx}-${sy}`] = newData;
    }
    if (key !== "") {
      tilesetTiles[`${x}-${y}`][key] = newData;
    } else {
      tilesetTiles[`${x}-${y}`] = newData;
    }
  };

  const setActiveTool = (toolIdx) => {
    g$mul$ACTIVE_TOOL = toolIdx;
    const actTool = document
      .getElementById("toolButtonsWrapper")
      .querySelector(`input[id="tool${toolIdx}"]`);
    if (actTool) actTool.checked = true;
    document
      .getElementById("canvas_wrapper")
      .setAttribute("isDraggable", g$mul$ACTIVE_TOOL === TOOLS.PAN);
    draw();
  };

  let g$updateSelection$selectionSize = [1, 1];
  const updateSelection = (autoSelectTool = true) => {
    if (!g$mul$tileSets[g$init$tilesetDataSel.value]) return;
    const selected = g$mul$selection[0];
    if (!selected) return;
    const { x, y } = selected;
    const { x: endX, y: endY } = g$mul$selection[g$mul$selection.length - 1];
    const selWidth = endX - x + 1;
    const selHeight = endY - y + 1;
    g$updateSelection$selectionSize = [selWidth, selHeight];
    console.log(g$mul$tileSets[g$init$tilesetDataSel.value].tileSize);
    const tileSize = g$mul$tileSets[g$init$tilesetDataSel.value].tileSize;
    g$init$tilesetSelection.style.left = `${x * tileSize * g$mul$ZOOM}px`;
    g$init$tilesetSelection.style.top = `${y * tileSize * g$mul$ZOOM}px`;
    g$init$tilesetSelection.style.width = `${
      selWidth * tileSize * g$mul$ZOOM
    }px`;
    g$init$tilesetSelection.style.height = `${
      selHeight * tileSize * g$mul$ZOOM
    }px`;

    // Autoselect tool upon selecting a tile
    if (
      autoSelectTool &&
      ![TOOLS.BRUSH, TOOLS.RAND, TOOLS.FILL].includes(g$mul$ACTIVE_TOOL)
    )
      setActiveTool(TOOLS.BRUSH);

    // show/hide param editor
    if (g$init$tileDataSel.value === "frames" && g$getTile$editedEntity)
      g$init$objectParametersEditor.classList.add("entity");
    else g$init$objectParametersEditor.classList.remove("entity");
    onUpdateState();
  };

  const randomLetters = new Array(10680)
    .fill(1)
    .map((_, i) => String.fromCharCode(165 + i));

  const shouldHideSymbols = () => g$mul$SIZE_OF_CROP < 10 && g$mul$ZOOM < 2;
  const updateTilesetGridContainer = () => {
    const viewMode = g$init$tileDataSel.value;
    const tilesetData = g$mul$tileSets[g$init$tilesetDataSel.value];
    if (!tilesetData) return;

    const { tileCount, gridWidth, tileData, tags } = tilesetData;
    // console.log("COUNT", tileCount)
    const hideSymbols =
      !toggleSymbolsVisible$DISPLAY_SYMBOLS || shouldHideSymbols();
    const canvas = document.getElementById("tilesetCanvas");
    const img = g$reloadTilesets$TILESET_ELEMENTS[g$init$tilesetDataSel.value];
    canvas.width = img.width * g$mul$ZOOM;
    canvas.height = img.height * g$mul$ZOOM;
    const ctx = canvas.getContext("2d");
    if (g$mul$ZOOM !== 1) {
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // console.log("WIDTH EXCEEDS?", canvas.width % SIZE_OF_CROP)
    const tileSizeSeemsIncorrect = canvas.width % g$mul$SIZE_OF_CROP !== 0;
    drawGrid(
      ctx.canvas.width,
      ctx.canvas.height,
      ctx,
      g$mul$SIZE_OF_CROP * g$mul$ZOOM,
      tileSizeSeemsIncorrect ? "red" : "cyan"
    );
    Array.from({ length: tileCount }, (x, i) => i).map((tile) => {
      if (viewMode === "frames") {
        const frameData = getCurrentFrames();
        if (!frameData || Object.keys(frameData).length === 0) return;

        const { width, height, start, tiles, frameCount } = frameData;
        g$mul$selection = [...tiles];
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "red";
        ctx.strokeRect(
          g$mul$SIZE_OF_CROP * g$mul$ZOOM * (start.x + width),
          g$mul$SIZE_OF_CROP * g$mul$ZOOM * start.y,
          g$mul$SIZE_OF_CROP * g$mul$ZOOM * (width * (frameCount - 1)),
          g$mul$SIZE_OF_CROP * g$mul$ZOOM * height
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
          x * g$mul$SIZE_OF_CROP * g$mul$ZOOM +
          (g$mul$SIZE_OF_CROP * g$mul$ZOOM) / 3;
        const posY =
          y * g$mul$SIZE_OF_CROP * g$mul$ZOOM +
          (g$mul$SIZE_OF_CROP * g$mul$ZOOM) / 2;
        ctx.fillText(innerTile, posX, posY);
      }
    });
  };

  let g$init$tileSelectStart = null;
  const getSelectedTile = (event) => {
    const { x, y } = event.target.getBoundingClientRect();
    const tileSize =
      g$mul$tileSets[g$init$tilesetDataSel.value].tileSize * g$mul$ZOOM;
    const tx = Math.floor(Math.max(event.clientX - x, 0) / tileSize);
    const ty = Math.floor(Math.max(event.clientY - y, 0) / tileSize);
    // add start tile, add end tile, add all tiles inbetween
    const newSelection = [];
    if (g$init$tileSelectStart !== null) {
      for (let ix = g$init$tileSelectStart.x; ix < tx + 1; ix++) {
        for (let iy = g$init$tileSelectStart.y; iy < ty + 1; iy++) {
          const data = getTileData(ix, iy);
          newSelection.push({ ...data, x: ix, y: iy });
        }
      }
    }
    if (newSelection.length > 0) return newSelection;

    const data = getTileData(tx, ty);
    return [{ ...data, x: tx, y: ty }];
  };

  const draw = (shouldDrawGrid = true) => {
    const ctx = g$init$canvas.getContext("2d")();
    ctx.clearRect(0, 0, g$mul$WIDTH, g$mul$HEIGHT);
    ctx.canvas.width = g$mul$WIDTH;
    ctx.canvas.height = g$mul$HEIGHT;
    if (shouldDrawGrid && !g$init$SHOW_GRID)
      drawGrid(
        g$mul$WIDTH,
        g$mul$HEIGHT,
        ctx,
        g$mul$SIZE_OF_CROP * g$mul$ZOOM,
        g$mul$maps[g$mul$ACTIVE_MAP].gridColor
      );
    const shouldHideHud = shouldHideSymbols();

    g$mul$maps[g$mul$ACTIVE_MAP].layers.forEach((layer) => {
      if (!layer.visible) return;
      ctx.globalAlpha = layer.opacity;
      if (g$mul$ZOOM !== 1) {
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
      }
      //static tiles on this layer
      Object.keys(layer.tiles).forEach((key) => {
        const [positionX, positionY] = key.split("-").map(Number);
        const { x, y, tilesetIdx, isFlippedX } = layer.tiles[key];
        const tileSize =
          g$mul$tileSets[tilesetIdx]?.tileSize || g$mul$SIZE_OF_CROP;

        if (!(tilesetIdx in g$reloadTilesets$TILESET_ELEMENTS)) {
          //texture not found
          ctx.fillStyle = "red";
          ctx.fillRect(
            positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM
          );
          return;
        }
        if (isFlippedX) {
          ctx.save(); //Special canvas crap to flip a slice, cause drawImage cant do it
          ctx.translate(ctx.canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(
            g$reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize,
            ctx.canvas.width -
              positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM -
              g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM
          );
          ctx.restore();
        } else {
          ctx.drawImage(
            g$reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize,
            positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM
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
          g$mul$tileSets[tilesetIdx]?.tileSize || g$mul$SIZE_OF_CROP;

        if (!(tilesetIdx in g$reloadTilesets$TILESET_ELEMENTS)) {
          //texture not found
          ctx.fillStyle = "yellow";
          ctx.fillRect(
            positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM * width,
            g$mul$SIZE_OF_CROP * g$mul$ZOOM * height
          );
          ctx.fillStyle = "blue";
          ctx.fillText(
            "X",
            positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM + 5,
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM + 10
          );
          return;
        }
        const frameIndex =
          g$init$tileDataSel.value === "frames" || frameCount === 1
            ? Math.round(Date.now() / 120) % frameCount
            : 1; //30fps

        if (isFlippedX) {
          ctx.save(); //Special canvas crap to flip a slice, cause drawImage cant do it
          ctx.translate(ctx.canvas.width, 0);
          ctx.scale(-1, 1);

          const positionXFlipped =
            ctx.canvas.width -
            positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM -
            g$mul$SIZE_OF_CROP * g$mul$ZOOM;
          if (shouldDrawGrid && !shouldHideHud) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(250,240,255, 0.7)";
            ctx.rect(
              positionXFlipped,
              positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
              g$mul$SIZE_OF_CROP * g$mul$ZOOM * width,
              g$mul$SIZE_OF_CROP * g$mul$ZOOM * height
            );
            ctx.stroke();
          }
          ctx.drawImage(
            g$reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
            x * tileSize + frameIndex * tileSize * width,
            y * tileSize,
            tileSize * width, // src width
            tileSize * height, // src height
            positionXFlipped,
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM, //target y
            g$mul$SIZE_OF_CROP * g$mul$ZOOM * width, // target width
            g$mul$SIZE_OF_CROP * g$mul$ZOOM * height // target height
          );
          if (shouldDrawGrid && !shouldHideHud) {
            ctx.fillStyle = "white";
            ctx.fillText(
              "🔛",
              positionXFlipped + 5,
              positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM + 10
            );
          }
          ctx.restore();
        } else {
          if (shouldDrawGrid && !shouldHideHud) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(250,240,255, 0.7)";
            ctx.rect(
              positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
              positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM,
              g$mul$SIZE_OF_CROP * g$mul$ZOOM * width,
              g$mul$SIZE_OF_CROP * g$mul$ZOOM * height
            );
            ctx.stroke();
          }
          ctx.drawImage(
            g$reloadTilesets$TILESET_ELEMENTS[tilesetIdx],
            x * tileSize + frameIndex * tileSize * width, //src x
            y * tileSize, //src y
            tileSize * width, // src width
            tileSize * height, // src height
            positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM, //target x
            positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM, //target y
            g$mul$SIZE_OF_CROP * g$mul$ZOOM * width, // target width
            g$mul$SIZE_OF_CROP * g$mul$ZOOM * height // target height
          );
          if (shouldDrawGrid && !shouldHideHud) {
            ctx.fillStyle = "white";
            ctx.fillText(
              "⭕",
              positionX * g$mul$SIZE_OF_CROP * g$mul$ZOOM + 5,
              positionY * g$mul$SIZE_OF_CROP * g$mul$ZOOM + 10
            );
          }
        }
      });
    });
    if (g$init$SHOW_GRID)
      drawGrid(
        g$mul$WIDTH,
        g$mul$HEIGHT,
        ctx,
        g$mul$SIZE_OF_CROP * g$mul$ZOOM,
        g$mul$maps[g$mul$ACTIVE_MAP].gridColor
      );
    onUpdateState();
  };

  const setMouseIsTrue = (e) => {
    if (e.button === 0) {
      g$mul$isMouseDown = true;
    } else if (e.button === 1) {
      g$mul$PREV_ACTIVE_TOOL = g$mul$ACTIVE_TOOL;
      setActiveTool(TOOLS.PAN);
    }
  };

  const setMouseIsFalse = (e) => {
    if (e.button === 0) {
      g$mul$isMouseDown = false;
    } else if (e.button === 1 && g$mul$ACTIVE_TOOL === TOOLS.PAN) {
      setActiveTool(g$mul$PREV_ACTIVE_TOOL);
    }
  };

  const removeTile = (key) => {
    delete g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[
      key
    ];
    if (
      key in
      (g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer]
        .animatedTiles || {})
    )
      delete g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer]
        .animatedTiles[key];
  };

  const isFlippedOnX = () => document.getElementById("toggleFlipX").checked;
  const addSelectedTiles = (key, tiles) => {
    const [x, y] = key.split("-");
    const tilesPatch = tiles || g$mul$selection; // tiles is opt override for selection for fancy things like random patch of tiles
    const { x: startX, y: startY } = tilesPatch[0]; // add selection override
    const selWidth = g$updateSelection$selectionSize[0];
    const selHeight = g$updateSelection$selectionSize[1];
    g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[key] =
      tilesPatch[0];
    const isFlippedX = isFlippedOnX();
    for (let ix = 0; ix < selWidth; ix++) {
      for (let iy = 0; iy < selHeight; iy++) {
        const tileX = isFlippedX ? Number(x) - ix : Number(x) + ix; //placed in reverse when flipped on x
        const coordKey = `${tileX}-${Number(y) + iy}`;
        g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[
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
    g$mul$tileSets[g$init$tilesetDataSel.value]?.frames[
      g$init$tileFrameSel.value
    ];
  const getSelectedFrameCount = () => getCurrentFrames()?.frameCount || 1;
  const shouldNotAddAnimatedTile = () =>
    (g$init$tileDataSel.value !== "frames" && getSelectedFrameCount() !== 1) ||
    Object.keys(g$mul$tileSets[g$init$tilesetDataSel.value]?.frames).length ===
      0;
  const addTile = (key) => {
    if (shouldNotAddAnimatedTile()) {
      addSelectedTiles(key);
    } else {
      // if animated tile mode and has more than one frames, add/remove to animatedTiles
      if (
        !g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer]
          .animatedTiles
      )
        g$mul$maps[g$mul$ACTIVE_MAP].layers[
          g$setLayer$currentLayer
        ].animatedTiles = {};
      const isFlippedX = isFlippedOnX();
      const [x, y] = key.split("-");
      g$mul$maps[g$mul$ACTIVE_MAP].layers[
        g$setLayer$currentLayer
      ].animatedTiles[key] = {
        ...getCurrentFrames(),
        isFlippedX,
        layer: g$setLayer$currentLayer,
        xPos: Number(x) * g$mul$SIZE_OF_CROP,
        yPos: Number(y) * g$mul$SIZE_OF_CROP,
      };
    }
  };

  const addRandomTile = (key) => {
    // TODO add probability for empty
    if (shouldNotAddAnimatedTile()) {
      g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[key] =
        g$mul$selection[Math.floor(Math.random() * g$mul$selection.length)];
    } else {
      // do the same, but add random from frames instead
      const tilesetTiles = g$mul$tileSets[g$init$tilesetDataSel.value].tileData;
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
      g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[key];
    Array.from(
      { length: g$mul$mapTileWidth * g$mul$mapTileHeight },
      (x, i) => i
    ).map((tile) => {
      const x = tile % g$mul$mapTileWidth;
      const y = Math.floor(tile / g$mul$mapTileWidth);
      const coordKey = `${x}-${y}`;
      const filledTile =
        g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[
          coordKey
        ];

      if (
        pickedTile &&
        filledTile &&
        filledTile.x === pickedTile.x &&
        filledTile.y === pickedTile.y
      ) {
        g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[
          coordKey
        ] = g$mul$selection[0]; // Replace all clicked on tiles with selected
      } else if (
        !pickedTile &&
        !(
          coordKey in
          g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles
        )
      ) {
        g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].tiles[
          coordKey
        ] = g$mul$selection[0]; // when clicked on empty, replace all empty with selection
      }
    });
  };

  const selectMode = (mode = null) => {
    if (mode !== null) g$init$tileDataSel.value = mode;
    document.getElementById("tileFrameSelContainer").style.display =
      g$init$tileDataSel.value === "frames" ? "flex" : "none";
    // tilesetContainer.style.top = tileDataSel.value ===  "frames" ? "45px" : "0";
    updateTilesetGridContainer();
  };
  const getTile = (key, allLayers = false) => {
    const layers = g$mul$maps[g$mul$ACTIVE_MAP].layers;
    g$getTile$editedEntity = undefined;
    const clicked = allLayers
      ? [...layers].reverse().find((layer, index) => {
          if (layer.animatedTiles && key in layer.animatedTiles) {
            setLayer(layers.length - index - 1);
            g$getTile$editedEntity = layer.animatedTiles[key];
          }
          if (key in layer.tiles) {
            setLayer(layers.length - index - 1);
            return layer.tiles[key];
          }
        })?.tiles[key] //TODO this doesnt work on animatedTiles
      : layers[g$setLayer$currentLayer].tiles[key];

    if (clicked && !g$getTile$editedEntity) {
      g$mul$selection = [clicked];

      // console.log("clicked", clicked, "entity data",editedEntity)
      document.getElementById("toggleFlipX").checked = !!clicked?.isFlippedX;
      // TODO switch to different tileset if its from a different one
      // if(clicked.tilesetIdx !== tilesetDataSel.value) {
      //     tilesetDataSel.value = clicked.tilesetIdx;
      //     reloadTilesets();
      //     updateTilesetGridContainer();
      // }
      selectMode("");
      updateSelection();
      return true;
    } else if (g$getTile$editedEntity) {
      // console.log("Animated tile found", editedEntity)
      g$mul$selection = g$getTile$editedEntity.tiles;
      document.getElementById("toggleFlipX").checked =
        g$getTile$editedEntity.isFlippedX;
      setLayer(g$getTile$editedEntity.layer);
      g$init$tileFrameSel.value = g$getTile$editedEntity.name;
      updateSelection();
      selectMode("frames");
      return true;
    } else {
      return false;
    }
  };

  const toggleTile = (event) => {
    if (
      g$mul$ACTIVE_TOOL === TOOLS.PAN ||
      !g$mul$maps[g$mul$ACTIVE_MAP].layers[g$setLayer$currentLayer].visible
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
      g$mul$ACTIVE_TOOL === TOOLS.PICK
    ) {
      const pickedTile = getTile(key, true);
      if (g$mul$ACTIVE_TOOL === TOOLS.BRUSH && !pickedTile)
        setActiveTool(TOOLS.ERASE); //picking empty tile, sets tool to eraser
      else if (
        g$mul$ACTIVE_TOOL === TOOLS.FILL ||
        g$mul$ACTIVE_TOOL === TOOLS.RAND
      )
        setActiveTool(TOOLS.BRUSH); //
    } else {
      if (g$mul$ACTIVE_TOOL === TOOLS.BRUSH) {
        addTile(key); // also works with animated
      } else if (g$mul$ACTIVE_TOOL === TOOLS.ERASE) {
        removeTile(key); // also works with animated
      } else if (g$mul$ACTIVE_TOOL === TOOLS.RAND) {
        addRandomTile(key);
      } else if (g$mul$ACTIVE_TOOL === TOOLS.FILL) {
        fillEmptyOrSameTiles(key);
      }
    }
    draw();
    addToUndoStack();
  };

  const clearCanvas = () => {
    addToUndoStack();
    g$mul$maps[g$mul$ACTIVE_MAP].layers = [
      getEmptyLayer("bottom"),
      getEmptyLayer("middle"),
      getEmptyLayer("top"),
    ];
    setLayer(0);
    updateLayers();
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
    downloadAsTextFile({ tileSets: g$mul$tileSets, maps: g$mul$maps });
  };

  const exportImage = () => {
    draw(false);
    const data = g$init$canvas.toDataURL();
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
    const prevZoom = g$mul$ZOOM;
    g$mul$ZOOM = 1; // needed for correct eval
    updateZoom();
    draw(false);
    const { analizedTiles, uniqueTiles } = getTilesAnalisis(
      g$init$canvas.getContext("2d")(),
      g$mul$WIDTH,
      g$mul$HEIGHT,
      g$mul$SIZE_OF_CROP
    );
    const data = g$init$canvas.toDataURL();
    const image = new Image();
    image.src = data;
    const ctx = g$init$canvas.getContext("2d")();
    g$mul$ZOOM = prevZoom;
    updateZoom();
    draw(false);
    Object.values(analizedTiles).map((t) => {
      // Fill the heatmap
      t.coords.forEach((c, i) => {
        const fillStyle = `rgba(255, 0, 0, ${1 / t.times - 0.35})`;
        ctx.fillStyle = fillStyle;
        ctx.fillRect(
          c.x * g$mul$ZOOM,
          c.y * g$mul$ZOOM,
          g$mul$SIZE_OF_CROP * g$mul$ZOOM,
          g$mul$SIZE_OF_CROP * g$mul$ZOOM
        );
      });
    });
    drawGrid(
      g$mul$WIDTH,
      g$mul$HEIGHT,
      ctx,
      g$mul$SIZE_OF_CROP * g$mul$ZOOM,
      "rgba(255,213,0,0.5)"
    );
    ctx.fillStyle = "white";
    ctx.font = "bold 17px arial";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.lineWidth = 3;
    ctx.fillText(`Unique tiles: ${uniqueTiles}`, 4, g$mul$HEIGHT - 30);
    ctx.fillText(
      `Map size: ${g$mul$mapTileWidth}x${g$mul$mapTileHeight}`,
      4,
      g$mul$HEIGHT - 10
    );
  };
  const exportUniqueTiles = () => {
    const ctx = g$init$canvas.getContext("2d")();
    const prevZoom = g$mul$ZOOM;
    g$mul$ZOOM = 1; // needed for correct eval
    updateZoom();
    draw(false);
    const { analizedTiles } = getTilesAnalisis(
      g$init$canvas.getContext("2d")(),
      g$mul$WIDTH,
      g$mul$HEIGHT,
      g$mul$SIZE_OF_CROP
    );
    ctx.clearRect(0, 0, g$mul$WIDTH, g$mul$HEIGHT);
    const gridWidth = g$init$tilesetImage.width / g$mul$SIZE_OF_CROP;
    Object.values(analizedTiles).map((t, i) => {
      const positionX = i % gridWidth;
      const positionY = Math.floor(i / gridWidth);
      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = g$mul$SIZE_OF_CROP;
      tileCanvas.height = g$mul$SIZE_OF_CROP;
      const tileCtx = tileCanvas.getContext("2d");
      tileCtx.putImageData(t.tileData, 0, 0);
      ctx.drawImage(
        tileCanvas,
        0,
        0,
        g$mul$SIZE_OF_CROP,
        g$mul$SIZE_OF_CROP,
        positionX * g$mul$SIZE_OF_CROP,
        positionY * g$mul$SIZE_OF_CROP,
        g$mul$SIZE_OF_CROP,
        g$mul$SIZE_OF_CROP
      );
    });
    const data = g$init$canvas.toDataURL();
    const image = new Image();
    image.src = data;
    image.crossOrigin = "anonymous";
    const w = window.open("");
    w.document.write(image.outerHTML);
    g$mul$ZOOM = prevZoom;
    updateZoom();
    draw();
  };

  exports.getLayers = () => {
    return g$mul$maps[g$mul$ACTIVE_MAP].layers;
  };

  const renameCurrentTileSymbol = () => {
    const { x, y, tileSymbol } = g$mul$selection[0];
    const newSymbol = window.prompt("Enter tile symbol", tileSymbol || "*");
    if (newSymbol !== null) {
      setTileData(x, y, newSymbol, "tileSymbol");
      updateSelection();
      updateTilesetGridContainer();
      addToUndoStack();
    }
  };

  const getFlattenedData = () => {
    const result = Object.entries(g$mul$maps).map(([key, map]) => {
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
      maps: g$mul$maps,
      tileSets: g$mul$tileSets,
      flattenedData: getFlattenedData(),
      activeMap: g$mul$ACTIVE_MAP,
      downloadAsTextFile,
    };
    console.log("Exported ", exportData);
    return exportData;
  };

  const updateMapSize = (size) => {
    if (size?.mapWidth && size?.mapWidth > 1) {
      g$mul$mapTileWidth = size?.mapWidth;
      g$mul$WIDTH = g$mul$mapTileWidth * g$mul$SIZE_OF_CROP * g$mul$ZOOM;
      g$mul$maps[g$mul$ACTIVE_MAP].mapWidth = g$mul$mapTileWidth;
      document.querySelector(
        ".canvas_resizer[resizerdir='x']"
      ).style = `left:${g$mul$WIDTH}px`;
      document.querySelector(".canvas_resizer[resizerdir='x'] input").value =
        String(g$mul$mapTileWidth);
      document.getElementById("canvasWidthInp").value =
        String(g$mul$mapTileWidth);
    }
    if (size?.mapHeight && size?.mapHeight > 1) {
      g$mul$mapTileHeight = size?.mapHeight;
      g$mul$HEIGHT = g$mul$mapTileHeight * g$mul$SIZE_OF_CROP * g$mul$ZOOM;
      g$mul$maps[g$mul$ACTIVE_MAP].mapHeight = g$mul$mapTileHeight;
      document.querySelector(
        ".canvas_resizer[resizerdir='y']"
      ).style = `top:${g$mul$HEIGHT}px`;
      document.querySelector(".canvas_resizer[resizerdir='y'] input").value =
        String(g$mul$mapTileHeight);
      document.getElementById("canvasHeightInp").value =
        String(g$mul$mapTileHeight);
    }
    draw();
  };

  const setActiveMap = (id) => {
    g$mul$ACTIVE_MAP = id;
    document.getElementById("gridColorSel").value =
      g$mul$maps[g$mul$ACTIVE_MAP].gridColor || "#00FFFF";
    draw();
    updateMapSize({
      mapWidth: g$mul$maps[g$mul$ACTIVE_MAP].mapWidth,
      mapHeight: g$mul$maps[g$mul$ACTIVE_MAP].mapHeight,
    });
    updateLayers();
  };

  let g$mul$undoStepPosition = -1;
  let g$clearUndoStack$undoStack = [];
  const clearUndoStack = () => {
    g$clearUndoStack$undoStack = [];
    g$mul$undoStepPosition = -1;
  };
  const getAppState = () => {
    // TODO we need for tilesets to load - rapidly refreshing the browser may return empty tilesets object!
    if (
      Object.keys(g$mul$tileSets).length === 0 &&
      g$mul$tileSets.constructor === Object
    )
      return null;
    return {
      tileMapData: { tileSets: g$mul$tileSets, maps: g$mul$maps },
      appState: {
        undoStack: g$clearUndoStack$undoStack,
        undoStepPosition: g$mul$undoStepPosition,
        currentLayer: g$setLayer$currentLayer,
        PREV_ACTIVE_TOOL: g$mul$PREV_ACTIVE_TOOL,
        ACTIVE_TOOL: g$mul$ACTIVE_TOOL,
        ACTIVE_MAP: g$mul$ACTIVE_MAP,
        SHOW_GRID: g$init$SHOW_GRID,
        selection: g$mul$selection,
      },
      //Todo tileSize and the others
      // undo stack is lost
    };
  };
  const onUpdateState = () => {
    g$init$apiOnUpdateCallback(getAppState());
  };
  const addToUndoStack = () => {
    if (
      Object.keys(g$mul$tileSets).length === 0 ||
      Object.keys(g$mul$maps).length === 0
    )
      return;
    const oldState =
      g$clearUndoStack$undoStack.length > 0
        ? JSON.stringify({
            maps: g$clearUndoStack$undoStack[g$mul$undoStepPosition].maps,
            tileSets:
              g$clearUndoStack$undoStack[g$mul$undoStepPosition].tileSets,
            currentLayer:
              g$clearUndoStack$undoStack[g$mul$undoStepPosition].currentLayer,
            ACTIVE_MAP:
              g$clearUndoStack$undoStack[g$mul$undoStepPosition].ACTIVE_MAP,
            IMAGES: g$clearUndoStack$undoStack[g$mul$undoStepPosition].IMAGES,
          })
        : undefined;
    const newState = JSON.stringify({
      maps: g$mul$maps,
      tileSets: g$mul$tileSets,
      currentLayer: g$setLayer$currentLayer,
      ACTIVE_MAP: g$mul$ACTIVE_MAP,
      IMAGES: g$mul$IMAGES,
    });
    if (newState === oldState) return; // prevent updating when no changes are present in the data!

    g$mul$undoStepPosition += 1;
    g$clearUndoStack$undoStack.length = g$mul$undoStepPosition;
    g$clearUndoStack$undoStack.push(
      JSON.parse(
        JSON.stringify({
          maps: g$mul$maps,
          tileSets: g$mul$tileSets,
          currentLayer: g$setLayer$currentLayer,
          ACTIVE_MAP: g$mul$ACTIVE_MAP,
          IMAGES: g$mul$IMAGES,
          undoStepPosition: g$mul$undoStepPosition,
        })
      )
    );
    // console.log("undo stack updated", undoStack, undoStepPosition)
  };
  const restoreFromUndoStackData = () => {
    g$mul$maps = decoupleReferenceFromObj(
      g$clearUndoStack$undoStack[g$mul$undoStepPosition].maps
    );
    const undoTileSets = decoupleReferenceFromObj(
      g$clearUndoStack$undoStack[g$mul$undoStepPosition].tileSets
    );
    const undoIMAGES = decoupleReferenceFromObj(
      g$clearUndoStack$undoStack[g$mul$undoStepPosition].IMAGES
    );
    if (JSON.stringify(g$mul$IMAGES) !== JSON.stringify(undoIMAGES)) {
      // images needs to happen before tilesets
      g$mul$IMAGES = undoIMAGES;
      reloadTilesets();
    }
    if (JSON.stringify(undoTileSets) !== JSON.stringify(g$mul$tileSets)) {
      // done to prevent the below, which is expensive
      g$mul$tileSets = undoTileSets;
      updateTilesetGridContainer();
    }
    g$mul$tileSets = undoTileSets;
    updateTilesetDataList();

    const undoLayer = decoupleReferenceFromObj(
      g$clearUndoStack$undoStack[g$mul$undoStepPosition].currentLayer
    );
    const undoActiveMap = decoupleReferenceFromObj(
      g$clearUndoStack$undoStack[g$mul$undoStepPosition].ACTIVE_MAP
    );
    if (undoActiveMap !== g$mul$ACTIVE_MAP) {
      setActiveMap(undoActiveMap);
      updateMaps();
    }
    updateLayers(); // needs to happen after active map is set and maps are updated
    setLayer(undoLayer);
    draw();
  };
  const undo = () => {
    if (g$mul$undoStepPosition === 0) return;
    g$mul$undoStepPosition -= 1;
    restoreFromUndoStackData();
  };
  const redo = () => {
    if (g$mul$undoStepPosition === g$clearUndoStack$undoStack.length - 1)
      return;
    g$mul$undoStepPosition += 1;
    restoreFromUndoStackData();
  };
  const zoomLevels = [0.25, 0.5, 1, 2, 3, 4];
  let g$mul$zoomIndex = 1;
  const updateZoom = () => {
    g$init$tilesetImage.style = `transform: scale(${g$mul$ZOOM});transform-origin: left top;image-rendering: auto;image-rendering: crisp-edges;image-rendering: pixelated;`;
    g$init$tilesetContainer.style.width = `${
      g$init$tilesetImage.width * g$mul$ZOOM
    }px`;
    g$init$tilesetContainer.style.height = `${
      g$init$tilesetImage.height * g$mul$ZOOM
    }px`;
    document.getElementById("zoomLabel").innerText = `${g$mul$ZOOM}x`;
    updateTilesetGridContainer();
    updateSelection(false);
    updateMapSize({
      mapWidth: g$mul$mapTileWidth,
      mapHeight: g$mul$mapTileHeight,
    });
    g$mul$WIDTH = g$mul$mapTileWidth * g$mul$SIZE_OF_CROP * g$mul$ZOOM; // needed when setting zoom?
    g$mul$HEIGHT = g$mul$mapTileHeight * g$mul$SIZE_OF_CROP * g$mul$ZOOM;
    g$mul$zoomIndex =
      zoomLevels.indexOf(g$mul$ZOOM) === -1
        ? 0
        : zoomLevels.indexOf(g$mul$ZOOM);
  };
  const zoomIn = () => {
    if (g$mul$zoomIndex >= zoomLevels.length - 1) return;
    g$mul$zoomIndex += 1;
    g$mul$ZOOM = zoomLevels[g$mul$zoomIndex];
    updateZoom();
  };
  const zoomOut = () => {
    if (g$mul$zoomIndex === 0) return;
    g$mul$zoomIndex -= 1;
    g$mul$ZOOM = zoomLevels[g$mul$zoomIndex];
    updateZoom();
  };

  const toggleSymbolsVisible = (override = null) => {
    if (override === null)
      toggleSymbolsVisible$DISPLAY_SYMBOLS =
        !toggleSymbolsVisible$DISPLAY_SYMBOLS;
    document.getElementById("setSymbolsVisBtn").innerHTML =
      toggleSymbolsVisible$DISPLAY_SYMBOLS ? "👁️" : "👓";
    updateTilesetGridContainer();
  };

  const getCurrentAnimation = (getAnim) =>
    g$mul$tileSets[g$init$tilesetDataSel.value]?.frames[
      g$init$tileFrameSel.value
    ]?.animations?.[getAnim || g$init$tileAnimSel.value];
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
        g$init$tileDataSel,
        g$mul$tileSets[g$init$tilesetDataSel.value]?.tags,
        `<option value="">Symbols (${
          g$mul$tileSets[g$init$tilesetDataSel.value]?.tileCount || "?"
        })</option><option value="frames">Objects</option>`
      );
    else {
      populateWithOptions(
        g$init$tileFrameSel,
        g$mul$tileSets[g$init$tilesetDataSel.value]?.frames,
        ""
      );
      populateWithOptions(
        g$init$tileAnimSel,
        g$mul$tileSets[g$init$tilesetDataSel.value]?.frames[
          g$init$tileFrameSel.value
        ]?.animations,
        ""
      );
    }

    document.getElementById("tileFrameCount").value =
      getCurrentFrames()?.frameCount || 1;
    const currentAnim = getCurrentAnimation();
    g$state$el.animStart().max = g$state$el.tileFrameCount().value;
    g$state$el.animEnd().max = g$state$el.tileFrameCount().value;
    if (currentAnim) {
      console.log({ currentAnim });
      g$state$el.animStart().value = currentAnim.start || 1;
      g$state$el.animEnd().value = currentAnim.end || 1;
      g$state$el.animLoop().checked = currentAnim.loop || false;
      g$state$el.animSpeed().value = currentAnim.speed || 1;
    }
  };

  const reevaluateTilesetsData = () => {
    let symbolStartIdx = 0;
    Object.entries(g$mul$tileSets).forEach(([key, old]) => {
      const tileData = {};
      // console.log("OLD DATA",old)
      const tileSize = old.tileSize || g$mul$SIZE_OF_CROP;
      const gridWidth = Math.ceil(old.width / tileSize);
      const gridHeight = Math.ceil(old.height / tileSize);
      const tileCount = gridWidth * gridHeight;

      Array.from({ length: tileCount }, (x, i) => i).map((tile) => {
        const x = tile % gridWidth;
        const y = Math.floor(tile / gridWidth);
        const oldTileData = old?.[`${x}-${y}`]?.tileData;
        const tileSymbol = randomLetters[Math.floor(symbolStartIdx + tile)];
        tileData[`${x}-${y}`] = {
          ...oldTileData,
          x,
          y,
          tilesetIdx: key,
          tileSymbol,
        };
        g$mul$tileSets[key] = {
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
    if (newSize === g$mul$SIZE_OF_CROP && g$init$cropSize.value === newSize)
      return;
    g$mul$tileSets[g$init$tilesetDataSel.value].tileSize = newSize;
    g$mul$IMAGES.forEach((ts, idx) => {
      if (ts.src === g$init$tilesetImage.src)
        g$mul$IMAGES[idx].tileSize = newSize;
    });
    g$mul$SIZE_OF_CROP = newSize;
    g$init$cropSize.value = g$mul$SIZE_OF_CROP;
    document.getElementById("gridCropSize").value = g$mul$SIZE_OF_CROP;
    // console.log("NEW SIZE", tilesetDataSel.value,tileSets[tilesetDataSel.value], newSize,ACTIVE_MAP, maps)
    updateZoom();
    updateTilesetGridContainer();
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
      tileSize = g$mul$SIZE_OF_CROP,
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

    g$reloadTilesets$TILESET_ELEMENTS = [];
    g$init$tilesetDataSel.innerHTML = "";
    // Use to prevent old data from erasure
    const oldTilesets = { ...g$mul$tileSets };
    g$mul$tileSets = {};
    // let symbolStartIdx = 0;
    // Generate tileset data for each of the loaded images
    g$mul$IMAGES.forEach((tsImage, idx) => {
      const newOpt = document.createElement("option");
      newOpt.innerText = tsImage.name || `tileset ${idx}`;
      newOpt.value = idx;
      g$init$tilesetDataSel.appendChild(newOpt);
      const tilesetImgElement = document.createElement("img");
      tilesetImgElement.src = tsImage.src;
      tilesetImgElement.crossOrigin = "Anonymous";
      g$reloadTilesets$TILESET_ELEMENTS.push(tilesetImgElement);
    });

    Promise.all(
      Array.from(g$reloadTilesets$TILESET_ELEMENTS)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    ).then(() => {
      // console.log("TILESET ELEMENTS", TILESET_ELEMENTS)
      g$reloadTilesets$TILESET_ELEMENTS.forEach((tsImage, idx) => {
        const tileSize = tsImage.tileSize || g$mul$SIZE_OF_CROP;
        g$mul$tileSets[idx] = getEmptyTileSet({
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
      g$init$tilesetImage.src = g$reloadTilesets$TILESET_ELEMENTS[0].src;
      g$init$tilesetImage.crossOrigin = "Anonymous";
      updateSelection(false);
      updateTilesetGridContainer();
    });
    // finally current tileset loaded
    g$init$tilesetImage.addEventListener("load", () => {
      draw();
      updateLayers();
      if (g$mul$selection.length === 0) g$mul$selection = [getTileData(0, 0)];
      updateSelection(false);
      updateTilesetDataList();
      updateTilesetDataList(true);
      updateTilesetGridContainer();
      document.getElementById(
        "tilesetSrcLabel"
      ).innerHTML = `src: <a href="${g$init$tilesetImage.src}">${g$init$tilesetImage.src}</a>`;
      document.getElementById("tilesetSrcLabel").title =
        g$init$tilesetImage.src;
      const tilesetExtraInfo = g$mul$IMAGES.find(
        (ts) => ts.src === g$init$tilesetImage.src
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
      setCropSize(g$mul$tileSets[g$init$tilesetDataSel.value].tileSize);
      updateZoom();
      document.querySelector(
        '.canvas_resizer[resizerdir="x"]'
      ).style = `left:${g$mul$WIDTH}px;`;

      if (g$mul$undoStepPosition === -1) addToUndoStack(); //initial undo stack entry
    });
  };

  const updateMaps = () => {
    g$init$mapsDataSel.innerHTML = "";
    let lastMap = g$mul$ACTIVE_MAP;
    Object.keys(g$mul$maps).forEach((key, idx) => {
      const newOpt = document.createElement("option");
      newOpt.innerText = g$mul$maps[key].name; //`map ${idx}`;
      newOpt.value = key;
      g$init$mapsDataSel.appendChild(newOpt);
      if (idx === Object.keys(g$mul$maps).length - 1) lastMap = key;
    });
    g$init$mapsDataSel.value = lastMap;
    setActiveMap(lastMap);
    document.getElementById("removeMapBtn").disabled =
      Object.keys(g$mul$maps).length === 1;
  };
  const loadData = (data) => {
    try {
      clearUndoStack();
      g$mul$WIDTH = g$init$canvas.width * g$mul$ZOOM;
      g$mul$HEIGHT = g$init$canvas.height * g$mul$ZOOM;
      g$mul$selection = [{}];
      g$mul$ACTIVE_MAP = data ? Object.keys(data.maps)[0] : "Map_1";
      g$mul$maps = data
        ? { ...data.maps }
        : {
            [g$mul$ACTIVE_MAP]: getEmptyMap(
              { SIZE_OF_CROP: g$mul$SIZE_OF_CROP },
              "Map 1",
              g$mul$mapTileWidth,
              g$mul$mapTileHeight
            ),
          };
      g$mul$tileSets = data ? { ...data.tileSets } : {};
      reloadTilesets();
      g$init$tilesetDataSel.value = "0";
      g$init$cropSize.value = data
        ? g$mul$tileSets[g$init$tilesetDataSel.value]?.tileSize ||
          g$mul$maps[g$mul$ACTIVE_MAP].tileSize
        : g$mul$SIZE_OF_CROP;
      document.getElementById("gridCropSize").value = g$init$cropSize.value;
      updateMaps();
      updateMapSize({
        mapWidth: g$mul$maps[g$mul$ACTIVE_MAP].mapWidth,
        mapHeight: g$mul$maps[g$mul$ACTIVE_MAP].mapHeight,
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

    // Attach
    const attachTo = document.getElementById(attachToId);
    if (attachTo === null) return;

    g$init_state$apiTileSetLoaders = tileSetLoaders || {};
    g$init_state$apiTileSetLoaders.base64 = {
      name: "Fs (as base64)",
      onSelectImage: (setSrc, file, base64) => {
        setSrc(base64);
      },
    };
    g$init_state$apiTileMapExporters = tileMapExporters;
    g$init_state$apiTileMapExporters.exportAsImage = {
      name: "Export Map as image",
      transformer: exportImage,
    };
    g$init_state$apiTileMapExporters.saveData = {
      name: "Download Json file",
      transformer: exportJson,
    };
    g$init_state$apiTileMapExporters.analizeTilemap = {
      name: "Analize tilemap",
      transformer: drawAnaliticsReport,
    };
    g$init_state$apiTileMapExporters.exportTilesFromMap = {
      name: "Extract tileset from map",
      transformer: exportUniqueTiles,
    };
    g$init_state$apiTileMapImporters = tileMapImporters;
    g$init_state$apiTileMapImporters.openData = {
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
    g$init$apiOnUpdateCallback = onUpdate;

    if (onMouseUp) {
      g$init$apiOnMouseUp = onMouseUp;
      document
        .getElementById("tileMapEditor")
        .addEventListener("pointerup", function () {
          g$init$apiOnMouseUp(getAppState(), g$init_state$apiTileMapExporters);
        });
    }

    const importedTilesetImages =
      (tileMapData?.tileSets && Object.values(tileMapData?.tileSets)) ||
      tileSetImages;
    g$mul$IMAGES = importedTilesetImages;
    g$mul$SIZE_OF_CROP = importedTilesetImages?.[0]?.tileSize || tileSize || 32; //to the best of your ability, predict the init tileSize
    g$mul$mapTileWidth = mapWidth || 12;
    g$mul$mapTileHeight = mapHeight || 12;
    // const canvasWidth = mapTileWidth * tileSize * ZOOM;
    // const canvasHeight = mapTileHeight * tileSize * ZOOM;

    if (g$mul$SIZE_OF_CROP < 12) g$mul$ZOOM = 2; // Automatically start with zoom 2 when the tilesize is tiny
    // Attach elements
    attachTo.innerHTML = html({
      width,
      height,
      mapTileWidth: g$mul$mapTileWidth,
    });
    attachTo.className = "tilemap_editor_root";
    g$init$tilesetImage = document.createElement("img");
    g$init$cropSize = document.getElementById("cropSize");

    g$init$confirmBtn = document.getElementById("confirmBtn");
    if (onApply) {
      g$init$confirmBtn.innerText = applyButtonText || "Ok";
    } else {
      g$init$confirmBtn.style.display = "none";
    }
    g$init$canvas = document.getElementById("mapCanvas");
    g$init$tilesetContainer = document.querySelector(".tileset-container");
    g$init$tilesetSelection = document.querySelector(
      ".tileset-container-selection"
    );
    // tilesetGridContainer = document.getElementById("tilesetGridContainer");
    g$init$layersElement = document.getElementById("layers");
    g$init$objectParametersEditor = document.getElementById(
      "objectParametersEditor"
    );

    g$init$tilesetContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    g$init$tilesetContainer.addEventListener("pointerdown", (e) => {
      g$init$tileSelectStart = getSelectedTile(e)[0];
    });
    g$init$tilesetContainer.addEventListener("pointermove", (e) => {
      if (g$init$tileSelectStart !== null) {
        g$mul$selection = getSelectedTile(e);
        updateSelection();
      }
    });

    const setFramesToSelection = (objectName, animName = "") => {
      console.log({ animName, objectName });
      if (objectName === "" || typeof objectName !== "string") return;
      g$mul$tileSets[g$init$tilesetDataSel.value].frames[objectName] = {
        ...(g$mul$tileSets[g$init$tilesetDataSel.value].frames[objectName] ||
          {}),
        width: g$updateSelection$selectionSize[0],
        height: g$updateSelection$selectionSize[1],
        start: g$mul$selection[0],
        tiles: g$mul$selection,
        name: objectName,
        //To be set when placing tile
        layer: undefined,
        isFlippedX: false,
        xPos: 0,
        yPos: 0, //TODO free position
      };
    };
    g$init$tilesetContainer.addEventListener("pointerup", (e) => {
      setTimeout(() => {
        document.getElementById("tilesetDataDetails").open = false;
      }, 100);

      g$mul$selection = getSelectedTile(e);
      updateSelection();
      g$mul$selection = getSelectedTile(e);
      g$init$tileSelectStart = null;

      const viewMode = g$init$tileDataSel.value;
      if (viewMode === "" && e.button === 2) {
        renameCurrentTileSymbol();
        return;
      }
      if (e.button === 0) {
        if (
          toggleSymbolsVisible$DISPLAY_SYMBOLS &&
          viewMode !== "" &&
          viewMode !== "frames"
        ) {
          g$mul$selection.forEach((selected) => {
            addToUndoStack();
            const { x, y } = selected;
            const tileKey = `${x}-${y}`;
            const tagTiles =
              g$mul$tileSets[g$init$tilesetDataSel.value]?.tags[viewMode]
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
          setFramesToSelection(g$init$tileFrameSel.value);
        }
        updateTilesetGridContainer();
      }
    });
    g$init$tilesetContainer.addEventListener("dblclick", (e) => {
      const viewMode = g$init$tileDataSel.value;
      if (viewMode === "") {
        renameCurrentTileSymbol();
      }
    });
    document.getElementById("addLayerBtn").addEventListener("click", () => {
      addToUndoStack();
      addLayer();
    });
    // Maps DATA callbacks
    g$init$mapsDataSel = document.getElementById("mapsDataSel");
    g$init$mapsDataSel.addEventListener("change", (e) => {
      addToUndoStack();
      setActiveMap(e.target.value);
      addToUndoStack();
    });
    document.getElementById("addMapBtn").addEventListener("click", () => {
      const suggestMapName = `Map ${Object.keys(g$mul$maps).length + 1}`;
      const result = window.prompt("Enter new map key...", suggestMapName);
      if (result !== null) {
        addToUndoStack();
        const newMapKey = result.trim().replaceAll(" ", "_") || suggestMapName;
        if (newMapKey in g$mul$maps) {
          alert("A map with this key already exists.");
          return;
        }
        g$mul$maps[newMapKey] = getEmptyMap(
          { SIZE_OF_CROP: g$mul$SIZE_OF_CROP },
          result.trim()
        );
        addToUndoStack();
        updateMaps();
      }
    });
    document.getElementById("duplicateMapBtn").addEventListener("click", () => {
      const makeNewKey = (key) => {
        const suggestedNew = `${key}_copy`;
        if (suggestedNew in g$mul$maps) {
          return makeNewKey(suggestedNew);
        }
        return suggestedNew;
      };
      addToUndoStack();
      const newMapKey = makeNewKey(g$mul$ACTIVE_MAP);
      g$mul$maps[newMapKey] = {
        ...JSON.parse(JSON.stringify(g$mul$maps[g$mul$ACTIVE_MAP])),
        name: newMapKey,
      }; // todo prompt to ask for name
      updateMaps();
      addToUndoStack();
    });
    document.getElementById("removeMapBtn").addEventListener("click", () => {
      addToUndoStack();
      delete g$mul$maps[g$mul$ACTIVE_MAP];
      setActiveMap(Object.keys(g$mul$maps)[0]);
      updateMaps();
      addToUndoStack();
    });
    // Tileset DATA Callbacks //tileDataSel
    g$init$tileDataSel = document.getElementById("tileDataSel");
    g$init$tileDataSel.addEventListener("change", () => {
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
        if (result in g$mul$tileSets[g$init$tilesetDataSel.value].tags) {
          alert("Tag already exists");
          return;
        }
        g$mul$tileSets[g$init$tilesetDataSel.value].tags[result] =
          getEmptyTilesetTag(result, result);
        updateTilesetDataList();
        addToUndoStack();
      }
    });
    document
      .getElementById("removeTileTagBtn")
      .addEventListener("click", () => {
        if (
          g$init$tileDataSel.value &&
          g$init$tileDataSel.value in
            g$mul$tileSets[g$init$tilesetDataSel.value].tags
        ) {
          delete g$mul$tileSets[g$init$tilesetDataSel.value].tags[
            g$init$tileDataSel.value
          ];
          updateTilesetDataList();
          addToUndoStack();
        }
      });
    // Tileset frames
    g$init$tileFrameSel = document.getElementById("tileFrameSel");
    g$init$tileFrameSel.addEventListener("change", (e) => {
      g$state$el.tileFrameCount().value = getCurrentFrames()?.frameCount || 1;
      updateTilesetDataList(true);
      updateTilesetGridContainer();
    });
    g$state$el.animStart().addEventListener("change", (e) => {
      getCurrentAnimation().start = Number(g$state$el.animStart().value);
    });
    g$state$el.animEnd().addEventListener("change", (e) => {
      getCurrentAnimation().end = Number(g$state$el.animEnd().value);
    });
    document.getElementById("addTileFrameBtn").addEventListener("click", () => {
      const result = window.prompt(
        "Name your object",
        `obj${
          Object.keys(g$mul$tileSets[g$init$tilesetDataSel.value]?.frames || {})
            .length
        }`
      );
      if (result !== null) {
        if (result in g$mul$tileSets[g$init$tilesetDataSel.value].frames) {
          alert("Object already exists");
          return;
        }
        g$mul$tileSets[g$init$tilesetDataSel.value].frames[result] = {
          frameCount: Number(g$state$el.tileFrameCount().value),
          animations: {
            a1: {
              start: 1,
              end: Number(g$state$el.tileFrameCount().value) || 1, //todo move in here
              name: "a1",
              loop: g$state$el.animLoop().checked,
              speed: Number(g$state$el.animSpeed().value),
            },
          },
        };
        setFramesToSelection(result);
        updateTilesetDataList(true);
        g$init$tileFrameSel.value = result;
        updateTilesetGridContainer();
      }
    });
    document
      .getElementById("removeTileFrameBtn")
      .addEventListener("click", () => {
        if (
          g$init$tileFrameSel.value &&
          g$init$tileFrameSel.value in
            g$mul$tileSets[g$init$tilesetDataSel.value].frames &&
          confirm(
            `Are you sure you want to delete ${g$init$tileFrameSel.value}`
          )
        ) {
          delete g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ];
          updateTilesetDataList(true);
          updateTilesetGridContainer();
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
    g$state$el.renameTileFrameBtn().addEventListener("click", () => {
      // could be a generic function
      renameKeyInObjectForSelectElement(
        g$init$tileFrameSel,
        g$mul$tileSets[g$init$tilesetDataSel.value]?.frames,
        "object"
      );
    });
    g$state$el.tileFrameCount().addEventListener("change", (e) => {
      if (g$init$tileFrameSel.value === "") return;
      getCurrentFrames().frameCount = Number(e.target.value);
      updateTilesetGridContainer();
    });

    // animations
    g$init$tileAnimSel = document.getElementById("tileAnimSel");
    g$init$tileAnimSel.addEventListener("change", (e) => {
      //swap with tileAnimSel
      console.log("anim select", e, g$init$tileAnimSel.value);
      g$state$el.animStart().value = getCurrentAnimation()?.start || 1;
      g$state$el.animEnd().value = getCurrentAnimation()?.end || 1;
      g$state$el.animLoop().checked = getCurrentAnimation()?.loop || false;
      g$state$el.animSpeed().value = getCurrentAnimation()?.speed || 1;
      updateTilesetGridContainer();
    });
    document.getElementById("addTileAnimBtn").addEventListener("click", () => {
      const result = window.prompt(
        "Name your animation",
        `anim${
          Object.keys(
            g$mul$tileSets[g$init$tilesetDataSel.value]?.frames[
              g$init$tileFrameSel.value
            ]?.animations || {}
          ).length
        }`
      );
      if (result !== null) {
        if (
          !g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ]?.animations
        ) {
          g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ].animations = {};
        }
        if (
          result in
          g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ]?.animations
        ) {
          alert("Animation already exists");
          return;
        }
        g$mul$tileSets[g$init$tilesetDataSel.value].frames[
          g$init$tileFrameSel.value
        ].animations[result] = {
          start: 1,
          end: Number(g$state$el.tileFrameCount().value || 1),
          loop: g$state$el.animLoop().checked,
          speed: Number(g$state$el.animSpeed().value || 1),
          name: result,
        };
        // setFramesToSelection(tileFrameSel.value, result);
        updateTilesetDataList(true);
        g$init$tileAnimSel.value = result;
        updateTilesetGridContainer();
      }
    });
    document
      .getElementById("removeTileAnimBtn")
      .addEventListener("click", () => {
        console.log(
          "delete",
          g$init$tileAnimSel.value,
          g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ].animations
        );
        if (
          g$init$tileAnimSel.value &&
          g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ]?.animations &&
          g$init$tileAnimSel.value in
            g$mul$tileSets[g$init$tilesetDataSel.value].frames[
              g$init$tileFrameSel.value
            ]?.animations &&
          confirm(`Are you sure you want to delete ${g$init$tileAnimSel.value}`)
        ) {
          delete g$mul$tileSets[g$init$tilesetDataSel.value].frames[
            g$init$tileFrameSel.value
          ].animations[g$init$tileAnimSel.value];
          updateTilesetDataList(true);
          updateTilesetGridContainer();
        }
      });
    g$state$el.renameTileAnimBtn().addEventListener("click", () => {
      renameKeyInObjectForSelectElement(
        g$init$tileAnimSel,
        g$mul$tileSets[g$init$tilesetDataSel.value]?.frames[
          g$init$tileFrameSel.value
        ]?.animations,
        "animation"
      );
    });

    g$state$el.animLoop().addEventListener("change", () => {
      getCurrentAnimation().loop = g$state$el.animLoop().checked;
    });
    g$state$el.animSpeed().addEventListener("change", (e) => {
      getCurrentAnimation().speed = g$state$el.animSpeed().value;
    });
    // Tileset SELECT callbacks
    g$init$tilesetDataSel = document.getElementById("tilesetDataSel");
    g$init$tilesetDataSel.addEventListener("change", (e) => {
      g$init$tilesetImage.src =
        g$reloadTilesets$TILESET_ELEMENTS[e.target.value].src;
      g$init$tilesetImage.crossOrigin = "Anonymous";
      updateTilesetDataList();
    });
    g$state$el.tileFrameCount().addEventListener("change", () => {
      g$state$el.animStart().max = g$state$el.tileFrameCount().value;
      g$state$el.animEnd().max = g$state$el.tileFrameCount().value;
    });

    const replaceSelectedTileSet = (src) => {
      addToUndoStack();
      g$mul$IMAGES[Number(g$init$tilesetDataSel.value)].src = src;
      reloadTilesets();
    };
    const addNewTileSet = (src) => {
      console.log("add new tileset" + src);
      addToUndoStack();
      g$mul$IMAGES.push({ src });
      reloadTilesets();
    };
    exports.addNewTileSet = addNewTileSet;
    // replace tileset
    document
      .getElementById("tilesetReplaceInput")
      .addEventListener("change", (e) => {
        toBase64(e.target.files[0]).then((base64Src) => {
          if (g$init_state$selectedTileSetLoader.onSelectImage) {
            g$init_state$selectedTileSetLoader.onSelectImage(
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
        if (g$init_state$selectedTileSetLoader.onSelectImage) {
          document.getElementById("tilesetReplaceInput").click();
        }
        if (g$init_state$selectedTileSetLoader.prompt) {
          g$init_state$selectedTileSetLoader.prompt(replaceSelectedTileSet);
        }
      });
    // add tileset
    document
      .getElementById("tilesetReadInput")
      .addEventListener("change", (e) => {
        toBase64(e.target.files[0]).then((base64Src) => {
          if (g$init_state$selectedTileSetLoader.onSelectImage) {
            g$init_state$selectedTileSetLoader.onSelectImage(
              addNewTileSet,
              e.target.files[0],
              base64Src
            );
          }
        });
      });
    // remove tileset
    document.getElementById("addTilesetBtn").addEventListener("click", () => {
      if (g$init_state$selectedTileSetLoader.onSelectImage) {
        document.getElementById("tilesetReadInput").click();
      }
      if (g$init_state$selectedTileSetLoader.prompt) {
        g$init_state$selectedTileSetLoader.prompt(addNewTileSet);
      }
    });
    const tileSetLoadersSel = document.getElementById("tileSetLoadersSel");
    Object.entries(g$init_state$apiTileSetLoaders).forEach(([key, loader]) => {
      const tsLoaderOption = document.createElement("option");
      tsLoaderOption.value = key;
      tsLoaderOption.innerText = loader.name;
      tileSetLoadersSel.appendChild(tsLoaderOption);
      // apiTileSetLoaders[key].load = () => tileSetLoaders
    });

    tileSetLoadersSel.value = "base64";
    g$init_state$selectedTileSetLoader =
      g$init_state$apiTileSetLoaders[tileSetLoadersSel.value];
    tileSetLoadersSel.addEventListener("change", (e) => {
      g$init_state$selectedTileSetLoader =
        g$init_state$apiTileSetLoaders[e.target.value];
    });
    exports.tilesetLoaders = g$init_state$apiTileSetLoaders;

    const deleteTilesetWithIndex = (index, cb = null) => {
      if (confirm(`Are you sure you want to delete this image?`)) {
        addToUndoStack();
        g$mul$IMAGES.splice(index, 1);
        reloadTilesets();
        if (cb) cb();
      }
    };
    exports.IMAGES = g$mul$IMAGES;
    exports.deleteTilesetWithIndex = deleteTilesetWithIndex;
    document
      .getElementById("removeTilesetBtn")
      .addEventListener("click", () => {
        //Remove current tileset
        if (g$init$tilesetDataSel.value !== "0") {
          deleteTilesetWithIndex(Number(g$init$tilesetDataSel.value));
        }
      });

    // Canvas callbacks
    g$init$canvas.addEventListener("pointerdown", setMouseIsTrue);
    g$init$canvas.addEventListener("pointerup", setMouseIsFalse);
    g$init$canvas.addEventListener("pointerleave", setMouseIsFalse);
    g$init$canvas.addEventListener("pointerdown", toggleTile);
    g$init$canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    draggable({
      onElement: g$init$canvas,
      element: document.getElementById("canvas_wrapper"),
    });
    g$init$canvas.addEventListener("pointermove", (e) => {
      if (g$mul$isMouseDown && g$mul$ACTIVE_TOOL !== 2) toggleTile(e);
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
    //     element: document.querySelector(".canvas_resizer[resizerdir='x']"),
    //     onElement: document.querySelector(".canvas_resizer[resizerdir='x'] span"),
    //     isDrag: true, limitY: true,
    //     onRelease: ({x}) => {
    //         const snappedX = getSnappedPos(x);
    //         console.log("SNAPPED GRID", x,snappedX)
    //         updateMapSize({mapWidth: snappedX })
    //     },
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
    g$init$cropSize.addEventListener("change", (e) => {
      setCropSize(Number(e.target.value));
    });

    document
      .getElementById("clearCanvasBtn")
      .addEventListener("click", clearCanvas);
    if (onApply) {
      g$init$confirmBtn.addEventListener("click", () =>
        onApply.onClick(getExportData())
      );
    }

    document.getElementById("renameMapBtn").addEventListener("click", () => {
      const newName = window.prompt(
        "Change map name:",
        g$mul$maps[g$mul$ACTIVE_MAP].name || "Map"
      );
      if (newName !== null && g$mul$maps[g$mul$ACTIVE_MAP].name !== newName) {
        if (
          Object.values(g$mul$maps)
            .map((map) => map.name)
            .includes(newName)
        ) {
          alert(`${newName} already exists`);
          return;
        }
        g$mul$maps[g$mul$ACTIVE_MAP].name = newName;
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
      g$init_state$apiTileMapExporters[key].getData = () =>
        exporter.transformer(getExportData());
    });
    exports.exporters = g$init_state$apiTileMapExporters;

    Object.entries(g$init_state$apiTileMapImporters).forEach(
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
      g$mul$maps[g$mul$ACTIVE_MAP].gridColor = e.target.value;
      draw();
    });
    document.getElementById("showGrid").addEventListener("change", (e) => {
      g$init$SHOW_GRID = e.target.checked;
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
    g$init$canvas.addEventListener("wheel", (e) => {
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    });

    loadData(tileMapData);
    if (appState) {
      g$mul$ACTIVE_MAP = appState.ACTIVE_MAP;
      g$init$mapsDataSel.value = g$mul$ACTIVE_MAP;
      setActiveMap(appState.ACTIVE_MAP);
      g$mul$PREV_ACTIVE_TOOL = appState.PREV_ACTIVE_TOOL;
      g$mul$ACTIVE_TOOL = appState.ACTIVE_TOOL;
      setActiveTool(appState.ACTIVE_TOOL);
      setLayer(appState.currentLayer);
      g$mul$selection = appState.selection;
      updateSelection(false);
      g$init$SHOW_GRID = appState.SHOW_GRID;
    }

    // Animated tiles when on frames mode
    const animateTiles = () => {
      if (g$init$tileDataSel.value === "frames") draw();
      requestAnimationFrame(animateTiles);
    };
    requestAnimationFrame(animateTiles);
  };

  exports.getState = () => {
    return getAppState();
  };

  exports.onUpdate = g$init$apiOnUpdateCallback;
  exports.onMouseUp = g$init$apiOnMouseUp;

  exports.getTilesets = () => g$mul$tileSets;
};

const exports = function () {};
main(exports);
export default exports;
