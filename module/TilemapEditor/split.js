//@ts-check
import { getEmptyLayer } from "./utils.js";
import _ from "./state.js";

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

export const setLayer = ({ addToUndoStack, draw, updateLayers }, newLayer) => {
  _.setLayer$currentLayer = Number(newLayer);

  const oldActivedLayer = document.querySelector(".layer.active");
  if (oldActivedLayer) {
    oldActivedLayer.classList.remove("active");
  }

  const activeLayerLabel = document.getElementById("activeLayerLabel");
  const layerOpacitySlider = document.getElementById("layerOpacitySlider");
  const layerOpacitySliderValue = document.getElementById(
    "layerOpacitySliderValue"
  );

  document
    .querySelector(`.layer[tile-layer="${newLayer}"]`)
    ?.classList.add("active");
  if (activeLayerLabel)
    activeLayerLabel.innerHTML = `
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
    //@ts-ignore
    layerOpacitySlider.value =
      _.mul$maps[_.mul$ACTIVE_MAP].layers[newLayer]?.opacity;
    layerOpacitySlider.addEventListener("change", (e) => {
      if (!e.target) throw new Error("failed: e.target");
      addToUndoStack();
      //@ts-ignore
      layerOpacitySliderValue.innerText = e.target.value;
      //@ts-ignore
      _.mul$maps[_.mul$ACTIVE_MAP].layers[_.setLayer$currentLayer].opacity =
        //@ts-ignore
        Number(e.target.value);
      draw();
      updateLayers();
    });
  }
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
    if (!(selectLayerBtn && setLayerVisBtn && trashLayerBtn))
      throw new Error("dom not found");
    selectLayerBtn.addEventListener("click", (e) => {
      if (!e.target) throw new Error("failed: e.target");
      setLayer(
        {
          addToUndoStack,
          draw,
          updateLayers,
        },
        //@ts-ignore
        e.target.getAttribute("tile-layer")
      );
      addToUndoStack();
    });
    setLayerVisBtn.addEventListener("click", (e) => {
      if (!e.target) throw new Error("failed: e.target");
      setLayerIsVisible(
        { draw },
        //@ts-ignore
        e.target.getAttribute("vis-layer")
      );
      addToUndoStack();
    });
    trashLayerBtn.addEventListener("click", (e) => {
      if (!e.target) throw new Error("failed: e.target");
      //@ts-ignore
      trashLayer(e.target.getAttribute("trash-layer"));
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

export const getTileData = ({}, x = null, y = null) => {
  //@ts-ignore
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
  if (!(toolButtonsWrapper && canvas_wrapper)) throw new Error("dom not found");
  _.mul$ACTIVE_TOOL = toolIdx;
  const actTool = toolButtonsWrapper.querySelector(
    `input[id="tool${toolIdx}"]`
  );
  //@ts-ignore
  if (actTool) actTool.checked = true;
  canvas_wrapper.setAttribute(
    "isDraggable",
    `${_.mul$ACTIVE_TOOL === TOOLS.PAN}`
  );
  draw();
};
