import { TOOLS, ZOOM_LEVELS } from "../../constants/enums.js";
import { tilemapEditorRootHTML } from "../../constants/html.js";
import { target } from "../../helper.js";
import {
  addRandomTile,
  addTile,
  addToUndoStack,
  clearUndoStack,
  downloadAsTextFile,
  draw,
  fillEmptyOrSameTiles,
  getAppState,
  getCurrentAnimation,
  getCurrentFrames,
  getEmptyMap,
  getSelectedTile,
  getTile,
  getTilesAnalisis,
  reloadTilesets,
  removeTile,
  restoreFromUndoStackData,
  selectMode,
  setActiveMap,
  setActiveTool,
  setCropSize,
  setLayer,
  setMouseIsFalse,
  setMouseIsTrue,
  updateLayers,
  updateMapSize,
  updateMaps,
  updateSelection,
  updateTilesetDataList,
  updateTilesetGridContainer,
  updateZoom,
} from "../features.js";
import {
  ApiTileMapExporters,
  ApiTileMapImporters,
  ApiTileSetLoaders,
  AppState,
  FlattenedDataItem,
  ImageJSON,
  Tag,
  Tile,
  TileMapData,
  _,
} from "../store.js";
import { drawGrid, getEmptyLayer, toBase64 } from "../utils.js";

export default (exports: Function) =>
  (
    attachToId: string,
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
      onMouseUp,
      appState,
    }: {
      tileMapData: TileMapData;
      tileSize: number;
      mapWidth: number;
      mapHeight: number;
      tileSetImages: ImageJSON[];
      applyButtonText: string;
      onApply?: { onClick: (data: FlattenedDataItem) => void };
      tileSetLoaders: ApiTileSetLoaders;
      tileMapExporters: ApiTileMapExporters;
      tileMapImporters: ApiTileMapImporters;
      onUpdate?: () => void;
      onMouseUp?: () => void;
      appState: AppState;
    }
  ) => {
    // Call once on element to add behavior, toggle on/off isDraggable attr to enable
    const draggable = ({
      element,
      onElement,
      isDrag = false,
      onDrag,
      limitX = false,
      limitY = false,
      onRelease,
    }: {
      element: HTMLElement;
      onElement?: HTMLCanvasElement;
      isDrag?: boolean;
      onDrag?: (e: {
        deltaX: number;
        deltaY: number;
        x: number;
        y: number;
        mouseX: number;
        mouseY: number;
      }) => void;
      limitX?: boolean;
      limitY?: boolean;
      onRelease?: (e: { x: number; y: number }) => void;
    }) => {
      element.setAttribute("isDraggable", `${isDrag}`);
      let isMouseDown = false;
      let mouseX: number;
      let mouseY: number;
      let elementX = 0;
      let elementY = 0;
      const onMouseMove = (event: MouseEvent) => {
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
      const onMouseDown = (event: MouseEvent) => {
        if (element.getAttribute("isDraggable") === "false") return;

        mouseX = event.clientX;
        mouseY = event.clientY;
        console.log("MOUSEX", mouseX);
        isMouseDown = true;
      };
      const onMouseUp = () => {
        if (!(element.getAttribute("isDraggable") === "false")) return;
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
        updateLayers();
      }
    };

    const toggleTile = (event: MouseEvent) => {
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
      setLayer(0);
      updateLayers();
      draw();
      addToUndoStack();
    };

    const exportJson = () => {
      downloadAsTextFile({ tileSets: _.mul$tileSets, maps: _.mul$maps });
    };

    const exportImage = () => {
      draw(false);
      const data = _.init$canvas!.toDataURL();
      const image = new Image();
      image.src = data;
      image.crossOrigin = "anonymous";
      const w = window.open("")!;
      w.document.write(image.outerHTML);
      draw();
    };

    const toggleSymbolsVisible = (override = null) => {
      if (override === null)
        _.toggleSymbolsVisible$DISPLAY_SYMBOLS =
          !_.toggleSymbolsVisible$DISPLAY_SYMBOLS;
      document.getElementById("setSymbolsVisBtn")!.innerHTML =
        _.toggleSymbolsVisible$DISPLAY_SYMBOLS ? "👁️" : "👓";
      updateTilesetGridContainer();
    };

    const zoomIn = () => {
      if (_.mul$zoomIndex >= ZOOM_LEVELS.length - 1) return;
      _.mul$zoomIndex += 1;
      _.mul$ZOOM = ZOOM_LEVELS[_.mul$zoomIndex];
      updateZoom();
    };
    const zoomOut = () => {
      if (_.mul$zoomIndex === 0) return;
      _.mul$zoomIndex -= 1;
      _.mul$ZOOM = ZOOM_LEVELS[_.mul$zoomIndex];
      updateZoom();
    };

    const drawAnaliticsReport = () => {
      const prevZoom = _.mul$ZOOM;
      _.mul$ZOOM = 1; // needed for correct eval
      updateZoom();
      draw(false);
      const { analizedTiles, uniqueTiles } = getTilesAnalisis(
        _.init$canvas!.getContext("2d")!,
        _.mul$WIDTH,
        _.mul$HEIGHT,
        _.mul$SIZE_OF_CROP
      );
      const data = _.init$canvas!.toDataURL();
      const image = new Image();
      image.src = data;
      const ctx = _.init$canvas!.getContext("2d")!;
      _.mul$ZOOM = prevZoom;
      updateZoom();
      draw(false);
      Object.values(analizedTiles).map((t) => {
        // Fill the heatmap
        t.coords.forEach((c, i) => {
          const fillStyle = `rgba(255, 0, 0, ${1 / t.times - 0.35})`;
          ctx.fillStyle = fillStyle;
          ctx.fillRect(
            c.x! * _.mul$ZOOM,
            c.y! * _.mul$ZOOM,
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
      const ctx = _.init$canvas!.getContext("2d")!;
      const prevZoom = _.mul$ZOOM;
      _.mul$ZOOM = 1; // needed for correct eval
      updateZoom();
      draw(false);
      const { analizedTiles } = getTilesAnalisis(
        _.init$canvas!.getContext("2d")!,
        _.mul$WIDTH,
        _.mul$HEIGHT,
        _.mul$SIZE_OF_CROP
      );
      ctx.clearRect(0, 0, _.mul$WIDTH, _.mul$HEIGHT);
      const gridWidth = _.init$tilesetImage!.width / _.mul$SIZE_OF_CROP;
      Object.values(analizedTiles).map((t, i) => {
        const positionX = i % gridWidth;
        const positionY = Math.floor(i / gridWidth);
        const tileCanvas = document.createElement("canvas");
        tileCanvas.width = _.mul$SIZE_OF_CROP;
        tileCanvas.height = _.mul$SIZE_OF_CROP;
        const tileCtx = tileCanvas.getContext("2d")!;
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
      const data = _.init$canvas!.toDataURL();
      const image = new Image();
      image.src = data;
      image.crossOrigin = "anonymous";
      const w = window.open("")!;
      w.document.write(image.outerHTML);
      _.mul$ZOOM = prevZoom;
      updateZoom();
      draw();
    };

    const renameCurrentTileSymbol = () => {
      const setTileData = (x = NaN, y = NaN, newData: string, key = "") => {
        const tilesetTiles =
          _.mul$tileSets[_.init$tilesetDataSel!.value].tileData;
        if (Number.isNaN(x) && Number.isNaN(y)) {
          const { x: sx, y: sy } = _.mul$selection[0];
          //@ts-expect-error FIXME: type error
          tilesetTiles[`${sx}-${sy}`] = newData;
        }
        if (key !== "") {
          //@ts-expect-error FIXME: type error
          tilesetTiles[`${x}-${y}`][key] = newData;
        } else {
          //@ts-expect-error FIXME: type error
          tilesetTiles[`${x}-${y}`] = newData;
        }
      };
      const { x, y, tileSymbol } = _.mul$selection[0]!;
      const newSymbol = window.prompt("Enter tile symbol", tileSymbol || "*");
      if (newSymbol !== null) {
        setTileData(x, y, newSymbol, "tileSymbol");
        updateSelection();
        updateTilesetGridContainer();
        addToUndoStack();
      }
    };

    const getExportData = () => {
      const getFlattenedData = () => {
        const result = Object.entries(_.mul$maps).map(([key, map]) => {
          console.log({ map });
          const layers = map.layers;
          const flattenedData: FlattenedDataItem["flattenedData"] = Array(
            layers.length
          )
            .fill([])
            .map(() => {
              return Array(map.mapHeight)
                .fill([])
                .map((_row) => {
                  return Array(map.mapWidth)
                    .fill([])
                    .map((_column) => ({
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

    const loadData = (data: TileMapData) => {
      try {
        clearUndoStack();
        _.mul$WIDTH = _.init$canvas!.width * _.mul$ZOOM;
        _.mul$HEIGHT = _.init$canvas!.height * _.mul$ZOOM;
        _.mul$selection = [{} as Tile];
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
        _.init$tilesetDataSel!.value = "0";
        _.init$cropSize!.value = `${
          data
            ? _.mul$tileSets[_.init$tilesetDataSel!.value]?.tileSize ||
              _.mul$maps[_.mul$ACTIVE_MAP].tileSize
            : _.mul$SIZE_OF_CROP
        }`;
        (document.getElementById("gridCropSize")! as HTMLInputElement).value =
          _.init$cropSize!.value;
        updateMaps();
        updateMapSize({
          mapWidth: _.mul$maps[_.mul$ACTIVE_MAP].mapWidth,
          mapHeight: _.mul$maps[_.mul$ACTIVE_MAP].mapHeight,
        });
      } catch (e) {
        console.error(e);
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
          const json = JSON.parse(target(e).result);
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
        .getElementById("tileMapEditor")!
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
    _.init$cropSize = document.getElementById("cropSize")! as HTMLInputElement;

    _.init$confirmBtn = document.getElementById(
      "confirmBtn"
    ) as HTMLButtonElement;
    if (onApply) {
      _.init$confirmBtn.innerText = applyButtonText || "Ok";
    } else {
      _.init$confirmBtn.style.display = "none";
    }
    _.init$canvas = document.getElementById("mapCanvas")! as HTMLCanvasElement;
    _.init$tilesetContainer = document.querySelector(
      ".tileset-container"
    )! as HTMLElement;
    _.init$tilesetSelection = document.querySelector(
      ".tileset-container-selection"
    )! as HTMLElement;
    // tilesetGridContainer = document.getElementById("tilesetGridContainer")!;
    _.init$layersElement = document.getElementById("layers")!;
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

    const setFramesToSelection = (objectName: string, animName = "") => {
      console.log({ animName, objectName });
      if (objectName === "" || typeof objectName !== "string") return;
      _.mul$tileSets[_.init$tilesetDataSel!.value].frames[objectName] = {
        ...(_.mul$tileSets[_.init$tilesetDataSel!.value].frames[objectName] ||
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
        (
          document.getElementById("tilesetDataDetails")! as HTMLDetailsElement
        ).open = false;
      }, 100);

      _.mul$selection = getSelectedTile(e);
      updateSelection();
      _.mul$selection = getSelectedTile(e);
      _.init$tileSelectStart = null;

      const viewMode = _.init$tileDataSel!.value;
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
              _.mul$tileSets[_.init$tilesetDataSel!.value]?.tags[viewMode]
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
          setFramesToSelection(_.init$tileFrameSel!.value);
        }
        updateTilesetGridContainer();
      }
    });
    _.init$tilesetContainer.addEventListener("dblclick", (e) => {
      const viewMode = _.init$tileDataSel!.value;
      if (viewMode === "") {
        renameCurrentTileSymbol();
      }
    });
    document.getElementById("addLayerBtn")!.addEventListener("click", () => {
      addToUndoStack();
      addLayer();
    });
    // Maps DATA callbacks
    _.init$mapsDataSel = document.getElementById(
      "mapsDataSel"
    ) as HTMLSelectElement;
    _.init$mapsDataSel.addEventListener("change", (e) => {
      addToUndoStack();
      setActiveMap(target(e).value);
      addToUndoStack();
    });
    document.getElementById("addMapBtn")!.addEventListener("click", () => {
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
    document
      .getElementById("duplicateMapBtn")!
      .addEventListener("click", () => {
        const makeNewKey = (key: string): string => {
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
    document.getElementById("removeMapBtn")!.addEventListener("click", () => {
      addToUndoStack();
      delete _.mul$maps[_.mul$ACTIVE_MAP];
      setActiveMap(Object.keys(_.mul$maps)[0]);
      updateMaps();
      addToUndoStack();
    });
    // Tileset DATA Callbacks //tileDataSel
    _.init$tileDataSel = document.getElementById(
      "tileDataSel"
    ) as HTMLSelectElement;
    _.init$tileDataSel.addEventListener("change", () => {
      selectMode();
    });
    document.getElementById("addTileTagBtn")!.addEventListener("click", () => {
      const getEmptyTilesetTag = (
        name: string,
        code: string,
        tiles = {}
      ): Tag => ({
        name,
        code,
        tiles,
      });
      const result = window.prompt("Name your tag", "solid()");
      if (result !== null) {
        if (result in _.mul$tileSets[_.init$tilesetDataSel!.value].tags) {
          alert("Tag already exists");
          return;
        }
        _.mul$tileSets[_.init$tilesetDataSel!.value].tags[result] =
          getEmptyTilesetTag(result, result);
        updateTilesetDataList();
        addToUndoStack();
      }
    });
    document
      .getElementById("removeTileTagBtn")!
      .addEventListener("click", () => {
        if (
          _.init$tileDataSel!.value &&
          _.init$tileDataSel!.value in
            _.mul$tileSets[_.init$tilesetDataSel!.value].tags
        ) {
          delete _.mul$tileSets[_.init$tilesetDataSel!.value].tags[
            _.init$tileDataSel!.value
          ];
          updateTilesetDataList();
          addToUndoStack();
        }
      });
    // Tileset frames
    _.init$tileFrameSel = document.getElementById(
      "tileFrameSel"
    ) as HTMLSelectElement;
    _.init$tileFrameSel.addEventListener("change", (e) => {
      _.state$el.tileFrameCount!().value = `${
        getCurrentFrames()?.frameCount || 1
      }`;
      updateTilesetDataList(true);
      updateTilesetGridContainer();
    });
    _.state$el.animStart!().addEventListener("change", (e) => {
      getCurrentAnimation()!.start = Number(_.state$el.animStart!().value);
    });
    _.state$el.animEnd!().addEventListener("change", (e) => {
      getCurrentAnimation()!.end = Number(_.state$el.animEnd!().value);
    });
    document
      .getElementById("addTileFrameBtn")!
      .addEventListener("click", () => {
        const result = window.prompt(
          "Name your object",
          `obj${
            Object.keys(
              _.mul$tileSets[_.init$tilesetDataSel!.value]?.frames || {}
            ).length
          }`
        );
        if (result !== null) {
          if (result in _.mul$tileSets[_.init$tilesetDataSel!.value].frames) {
            alert("Object already exists");
            return;
          }
          _.mul$tileSets[_.init$tilesetDataSel!.value].frames[result] = {
            frameCount: Number(_.state$el.tileFrameCount!().value),
            animations: {
              a1: {
                start: 1,
                end: Number(_.state$el.tileFrameCount!().value) || 1, //todo move in here
                name: "a1",
                loop: _.state$el.animLoop!().checked,
                speed: Number(_.state$el.animSpeed!().value),
              },
            },
          };
          setFramesToSelection(result);
          updateTilesetDataList(true);
          _.init$tileFrameSel!.value = result;
          updateTilesetGridContainer();
        }
      });
    document
      .getElementById("removeTileFrameBtn")!
      .addEventListener("click", () => {
        if (
          _.init$tileFrameSel!.value &&
          _.init$tileFrameSel!.value in
            _.mul$tileSets[_.init$tilesetDataSel!.value].frames &&
          confirm(
            `Are you sure you want to delete ${_.init$tileFrameSel!.value}`
          )
        ) {
          delete _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ];
          updateTilesetDataList(true);
          updateTilesetGridContainer();
        }
      });
    const renameKeyInObjectForSelectElement = (
      selectElement: HTMLSelectElement,
      objectPath: {},
      typeLabel: string
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
          Object.getOwnPropertyDescriptor(objectPath, oldValue)!
        );
        delete (objectPath as any)[oldValue];
        updateTilesetDataList(true);
        selectElement.value = result;
        updateTilesetDataList(true);
      }
    };
    _.state$el.renameTileFrameBtn!().addEventListener("click", () => {
      // could be a generic function
      renameKeyInObjectForSelectElement(
        _.init$tileFrameSel!,
        _.mul$tileSets[_.init$tilesetDataSel!.value]?.frames,
        "object"
      );
    });
    _.state$el.tileFrameCount!().addEventListener("change", (e) => {
      if (_.init$tileFrameSel!.value === "") return;
      getCurrentFrames().frameCount = Number(target(e).value);
      updateTilesetGridContainer();
    });

    // animations
    _.init$tileAnimSel = document.getElementById(
      "tileAnimSel"
    ) as HTMLSelectElement;
    _.init$tileAnimSel.addEventListener("change", (e) => {
      //swap with tileAnimSel
      console.log("anim select", e, _.init$tileAnimSel!.value);
      _.state$el.animStart!().value = `${getCurrentAnimation()?.start || 1}`;
      _.state$el.animEnd!().value = `${getCurrentAnimation()?.end || 1}`;
      _.state$el.animLoop!().checked = getCurrentAnimation()?.loop || false;
      _.state$el.animSpeed!().value = `${getCurrentAnimation()?.speed || 1}`;
      updateTilesetGridContainer();
    });
    document.getElementById("addTileAnimBtn")!.addEventListener("click", () => {
      const result = window.prompt(
        "Name your animation",
        `anim${
          Object.keys(
            _.mul$tileSets[_.init$tilesetDataSel!.value]?.frames[
              _.init$tileFrameSel!.value
            ]?.animations || {}
          ).length
        }`
      );
      if (result !== null) {
        if (
          !_.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ]?.animations
        ) {
          _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ].animations = {};
        }
        if (
          result in
          _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ]?.animations!
        ) {
          alert("Animation already exists");
          return;
        }
        _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
          _.init$tileFrameSel!.value
        ].animations![result] = {
          start: 1,
          end: Number(_.state$el.tileFrameCount!().value || 1),
          loop: _.state$el.animLoop!().checked,
          speed: Number(_.state$el.animSpeed!().value || 1),
          name: result,
        };
        // setFramesToSelection(tileFrameSel.value, result);
        updateTilesetDataList(true);
        _.init$tileAnimSel!.value = result;
        updateTilesetGridContainer();
      }
    });
    document
      .getElementById("removeTileAnimBtn")!
      .addEventListener("click", () => {
        console.log(
          "delete",
          _.init$tileAnimSel!.value,
          _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ].animations
        );
        if (
          _.init$tileAnimSel!.value &&
          _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ]?.animations &&
          _.init$tileAnimSel!.value in
            _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
              _.init$tileFrameSel!.value
            ]?.animations! &&
          confirm(
            `Are you sure you want to delete ${_.init$tileAnimSel!.value}`
          )
        ) {
          delete _.mul$tileSets[_.init$tilesetDataSel!.value].frames[
            _.init$tileFrameSel!.value
          ].animations![_.init$tileAnimSel!.value];
          updateTilesetDataList(true);
          updateTilesetGridContainer();
        }
      });
    _.state$el.renameTileAnimBtn!().addEventListener("click", () => {
      renameKeyInObjectForSelectElement(
        _.init$tileAnimSel!,
        _.mul$tileSets[_.init$tilesetDataSel!.value]?.frames[
          _.init$tileFrameSel!.value
        ]?.animations!,
        "animation"
      );
    });

    _.state$el.animLoop!().addEventListener("change", () => {
      getCurrentAnimation!()!.loop = _.state$el.animLoop!().checked;
    });
    _.state$el.animSpeed!().addEventListener("change", (e) => {
      getCurrentAnimation!()!.speed = _.state$el.animSpeed!()
        .value as unknown as number;
    });
    // Tileset SELECT callbacks
    _.init$tilesetDataSel = document.getElementById(
      "tilesetDataSel"
    ) as HTMLSelectElement;
    _.init$tilesetDataSel.addEventListener("change", (e) => {
      _.init$tilesetImage!.src =
        _.reloadTilesets$TILESET_ELEMENTS[
          target(e).value as unknown as number
        ].src;
      _.init$tilesetImage!.crossOrigin = "Anonymous";
      updateTilesetDataList();
    });
    _.state$el.tileFrameCount!().addEventListener("change", () => {
      _.state$el.animStart!().max = _.state$el.tileFrameCount!().value;
      _.state$el.animEnd!().max = _.state$el.tileFrameCount!().value;
    });

    const replaceSelectedTileSet = (src: string) => {
      addToUndoStack();
      _.mul$IMAGES[Number(_.init$tilesetDataSel!.value)].src = src;
      reloadTilesets();
    };
    const addNewTileSet = (src: string) => {
      console.log("add new tileset" + src);
      addToUndoStack();
      _.mul$IMAGES.push({ src });
      reloadTilesets();
    };
    //@ts-expect-error FIXME: exports
    exports.addNewTileSet = addNewTileSet;
    // replace tileset
    document
      .getElementById("tilesetReplaceInput")!
      .addEventListener("change", (e) => {
        toBase64(target(e).files![0]).then((base64Src) => {
          if (_.init_state$selectedTileSetLoader.onSelectImage) {
            _.init_state$selectedTileSetLoader.onSelectImage(
              replaceSelectedTileSet,
              target(e).files![0],
              base64Src
            );
          }
        });
      });
    document
      .getElementById("replaceTilesetBtn")!
      .addEventListener("click", () => {
        if (_.init_state$selectedTileSetLoader.onSelectImage!) {
          document.getElementById("tilesetReplaceInput")!.click();
        }
        if (_.init_state$selectedTileSetLoader.prompt) {
          _.init_state$selectedTileSetLoader.prompt(replaceSelectedTileSet);
        }
      });
    // add tileset
    document
      .getElementById("tilesetReadInput")!
      .addEventListener("change", (e) => {
        toBase64(target(e).files![0]).then((base64Src) => {
          if (_.init_state$selectedTileSetLoader.onSelectImage) {
            _.init_state$selectedTileSetLoader.onSelectImage(
              addNewTileSet,
              target(e).files![0],
              base64Src
            );
          }
        });
      });
    // remove tileset
    document.getElementById("addTilesetBtn")!.addEventListener("click", () => {
      if (_.init_state$selectedTileSetLoader.onSelectImage) {
        document.getElementById("tilesetReadInput")!.click();
      }
      if (_.init_state$selectedTileSetLoader.prompt) {
        _.init_state$selectedTileSetLoader.prompt(addNewTileSet);
      }
    });
    const tileSetLoadersSel = document.getElementById(
      "tileSetLoadersSel"
    ) as HTMLSelectElement;
    Object.entries(_.init_state$apiTileSetLoaders).forEach(([key, loader]) => {
      const tsLoaderOption = document.createElement("option");
      tsLoaderOption.value = key;
      tsLoaderOption.innerText = loader.name;
      tileSetLoadersSel.appendChild(tsLoaderOption);
      // apiTileSetLoaders[key].load = () => tileSetLoaders
    });

    tileSetLoadersSel.value = "base64";
    //@ts-expect-error FIXME: type
    _.init_state$selectedTileSetLoader =
      _.init_state$apiTileSetLoaders[
        tileSetLoadersSel.value as keyof ApiTileSetLoaders
      ];
    tileSetLoadersSel.addEventListener("change", (e) => {
      //@ts-expect-error FIXME: type
      _.init_state$selectedTileSetLoader =
        _.init_state$apiTileSetLoaders[
          target(e).value as keyof ApiTileSetLoaders
        ];
    });
    //@ts-expect-error FIXME: exports
    exports.tilesetLoaders = _.init_state$apiTileSetLoaders;

    const deleteTilesetWithIndex = (
      index: number,
      cb: (() => void) | null = null
    ) => {
      if (confirm(`Are you sure you want to delete this image?`)) {
        addToUndoStack();
        _.mul$IMAGES.splice(index, 1);
        reloadTilesets();
        if (cb) cb();
      }
    };
    //@ts-expect-error FIXME: exports
    exports.IMAGES = _.mul$IMAGES;
    //@ts-expect-error FIXME: exports
    exports.deleteTilesetWithIndex = deleteTilesetWithIndex;
    document
      .getElementById("removeTilesetBtn")!
      .addEventListener("click", () => {
        //Remove current tileset
        if (_.init$tilesetDataSel!.value !== "0") {
          deleteTilesetWithIndex(Number(_.init$tilesetDataSel!.value));
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
      element: document.getElementById("canvas_wrapper")!,
    });
    _.init$canvas.addEventListener("pointermove", (e) => {
      if (_.mul$isMouseDown && _.mul$ACTIVE_TOOL !== 2) toggleTile(e);
    });
    // Canvas Resizer ===================
    document
      .getElementById("canvasWidthInp")!
      .addEventListener("change", (e) => {
        updateMapSize({ mapWidth: Number(target(e).value) });
      });
    document
      .getElementById("canvasHeightInp")!
      .addEventListener("change", (e) => {
        updateMapSize({ mapHeight: Number(target(e).value) });
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
      .querySelector(".canvas_resizer[resizerdir='y'] input")!
      .addEventListener("change", (e) => {
        updateMapSize({ mapHeight: Number(target(e).value) });
      });
    document
      .querySelector(".canvas_resizer[resizerdir='x'] input")!
      .addEventListener("change", (e) => {
        updateMapSize({ mapWidth: Number(target(e).value) });
      });
    document
      .getElementById("toolButtonsWrapper")!
      .addEventListener("click", (e) => {
        console.log("ACTIVE_TOOL", target(e).value);
        if (target(e).getAttribute("name") === "tool")
          setActiveTool(Number(target(e).value));
      });
    document.getElementById("gridCropSize")!.addEventListener("change", (e) => {
      setCropSize(Number(target(e).value));
    });
    _.init$cropSize.addEventListener("change", (e) => {
      setCropSize(Number(target(e).value));
    });

    document
      .getElementById("clearCanvasBtn")!
      .addEventListener("click", clearCanvas);
    if (onApply) {
      _.init$confirmBtn.addEventListener("click", () =>
        onApply.onClick(getExportData())
      );
    }

    document.getElementById("renameMapBtn")!.addEventListener("click", () => {
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

    const fileMenuDropDown = document.getElementById("fileMenuDropDown")!;
    const makeMenuItem = (name: string, value: string, description: string) => {
      const menuItem = document.createElement("span") as HTMLInputElement;
      menuItem.className = "item";
      menuItem.innerText = name;
      menuItem.title = description || name;
      menuItem.value = value;
      fileMenuDropDown.appendChild(menuItem);
      return menuItem;
    };
    Object.entries(tileMapExporters).forEach(([key, exporter]: any) => {
      makeMenuItem(exporter.name, key, exporter.description).onclick = () => {
        exporter.transformer(getExportData());
      };
      //@ts-expect-error FIXME: type
      _.init_state$apiTileMapExporters[key].getData = () =>
        exporter.transformer(getExportData());
    });
    //@ts-expect-error FIXME: exports
    exports.exporters = _.init_state$apiTileMapExporters;

    Object.entries(_.init_state$apiTileMapImporters).forEach(
      ([key, importer]: any) => {
        makeMenuItem(importer.name, key, importer.description).onclick = () => {
          if (importer.onSelectFiles) {
            const input = document.createElement("input");
            input.type = "file";
            input.id = `importerInput-${key}`;
            if (importer.acceptFile) input.accept = importer.acceptFile;
            input.style.display = "none";
            input.addEventListener("change", (e) => {
              importer.onSelectFiles(loadData, target(e).files);
            });
            input.click();
          }
        };
        // apiTileMapImporters[key].setData = (files) => importer.onSelectFiles(loadData, files);
      }
    );
    document.getElementById("toggleFlipX")!.addEventListener("change", (e) => {
      document.getElementById("flipBrushIndicator")!.style.transform = target(e)
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
    document.getElementById("gridColorSel")!.addEventListener("change", (e) => {
      console.log("grid col", target(e).value);
      _.mul$maps[_.mul$ACTIVE_MAP].gridColor = target(e).value;
      draw();
    });
    document.getElementById("showGrid")!.addEventListener("change", (e) => {
      _.init$SHOW_GRID = target(e).checked;
      draw();
    });

    document.getElementById("undoBtn")!.addEventListener("click", undo);
    document.getElementById("redoBtn")!.addEventListener("click", redo);
    document.getElementById("zoomIn")!.addEventListener("click", zoomIn);
    document.getElementById("zoomOut")!.addEventListener("click", zoomOut);
    document
      .getElementById("setSymbolsVisBtn")!
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
      setLayer(appState.currentLayer);
      _.mul$selection = appState.selection;
      updateSelection(false);
      _.init$SHOW_GRID = appState.SHOW_GRID;
    }

    // Animated tiles when on frames mode
    const animateTiles = () => {
      if (_.init$tileDataSel!.value === "frames") draw();
      requestAnimationFrame(animateTiles);
    };
    requestAnimationFrame(animateTiles);
  };
