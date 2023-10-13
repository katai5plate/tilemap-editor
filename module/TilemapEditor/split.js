//@ts-check
import { getEmptyLayer } from "./utils.js";
import _ from "./state.js";
import { any, force, tagCanvas, tagInput, target } from "../helper.js";

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

export const setLayer = ({ addToUndoStack, draw, updateLayers }, newLayer) => {
  _.setLayer$currentLayer = Number(newLayer);

  const oldActivedLayer = document.querySelector(".layer.active");
  if (oldActivedLayer) oldActivedLayer.classList.remove("active");
  else console.warn({ oldActivedLayer });

  const activeLayerLabel = document.getElementById("activeLayerLabel");
  const layerOpacitySlider = tagInput(
    document.getElementById("layerOpacitySlider")
  );
  const layerOpacitySliderValue = document.getElementById(
    "layerOpacitySliderValue"
  );

  document
    .querySelector(`.layer[tile-layer="${newLayer}"]`)
    ?.classList.add("active");
  force(activeLayerLabel).innerHTML = `
          Editing Layer: ${_.mul$maps[_.mul$ACTIVE_MAP].layers[newLayer]?.name}
          <div class="dropdown left">
              <div class="item nohover">Layer: ${
                _.mul$maps[_.mul$ACTIVE_MAP].layers[newLayer]?.name
              } </div>
              <div class="item">
                  <div class="slider-wrapper">
                    <label for="layerOpacitySlider">Opacity</label>
                    <input type="range" min="0" max="1" value="1" id="layerOpacitySlider" step="0.01">
                    <output for="layerOpacitySlider" id="layerOpacitySliderValue">${
                      _.mul$maps[_.mul$ACTIVE_MAP].layers[newLayer]?.opacity
                    }</output>
                  </div>
              </div>
          </div>
      `;
  if (layerOpacitySlider) {
    layerOpacitySlider.value =
      _.mul$maps[_.mul$ACTIVE_MAP].layers[newLayer]?.opacity;
    layerOpacitySlider.addEventListener("change", (e) => {
      addToUndoStack();

      force(layerOpacitySliderValue).innerText = target(e).value;

      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].opacity =
        Number(target(e).value);
      draw();
      updateLayers();
    });
  } else console.warn({ layerOpacitySlider });
};

export const updateLayers = ({ addToUndoStack, draw, layersElement }) => {
  const setLayerIsVisible = (layer, override = false) => {
    const setLayerVisBtn = document.getElementById(`setLayerVisBtn-${layer}`);
    if (!setLayerVisBtn) throw new Error("dom not found");
    const layerNumber = Number(layer);
    _.mul$maps[_.mul$ACTIVE_MAP].layers[layerNumber].visible =
      override || !_.mul$maps[_.mul$ACTIVE_MAP].layers[layerNumber].visible;
    setLayerVisBtn.innerHTML = _.mul$maps[_.mul$ACTIVE_MAP].layers[layerNumber]
      .visible
      ? "👁️"
      : "👓";
    draw();
  };
  const trashLayer = (layer) => {
    const layerNumber = Number(layer);
    _.mul$maps[_.mul$ACTIVE_MAP].layers.splice(layerNumber, 1);
    updateLayers();
    setLayer(
      {
        addToUndoStack,
        draw,
        updateLayers,
      },
      _.mul$maps[_.mul$ACTIVE_MAP].layers.length - 1
    );
    draw();
  };

  layersElement.innerHTML = _.mul$maps[_.mul$ACTIVE_MAP].layers
    .map((layer, index) => {
      return `
            <div class="layer">
              <div id="selectLayerBtn-${index}" class="layer select_layer" tile-layer="${index}" title="${
        layer.name
      }">${layer.name} ${layer.opacity < 1 ? ` (${layer.opacity})` : ""}</div>
              <span id="setLayerVisBtn-${index}" vis-layer="${index}"></span>
              <div id="trashLayerBtn-${index}" trash-layer="${index}" ${
        _.mul$maps[_.mul$ACTIVE_MAP].layers.length > 1 ? "" : `disabled="true"`
      }>🗑️</div>
            </div>
          `;
    })
    .reverse()
    .join("\n");

  _.mul$maps[_.mul$ACTIVE_MAP].layers.forEach((_, index) => {
    const selectLayerBtn = document.getElementById(`selectLayerBtn-${index}`);
    const setLayerVisBtn = document.getElementById(`setLayerVisBtn-${index}`);
    const trashLayerBtn = document.getElementById(`trashLayerBtn-${index}`);

    force(selectLayerBtn).addEventListener("click", (e) => {
      setLayer(
        {
          addToUndoStack,
          draw,
          updateLayers,
        },

        target(e).getAttribute("tile-layer")
      );
      addToUndoStack();
    });
    force(setLayerVisBtn).addEventListener("click", (e) => {
      setLayerIsVisible({ draw }, !!target(e).getAttribute("vis-layer"));
      addToUndoStack();
    });
    force(trashLayerBtn).addEventListener("click", (e) => {
      trashLayer(target(e).getAttribute("trash-layer"));
      addToUndoStack();
    });
    setLayerIsVisible(index, true);
  });
  setLayer(
    {
      addToUndoStack,
      draw,
      updateLayers,
    },
    _.setLayer$currentLayer
  );
};

export const getTileData = (x = null, y = null) => {
  const tilesetTiles = _.mul$tileSets[_.init$tilesetDataSel.value].tileData;
  let data;
  if (x === null && y === null) {
    const { x: sx, y: sy } = _.mul$selection[0];
    return tilesetTiles[`${sx}-${sy}`];
  } else {
    data = tilesetTiles[`${x}-${y}`];
  }
  return data;
};

export const setActiveTool = ({ TOOLS, draw }, toolIdx) => {
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

export const updateSelection = (
  { TOOLS, draw, onUpdateState },
  autoSelectTool = true
) => {
  if (!_.mul$tileSets[_.init$tilesetDataSel.value]) return;
  const selected = _.mul$selection[0];
  if (!selected) return;
  const { x, y } = selected;
  const { x: endX, y: endY } = _.mul$selection[_.mul$selection.length - 1];
  const selWidth = endX - x + 1;
  const selHeight = endY - y + 1;
  _.updateSelection$selectionSize = [selWidth, selHeight];

  console.log(_.mul$tileSets[_.init$tilesetDataSel.value].tileSize);

  const tileSize = _.mul$tileSets[_.init$tilesetDataSel.value].tileSize;

  _.init$tilesetSelection.style.left = `${x * tileSize * _.mul$ZOOM}px`;

  _.init$tilesetSelection.style.top = `${y * tileSize * _.mul$ZOOM}px`;

  _.init$tilesetSelection.style.width = `${selWidth * tileSize * _.mul$ZOOM}px`;

  _.init$tilesetSelection.style.height = `${
    selHeight * tileSize * _.mul$ZOOM
  }px`;

  // Autoselect tool upon selecting a tile
  if (
    autoSelectTool &&
    ![TOOLS.BRUSH, TOOLS.RAND, TOOLS.FILL].includes(_.mul$ACTIVE_TOOL)
  )
    setActiveTool({ TOOLS, draw }, TOOLS.BRUSH);

  // show/hide param editor

  if (_.init$tileDataSel.value === "frames" && _.getTile$editedEntity)
    _.init$objectParametersEditor.classList.add("entity");
  else _.init$objectParametersEditor.classList.remove("entity");
  onUpdateState();
};

export const shouldHideSymbols = () =>
  _.mul$SIZE_OF_CROP < 10 && _.mul$ZOOM < 2;

export const updateTilesetGridContainer = ({ drawGrid, getCurrentFrames }) => {
  const viewMode = _.init$tileDataSel.value;

  const tilesetData = _.mul$tileSets[_.init$tilesetDataSel.value];
  if (!tilesetData) return;

  const { tileCount, gridWidth, tileData, tags } = tilesetData;
  // console.log("COUNT", tileCount)
  const hideSymbols =
    !_.toggleSymbolsVisible$DISPLAY_SYMBOLS || shouldHideSymbols();
  const canvas = force(tagCanvas(document.getElementById("tilesetCanvas")));

  const img = _.reloadTilesets$TILESET_ELEMENTS[_.init$tilesetDataSel.value];

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
