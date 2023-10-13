//@ts-check
import _ from "./state.js";
import { any, force, tagCanvas, tagInput, target } from "../helper.js";
import { draw, shouldHideSymbols } from "./nodep.js";
import { activeLayerLabelHTML, layersElementHTML } from "../constants/html.js";

export const setLayer = ({ addToUndoStack, updateLayers }, newLayer) => {
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
  force(activeLayerLabel).innerHTML = activeLayerLabelHTML(
    _.mul$maps[_.mul$ACTIVE_MAP].layers[newLayer]
  );
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

export const updateLayers = ({ addToUndoStack, layersElement }) => {
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
        updateLayers,
      },
      _.mul$maps[_.mul$ACTIVE_MAP].layers.length - 1
    );
    draw();
  };

  layersElement.innerHTML = _.mul$maps[_.mul$ACTIVE_MAP].layers
    .map((layer, index) =>
      layersElementHTML({
        layer,
        index,
        enableButton: _.mul$maps[_.mul$ACTIVE_MAP].layers.length > 1,
      })
    )
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
      updateLayers,
    },
    _.setLayer$currentLayer
  );
};

export const updateTilesetGridContainer = ({ drawGrid, getCurrentFrames }) => {
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
