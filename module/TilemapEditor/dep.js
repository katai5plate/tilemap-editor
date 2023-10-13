//@ts-check
import _ from "./state.js";
import { force, tagInput, target } from "../helper.js";
import { draw } from "./nodep.js";
import { activeLayerLabelHTML, layersElementHTML } from "../constants/html.js";

export const setLayer = ({ addToUndoStack }, newLayer) => {
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

export const updateLayers = ({ addToUndoStack }) => {
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
      { addToUndoStack },
      _.mul$maps[_.mul$ACTIVE_MAP].layers.length - 1
    );
    draw();
  };

  force(_.init$layersElement).innerHTML = _.mul$maps[_.mul$ACTIVE_MAP].layers
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
  setLayer({ addToUndoStack }, _.setLayer$currentLayer);
};
