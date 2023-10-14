define("src/getImgurGallery", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //Get imgur gallery from an id  -- example: SjjsjTm
    exports.default = (album_id, cb) => {
        const api_key = "a85ae3a537d345f";
        const request_url = "https://api.imgur.com/3/album/" + album_id;
        const requestAlbum = () => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    processRequest(req.responseText);
                }
                else {
                    console.log("Error with Imgur Request.");
                }
            };
            req.open("GET", request_url, true); // true for asynchronous
            req.setRequestHeader("Authorization", "Client-ID " + api_key);
            req.send(null);
        };
        const processRequest = (response_text) => {
            if (response_text == "Not found") {
                console.log("Imgur album not found.");
            }
            else {
                const json = JSON.parse(response_text);
                console.log("Got images from imgur", json);
                cb(json.data);
            }
        };
        requestAlbum();
    };
});
define("src/getMapFromGist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (gistId, cb) => {
        console.log("Trying to get gist", `https://api.github.com/gists/=${gistId}`);
        fetch(`https://api.github.com/gists/${gistId}`)
            .then((blob) => blob.json())
            .then((data) => {
            let mapFound;
            Object.entries(data.files).forEach(([key, val]) => {
                if (!mapFound && key.endsWith(".json")) {
                    fetch(val.raw_url)
                        .then((blob) => blob.json())
                        .then((jsonData) => {
                        mapFound = jsonData;
                        console.log("Got map!", mapFound);
                        cb(mapFound);
                    });
                }
            });
        });
    };
});
define("src/helper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.target = void 0;
    const target = (e) => e.target;
    exports.target = target;
});
define("src/constants/tileSetImages", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = [
        {
            src: "https://i.imgur.com/ztwPZOI.png",
            name: "demo tileset",
            tileSize: 32,
            link: "https://google.com",
            description: `Demo tileset with a very very very very long description that can't barely fit there.
                Still the author decided he has lots to say about the thing and even include a link`,
        },
        {
            src: "./assets/free.png",
        },
    ];
});
define("src/kaboomJsExport", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // kaboomJs example exporter
    exports.default = ({ flattenedData, 
    // maps,
    tileSets,
    // activeMap,
    // downloadAsTextFile,
     }) => {
        const getTileData = (tileSet, tileSetIdx) => Array.from({ length: tileSet.tileCount }, (x, i) => i)
            .map((tile) => {
            const x = tile % tileSet.gridWidth;
            const y = Math.floor(tile / tileSet.gridWidth);
            const tileKey = `${x}-${y}`;
            const tags = Object.keys(tileSet.tags).filter((tagKey) => !!tileSet.tags[tagKey]?.tiles[tileKey]);
            return `"${tileSet.tileData[tileKey]?.tileSymbol}": [
          sprite("tileset-${tileSetIdx}", { frame: ${tile}, }),
          ${tags?.join(",") || ""}
        ],`;
        })
            .join("\n");
        const getAsciiMap = (flattenedDataLayer) => `\n${flattenedDataLayer
            .map((row, rowIndex) => "'" + row.map((tile) => tile.tileSymbol).join(""))
            .join("',\n") + "'"}`;
        console.log("TILESETS", tileSets, flattenedData);
        const kaboomBoiler = `
      kaboom({
        global: true,
        fullscreen: true,
        scale: 1,
        debug: true,
        clearColor: [0, 0, 0, 1],
      });

      // Load assets
      ${Object.values(tileSets)
            .map((tileSet, tileSetIdx) => `
            loadSprite("tileset-${tileSetIdx}", "${tileSet.src}", {
            sliceX: ${tileSet.gridWidth},
            sliceY: ${tileSet.gridHeight},
        });
      `)
            .join("\n")}


      scene("main", () => {
      // tileset
        ${Object.values(tileSets)
            .map((tileSet, tileSetIdx) => `
            const tileset_${tileSetIdx}_data = {
            width: ${tileSet.tileSize},
            height: ${tileSet.tileSize},
            pos: vec2(0, 0),
             ${getTileData(tileSet, tileSetIdx)}
             };
        `)
            .join("\n")}
      // maps
      ${flattenedData
            .map((map, index) => `
        const map_${index} = [${getAsciiMap(map.flattenedData[map.flattenedData.length - 1])}];
      `)
            .join("\n")}

      addLevel(map_0, tileset_0_data);
      })

      start("main");
      `;
        console.log(kaboomBoiler);
        // return the transformed data in the end
        return kaboomBoiler;
    };
});
define("src/uploadImageToImgur", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // upload to imgur, then return the src
    exports.default = (blob) => {
        const formData = new FormData();
        formData.append("type", "file");
        formData.append("image", blob);
        return fetch("https://api.imgur.com/3/upload.json", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Client-ID 1bddacd2afe5039", // imgur specific
            },
            body: formData,
        })
            .then((response) => {
            if (response.status === 200 || response.status === 0)
                return Promise.resolve(response);
            return Promise.reject(new Error("Error loading image"));
        })
            .then((response) => response.json());
    };
});
define("src/constants/html", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.layersElementHTML = exports.activeLayerLabelHTML = exports.tilemapEditorRootHTML = void 0;
    const tilemapEditorRootHTML = ({ width, height, mapTileWidth }) => `
<div id="tilemapjs_root" class="card tilemapjs_root">
 <a id="downloadAnchorElem" style="display:none"></a>
<div class="tileset_opt_field header">
<div class="menu file">
     <span> File </span>
     <div class="dropdown" id="fileMenuDropDown">                            
         <a class="button item button-as-link" href="#popup2">About</a>
         <div id="popup2" class="overlay">
         <div class="popup">
         <h4>Tilemap editor</h4>
         <a class="close" href="#">&times;</a>
         <div class="content"> 
             <div>Created by Todor Imreorov (blurymind@gmail.com)</div>
             <br/>
             <div><a class="button-as-link" href="https://github.com/blurymind/tilemap-editor">Project page (Github)</a></div>
             <div><a class="button-as-link" href="https://ko-fi.com/blurymind">Donate page (ko-fi)</a></div>
             <br/>
             <div>Instructions:</div>
             <div>right click on map - picks tile</div>
             <div>mid-click - erases tile</div>
             <div>left-click adds tile</div> 
             <div>right-click on tileset - lets you change tile symbol or metadata</div>
             <div>left-click - selects tile </div>
         </div>
         </div>
         </div>
     </div>
 </div>
 <div>
     <div id="toolButtonsWrapper" class="tool_wrapper">             
       <input id="tool0" type="radio" value="0" name="tool" checked class="hidden"/>
       <label for="tool0" title="paint tiles" data-value="0" class="menu">
           <div id="flipBrushIndicator">🖌️</div>
           <div class="dropdown">
             <div class="item nohover">Brush tool options</div>
             <div class="item">
                 <label for="toggleFlipX" class="">Flip tile on x</label>
                 <input type="checkbox" id="toggleFlipX" style="display: none"> 
                 <label class="toggleFlipX"></label>
             </div>
           </div>
       </label>
       <input id="tool1" type="radio" value="1" name="tool" class="hidden"/>
       <label for="tool1" title="erase tiles" data-value="1">🗑️</label>
       <input id="tool2" type="radio" value="2" name="tool" class="hidden"/> 
       <label for="tool2" title="pan" data-value="2">✋</label>
       <input id="tool3" type="radio" value="3" name="tool" class="hidden"/> 
       <label for="tool3" title="pick tile" data-value="3">🎨</label>
       <input id="tool4" type="radio" value="4" name="tool" class="hidden"/> 
       <label for="tool4" title="random from selected" data-value="4">🎲</label>
        <input id="tool5" type="radio" value="5" name="tool" class="hidden"/> 
       <label for="tool5" title="fill on layer" data-value="5">🌈</label>
     </div>
 </div>

 <div class="tool_wrapper">
     <label id="undoBtn" title="Undo">↩️️</label>
     <label id="redoBtn" title="Redo">🔁️</label>
     <label id="zoomIn" title="Zoom in">🔎️+</label>
     <label id="zoomOut" title="Zoom out">🔎️-</label>
     <label id="zoomLabel">️</label>
 </div>
     
 <div>
     <button class="primary-button" id="confirmBtn">"apply"</button>
 </div>

</div>
<div class="card_body">
 <div class="card_left_column">
 <details class="details_container sticky_left" id="tilesetDataDetails" open="true">
   <summary >
     <span  id="mapSelectContainer">
     | <select name="tileSetSelectData" id="tilesetDataSel" class="limited_select"></select>
     <button id="replaceTilesetBtn" title="replace tileset">r</button>
     <input id="tilesetReplaceInput" type="file" style="display: none" />
     <button id="addTilesetBtn" title="add tileset">+</button>
     <input id="tilesetReadInput" type="file" style="display: none" />
     <button id="removeTilesetBtn" title="remove">-</button>
     </span>
   </summary>
   <div>
       <div class="tileset_opt_field">
         <span>Tile size:</span>
         <input type="number" id="cropSize" name="crop" placeholder="32" min="1" max="128">
       </div>
       <div class="tileset_opt_field">
         <span>Tileset loader:</span>
         <select name="tileSetLoaders" id="tileSetLoadersSel"></select>
       </div>
       <div class="tileset_info" id="tilesetSrcLabel"></div>
       <div class="tileset_info" id="tilesetHomeLink"></div>
       <div class="tileset_info" id="tilesetDescriptionLabel"></div> 
   </div>

 </details>
 <div class="select_container layer sticky_top sticky_left" id="tilesetSelectContainer">
     <span id="setSymbolsVisBtn">👓️</span>

     <select name="tileData" id="tileDataSel">
         <option value="">Symbols</option>
     </select>
     <button id="addTileTagBtn" title="add">+</button>
     <button id="removeTileTagBtn" title="remove">-</button>
 </div>

 <div class="select_container sticky_top2 sticky_settings sticky_left" style="display: none;flex-direction:column;" id="tileFrameSelContainer">
     <div class="item nohover layer tileset_opt_field">
         <div title="Object parameters" class="menu parameters" id="objectParametersEditor">
             ⚙
             <div class="dropdown">        
                 <div class="item"> 
                     💡 object:
                     <button id="renameTileFrameBtn" title="rename object">📝</button>
                     <button id="removeTileFrameBtn" title="remove">🗑️</button>
                      <button id="addTileFrameBtn" title="add new object">+ new</button>
                 </div>
<!--                        <div class="item nohover">Object parameters:</div>-->
             </div>
         ️</div>
         <select name="tileFrameData" id="tileFrameSel" style="max-width: 150px;">
<!--            <option value="anim1">anim1rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr</option>-->
         </select>
         frames: <input id="tileFrameCount" value="1" type="number" min="1">
<!--                <button id="renameTileFrameBtn" title="rename object">r</button>-->
<!--                <button id="addTileFrameBtn" title="add new object">+</button>-->
<!--                <button id="removeTileFrameBtn" title="remove object">-</button>-->

     </div>
     <div class="item nohover layer tileset_opt_field"> 
       <div title="Animation parameters" class="menu parameters" id="objectParametersEditor">
             ⚙
             <div class="dropdown">        
                 <div class="item"> 
                     🎞️ animation:
                     <button id="renameTileAnimBtn" title="rename animation">📝</button>
                     <button id="removeTileAnimBtn" title="remove">🗑️</button>
                     <button id="addTileAnimBtn" title="add new animation">+ new</button>
                 </div>
<!--                        <div class="item nohover">Object parameters:</div>-->
             </div>
         ️</div>
         <select name="tileAnimData" id="tileAnimSel" style="max-width: 72px">
 <!--          <option value="anim1">anim1</option>-->
         </select>
         <input id="animStart" value="1" type="number" min="1" title="animation start" class="two-digit-width"> to 
         <input id="animEnd" value="1" type="number" min="1" title="animation end" class="two-digit-width">

         <span title="animation speed">⏱</span>
         <input id="animSpeed" value="1" type="number" min="1" title="animation speed" class="two-digit-width">
         <span class="item" title="loop animation">
             <input type="checkbox" id="animLoop" style="display: none" checked>
             <label for="animLoop" class="animLoop">️</label>
         </span>
<!--                <button id="renameTileAnimBtn" title="rename animation">r</button>-->
<!--                <button id="addTileAnimBtn" title="add new animation">+</button>-->
<!--                <button id="removeTileAnimBtn" title="remove animation">-</button>-->


    </div>     
 </div>

<div class="tileset-container">
 <div class="tileset-container-selection"></div>
 <canvas id="tilesetCanvas" />
<!--        <div id="tilesetGridContainer" class="tileset_grid_container"></div>-->
 
</div>
 </div>
 <div class="card_right-column" style="position:relative" id="canvas_drag_area">
 <div class="canvas_wrapper" id="canvas_wrapper">
   <canvas id="mapCanvas" width="${width}" height="${height}"></canvas>
   <div class="canvas_resizer" resizerdir="y"><input value="1" type="number" min="1" resizerdir="y"><span>-y-</span></div>
   <div class="canvas_resizer vertical" resizerdir="x"><input value="${mapTileWidth}" type="number" min="1" resizerdir="x"><span>-x-</span></div>
 </div>
 </div>
<div class="card_right-column layers">
<div id="mapSelectContainer" class="tilemaps_selector">
     <select name="mapsData" id="mapsDataSel"></select>
     <button id="addMapBtn" title="Add tilemap">+</button>
     <button id="removeMapBtn" title="Remove tilemap">-</button>        
     <button id="duplicateMapBtn" title="Duplicate tilemap">📑</button>     
     <a class="button" href="#popup1">🎚️</a>
     <div id="popup1" class="overlay">
     <div class="popup">
     <h4>TileMap settings</h4>
     <a class="close" href="#">&times;</a>
     <div class="content">
         <span class="flex">Width: </span><input id="canvasWidthInp" value="1" type="number" min="1">
         <span class="flex">Height: </span><input id="canvasHeightInp" value="1" type="number" min="1">
         <br/><br/>
         <span class="flex">Grid tile size: </span><input type="number" id="gridCropSize" name="crop" placeholder="32" min="1" max="128">
         <span class="flex">Grid color: </span><input type="color" value="#ff0000" id="gridColorSel">
         <span class="flex">Show grid above: </span> <input type="checkbox" id="showGrid">
         <br/><br/>
         <div class="tileset_opt_field">
             <button id="renameMapBtn" title="Rename map">Rename</button>
             <button id="clearCanvasBtn" title="Clear map">Clear</button>
         </div>
     </div>
     </div>
     </div>
 </div>

 <label class="sticky add_layer">
     <label id="activeLayerLabel" class="menu">
     Editing Layer
     </label>
     <button id="addLayerBtn" title="Add layer">+</button>
 </label>
 <div class="layers" id="layers">
</div>
</div>
</div>
 `;
    exports.tilemapEditorRootHTML = tilemapEditorRootHTML;
    const activeLayerLabelHTML = ({ name, opacity }) => `
 Editing Layer: ${name}
 <div class="dropdown left">
     <div class="item nohover">Layer: ${name} </div>
     <div class="item">
         <div class="slider-wrapper">
           <label for="layerOpacitySlider">Opacity</label>
           <input type="range" min="0" max="1" value="1" id="layerOpacitySlider" step="0.01">
           <output for="layerOpacitySlider" id="layerOpacitySliderValue">${opacity}</output>
         </div>
     </div>
 </div>
`;
    exports.activeLayerLabelHTML = activeLayerLabelHTML;
    const layersElementHTML = ({ index, layer, enableButton }) => `
<div class="layer">
  <div id="selectLayerBtn-${index}" class="layer select_layer" tile-layer="${index}" title="${layer.name}">${layer.name} ${layer.opacity < 1 ? ` (${layer.opacity})` : ""}</div>
  <span id="setLayerVisBtn-${index}" vis-layer="${index}"></span>
  <div id="trashLayerBtn-${index}" trash-layer="${index}" ${enableButton ? "" : `disabled="true"`}>🗑️</div>
</div>
`;
    exports.layersElementHTML = layersElementHTML;
});
define("src/TilemapEditor/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEmptyLayer = exports.decoupleReferenceFromObj = exports.drawGrid = exports.toBase64 = void 0;
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
    exports.toBase64 = toBase64;
    const drawGrid = (w, h, ctx, step = 16, color = "rgba(0,255,217,0.5)") => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = 0; x < w + 1; x += step) {
            ctx.moveTo(x, 0.5);
            ctx.lineTo(x, h + 0.5);
        }
        for (let y = 0; y < h + 1; y += step) {
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(w, y + 0.5);
        }
        ctx.stroke();
    };
    exports.drawGrid = drawGrid;
    const decoupleReferenceFromObj = (obj) => JSON.parse(JSON.stringify(obj));
    exports.decoupleReferenceFromObj = decoupleReferenceFromObj;
    const getEmptyLayer = (name = "layer") => ({
        tiles: {},
        visible: true,
        name,
        animatedTiles: {},
        opacity: 1,
    });
    exports.getEmptyLayer = getEmptyLayer;
});
define("src/TilemapEditor/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// memo: グローバルかつ再代入の変数の識別子
// _.init$ -- init で書き換わる
// _.mul$ -- 複数個所で書き換わる
// _.state$ -- 状態管理オブジェクト
define("src/TilemapEditor/state", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        state$el: {
            tileFrameCount: (() => { }),
            animStart: (() => { }),
            animEnd: (() => { }),
            renameTileFrameBtn: (() => { }),
            renameTileAnimBtn: (() => { }),
            animSpeed: (() => { }),
            animLoop: (() => { }),
        },
        init$tilesetImage: undefined,
        init$canvas: undefined,
        init$tilesetContainer: undefined,
        init$tilesetSelection: undefined,
        init$cropSize: undefined,
        init$confirmBtn: undefined,
        init$layersElement: undefined,
        init$tileDataSel: undefined,
        init$tileFrameSel: undefined,
        init$tileAnimSel: undefined,
        init$tilesetDataSel: undefined,
        init$mapsDataSel: undefined,
        init$objectParametersEditor: undefined,
        mul$mapTileHeight: undefined,
        mul$mapTileWidth: undefined,
        reloadTilesets$TILESET_ELEMENTS: [],
        mul$IMAGES: [{ src: "" }],
        mul$ZOOM: 1,
        mul$SIZE_OF_CROP: 32,
        mul$WIDTH: 0,
        mul$HEIGHT: 0,
        mul$PREV_ACTIVE_TOOL: 0,
        mul$ACTIVE_TOOL: 0,
        mul$ACTIVE_MAP: "",
        toggleSymbolsVisible$DISPLAY_SYMBOLS: false,
        init$SHOW_GRID: false,
        mul$selection: [],
        setLayer$currentLayer: 0,
        mul$isMouseDown: false,
        mul$maps: {},
        mul$tileSets: {},
        init_state$apiTileSetLoaders: {},
        init_state$selectedTileSetLoader: {
            onSelectImage: (() => { }),
            prompt: (() => { }),
        },
        init_state$apiTileMapExporters: {},
        init_state$apiTileMapImporters: {},
        init$apiOnUpdateCallback: (() => { }),
        init$apiOnMouseUp: (() => { }),
        getTile$editedEntity: undefined,
        updateSelection$selectionSize: [1, 1],
        mul$undoStepPosition: -1,
        clearUndoStack$undoStack: [],
        mul$zoomIndex: 1,
        init$tileSelectStart: null,
    };
});
define("src/constants/enums", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZOOM_LEVELS = exports.RANDOM_LETTERS = exports.TOOLS = void 0;
    exports.TOOLS = {
        BRUSH: 0,
        ERASE: 1,
        PAN: 2,
        PICK: 3,
        RAND: 4,
        FILL: 5,
    };
    exports.RANDOM_LETTERS = new Array(10680)
        .fill(1)
        .map((_, i) => String.fromCharCode(165 + i));
    exports.ZOOM_LEVELS = [0.25, 0.5, 1, 2, 3, 4];
});
define("src/TilemapEditor/features", ["require", "exports", "src/constants/enums", "src/constants/html", "src/helper", "src/TilemapEditor/state", "src/TilemapEditor/utils"], function (require, exports, enums_js_1, html_js_1, helper_js_1, state_js_1, utils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.restoreFromUndoStackData = exports.updateMaps = exports.reloadTilesets = exports.setActiveMap = exports.getTile = exports.updateLayers = exports.setLayer = exports.setCropSize = exports.reevaluateTilesetsData = exports.updateTilesetDataList = exports.getCurrentAnimation = exports.updateZoom = exports.addToUndoStack = exports.clearUndoStack = exports.updateMapSize = exports.getTilesAnalisis = exports.downloadAsTextFile = exports.selectMode = exports.updateTilesetGridContainer = exports.fillEmptyOrSameTiles = exports.addRandomTile = exports.addTile = exports.shouldNotAddAnimatedTile = exports.getSelectedFrameCount = exports.getCurrentFrames = exports.removeTile = exports.setMouseIsFalse = exports.setMouseIsTrue = exports.updateSelection = exports.setActiveTool = exports.getSelectedTile = exports.draw = exports.onUpdateState = exports.getAppState = exports.shouldHideSymbols = exports.getTileData = exports.getEmptyMap = void 0;
    const getEmptyMap = (name = "map", mapWidth = 20, mapHeight = 20, tileSize = 32, gridColor = "#00FFFF") => ({
        layers: [
            (0, utils_js_1.getEmptyLayer)("bottom"),
            (0, utils_js_1.getEmptyLayer)("middle"),
            (0, utils_js_1.getEmptyLayer)("top"),
        ],
        name,
        mapWidth,
        mapHeight,
        tileSize,
        width: mapWidth * state_js_1.default.mul$SIZE_OF_CROP,
        height: mapHeight * state_js_1.default.mul$SIZE_OF_CROP,
        gridColor,
    });
    exports.getEmptyMap = getEmptyMap;
    const getTileData = (x = NaN, y = NaN) => {
        const tilesetTiles = state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value].tileData;
        let data;
        if (Number.isNaN(x) && Number.isNaN(y)) {
            const { x: sx, y: sy } = state_js_1.default.mul$selection[0];
            return tilesetTiles[`${sx}-${sy}`];
        }
        else {
            data = tilesetTiles[`${x}-${y}`];
        }
        return data;
    };
    exports.getTileData = getTileData;
    const shouldHideSymbols = () => state_js_1.default.mul$SIZE_OF_CROP < 10 && state_js_1.default.mul$ZOOM < 2;
    exports.shouldHideSymbols = shouldHideSymbols;
    const getAppState = () => {
        // TODO we need for tilesets to load - rapidly refreshing the browser may return empty tilesets object!
        if (Object.keys(state_js_1.default.mul$tileSets).length === 0 &&
            state_js_1.default.mul$tileSets.constructor === Object)
            return null;
        return {
            tileMapData: { tileSets: state_js_1.default.mul$tileSets, maps: state_js_1.default.mul$maps },
            appState: {
                undoStack: state_js_1.default.clearUndoStack$undoStack,
                undoStepPosition: state_js_1.default.mul$undoStepPosition,
                currentLayer: state_js_1.default.setLayer$currentLayer,
                PREV_ACTIVE_TOOL: state_js_1.default.mul$PREV_ACTIVE_TOOL,
                ACTIVE_TOOL: state_js_1.default.mul$ACTIVE_TOOL,
                ACTIVE_MAP: state_js_1.default.mul$ACTIVE_MAP,
                SHOW_GRID: state_js_1.default.init$SHOW_GRID,
                selection: state_js_1.default.mul$selection,
            },
            //Todo tileSize and the others
            // undo stack is lost
        };
    };
    exports.getAppState = getAppState;
    const onUpdateState = () => {
        state_js_1.default.init$apiOnUpdateCallback((0, exports.getAppState)());
    };
    exports.onUpdateState = onUpdateState;
    const draw = (shouldDrawGrid = true) => {
        const ctx = state_js_1.default.init$canvas.getContext("2d");
        ctx.clearRect(0, 0, state_js_1.default.mul$WIDTH, state_js_1.default.mul$HEIGHT);
        ctx.canvas.width = state_js_1.default.mul$WIDTH;
        ctx.canvas.height = state_js_1.default.mul$HEIGHT;
        if (shouldDrawGrid && !state_js_1.default.init$SHOW_GRID)
            (0, utils_js_1.drawGrid)(state_js_1.default.mul$WIDTH, state_js_1.default.mul$HEIGHT, ctx, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].gridColor);
        const shouldHideHud = (0, exports.shouldHideSymbols)();
        state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers.forEach((layer) => {
            if (!layer.visible)
                return;
            ctx.globalAlpha = layer.opacity;
            if (state_js_1.default.mul$ZOOM !== 1) {
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
            }
            //static tiles on this layer
            Object.keys(layer.tiles).forEach((key) => {
                const [positionX, positionY] = key.split("-").map(Number);
                const { x, y, tilesetIdx, isFlippedX } = layer.tiles[key];
                const tileSize = state_js_1.default.mul$tileSets[tilesetIdx]?.tileSize || state_js_1.default.mul$SIZE_OF_CROP;
                if (!(tilesetIdx in state_js_1.default.reloadTilesets$TILESET_ELEMENTS)) {
                    //texture not found
                    ctx.fillStyle = "red";
                    ctx.fillRect(positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM);
                    return;
                }
                if (isFlippedX) {
                    ctx.save(); //Special canvas crap to flip a slice, cause drawImage cant do it
                    ctx.translate(ctx.canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(state_js_1.default.reloadTilesets$TILESET_ELEMENTS[tilesetIdx], x * tileSize, y * tileSize, tileSize, tileSize, ctx.canvas.width -
                        positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM -
                        state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM);
                    ctx.restore();
                }
                else {
                    ctx.drawImage(state_js_1.default.reloadTilesets$TILESET_ELEMENTS[tilesetIdx], x * tileSize, y * tileSize, tileSize, tileSize, positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM);
                }
            });
            // animated tiles
            Object.keys(layer.animatedTiles || {}).forEach((key) => {
                const [positionX, positionY] = key.split("-").map(Number);
                const { start, width, height, frameCount, isFlippedX } = layer.animatedTiles[key];
                const { x, y, tilesetIdx } = start;
                const tileSize = state_js_1.default.mul$tileSets[tilesetIdx]?.tileSize || state_js_1.default.mul$SIZE_OF_CROP;
                if (!(tilesetIdx in state_js_1.default.reloadTilesets$TILESET_ELEMENTS)) {
                    //texture not found
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * width, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * height);
                    ctx.fillStyle = "blue";
                    ctx.fillText("X", positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM + 5, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM + 10);
                    return;
                }
                const frameIndex = state_js_1.default.init$tileDataSel.value === "frames" || frameCount === 1
                    ? Math.round(Date.now() / 120) % frameCount
                    : 1; //30fps
                if (isFlippedX) {
                    ctx.save(); //Special canvas crap to flip a slice, cause drawImage cant do it
                    ctx.translate(ctx.canvas.width, 0);
                    ctx.scale(-1, 1);
                    const positionXFlipped = ctx.canvas.width -
                        positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM -
                        state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM;
                    if (shouldDrawGrid && !shouldHideHud) {
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "rgba(250,240,255, 0.7)";
                        ctx.rect(positionXFlipped, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * width, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * height);
                        ctx.stroke();
                    }
                    ctx.drawImage(state_js_1.default.reloadTilesets$TILESET_ELEMENTS[tilesetIdx], x * tileSize + frameIndex * tileSize * width, y * tileSize, tileSize * width, // src width
                    tileSize * height, // src height
                    positionXFlipped, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, //target y
                    state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * width, // target width
                    state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * height // target height
                    );
                    if (shouldDrawGrid && !shouldHideHud) {
                        ctx.fillStyle = "white";
                        ctx.fillText("🔛", positionXFlipped + 5, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM + 10);
                    }
                    ctx.restore();
                }
                else {
                    if (shouldDrawGrid && !shouldHideHud) {
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "rgba(250,240,255, 0.7)";
                        ctx.rect(positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * width, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * height);
                        ctx.stroke();
                    }
                    ctx.drawImage(state_js_1.default.reloadTilesets$TILESET_ELEMENTS[tilesetIdx], x * tileSize + frameIndex * tileSize * width, //src x
                    y * tileSize, //src y
                    tileSize * width, // src width
                    tileSize * height, // src height
                    positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, //target x
                    positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, //target y
                    state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * width, // target width
                    state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * height // target height
                    );
                    if (shouldDrawGrid && !shouldHideHud) {
                        ctx.fillStyle = "white";
                        ctx.fillText("⭕", positionX * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM + 5, positionY * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM + 10);
                    }
                }
            });
        });
        if (state_js_1.default.init$SHOW_GRID)
            (0, utils_js_1.drawGrid)(state_js_1.default.mul$WIDTH, state_js_1.default.mul$HEIGHT, ctx, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].gridColor);
        (0, exports.onUpdateState)();
    };
    exports.draw = draw;
    const getSelectedTile = (event) => {
        const { x, y } = event.target.getBoundingClientRect();
        const tileSize = state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value].tileSize * state_js_1.default.mul$ZOOM;
        const tx = Math.floor(Math.max(event.clientX - x, 0) / tileSize);
        const ty = Math.floor(Math.max(event.clientY - y, 0) / tileSize);
        // add start tile, add end tile, add all tiles inbetween
        const newSelection = [];
        if (state_js_1.default.init$tileSelectStart !== null) {
            for (let ix = state_js_1.default.init$tileSelectStart.x; ix < tx + 1; ix++) {
                for (let iy = state_js_1.default.init$tileSelectStart.y; iy < ty + 1; iy++) {
                    const data = (0, exports.getTileData)(ix, iy);
                    newSelection.push({ ...data, x: ix, y: iy });
                }
            }
        }
        if (newSelection.length > 0)
            return newSelection;
        const data = (0, exports.getTileData)(tx, ty);
        return [{ ...data, x: tx, y: ty }];
    };
    exports.getSelectedTile = getSelectedTile;
    const setActiveTool = (toolIdx) => {
        const toolButtonsWrapper = document.getElementById("toolButtonsWrapper");
        const canvas_wrapper = document.getElementById("canvas_wrapper");
        state_js_1.default.mul$ACTIVE_TOOL = toolIdx;
        const actTool = toolButtonsWrapper.querySelector(`input[id="tool${toolIdx}"]`);
        if (actTool)
            actTool.checked = true;
        canvas_wrapper.setAttribute("isDraggable", `${state_js_1.default.mul$ACTIVE_TOOL === enums_js_1.TOOLS.PAN}`);
        (0, exports.draw)();
    };
    exports.setActiveTool = setActiveTool;
    const updateSelection = (autoSelectTool = true) => {
        const tilesetDataSel = state_js_1.default.init$tilesetDataSel;
        const tilesetSelection = state_js_1.default.init$tilesetSelection;
        if (!state_js_1.default.mul$tileSets[tilesetDataSel.value])
            return;
        const selected = state_js_1.default.mul$selection[0];
        if (!selected)
            return;
        const { x, y } = selected;
        const { x: endX, y: endY } = state_js_1.default.mul$selection[state_js_1.default.mul$selection.length - 1];
        const selWidth = endX - x + 1;
        const selHeight = endY - y + 1;
        state_js_1.default.updateSelection$selectionSize = [selWidth, selHeight];
        console.log(state_js_1.default.mul$tileSets[tilesetDataSel.value].tileSize);
        const tileSize = state_js_1.default.mul$tileSets[tilesetDataSel.value].tileSize;
        tilesetSelection.style.left = `${x * tileSize * state_js_1.default.mul$ZOOM}px`;
        tilesetSelection.style.top = `${y * tileSize * state_js_1.default.mul$ZOOM}px`;
        tilesetSelection.style.width = `${selWidth * tileSize * state_js_1.default.mul$ZOOM}px`;
        tilesetSelection.style.height = `${selHeight * tileSize * state_js_1.default.mul$ZOOM}px`;
        // Autoselect tool upon selecting a tile
        if (autoSelectTool &&
            ![enums_js_1.TOOLS.BRUSH, enums_js_1.TOOLS.RAND, enums_js_1.TOOLS.FILL].includes(state_js_1.default.mul$ACTIVE_TOOL))
            (0, exports.setActiveTool)(enums_js_1.TOOLS.BRUSH);
        // show/hide param editor
        if (state_js_1.default.init$tileDataSel.value === "frames" && state_js_1.default.getTile$editedEntity)
            state_js_1.default.init$objectParametersEditor.classList.add("entity");
        else
            state_js_1.default.init$objectParametersEditor.classList.remove("entity");
        (0, exports.onUpdateState)();
    };
    exports.updateSelection = updateSelection;
    const setMouseIsTrue = (e) => {
        if (e.button === 0) {
            state_js_1.default.mul$isMouseDown = true;
        }
        else if (e.button === 1) {
            state_js_1.default.mul$PREV_ACTIVE_TOOL = state_js_1.default.mul$ACTIVE_TOOL;
            (0, exports.setActiveTool)(enums_js_1.TOOLS.PAN);
        }
    };
    exports.setMouseIsTrue = setMouseIsTrue;
    const setMouseIsFalse = (e) => {
        if (e.button === 0) {
            state_js_1.default.mul$isMouseDown = false;
        }
        else if (e.button === 1 && state_js_1.default.mul$ACTIVE_TOOL === enums_js_1.TOOLS.PAN) {
            (0, exports.setActiveTool)(state_js_1.default.mul$PREV_ACTIVE_TOOL);
        }
    };
    exports.setMouseIsFalse = setMouseIsFalse;
    const removeTile = (key) => {
        delete state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[key];
        if (key in
            (state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer]
                .animatedTiles || {}))
            delete state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer]
                .animatedTiles[key];
    };
    exports.removeTile = removeTile;
    const addSelectedTiles = (key, tiles) => {
        const [x, y] = key.split("-");
        const tilesPatch = tiles || state_js_1.default.mul$selection; // tiles is opt override for selection for fancy things like random patch of tiles
        const { x: startX, y: startY } = tilesPatch[0]; // add selection override
        const selWidth = state_js_1.default.updateSelection$selectionSize[0];
        const selHeight = state_js_1.default.updateSelection$selectionSize[1];
        state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[key] =
            tilesPatch[0];
        for (let ix = 0; ix < selWidth; ix++) {
            for (let iy = 0; iy < selHeight; iy++) {
                const isFlippedX = document.getElementById("toggleFlipX").checked;
                const tileX = isFlippedX ? Number(x) - ix : Number(x) + ix; //placed in reverse when flipped on x
                const coordKey = `${tileX}-${Number(y) + iy}`;
                state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[coordKey] = {
                    ...tilesPatch.find((tile) => tile.x === startX + ix && tile.y === startY + iy),
                    isFlippedX,
                };
            }
        }
    };
    const getCurrentFrames = () => state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value]?.frames[state_js_1.default.init$tileFrameSel.value];
    exports.getCurrentFrames = getCurrentFrames;
    const getSelectedFrameCount = () => (0, exports.getCurrentFrames)()?.frameCount || 1;
    exports.getSelectedFrameCount = getSelectedFrameCount;
    const shouldNotAddAnimatedTile = () => (state_js_1.default.init$tileDataSel.value !== "frames" && (0, exports.getSelectedFrameCount)() !== 1) ||
        Object.keys(state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value]?.frames).length === 0;
    exports.shouldNotAddAnimatedTile = shouldNotAddAnimatedTile;
    const addTile = (key) => {
        if ((0, exports.shouldNotAddAnimatedTile)()) {
            addSelectedTiles(key);
        }
        else {
            // if animated tile mode and has more than one frames, add/remove to animatedTiles
            if (!state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer]
                .animatedTiles)
                state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].animatedTiles = {};
            const [x, y] = key.split("-");
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].animatedTiles[key] = {
                ...(0, exports.getCurrentFrames)(),
                isFlippedX: document.getElementById("toggleFlipX")
                    .checked,
                layer: state_js_1.default.setLayer$currentLayer,
                xPos: Number(x) * state_js_1.default.mul$SIZE_OF_CROP,
                yPos: Number(y) * state_js_1.default.mul$SIZE_OF_CROP,
            };
        }
    };
    exports.addTile = addTile;
    const addRandomTile = (key) => {
        // TODO add probability for empty
        if ((0, exports.shouldNotAddAnimatedTile)()) {
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[key] =
                state_js_1.default.mul$selection[Math.floor(Math.random() * state_js_1.default.mul$selection.length)];
        }
        else {
            // do the same, but add random from frames instead
            const tilesetTiles = state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value].tileData;
            const { frameCount, tiles, width } = (0, exports.getCurrentFrames)();
            const randOffset = Math.floor(Math.random() * frameCount);
            const randXOffsetTiles = tiles.map((tile) => tilesetTiles[`${tile.x + randOffset * width}-${tile.y}`]);
            addSelectedTiles(key, randXOffsetTiles);
        }
    };
    exports.addRandomTile = addRandomTile;
    const fillEmptyOrSameTiles = (key) => {
        const pickedTile = state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[key];
        const [w, h] = [state_js_1.default.mul$mapTileWidth, state_js_1.default.mul$mapTileHeight];
        Array.from({ length: w * h }, (x, i) => i).map((tile) => {
            const x = tile % w;
            const y = Math.floor(tile / w);
            const coordKey = `${x}-${y}`;
            const filledTile = state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[coordKey];
            if (pickedTile &&
                filledTile &&
                filledTile.x === pickedTile.x &&
                filledTile.y === pickedTile.y) {
                state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[coordKey] = state_js_1.default.mul$selection[0]; // Replace all clicked on tiles with selected
            }
            else if (!pickedTile &&
                !(coordKey in
                    state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles)) {
                state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].tiles[coordKey] = state_js_1.default.mul$selection[0]; // when clicked on empty, replace all empty with selection
            }
        });
    };
    exports.fillEmptyOrSameTiles = fillEmptyOrSameTiles;
    const updateTilesetGridContainer = () => {
        const viewMode = state_js_1.default.init$tileDataSel.value;
        const tilesetData = state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value];
        if (!tilesetData)
            return;
        const { tileCount, gridWidth, tileData, tags } = tilesetData;
        // console.log("COUNT", tileCount)
        const hideSymbols = !state_js_1.default.toggleSymbolsVisible$DISPLAY_SYMBOLS || (0, exports.shouldHideSymbols)();
        const canvas = document.getElementById("tilesetCanvas");
        const img = state_js_1.default.reloadTilesets$TILESET_ELEMENTS[state_js_1.default.init$tilesetDataSel.value];
        canvas.width = img.width * state_js_1.default.mul$ZOOM;
        canvas.height = img.height * state_js_1.default.mul$ZOOM;
        const ctx = canvas.getContext("2d");
        if (state_js_1.default.mul$ZOOM !== 1) {
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // console.log("WIDTH EXCEEDS?", canvas.width % SIZE_OF_CROP)
        const tileSizeSeemsIncorrect = canvas.width % state_js_1.default.mul$SIZE_OF_CROP !== 0;
        (0, utils_js_1.drawGrid)(ctx.canvas.width, ctx.canvas.height, ctx, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM, tileSizeSeemsIncorrect ? "red" : "cyan");
        Array.from({ length: tileCount }, (x, i) => i).map((tile) => {
            if (viewMode === "frames") {
                const frameData = (0, exports.getCurrentFrames)();
                if (!frameData || Object.keys(frameData).length === 0)
                    return;
                const { width, height, start, tiles, frameCount } = frameData;
                state_js_1.default.mul$selection = [...tiles];
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "red";
                ctx.strokeRect(state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * (start.x + width), state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * start.y, state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * (width * (frameCount - 1)), state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM * height);
            }
            else if (!hideSymbols) {
                const x = tile % gridWidth;
                const y = Math.floor(tile / gridWidth);
                const tileKey = `${x}-${y}`;
                const innerTile = viewMode === ""
                    ? tileData[tileKey]?.tileSymbol
                    : viewMode === "frames"
                        ? tile
                        : tags[viewMode]?.tiles[tileKey]?.mark || "-";
                ctx.fillStyle = "white";
                ctx.font = "11px arial";
                ctx.shadowColor = "black";
                ctx.shadowBlur = 4;
                ctx.lineWidth = 2;
                const posX = x * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM +
                    (state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM) / 3;
                const posY = y * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM +
                    (state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM) / 2;
                ctx.fillText(innerTile, posX, posY);
            }
        });
    };
    exports.updateTilesetGridContainer = updateTilesetGridContainer;
    const selectMode = (mode = "") => {
        if (mode !== "")
            state_js_1.default.init$tileDataSel.value = mode;
        document.getElementById("tileFrameSelContainer").style.display =
            state_js_1.default.init$tileDataSel.value === "frames" ? "flex" : "none";
        // tilesetContainer.style.top = tileDataSel.value === "frames" ? "45px" : "0";
        (0, exports.updateTilesetGridContainer)();
    };
    exports.selectMode = selectMode;
    const downloadAsTextFile = (input, fileName = "tilemap-editor.json") => {
        const dataStr = "data:text/json;charset=utf-8," +
            encodeURIComponent(typeof input === "string" ? input : JSON.stringify(input));
        const dlAnchorElem = document.getElementById("downloadAnchorElem");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", fileName);
        dlAnchorElem.click();
    };
    exports.downloadAsTextFile = downloadAsTextFile;
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
                }
                else {
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
    exports.getTilesAnalisis = getTilesAnalisis;
    const updateMapSize = (size) => {
        if (size?.mapWidth && size?.mapWidth > 1) {
            state_js_1.default.mul$mapTileWidth = size?.mapWidth;
            state_js_1.default.mul$WIDTH = state_js_1.default.mul$mapTileWidth * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM;
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].mapWidth = state_js_1.default.mul$mapTileWidth;
            document.querySelector(".canvas_resizer[resizerdir='x']").style.left = `${state_js_1.default.mul$WIDTH}px`;
            document.querySelector(".canvas_resizer[resizerdir='x'] input").value = String(state_js_1.default.mul$mapTileWidth);
            document.getElementById("canvasWidthInp").value =
                String(state_js_1.default.mul$mapTileWidth);
        }
        if (size?.mapHeight && size?.mapHeight > 1) {
            state_js_1.default.mul$mapTileHeight = size?.mapHeight;
            state_js_1.default.mul$HEIGHT = state_js_1.default.mul$mapTileHeight * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM;
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].mapHeight = state_js_1.default.mul$mapTileHeight;
            document.querySelector(".canvas_resizer[resizerdir='y']").style.top = `${state_js_1.default.mul$HEIGHT}px`;
            document.querySelector(".canvas_resizer[resizerdir='y'] input").value = String(state_js_1.default.mul$mapTileHeight);
            document.getElementById("canvasHeightInp").value =
                String(state_js_1.default.mul$mapTileHeight);
        }
        (0, exports.draw)();
    };
    exports.updateMapSize = updateMapSize;
    const clearUndoStack = () => {
        state_js_1.default.clearUndoStack$undoStack = [];
        state_js_1.default.mul$undoStepPosition = -1;
    };
    exports.clearUndoStack = clearUndoStack;
    const addToUndoStack = () => {
        if (Object.keys(state_js_1.default.mul$tileSets).length === 0 ||
            Object.keys(state_js_1.default.mul$maps).length === 0)
            return;
        const oldState = state_js_1.default.clearUndoStack$undoStack.length > 0
            ? JSON.stringify({
                maps: state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].maps,
                tileSets: state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].tileSets,
                currentLayer: state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].currentLayer,
                ACTIVE_MAP: state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].ACTIVE_MAP,
                IMAGES: state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].IMAGES,
            })
            : undefined;
        const newState = JSON.stringify({
            maps: state_js_1.default.mul$maps,
            tileSets: state_js_1.default.mul$tileSets,
            currentLayer: state_js_1.default.setLayer$currentLayer,
            ACTIVE_MAP: state_js_1.default.mul$ACTIVE_MAP,
            IMAGES: state_js_1.default.mul$IMAGES,
        });
        if (newState === oldState)
            return; // prevent updating when no changes are present in the data!
        state_js_1.default.mul$undoStepPosition += 1;
        state_js_1.default.clearUndoStack$undoStack.length = state_js_1.default.mul$undoStepPosition;
        state_js_1.default.clearUndoStack$undoStack.push(JSON.parse(JSON.stringify({
            maps: state_js_1.default.mul$maps,
            tileSets: state_js_1.default.mul$tileSets,
            currentLayer: state_js_1.default.setLayer$currentLayer,
            ACTIVE_MAP: state_js_1.default.mul$ACTIVE_MAP,
            IMAGES: state_js_1.default.mul$IMAGES,
            undoStepPosition: state_js_1.default.mul$undoStepPosition,
        })));
        // console.log("undo stack updated", undoStack, undoStepPosition)
    };
    exports.addToUndoStack = addToUndoStack;
    const updateZoom = () => {
        const [tilesetImage, tilesetContainer] = [
            state_js_1.default.init$tilesetImage,
            state_js_1.default.init$tilesetContainer,
        ];
        // tilesetImage.style = `transform: scale(${_.mul$ZOOM});transform-origin: left top;image-rendering: auto;image-rendering: crisp-edges;image-rendering: pixelated;`;
        tilesetImage.setAttribute("style", `transform: scale(${state_js_1.default.mul$ZOOM});transform-origin: left top;image-rendering: auto;image-rendering: crisp-edges;image-rendering: pixelated;`);
        tilesetContainer.style.width = `${tilesetImage.width * state_js_1.default.mul$ZOOM}px`;
        tilesetContainer.style.height = `${tilesetImage.height * state_js_1.default.mul$ZOOM}px`;
        document.getElementById("zoomLabel").innerText = `${state_js_1.default.mul$ZOOM}x`;
        (0, exports.updateTilesetGridContainer)();
        (0, exports.updateSelection)(false);
        (0, exports.updateMapSize)({
            mapWidth: state_js_1.default.mul$mapTileWidth,
            mapHeight: state_js_1.default.mul$mapTileHeight,
        });
        state_js_1.default.mul$WIDTH = state_js_1.default.mul$mapTileWidth * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM; // needed when setting zoom?
        state_js_1.default.mul$HEIGHT = state_js_1.default.mul$mapTileHeight * state_js_1.default.mul$SIZE_OF_CROP * state_js_1.default.mul$ZOOM;
        state_js_1.default.mul$zoomIndex =
            enums_js_1.ZOOM_LEVELS.indexOf(state_js_1.default.mul$ZOOM) === -1
                ? 0
                : enums_js_1.ZOOM_LEVELS.indexOf(state_js_1.default.mul$ZOOM);
    };
    exports.updateZoom = updateZoom;
    const getCurrentAnimation = (getAnim) => state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value]?.frames[state_js_1.default.init$tileFrameSel.value]
        ?.animations?.[getAnim || state_js_1.default.init$tileAnimSel.value];
    exports.getCurrentAnimation = getCurrentAnimation;
    const updateTilesetDataList = (populateFrames = false) => {
        const populateWithOptions = (selectEl, options, newContent) => {
            if (!options)
                return;
            const value = selectEl.value + "";
            selectEl.innerHTML = newContent;
            Object.keys(options).forEach((opt) => {
                const newOption = document.createElement("option");
                newOption.innerText = opt;
                newOption.value = opt;
                selectEl.appendChild(newOption);
            });
            if (value in options ||
                (["", "frames", "animations"].includes(value) && !populateFrames))
                selectEl.value = value;
        };
        const tilesetDataSel = state_js_1.default.init$tilesetDataSel;
        if (!populateFrames)
            populateWithOptions(state_js_1.default.init$tileDataSel, state_js_1.default.mul$tileSets[tilesetDataSel.value]?.tags, `<option value="">Symbols (${state_js_1.default.mul$tileSets[tilesetDataSel.value]?.tileCount || "?"})</option><option value="frames">Objects</option>`);
        else {
            populateWithOptions(state_js_1.default.init$tileFrameSel, state_js_1.default.mul$tileSets[tilesetDataSel.value]?.frames, "");
            populateWithOptions(state_js_1.default.init$tileAnimSel, state_js_1.default.mul$tileSets[tilesetDataSel.value]?.frames[state_js_1.default.init$tileFrameSel.value]
                ?.animations, "");
        }
        document.getElementById("tileFrameCount").value =
            (0, exports.getCurrentFrames)()?.frameCount || 1;
        const currentAnim = (0, exports.getCurrentAnimation)();
        // FIXME: ???
        //@ts-ignore
        state_js_1.default.state$el.animStart().max = state_js_1.default.state$el.tileFrameCount().value;
        //@ts-ignore
        state_js_1.default.state$el.animEnd().max = state_js_1.default.state$el.tileFrameCount().value;
        if (currentAnim) {
            console.log({ currentAnim });
            //@ts-ignore
            state_js_1.default.state$el.animStart().value = currentAnim.start || 1;
            //@ts-ignore
            state_js_1.default.state$el.animEnd().value = currentAnim.end || 1;
            //@ts-ignore
            state_js_1.default.state$el.animLoop().checked = currentAnim.loop || false;
            //@ts-ignore
            state_js_1.default.state$el.animSpeed().value = currentAnim.speed || 1;
        }
    };
    exports.updateTilesetDataList = updateTilesetDataList;
    const reevaluateTilesetsData = () => {
        let symbolStartIdx = 0;
        Object.entries(state_js_1.default.mul$tileSets).forEach(([key, old]) => {
            const tileData = {};
            // console.log("OLD DATA",old)
            const tileSize = old.tileSize || state_js_1.default.mul$SIZE_OF_CROP;
            const gridWidth = Math.ceil(old.width / tileSize);
            const gridHeight = Math.ceil(old.height / tileSize);
            const tileCount = gridWidth * gridHeight;
            Array.from({ length: tileCount }, (x, i) => i).map((tile) => {
                const x = tile % gridWidth;
                const y = Math.floor(tile / gridWidth);
                const oldTileData = old?.[`${x}-${y}`]?.tileData;
                const tileSymbol = enums_js_1.RANDOM_LETTERS[Math.floor(symbolStartIdx + tile)];
                tileData[`${x}-${y}`] = {
                    ...oldTileData,
                    x,
                    y,
                    tilesetIdx: key,
                    tileSymbol,
                };
                state_js_1.default.mul$tileSets[key] = {
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
    exports.reevaluateTilesetsData = reevaluateTilesetsData;
    const setCropSize = (newSize) => {
        if (newSize === state_js_1.default.mul$SIZE_OF_CROP && state_js_1.default.init$cropSize.value === newSize)
            return;
        state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value].tileSize = newSize;
        state_js_1.default.mul$IMAGES.forEach((ts, idx) => {
            if (ts.src === state_js_1.default.init$tilesetImage.src)
                state_js_1.default.mul$IMAGES[idx].tileSize = newSize;
        });
        state_js_1.default.mul$SIZE_OF_CROP = newSize;
        state_js_1.default.init$cropSize.value = `${state_js_1.default.mul$SIZE_OF_CROP}`;
        document.getElementById("gridCropSize").value = `${state_js_1.default.mul$SIZE_OF_CROP}`;
        // console.log("NEW SIZE", tilesetDataSel.value,tileSets[tilesetDataSel.value], newSize,ACTIVE_MAP, maps)
        (0, exports.updateZoom)();
        (0, exports.updateTilesetGridContainer)();
        // console.log(tileSets, IMAGES)
        (0, exports.reevaluateTilesetsData)();
        (0, exports.updateTilesetDataList)();
        (0, exports.draw)();
    };
    exports.setCropSize = setCropSize;
    const setLayer = (newLayer) => {
        state_js_1.default.setLayer$currentLayer = Number(newLayer);
        const oldActivedLayer = document.querySelector(".layer.active");
        if (oldActivedLayer)
            oldActivedLayer.classList.remove("active");
        else
            console.warn({ oldActivedLayer });
        const activeLayerLabel = document.getElementById("activeLayerLabel");
        const layerOpacitySlider = document.getElementById("layerOpacitySlider");
        const layerOpacitySliderValue = document.getElementById("layerOpacitySliderValue");
        document
            .querySelector(`.layer[tile-layer="${newLayer}"]`)
            ?.classList.add("active");
        activeLayerLabel.innerHTML = (0, html_js_1.activeLayerLabelHTML)(state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[newLayer]);
        if (layerOpacitySlider) {
            layerOpacitySlider.value = `${state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[newLayer]?.opacity}`;
            layerOpacitySlider.addEventListener("change", (e) => {
                (0, exports.addToUndoStack)();
                layerOpacitySliderValue.innerText = (0, helper_js_1.target)(e).value;
                state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[state_js_1.default.setLayer$currentLayer].opacity =
                    Number((0, helper_js_1.target)(e).value);
                (0, exports.draw)();
                (0, exports.updateLayers)();
            });
        }
        else
            console.warn({ layerOpacitySlider });
    };
    exports.setLayer = setLayer;
    const updateLayers = () => {
        const setLayerIsVisible = (layer, override = false) => {
            const setLayerVisBtn = document.getElementById(`setLayerVisBtn-${layer}`);
            if (!setLayerVisBtn)
                throw new Error("dom not found");
            const layerNumber = Number(layer);
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[layerNumber].visible =
                override || !state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[layerNumber].visible;
            setLayerVisBtn.innerHTML = state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers[layerNumber]
                .visible
                ? "👁️"
                : "👓";
            (0, exports.draw)();
        };
        const trashLayer = (layer) => {
            const layerNumber = Number(layer);
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers.splice(layerNumber, 1);
            (0, exports.updateLayers)();
            (0, exports.setLayer)(state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers.length - 1);
            (0, exports.draw)();
        };
        state_js_1.default.init$layersElement.innerHTML = state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers
            .map((layer, index) => (0, html_js_1.layersElementHTML)({
            layer,
            index,
            enableButton: state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers.length > 1,
        }))
            .reverse()
            .join("\n");
        state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers.forEach((_, index) => {
            const selectLayerBtn = document.getElementById(`selectLayerBtn-${index}`);
            const setLayerVisBtn = document.getElementById(`setLayerVisBtn-${index}`);
            const trashLayerBtn = document.getElementById(`trashLayerBtn-${index}`);
            selectLayerBtn.addEventListener("click", (e) => {
                (0, exports.setLayer)((0, helper_js_1.target)(e).getAttribute("tile-layer"));
                (0, exports.addToUndoStack)();
            });
            setLayerVisBtn.addEventListener("click", (e) => {
                setLayerIsVisible({ draw: exports.draw }, !!(0, helper_js_1.target)(e).getAttribute("vis-layer"));
                (0, exports.addToUndoStack)();
            });
            trashLayerBtn.addEventListener("click", (e) => {
                trashLayer((0, helper_js_1.target)(e).getAttribute("trash-layer"));
                (0, exports.addToUndoStack)();
            });
            setLayerIsVisible(index, true);
        });
        (0, exports.setLayer)(state_js_1.default.setLayer$currentLayer);
    };
    exports.updateLayers = updateLayers;
    const getTile = (key, allLayers = false) => {
        const layers = state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].layers;
        state_js_1.default.getTile$editedEntity = undefined;
        const clicked = allLayers
            ? [...layers].reverse().find((layer, index) => {
                if (layer.animatedTiles && key in layer.animatedTiles) {
                    (0, exports.setLayer)(layers.length - index - 1);
                    state_js_1.default.getTile$editedEntity = layer.animatedTiles[key];
                }
                if (key in layer.tiles) {
                    (0, exports.setLayer)(layers.length - index - 1);
                    return layer.tiles[key];
                }
            })?.tiles[key] //TODO this doesnt work on animatedTiles
            : layers[state_js_1.default.setLayer$currentLayer].tiles[key];
        if (clicked && !state_js_1.default.getTile$editedEntity) {
            state_js_1.default.mul$selection = [clicked];
            // console.log("clicked", clicked, "entity data",editedEntity)
            document.getElementById("toggleFlipX").checked =
                !!clicked?.isFlippedX;
            // TODO switch to different tileset if its from a different one
            // if(clicked.tilesetIdx !== tilesetDataSel.value) {
            //     tilesetDataSel.value = clicked.tilesetIdx;
            //     reloadTilesets();
            //     updateTilesetGridContainer();
            // }
            (0, exports.selectMode)("");
            (0, exports.updateSelection)();
            return true;
        }
        else if (state_js_1.default.getTile$editedEntity) {
            // console.log("Animated tile found", editedEntity)
            state_js_1.default.mul$selection = state_js_1.default.getTile$editedEntity.tiles;
            document.getElementById("toggleFlipX").checked =
                state_js_1.default.getTile$editedEntity.isFlippedX;
            (0, exports.setLayer)(state_js_1.default.getTile$editedEntity.layer);
            state_js_1.default.init$tileFrameSel.value = state_js_1.default.getTile$editedEntity.name;
            (0, exports.updateSelection)();
            (0, exports.selectMode)("frames");
            return true;
        }
        else {
            return false;
        }
    };
    exports.getTile = getTile;
    const setActiveMap = (id) => {
        state_js_1.default.mul$ACTIVE_MAP = id;
        document.getElementById("gridColorSel").value =
            state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].gridColor || "#00FFFF";
        (0, exports.draw)();
        (0, exports.updateMapSize)({
            mapWidth: state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].mapWidth,
            mapHeight: state_js_1.default.mul$maps[state_js_1.default.mul$ACTIVE_MAP].mapHeight,
        });
        (0, exports.updateLayers)();
    };
    exports.setActiveMap = setActiveMap;
    // Note: only call this when tileset images have changed
    const reloadTilesets = () => {
        const getEmptyTileSet = ({ src, name = "tileset", gridWidth, gridHeight, tileData = {}, symbolStartIdx, tileSize = state_js_1.default.mul$SIZE_OF_CROP, tags = {}, frames = {}, width, height, description = "n/a", }) => {
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
        state_js_1.default.reloadTilesets$TILESET_ELEMENTS = [];
        state_js_1.default.init$tilesetDataSel.innerHTML = "";
        // Use to prevent old data from erasure
        const oldTilesets = { ...state_js_1.default.mul$tileSets };
        state_js_1.default.mul$tileSets = {};
        // let symbolStartIdx = 0;
        // Generate tileset data for each of the loaded images
        state_js_1.default.mul$IMAGES.forEach((tsImage, idx) => {
            const newOpt = document.createElement("option");
            newOpt.innerText = tsImage.name || `tileset ${idx}`;
            newOpt.value = `${idx}`;
            state_js_1.default.init$tilesetDataSel.appendChild(newOpt);
            const tilesetImgElement = document.createElement("img");
            tilesetImgElement.src = tsImage.src;
            tilesetImgElement.crossOrigin = "Anonymous";
            state_js_1.default.reloadTilesets$TILESET_ELEMENTS.push(tilesetImgElement);
        });
        Promise.all(Array.from(state_js_1.default.reloadTilesets$TILESET_ELEMENTS)
            .filter((img) => !img.complete)
            .map((img) => new Promise((resolve) => {
            img.onload = img.onerror = resolve;
        }))).then(() => {
            // console.log("TILESET ELEMENTS", TILESET_ELEMENTS)
            state_js_1.default.reloadTilesets$TILESET_ELEMENTS.forEach((tsImage, idx) => {
                const tileSize = tsImage.tileSize || state_js_1.default.mul$SIZE_OF_CROP;
                state_js_1.default.mul$tileSets[idx] = getEmptyTileSet({
                    tags: oldTilesets[idx]?.tags,
                    frames: oldTilesets[idx]?.frames,
                    tileSize,
                    // animations: oldTilesets[idx]?.animations,
                    src: tsImage.src,
                    name: `tileset ${idx}`,
                    width: tsImage.width,
                    height: tsImage.height,
                    // FIXME: temp value
                    gridWidth: tileSize,
                    gridHeight: tileSize,
                    symbolStartIdx: "",
                });
            });
            // console.log("POPULATED", tileSets)
            (0, exports.reevaluateTilesetsData)();
            state_js_1.default.init$tilesetImage.src = state_js_1.default.reloadTilesets$TILESET_ELEMENTS[0].src;
            state_js_1.default.init$tilesetImage.crossOrigin = "Anonymous";
            (0, exports.updateSelection)(false);
            (0, exports.updateTilesetGridContainer)();
        });
        // finally current tileset loaded
        state_js_1.default.init$tilesetImage.addEventListener("load", () => {
            (0, exports.draw)();
            (0, exports.updateLayers)();
            if (state_js_1.default.mul$selection.length === 0)
                state_js_1.default.mul$selection = [(0, exports.getTileData)(0, 0)];
            (0, exports.updateSelection)(false);
            (0, exports.updateTilesetDataList)();
            (0, exports.updateTilesetDataList)(true);
            (0, exports.updateTilesetGridContainer)();
            const tilesetImage = state_js_1.default.init$tilesetImage;
            document.getElementById("tilesetSrcLabel").innerHTML = `src: <a href="${tilesetImage.src}">${tilesetImage.src}</a>`;
            document.getElementById("tilesetSrcLabel").title = tilesetImage.src;
            const tilesetExtraInfo = state_js_1.default.mul$IMAGES.find((ts) => ts.src === tilesetImage.src);
            // console.log("CHANGED TILESET", tilesetExtraInfo, IMAGES)
            if (tilesetExtraInfo) {
                if (tilesetExtraInfo.link) {
                    document.getElementById("tilesetHomeLink").innerHTML = `link: <a href="${tilesetExtraInfo.link}">${tilesetExtraInfo.link}</a> `;
                    document.getElementById("tilesetHomeLink").title =
                        tilesetExtraInfo.link;
                }
                else {
                    document.getElementById("tilesetHomeLink").innerHTML = "";
                }
                if (tilesetExtraInfo.description) {
                    document.getElementById("tilesetDescriptionLabel").innerText =
                        tilesetExtraInfo.description;
                    document.getElementById("tilesetDescriptionLabel").title =
                        tilesetExtraInfo.description;
                }
                else {
                    document.getElementById("tilesetDescriptionLabel").innerText = "";
                }
                if (tilesetExtraInfo.tileSize) {
                    (0, exports.setCropSize)(tilesetExtraInfo.tileSize);
                }
            }
            (0, exports.setCropSize)(state_js_1.default.mul$tileSets[state_js_1.default.init$tilesetDataSel.value].tileSize);
            (0, exports.updateZoom)();
            // ).style = `left:${_.mul$WIDTH}px;`;
            document.querySelector('.canvas_resizer[resizerdir="x"]').style.left = `${state_js_1.default.mul$WIDTH}px;`;
            if (state_js_1.default.mul$undoStepPosition === -1)
                (0, exports.addToUndoStack)(); //initial undo stack entry
        });
    };
    exports.reloadTilesets = reloadTilesets;
    const updateMaps = () => {
        const mapsDataSel = state_js_1.default.init$mapsDataSel;
        mapsDataSel.innerHTML = "";
        let lastMap = state_js_1.default.mul$ACTIVE_MAP;
        Object.keys(state_js_1.default.mul$maps).forEach((key, idx) => {
            const newOpt = document.createElement("option");
            newOpt.innerText = state_js_1.default.mul$maps[key].name; //`map ${idx}`;
            newOpt.value = key;
            mapsDataSel.appendChild(newOpt);
            if (idx === Object.keys(state_js_1.default.mul$maps).length - 1)
                lastMap = key;
        });
        mapsDataSel.value = lastMap;
        (0, exports.setActiveMap)(lastMap);
        document.getElementById("removeMapBtn").disabled =
            Object.keys(state_js_1.default.mul$maps).length === 1;
    };
    exports.updateMaps = updateMaps;
    const restoreFromUndoStackData = () => {
        state_js_1.default.mul$maps = (0, utils_js_1.decoupleReferenceFromObj)(state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].maps);
        const undoTileSets = (0, utils_js_1.decoupleReferenceFromObj)(state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].tileSets);
        const undoIMAGES = (0, utils_js_1.decoupleReferenceFromObj)(state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].IMAGES);
        if (JSON.stringify(state_js_1.default.mul$IMAGES) !== JSON.stringify(undoIMAGES)) {
            // images needs to happen before tilesets
            state_js_1.default.mul$IMAGES = undoIMAGES;
            (0, exports.reloadTilesets)();
        }
        if (JSON.stringify(undoTileSets) !== JSON.stringify(state_js_1.default.mul$tileSets)) {
            // done to prevent the below, which is expensive
            state_js_1.default.mul$tileSets = undoTileSets;
            (0, exports.updateTilesetGridContainer)();
        }
        state_js_1.default.mul$tileSets = undoTileSets;
        (0, exports.updateTilesetDataList)();
        const undoLayer = (0, utils_js_1.decoupleReferenceFromObj)(state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].currentLayer);
        const undoActiveMap = (0, utils_js_1.decoupleReferenceFromObj)(state_js_1.default.clearUndoStack$undoStack[state_js_1.default.mul$undoStepPosition].ACTIVE_MAP);
        if (undoActiveMap !== state_js_1.default.mul$ACTIVE_MAP) {
            (0, exports.setActiveMap)(undoActiveMap);
            (0, exports.updateMaps)();
        }
        // needs to happen after active map is set and maps are updated
        (0, exports.updateLayers)();
        (0, exports.setLayer)(undoLayer);
        (0, exports.draw)();
    };
    exports.restoreFromUndoStackData = restoreFromUndoStackData;
});
define("src/TilemapEditor/init/index", ["require", "exports", "src/constants/html", "src/TilemapEditor/utils", "src/TilemapEditor/state", "src/TilemapEditor/features", "src/constants/enums", "src/helper"], function (require, exports, html_js_2, utils_js_2, state_js_2, features_js_1, enums_js_2, helper_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (exports) => (attachToId, { tileMapData, // the main data
    tileSize, mapWidth, mapHeight, tileSetImages, applyButtonText, onApply, tileSetLoaders, tileMapExporters, tileMapImporters, onUpdate = () => { }, onMouseUp = null, appState, }) => {
        // Call once on element to add behavior, toggle on/off isDraggable attr to enable
        const draggable = ({ element, onElement = null, isDrag = false, onDrag = null, limitX = false, limitY = false, onRelease = null, }) => {
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
                if (!limitX)
                    element.style.left = elementX + deltaX + "px";
                if (!limitY)
                    element.style.top = elementY + deltaY + "px";
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
                if (element.getAttribute("isDraggable") === "false")
                    return;
                mouseX = event.clientX;
                mouseY = event.clientY;
                console.log("MOUSEX", mouseX);
                isMouseDown = true;
            };
            const onMouseUp = () => {
                if (!(element.getAttribute("isDraggable") === "false"))
                    return;
                isMouseDown = false;
                elementX = parseInt(element.style.left) || 0;
                elementY = parseInt(element.style.top) || 0;
                if (onRelease)
                    onRelease({ x: elementX, y: elementY });
            };
            (onElement || element).addEventListener("pointerdown", onMouseDown);
            document.addEventListener("pointerup", onMouseUp);
            document.addEventListener("pointermove", onMouseMove);
        };
        const addLayer = () => {
            const newLayerName = prompt("Enter layer name", `Layer${state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].layers.length + 1}`);
            if (newLayerName !== null) {
                state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].layers.push((0, utils_js_2.getEmptyLayer)(newLayerName));
                (0, features_js_1.updateLayers)();
            }
        };
        const toggleTile = (event) => {
            if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.PAN ||
                !state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].layers[state_js_2.default.setLayer$currentLayer].visible)
                return;
            const { x, y } = (0, features_js_1.getSelectedTile)(event)[0];
            const key = `${x}-${y}`;
            // console.log(event.button)
            if (event.shiftKey) {
                (0, features_js_1.removeTile)(key);
            }
            else if (event.ctrlKey ||
                event.button === 2 ||
                state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.PICK) {
                const pickedTile = (0, features_js_1.getTile)(key, true);
                if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.BRUSH && !pickedTile)
                    (0, features_js_1.setActiveTool)(enums_js_2.TOOLS.ERASE);
                //picking empty tile, sets tool to eraser
                else if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.FILL ||
                    state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.RAND)
                    (0, features_js_1.setActiveTool)(enums_js_2.TOOLS.BRUSH); //
            }
            else {
                if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.BRUSH) {
                    (0, features_js_1.addTile)(key); // also works with animated
                }
                else if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.ERASE) {
                    (0, features_js_1.removeTile)(key); // also works with animated
                }
                else if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.RAND) {
                    (0, features_js_1.addRandomTile)(key);
                }
                else if (state_js_2.default.mul$ACTIVE_TOOL === enums_js_2.TOOLS.FILL) {
                    (0, features_js_1.fillEmptyOrSameTiles)(key);
                }
            }
            (0, features_js_1.draw)();
            (0, features_js_1.addToUndoStack)();
        };
        const clearCanvas = () => {
            (0, features_js_1.addToUndoStack)();
            state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].layers = [
                (0, utils_js_2.getEmptyLayer)("bottom"),
                (0, utils_js_2.getEmptyLayer)("middle"),
                (0, utils_js_2.getEmptyLayer)("top"),
            ];
            (0, features_js_1.setLayer)(0);
            (0, features_js_1.updateLayers)();
            (0, features_js_1.draw)();
            (0, features_js_1.addToUndoStack)();
        };
        const exportJson = () => {
            (0, features_js_1.downloadAsTextFile)({ tileSets: state_js_2.default.mul$tileSets, maps: state_js_2.default.mul$maps });
        };
        const exportImage = () => {
            (0, features_js_1.draw)(false);
            const data = state_js_2.default.init$canvas.toDataURL();
            const image = new Image();
            image.src = data;
            image.crossOrigin = "anonymous";
            const w = window.open("");
            w.document.write(image.outerHTML);
            (0, features_js_1.draw)();
        };
        const toggleSymbolsVisible = (override = null) => {
            if (override === null)
                state_js_2.default.toggleSymbolsVisible$DISPLAY_SYMBOLS =
                    !state_js_2.default.toggleSymbolsVisible$DISPLAY_SYMBOLS;
            document.getElementById("setSymbolsVisBtn").innerHTML =
                state_js_2.default.toggleSymbolsVisible$DISPLAY_SYMBOLS ? "👁️" : "👓";
            (0, features_js_1.updateTilesetGridContainer)();
        };
        const zoomIn = () => {
            if (state_js_2.default.mul$zoomIndex >= enums_js_2.ZOOM_LEVELS.length - 1)
                return;
            state_js_2.default.mul$zoomIndex += 1;
            state_js_2.default.mul$ZOOM = enums_js_2.ZOOM_LEVELS[state_js_2.default.mul$zoomIndex];
            (0, features_js_1.updateZoom)();
        };
        const zoomOut = () => {
            if (state_js_2.default.mul$zoomIndex === 0)
                return;
            state_js_2.default.mul$zoomIndex -= 1;
            state_js_2.default.mul$ZOOM = enums_js_2.ZOOM_LEVELS[state_js_2.default.mul$zoomIndex];
            (0, features_js_1.updateZoom)();
        };
        const drawAnaliticsReport = () => {
            const prevZoom = state_js_2.default.mul$ZOOM;
            state_js_2.default.mul$ZOOM = 1; // needed for correct eval
            (0, features_js_1.updateZoom)();
            (0, features_js_1.draw)(false);
            const { analizedTiles, uniqueTiles } = (0, features_js_1.getTilesAnalisis)(state_js_2.default.init$canvas.getContext("2d"), state_js_2.default.mul$WIDTH, state_js_2.default.mul$HEIGHT, state_js_2.default.mul$SIZE_OF_CROP);
            const data = state_js_2.default.init$canvas.toDataURL();
            const image = new Image();
            image.src = data;
            const ctx = state_js_2.default.init$canvas.getContext("2d");
            state_js_2.default.mul$ZOOM = prevZoom;
            (0, features_js_1.updateZoom)();
            (0, features_js_1.draw)(false);
            Object.values(analizedTiles).map((t) => {
                // Fill the heatmap
                t.coords.forEach((c, i) => {
                    const fillStyle = `rgba(255, 0, 0, ${1 / t.times - 0.35})`;
                    ctx.fillStyle = fillStyle;
                    ctx.fillRect(c.x * state_js_2.default.mul$ZOOM, c.y * state_js_2.default.mul$ZOOM, state_js_2.default.mul$SIZE_OF_CROP * state_js_2.default.mul$ZOOM, state_js_2.default.mul$SIZE_OF_CROP * state_js_2.default.mul$ZOOM);
                });
            });
            (0, utils_js_2.drawGrid)(state_js_2.default.mul$WIDTH, state_js_2.default.mul$HEIGHT, ctx, state_js_2.default.mul$SIZE_OF_CROP * state_js_2.default.mul$ZOOM, "rgba(255,213,0,0.5)");
            ctx.fillStyle = "white";
            ctx.font = "bold 17px arial";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 5;
            ctx.lineWidth = 3;
            ctx.fillText(`Unique tiles: ${uniqueTiles}`, 4, state_js_2.default.mul$HEIGHT - 30);
            ctx.fillText(`Map size: ${state_js_2.default.mul$mapTileWidth}x${state_js_2.default.mul$mapTileHeight}`, 4, state_js_2.default.mul$HEIGHT - 10);
        };
        const exportUniqueTiles = () => {
            const ctx = state_js_2.default.init$canvas.getContext("2d");
            const prevZoom = state_js_2.default.mul$ZOOM;
            state_js_2.default.mul$ZOOM = 1; // needed for correct eval
            (0, features_js_1.updateZoom)();
            (0, features_js_1.draw)(false);
            const { analizedTiles } = (0, features_js_1.getTilesAnalisis)(state_js_2.default.init$canvas.getContext("2d"), state_js_2.default.mul$WIDTH, state_js_2.default.mul$HEIGHT, state_js_2.default.mul$SIZE_OF_CROP);
            ctx.clearRect(0, 0, state_js_2.default.mul$WIDTH, state_js_2.default.mul$HEIGHT);
            const gridWidth = state_js_2.default.init$tilesetImage.width / state_js_2.default.mul$SIZE_OF_CROP;
            Object.values(analizedTiles).map((t, i) => {
                const positionX = i % gridWidth;
                const positionY = Math.floor(i / gridWidth);
                const tileCanvas = document.createElement("canvas");
                tileCanvas.width = state_js_2.default.mul$SIZE_OF_CROP;
                tileCanvas.height = state_js_2.default.mul$SIZE_OF_CROP;
                const tileCtx = tileCanvas.getContext("2d");
                tileCtx.putImageData(t.tileData, 0, 0);
                ctx.drawImage(tileCanvas, 0, 0, state_js_2.default.mul$SIZE_OF_CROP, state_js_2.default.mul$SIZE_OF_CROP, positionX * state_js_2.default.mul$SIZE_OF_CROP, positionY * state_js_2.default.mul$SIZE_OF_CROP, state_js_2.default.mul$SIZE_OF_CROP, state_js_2.default.mul$SIZE_OF_CROP);
            });
            const data = state_js_2.default.init$canvas.toDataURL();
            const image = new Image();
            image.src = data;
            image.crossOrigin = "anonymous";
            const w = window.open("");
            w.document.write(image.outerHTML);
            state_js_2.default.mul$ZOOM = prevZoom;
            (0, features_js_1.updateZoom)();
            (0, features_js_1.draw)();
        };
        const renameCurrentTileSymbol = () => {
            const setTileData = (x = null, y = null, newData, key = "") => {
                const tilesetTiles = state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].tileData;
                if (x === null && y === null) {
                    const { x: sx, y: sy } = state_js_2.default.mul$selection[0];
                    tilesetTiles[`${sx}-${sy}`] = newData;
                }
                if (key !== "") {
                    tilesetTiles[`${x}-${y}`][key] = newData;
                }
                else {
                    tilesetTiles[`${x}-${y}`] = newData;
                }
            };
            const { x, y, tileSymbol } = state_js_2.default.mul$selection[0];
            const newSymbol = window.prompt("Enter tile symbol", tileSymbol || "*");
            if (newSymbol !== null) {
                setTileData(x, y, newSymbol, "tileSymbol");
                (0, features_js_1.updateSelection)();
                (0, features_js_1.updateTilesetGridContainer)();
                (0, features_js_1.addToUndoStack)();
            }
        };
        const getExportData = () => {
            const getFlattenedData = () => {
                const result = Object.entries(state_js_2.default.mul$maps).map(([key, map]) => {
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
            const exportData = {
                maps: state_js_2.default.mul$maps,
                tileSets: state_js_2.default.mul$tileSets,
                flattenedData: getFlattenedData(),
                activeMap: state_js_2.default.mul$ACTIVE_MAP,
                downloadAsTextFile: features_js_1.downloadAsTextFile,
            };
            console.log("Exported ", exportData);
            return exportData;
        };
        const undo = () => {
            if (state_js_2.default.mul$undoStepPosition === 0)
                return;
            state_js_2.default.mul$undoStepPosition -= 1;
            (0, features_js_1.restoreFromUndoStackData)();
        };
        const redo = () => {
            if (state_js_2.default.mul$undoStepPosition === state_js_2.default.clearUndoStack$undoStack.length - 1)
                return;
            state_js_2.default.mul$undoStepPosition += 1;
            (0, features_js_1.restoreFromUndoStackData)();
        };
        const loadData = (data) => {
            try {
                (0, features_js_1.clearUndoStack)();
                state_js_2.default.mul$WIDTH = state_js_2.default.init$canvas.width * state_js_2.default.mul$ZOOM;
                state_js_2.default.mul$HEIGHT = state_js_2.default.init$canvas.height * state_js_2.default.mul$ZOOM;
                state_js_2.default.mul$selection = [{}];
                state_js_2.default.mul$ACTIVE_MAP = data ? Object.keys(data.maps)[0] : "Map_1";
                state_js_2.default.mul$maps = data
                    ? { ...data.maps }
                    : {
                        [state_js_2.default.mul$ACTIVE_MAP]: (0, features_js_1.getEmptyMap)("Map 1", state_js_2.default.mul$mapTileWidth, state_js_2.default.mul$mapTileHeight),
                    };
                state_js_2.default.mul$tileSets = data ? { ...data.tileSets } : {};
                (0, features_js_1.reloadTilesets)();
                state_js_2.default.init$tilesetDataSel.value = "0";
                state_js_2.default.init$cropSize.value = `${data
                    ? state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value]?.tileSize ||
                        state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].tileSize
                    : state_js_2.default.mul$SIZE_OF_CROP}`;
                document.getElementById("gridCropSize").value =
                    state_js_2.default.init$cropSize.value;
                (0, features_js_1.updateMaps)();
                (0, features_js_1.updateMapSize)({
                    mapWidth: state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].mapWidth,
                    mapHeight: state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].mapHeight,
                });
            }
            catch (e) {
                console.error(e);
            }
        };
        // Attach
        const attachTo = document.getElementById(attachToId);
        if (attachTo === null)
            return;
        state_js_2.default.init_state$apiTileSetLoaders = tileSetLoaders || {};
        state_js_2.default.init_state$apiTileSetLoaders.base64 = {
            name: "Fs (as base64)",
            onSelectImage: (setSrc, file, base64) => {
                setSrc(base64);
            },
        };
        state_js_2.default.init_state$apiTileMapExporters = tileMapExporters;
        state_js_2.default.init_state$apiTileMapExporters.exportAsImage = {
            name: "Export Map as image",
            transformer: exportImage,
        };
        state_js_2.default.init_state$apiTileMapExporters.saveData = {
            name: "Download Json file",
            transformer: exportJson,
        };
        state_js_2.default.init_state$apiTileMapExporters.analizeTilemap = {
            name: "Analize tilemap",
            transformer: drawAnaliticsReport,
        };
        state_js_2.default.init_state$apiTileMapExporters.exportTilesFromMap = {
            name: "Extract tileset from map",
            transformer: exportUniqueTiles,
        };
        state_js_2.default.init_state$apiTileMapImporters = tileMapImporters;
        state_js_2.default.init_state$apiTileMapImporters.openData = {
            name: "Open Json file",
            onSelectFiles: (setData, files) => {
                const readFile = new FileReader();
                readFile.onload = (e) => {
                    const json = JSON.parse((0, helper_js_2.target)(e).result);
                    setData(json);
                };
                readFile.readAsText(files[0]);
            },
            acceptFile: "application/JSON",
        };
        state_js_2.default.init$apiOnUpdateCallback = onUpdate;
        if (onMouseUp) {
            state_js_2.default.init$apiOnMouseUp = onMouseUp;
            document
                .getElementById("tileMapEditor")
                .addEventListener("pointerup", function () {
                state_js_2.default.init$apiOnMouseUp((0, features_js_1.getAppState)(), state_js_2.default.init_state$apiTileMapExporters);
            });
        }
        const importedTilesetImages = (tileMapData?.tileSets && Object.values(tileMapData?.tileSets)) ||
            tileSetImages;
        state_js_2.default.mul$IMAGES = importedTilesetImages;
        state_js_2.default.mul$SIZE_OF_CROP = importedTilesetImages?.[0]?.tileSize || tileSize || 32; //to the best of your ability, predict the init tileSize
        state_js_2.default.mul$mapTileWidth = mapWidth || 12;
        state_js_2.default.mul$mapTileHeight = mapHeight || 12;
        // const canvasWidth = mapTileWidth * tileSize * ZOOM;
        // const canvasHeight = mapTileHeight * tileSize * ZOOM;
        if (state_js_2.default.mul$SIZE_OF_CROP < 12)
            state_js_2.default.mul$ZOOM = 2; // Automatically start with zoom 2 when the tilesize is tiny
        // Attach elements
        attachTo.innerHTML = (0, html_js_2.tilemapEditorRootHTML)({
            width: state_js_2.default.mul$WIDTH,
            height: state_js_2.default.mul$HEIGHT,
            mapTileWidth: state_js_2.default.mul$mapTileWidth,
        });
        attachTo.className = "tilemap_editor_root";
        state_js_2.default.init$tilesetImage = document.createElement("img");
        state_js_2.default.init$cropSize = document.getElementById("cropSize");
        state_js_2.default.init$confirmBtn = document.getElementById("confirmBtn");
        if (onApply) {
            state_js_2.default.init$confirmBtn.innerText = applyButtonText || "Ok";
        }
        else {
            state_js_2.default.init$confirmBtn.style.display = "none";
        }
        state_js_2.default.init$canvas = document.getElementById("mapCanvas");
        state_js_2.default.init$tilesetContainer = document.querySelector(".tileset-container");
        state_js_2.default.init$tilesetSelection = document.querySelector(".tileset-container-selection");
        // tilesetGridContainer = document.getElementById("tilesetGridContainer");
        state_js_2.default.init$layersElement = document.getElementById("layers");
        state_js_2.default.init$objectParametersEditor = document.getElementById("objectParametersEditor");
        state_js_2.default.init$tilesetContainer.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
        state_js_2.default.init$tilesetContainer.addEventListener("pointerdown", (e) => {
            state_js_2.default.init$tileSelectStart = (0, features_js_1.getSelectedTile)(e)[0];
        });
        state_js_2.default.init$tilesetContainer.addEventListener("pointermove", (e) => {
            if (state_js_2.default.init$tileSelectStart !== null) {
                state_js_2.default.mul$selection = (0, features_js_1.getSelectedTile)(e);
                (0, features_js_1.updateSelection)();
            }
        });
        const setFramesToSelection = (objectName, animName = "") => {
            console.log({ animName, objectName });
            if (objectName === "" || typeof objectName !== "string")
                return;
            state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[objectName] = {
                ...(state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[objectName] ||
                    {}),
                width: state_js_2.default.updateSelection$selectionSize[0],
                height: state_js_2.default.updateSelection$selectionSize[1],
                start: state_js_2.default.mul$selection[0],
                tiles: state_js_2.default.mul$selection,
                name: objectName,
                //To be set when placing tile
                layer: undefined,
                isFlippedX: false,
                xPos: 0,
                yPos: 0, //TODO free position
            };
        };
        state_js_2.default.init$tilesetContainer.addEventListener("pointerup", (e) => {
            setTimeout(() => {
                document.getElementById("tilesetDataDetails").open = false;
            }, 100);
            state_js_2.default.mul$selection = (0, features_js_1.getSelectedTile)(e);
            (0, features_js_1.updateSelection)();
            state_js_2.default.mul$selection = (0, features_js_1.getSelectedTile)(e);
            state_js_2.default.init$tileSelectStart = null;
            const viewMode = state_js_2.default.init$tileDataSel.value;
            if (viewMode === "" && e.button === 2) {
                renameCurrentTileSymbol();
                return;
            }
            if (e.button === 0) {
                if (state_js_2.default.toggleSymbolsVisible$DISPLAY_SYMBOLS &&
                    viewMode !== "" &&
                    viewMode !== "frames") {
                    state_js_2.default.mul$selection.forEach((selected) => {
                        (0, features_js_1.addToUndoStack)();
                        const { x, y } = selected;
                        const tileKey = `${x}-${y}`;
                        const tagTiles = state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value]?.tags[viewMode]
                            ?.tiles;
                        if (tagTiles) {
                            if (tileKey in tagTiles) {
                                delete tagTiles[tileKey];
                            }
                            else {
                                tagTiles[tileKey] = { mark: "O" };
                            }
                        }
                    });
                }
                else if (viewMode === "frames") {
                    setFramesToSelection(state_js_2.default.init$tileFrameSel.value);
                }
                (0, features_js_1.updateTilesetGridContainer)();
            }
        });
        state_js_2.default.init$tilesetContainer.addEventListener("dblclick", (e) => {
            const viewMode = state_js_2.default.init$tileDataSel.value;
            if (viewMode === "") {
                renameCurrentTileSymbol();
            }
        });
        document.getElementById("addLayerBtn").addEventListener("click", () => {
            (0, features_js_1.addToUndoStack)();
            addLayer();
        });
        // Maps DATA callbacks
        state_js_2.default.init$mapsDataSel = document.getElementById("mapsDataSel");
        state_js_2.default.init$mapsDataSel.addEventListener("change", (e) => {
            (0, features_js_1.addToUndoStack)();
            (0, features_js_1.setActiveMap)((0, helper_js_2.target)(e).value);
            (0, features_js_1.addToUndoStack)();
        });
        document.getElementById("addMapBtn").addEventListener("click", () => {
            const suggestMapName = `Map ${Object.keys(state_js_2.default.mul$maps).length + 1}`;
            const result = window.prompt("Enter new map key...", suggestMapName);
            if (result !== null) {
                (0, features_js_1.addToUndoStack)();
                const newMapKey = result.trim().replaceAll(" ", "_") || suggestMapName;
                if (newMapKey in state_js_2.default.mul$maps) {
                    alert("A map with this key already exists.");
                    return;
                }
                state_js_2.default.mul$maps[newMapKey] = (0, features_js_1.getEmptyMap)(result.trim());
                (0, features_js_1.addToUndoStack)();
                (0, features_js_1.updateMaps)();
            }
        });
        document.getElementById("duplicateMapBtn").addEventListener("click", () => {
            const makeNewKey = (key) => {
                const suggestedNew = `${key}_copy`;
                if (suggestedNew in state_js_2.default.mul$maps) {
                    return makeNewKey(suggestedNew);
                }
                return suggestedNew;
            };
            (0, features_js_1.addToUndoStack)();
            const newMapKey = makeNewKey(state_js_2.default.mul$ACTIVE_MAP);
            state_js_2.default.mul$maps[newMapKey] = {
                ...JSON.parse(JSON.stringify(state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP])),
                name: newMapKey,
            }; // todo prompt to ask for name
            (0, features_js_1.updateMaps)();
            (0, features_js_1.addToUndoStack)();
        });
        document.getElementById("removeMapBtn").addEventListener("click", () => {
            (0, features_js_1.addToUndoStack)();
            delete state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP];
            (0, features_js_1.setActiveMap)(Object.keys(state_js_2.default.mul$maps)[0]);
            (0, features_js_1.updateMaps)();
            (0, features_js_1.addToUndoStack)();
        });
        // Tileset DATA Callbacks //tileDataSel
        state_js_2.default.init$tileDataSel = document.getElementById("tileDataSel");
        state_js_2.default.init$tileDataSel.addEventListener("change", () => {
            (0, features_js_1.selectMode)();
        });
        document.getElementById("addTileTagBtn").addEventListener("click", () => {
            const getEmptyTilesetTag = (name, code, tiles = {}) => ({
                name,
                code,
                tiles,
            });
            const result = window.prompt("Name your tag", "solid()");
            if (result !== null) {
                if (result in state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].tags) {
                    alert("Tag already exists");
                    return;
                }
                state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].tags[result] =
                    getEmptyTilesetTag(result, result);
                (0, features_js_1.updateTilesetDataList)();
                (0, features_js_1.addToUndoStack)();
            }
        });
        document
            .getElementById("removeTileTagBtn")
            .addEventListener("click", () => {
            if (state_js_2.default.init$tileDataSel.value &&
                state_js_2.default.init$tileDataSel.value in
                    state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].tags) {
                delete state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].tags[state_js_2.default.init$tileDataSel.value];
                (0, features_js_1.updateTilesetDataList)();
                (0, features_js_1.addToUndoStack)();
            }
        });
        // Tileset frames
        state_js_2.default.init$tileFrameSel = document.getElementById("tileFrameSel");
        state_js_2.default.init$tileFrameSel.addEventListener("change", (e) => {
            state_js_2.default.state$el.tileFrameCount().value = (0, features_js_1.getCurrentFrames)()?.frameCount || 1;
            (0, features_js_1.updateTilesetDataList)(true);
            (0, features_js_1.updateTilesetGridContainer)();
        });
        state_js_2.default.state$el.animStart().addEventListener("change", (e) => {
            (0, features_js_1.getCurrentAnimation)().start = Number(state_js_2.default.state$el.animStart().value);
        });
        state_js_2.default.state$el.animEnd().addEventListener("change", (e) => {
            (0, features_js_1.getCurrentAnimation)().end = Number(state_js_2.default.state$el.animEnd().value);
        });
        document.getElementById("addTileFrameBtn").addEventListener("click", () => {
            const result = window.prompt("Name your object", `obj${Object.keys(state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value]?.frames || {})
                .length}`);
            if (result !== null) {
                if (result in state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames) {
                    alert("Object already exists");
                    return;
                }
                state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[result] = {
                    frameCount: Number(state_js_2.default.state$el.tileFrameCount().value),
                    animations: {
                        a1: {
                            start: 1,
                            end: Number(state_js_2.default.state$el.tileFrameCount().value) || 1,
                            name: "a1",
                            loop: state_js_2.default.state$el.animLoop().checked,
                            speed: Number(state_js_2.default.state$el.animSpeed().value),
                        },
                    },
                };
                setFramesToSelection(result);
                (0, features_js_1.updateTilesetDataList)(true);
                state_js_2.default.init$tileFrameSel.value = result;
                (0, features_js_1.updateTilesetGridContainer)();
            }
        });
        document
            .getElementById("removeTileFrameBtn")
            .addEventListener("click", () => {
            if (state_js_2.default.init$tileFrameSel.value &&
                state_js_2.default.init$tileFrameSel.value in
                    state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames &&
                confirm(`Are you sure you want to delete ${state_js_2.default.init$tileFrameSel.value}`)) {
                delete state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value];
                (0, features_js_1.updateTilesetDataList)(true);
                (0, features_js_1.updateTilesetGridContainer)();
            }
        });
        const renameKeyInObjectForSelectElement = (selectElement, objectPath, typeLabel) => {
            const oldValue = selectElement.value;
            const result = window.prompt("Rename your animation", `${oldValue}`);
            if (result && result !== oldValue) {
                if (!objectPath)
                    return;
                if (result in objectPath) {
                    alert(`${typeLabel} with the ${result} name already exists. Aborted`);
                    return;
                }
                if (result.length < 2) {
                    alert(`${typeLabel} name needs to be longer than one character. Aborted`); //so animations and objects never overlap with symbols
                    return;
                }
                Object.defineProperty(objectPath, result, Object.getOwnPropertyDescriptor(objectPath, oldValue));
                delete objectPath[oldValue];
                (0, features_js_1.updateTilesetDataList)(true);
                selectElement.value = result;
                (0, features_js_1.updateTilesetDataList)(true);
            }
        };
        state_js_2.default.state$el.renameTileFrameBtn().addEventListener("click", () => {
            // could be a generic function
            renameKeyInObjectForSelectElement(state_js_2.default.init$tileFrameSel, state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value]?.frames, "object");
        });
        state_js_2.default.state$el.tileFrameCount().addEventListener("change", (e) => {
            if (state_js_2.default.init$tileFrameSel.value === "")
                return;
            (0, features_js_1.getCurrentFrames)().frameCount = Number((0, helper_js_2.target)(e).value);
            (0, features_js_1.updateTilesetGridContainer)();
        });
        // animations
        state_js_2.default.init$tileAnimSel = document.getElementById("tileAnimSel");
        state_js_2.default.init$tileAnimSel.addEventListener("change", (e) => {
            //swap with tileAnimSel
            console.log("anim select", e, state_js_2.default.init$tileAnimSel.value);
            state_js_2.default.state$el.animStart().value = (0, features_js_1.getCurrentAnimation)()?.start || 1;
            state_js_2.default.state$el.animEnd().value = (0, features_js_1.getCurrentAnimation)()?.end || 1;
            state_js_2.default.state$el.animLoop().checked = (0, features_js_1.getCurrentAnimation)()?.loop || false;
            state_js_2.default.state$el.animSpeed().value = (0, features_js_1.getCurrentAnimation)()?.speed || 1;
            (0, features_js_1.updateTilesetGridContainer)();
        });
        document.getElementById("addTileAnimBtn").addEventListener("click", () => {
            const result = window.prompt("Name your animation", `anim${Object.keys(state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value]?.frames[state_js_2.default.init$tileFrameSel.value]?.animations || {}).length}`);
            if (result !== null) {
                if (!state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value]?.animations) {
                    state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value].animations = {};
                }
                if (result in
                    state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value]?.animations) {
                    alert("Animation already exists");
                    return;
                }
                state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value].animations[result] = {
                    start: 1,
                    end: Number(state_js_2.default.state$el.tileFrameCount().value || 1),
                    loop: state_js_2.default.state$el.animLoop().checked,
                    speed: Number(state_js_2.default.state$el.animSpeed().value || 1),
                    name: result,
                };
                // setFramesToSelection(tileFrameSel.value, result);
                (0, features_js_1.updateTilesetDataList)(true);
                state_js_2.default.init$tileAnimSel.value = result;
                (0, features_js_1.updateTilesetGridContainer)();
            }
        });
        document
            .getElementById("removeTileAnimBtn")
            .addEventListener("click", () => {
            console.log("delete", state_js_2.default.init$tileAnimSel.value, state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value].animations);
            if (state_js_2.default.init$tileAnimSel.value &&
                state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value]?.animations &&
                state_js_2.default.init$tileAnimSel.value in
                    state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value]?.animations &&
                confirm(`Are you sure you want to delete ${state_js_2.default.init$tileAnimSel.value}`)) {
                delete state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value].frames[state_js_2.default.init$tileFrameSel.value].animations[state_js_2.default.init$tileAnimSel.value];
                (0, features_js_1.updateTilesetDataList)(true);
                (0, features_js_1.updateTilesetGridContainer)();
            }
        });
        state_js_2.default.state$el.renameTileAnimBtn().addEventListener("click", () => {
            renameKeyInObjectForSelectElement(state_js_2.default.init$tileAnimSel, state_js_2.default.mul$tileSets[state_js_2.default.init$tilesetDataSel.value]?.frames[state_js_2.default.init$tileFrameSel.value]?.animations, "animation");
        });
        state_js_2.default.state$el.animLoop().addEventListener("change", () => {
            (0, features_js_1.getCurrentAnimation)().loop = state_js_2.default.state$el.animLoop().checked;
        });
        state_js_2.default.state$el.animSpeed().addEventListener("change", (e) => {
            (0, features_js_1.getCurrentAnimation)().speed = state_js_2.default.state$el.animSpeed().value;
        });
        // Tileset SELECT callbacks
        state_js_2.default.init$tilesetDataSel = document.getElementById("tilesetDataSel");
        state_js_2.default.init$tilesetDataSel.addEventListener("change", (e) => {
            state_js_2.default.init$tilesetImage.src =
                state_js_2.default.reloadTilesets$TILESET_ELEMENTS[(0, helper_js_2.target)(e).value].src;
            state_js_2.default.init$tilesetImage.crossOrigin = "Anonymous";
            (0, features_js_1.updateTilesetDataList)();
        });
        state_js_2.default.state$el.tileFrameCount().addEventListener("change", () => {
            state_js_2.default.state$el.animStart().max = state_js_2.default.state$el.tileFrameCount().value;
            state_js_2.default.state$el.animEnd().max = state_js_2.default.state$el.tileFrameCount().value;
        });
        const replaceSelectedTileSet = (src) => {
            (0, features_js_1.addToUndoStack)();
            state_js_2.default.mul$IMAGES[Number(state_js_2.default.init$tilesetDataSel.value)].src = src;
            (0, features_js_1.reloadTilesets)();
        };
        const addNewTileSet = (src) => {
            console.log("add new tileset" + src);
            (0, features_js_1.addToUndoStack)();
            state_js_2.default.mul$IMAGES.push({ src });
            (0, features_js_1.reloadTilesets)();
        };
        exports.addNewTileSet = addNewTileSet;
        // replace tileset
        document
            .getElementById("tilesetReplaceInput")
            .addEventListener("change", (e) => {
            (0, utils_js_2.toBase64)((0, helper_js_2.target)(e).files[0]).then((base64Src) => {
                if (state_js_2.default.init_state$selectedTileSetLoader.onSelectImage) {
                    state_js_2.default.init_state$selectedTileSetLoader.onSelectImage(replaceSelectedTileSet, (0, helper_js_2.target)(e).files[0], base64Src);
                }
            });
        });
        document
            .getElementById("replaceTilesetBtn")
            .addEventListener("click", () => {
            if (state_js_2.default.init_state$selectedTileSetLoader.onSelectImage) {
                document.getElementById("tilesetReplaceInput").click();
            }
            if (state_js_2.default.init_state$selectedTileSetLoader.prompt) {
                state_js_2.default.init_state$selectedTileSetLoader.prompt(replaceSelectedTileSet);
            }
        });
        // add tileset
        document
            .getElementById("tilesetReadInput")
            .addEventListener("change", (e) => {
            (0, utils_js_2.toBase64)((0, helper_js_2.target)(e).files[0]).then((base64Src) => {
                if (state_js_2.default.init_state$selectedTileSetLoader.onSelectImage) {
                    state_js_2.default.init_state$selectedTileSetLoader.onSelectImage(addNewTileSet, (0, helper_js_2.target)(e).files[0], base64Src);
                }
            });
        });
        // remove tileset
        document.getElementById("addTilesetBtn").addEventListener("click", () => {
            if (state_js_2.default.init_state$selectedTileSetLoader.onSelectImage) {
                document.getElementById("tilesetReadInput").click();
            }
            if (state_js_2.default.init_state$selectedTileSetLoader.prompt) {
                state_js_2.default.init_state$selectedTileSetLoader.prompt(addNewTileSet);
            }
        });
        const tileSetLoadersSel = document.getElementById("tileSetLoadersSel");
        Object.entries(state_js_2.default.init_state$apiTileSetLoaders).forEach(([key, loader]) => {
            const tsLoaderOption = document.createElement("option");
            tsLoaderOption.value = key;
            tsLoaderOption.innerText = loader.name;
            tileSetLoadersSel.appendChild(tsLoaderOption);
            // apiTileSetLoaders[key].load = () => tileSetLoaders
        });
        tileSetLoadersSel.value = "base64";
        state_js_2.default.init_state$selectedTileSetLoader =
            state_js_2.default.init_state$apiTileSetLoaders[tileSetLoadersSel.value];
        tileSetLoadersSel.addEventListener("change", (e) => {
            state_js_2.default.init_state$selectedTileSetLoader =
                state_js_2.default.init_state$apiTileSetLoaders[(0, helper_js_2.target)(e).value];
        });
        exports.tilesetLoaders = state_js_2.default.init_state$apiTileSetLoaders;
        const deleteTilesetWithIndex = (index, cb = null) => {
            if (confirm(`Are you sure you want to delete this image?`)) {
                (0, features_js_1.addToUndoStack)();
                state_js_2.default.mul$IMAGES.splice(index, 1);
                (0, features_js_1.reloadTilesets)();
                if (cb)
                    cb();
            }
        };
        exports.IMAGES = state_js_2.default.mul$IMAGES;
        exports.deleteTilesetWithIndex = deleteTilesetWithIndex;
        document
            .getElementById("removeTilesetBtn")
            .addEventListener("click", () => {
            //Remove current tileset
            if (state_js_2.default.init$tilesetDataSel.value !== "0") {
                deleteTilesetWithIndex(Number(state_js_2.default.init$tilesetDataSel.value));
            }
        });
        // Canvas callbacks
        state_js_2.default.init$canvas.addEventListener("pointerdown", features_js_1.setMouseIsTrue);
        state_js_2.default.init$canvas.addEventListener("pointerup", features_js_1.setMouseIsFalse);
        state_js_2.default.init$canvas.addEventListener("pointerleave", features_js_1.setMouseIsFalse);
        state_js_2.default.init$canvas.addEventListener("pointerdown", toggleTile);
        state_js_2.default.init$canvas.addEventListener("contextmenu", (e) => e.preventDefault());
        draggable({
            onElement: state_js_2.default.init$canvas,
            element: document.getElementById("canvas_wrapper"),
        });
        state_js_2.default.init$canvas.addEventListener("pointermove", (e) => {
            if (state_js_2.default.mul$isMouseDown && state_js_2.default.mul$ACTIVE_TOOL !== 2)
                toggleTile(e);
        });
        // Canvas Resizer ===================
        document
            .getElementById("canvasWidthInp")
            .addEventListener("change", (e) => {
            (0, features_js_1.updateMapSize)({ mapWidth: Number((0, helper_js_2.target)(e).value) });
        });
        document
            .getElementById("canvasHeightInp")
            .addEventListener("change", (e) => {
            (0, features_js_1.updateMapSize)({ mapHeight: Number((0, helper_js_2.target)(e).value) });
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
            (0, features_js_1.updateMapSize)({ mapHeight: Number((0, helper_js_2.target)(e).value) });
        });
        document
            .querySelector(".canvas_resizer[resizerdir='x'] input")
            .addEventListener("change", (e) => {
            (0, features_js_1.updateMapSize)({ mapWidth: Number((0, helper_js_2.target)(e).value) });
        });
        document
            .getElementById("toolButtonsWrapper")
            .addEventListener("click", (e) => {
            console.log("ACTIVE_TOOL", (0, helper_js_2.target)(e).value);
            if ((0, helper_js_2.target)(e).getAttribute("name") === "tool")
                (0, features_js_1.setActiveTool)(Number((0, helper_js_2.target)(e).value));
        });
        document.getElementById("gridCropSize").addEventListener("change", (e) => {
            (0, features_js_1.setCropSize)(Number((0, helper_js_2.target)(e).value));
        });
        state_js_2.default.init$cropSize.addEventListener("change", (e) => {
            (0, features_js_1.setCropSize)(Number((0, helper_js_2.target)(e).value));
        });
        document
            .getElementById("clearCanvasBtn")
            .addEventListener("click", clearCanvas);
        if (onApply) {
            state_js_2.default.init$confirmBtn.addEventListener("click", () => onApply.onClick(getExportData()));
        }
        document.getElementById("renameMapBtn").addEventListener("click", () => {
            const newName = window.prompt("Change map name:", state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].name || "Map");
            if (newName !== null && state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].name !== newName) {
                if (Object.values(state_js_2.default.mul$maps)
                    .map((map) => map.name)
                    .includes(newName)) {
                    alert(`${newName} already exists`);
                    return;
                }
                state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].name = newName;
                (0, features_js_1.updateMaps)();
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
            state_js_2.default.init_state$apiTileMapExporters[key].getData = () => exporter.transformer(getExportData());
        });
        exports.exporters = state_js_2.default.init_state$apiTileMapExporters;
        Object.entries(state_js_2.default.init_state$apiTileMapImporters).forEach(([key, importer]) => {
            makeMenuItem(importer.name, key, importer.description).onclick = () => {
                if (importer.onSelectFiles) {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.id = `importerInput-${key}`;
                    if (importer.acceptFile)
                        input.accept = importer.acceptFile;
                    input.style.display = "none";
                    input.addEventListener("change", (e) => {
                        importer.onSelectFiles(loadData, (0, helper_js_2.target)(e).files);
                    });
                    input.click();
                }
            };
            // apiTileMapImporters[key].setData = (files) => importer.onSelectFiles(loadData, files);
        });
        document.getElementById("toggleFlipX").addEventListener("change", (e) => {
            document.getElementById("flipBrushIndicator").style.transform = (0, helper_js_2.target)(e)
                .checked
                ? "scale(-1, 1)"
                : "scale(1, 1)";
        });
        document.addEventListener("keypress", (e) => {
            if (e.ctrlKey) {
                if (e.code === "KeyZ")
                    undo();
                if (e.code === "KeyY")
                    redo();
            }
        });
        document.getElementById("gridColorSel").addEventListener("change", (e) => {
            console.log("grid col", (0, helper_js_2.target)(e).value);
            state_js_2.default.mul$maps[state_js_2.default.mul$ACTIVE_MAP].gridColor = (0, helper_js_2.target)(e).value;
            (0, features_js_1.draw)();
        });
        document.getElementById("showGrid").addEventListener("change", (e) => {
            state_js_2.default.init$SHOW_GRID = (0, helper_js_2.target)(e).checked;
            (0, features_js_1.draw)();
        });
        document.getElementById("undoBtn").addEventListener("click", undo);
        document.getElementById("redoBtn").addEventListener("click", redo);
        document.getElementById("zoomIn").addEventListener("click", zoomIn);
        document.getElementById("zoomOut").addEventListener("click", zoomOut);
        document
            .getElementById("setSymbolsVisBtn")
            .addEventListener("click", () => toggleSymbolsVisible());
        // Scroll zoom in/out - use wheel instead of scroll event since theres no scrollbar on the map
        state_js_2.default.init$canvas.addEventListener("wheel", (e) => {
            if (e.deltaY < 0)
                zoomIn();
            else
                zoomOut();
        });
        loadData(tileMapData);
        if (appState) {
            state_js_2.default.mul$ACTIVE_MAP = appState.ACTIVE_MAP;
            state_js_2.default.init$mapsDataSel.value = state_js_2.default.mul$ACTIVE_MAP;
            (0, features_js_1.setActiveMap)(appState.ACTIVE_MAP);
            state_js_2.default.mul$PREV_ACTIVE_TOOL = appState.PREV_ACTIVE_TOOL;
            state_js_2.default.mul$ACTIVE_TOOL = appState.ACTIVE_TOOL;
            (0, features_js_1.setActiveTool)(appState.ACTIVE_TOOL);
            (0, features_js_1.setLayer)(appState.currentLayer);
            state_js_2.default.mul$selection = appState.selection;
            (0, features_js_1.updateSelection)(false);
            state_js_2.default.init$SHOW_GRID = appState.SHOW_GRID;
        }
        // Animated tiles when on frames mode
        const animateTiles = () => {
            if (state_js_2.default.init$tileDataSel.value === "frames")
                (0, features_js_1.draw)();
            requestAnimationFrame(animateTiles);
        };
        requestAnimationFrame(animateTiles);
    };
});
define("src/TilemapEditor/index", ["require", "exports", "src/TilemapEditor/init/index", "src/TilemapEditor/features", "src/TilemapEditor/state", "src/TilemapEditor/utils"], function (require, exports, index_js_1, features_js_2, state_js_3, utils_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.keys(state_js_3.default.state$el).forEach((key) => {
        state_js_3.default.state$el[key] = () => document.getElementById(key);
    });
    class TilemapEditor {
        static toBase64 = utils_js_3.toBase64;
        static getLayers = () => state_js_3.default.mul$maps[state_js_3.default.mul$ACTIVE_MAP].layers;
        static init = (0, index_js_1.default)(TilemapEditor);
        static getState = () => (0, features_js_2.getAppState)();
        static onUpdate = state_js_3.default.init$apiOnUpdateCallback;
        static onMouseUp = state_js_3.default.init$apiOnMouseUp;
        static getTilesets = () => state_js_3.default.mul$tileSets;
    }
    exports.default = TilemapEditor;
});
define("src/index", ["require", "exports", "src/constants/tileSetImages", "src/getImgurGallery", "src/getMapFromGist", "src/kaboomJsExport", "src/uploadImageToImgur", "src/TilemapEditor/index"], function (require, exports, tileSetImages_js_1, getImgurGallery_js_1, getMapFromGist_js_1, kaboomJsExport_js_1, uploadImageToImgur_js_1, index_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import ioJsonData from "./constants/ioJsonData.js";
    let _tileSetImages = tileSetImages_js_1.default;
    let tileSize = 32;
    let mapWidth = 10;
    let mapHeight = 10;
    let tileMapData; //= ioJsonData;
    const initTilemapEditor = () => {
        console.log("INIT with", { tileSetImages: _tileSetImages, tileSize });
        // TODO move this under after parsing url params and get everything from there
        index_js_2.default.init("tileMapEditor", {
            // The id of the element that will become the tilemap-editor (must exist in your dom)
            // loads tilemap data which was saved before. undefined will start you with an empty map.
            // Takes a parsed json object with a data struct that tiled-editor can read (an object with maps and tileSets):
            // { maps : {...}, tileSets: {...}}
            tileMapData,
            // tileSize is used to slice the tileset and give the tilemap the right sized grid
            tileSize,
            // How many tiles is the initial map wide
            mapWidth,
            // How many tiles is the initial map tall
            mapHeight,
            // tileset images [{src (required), description (optional)}]
            tileSetImages: _tileSetImages,
            // You can write your own custom load image function here and use it for the tileset src. If you dont, the base64 string will be used instead
            tileSetLoaders: {
                fromUrl: {
                    name: "Any url",
                    prompt: (setSrc) => {
                        // Pass prompt ot onSelectImage. Prompt lets you do anything without asking the user to select a file
                        const fileUrl = window.prompt("What is the url of the tileset?", "https://i.imgur.com/ztwPZOI.png");
                        if (fileUrl !== null)
                            setSrc(fileUrl);
                    },
                },
                imgur: {
                    name: "Imgur (host)",
                    onSelectImage: (setSrc, file, base64) => {
                        // In case you want them to give you a file from the fs, you can do this instead of prompt
                        (0, uploadImageToImgur_js_1.default)(file).then((result) => {
                            console.log(file, base64);
                            console.log("Uploaded to imgur", result);
                            setSrc(result.data.link);
                        });
                    },
                },
            },
            // You can write your own tilemap exporters here. Whatever they return will get added to the export data you get out when you trigger onAppy
            tileMapExporters: {
            // kaboomJs: { // the exporter's key is later used by the onApply option
            //   name: "Download KaboomJs boilerplate code", // name of menu entry
            //   description: "Exports boilerplate js code for KaboomJs",
            //   transformer: ({flattenedData, maps, tileSets, activeMap, downloadAsTextFile})=> {
            //     const text = kaboomJsExport({flattenedData, maps, tileSets, activeMap});
            //     downloadAsTextFile(text, "KaboomJsMapData.js");// you can use this util method to get your text as a file
            //   }
            // },
            },
            tileMapImporters: {
            //similar to the exporters, you can write your own data importer, which will then be added to the file menu
            // tiledImport: {
            //   name: "Import Tiled json file (TODO)", // name of menu entry
            //   onSelectFiles: (setData, files) => { // callback that is triggered when file(s) are selected.
            //     const readFile = new FileReader();
            //     readFile.onload = (e) => {
            //       const json = JSON.parse(e.target.result);
            //       // At this point we got the json data from the tiled file. We need to convert it into
            //       // a data struct that tiled-editor can read (an object with maps and tileSets):
            //       // { maps : {...}, tileSets: {...}}
            //       alert("Not implemented yet... pr welcome ;)");
            //       return;// TODO tiled json file parser
            //
            //       setData(json); // Finally pass that to the setData function, which will load it into tiled-editor
            //     };
            //     readFile.readAsText(files[0]);
            //   },
            //   acceptFile: "application/JSON" // You can control what files are accepted
            // }
            },
            // If passed, a new button gets added to the header, upon being clicked, you can get data from the tilemap editor and trigger events
            onApply: {
                onClick: ({ flattenedData, maps, tileSets, activeMap }) => {
                    console.log("onClick, gets the data too");
                    const copyText = document.createElement("input");
                    document.body.appendChild(copyText);
                    copyText.value = (0, kaboomJsExport_js_1.default)({
                        flattenedData,
                        // maps,
                        tileSets,
                        // activeMap,
                    });
                    copyText.select();
                    copyText.setSelectionRange(0, 99999); /* For mobile devices */
                    document.execCommand("copy");
                    /* Alert the copied text */
                    // alert("Copied the text: " + copyText.value);
                    // const kbCode = kaboomJsExport({flattenedData, maps, tileSets, activeMap});
                },
                buttonText: "Copy Kb to clip", // controls the apply button's text
            },
            onUpdate(ev) {
                // callback for when the app updates its state (loaded data, tool, etc)
                // console.log("-->>", ev)
            },
        });
        console.log("Got App State:", index_js_2.default.getState());
    };
    if (window.location.href.includes("?")) {
        const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
        const imgur = urlParams.get("imgur");
        if (imgur) {
            (0, getImgurGallery_js_1.default)(imgur, (data) => {
                console.log("ALBUM", data.images);
                // const images = data.images //description and link
                _tileSetImages = data.images.map((image) => {
                    let extractedSourceMatch;
                    if (image.description && image.description.includes("tileSize:")) {
                        const extractedTileSizeMatch = image.description.match(/tileSize\:\s*([0-9]+)/);
                        if (extractedTileSizeMatch && extractedTileSizeMatch.length > 1) {
                            tileSize = parseInt(extractedTileSizeMatch[1], 10);
                            console.info("set tileSize from description", tileSize);
                            if (tileSize === 8) {
                                mapWidth = 20; // Detect map size for a gameboy room
                                mapHeight = 18;
                            }
                        }
                        extractedSourceMatch = image.description.match(/source\:\s*(.*)/);
                    }
                    let extractedTilesetName;
                    if (image.description && image.description.includes("name:")) {
                        extractedTilesetName = image.description.match(/name\:\s*(.*)/);
                    }
                    return {
                        src: image.link,
                        tileSize,
                        name: extractedTilesetName.length > 1 ? extractedTilesetName[1] : "",
                        description: image.description,
                        link: extractedSourceMatch && extractedSourceMatch.length > 1
                            ? `https://${extractedSourceMatch[1]}`
                            : `https://imgur.com/a/${imgur}`,
                    };
                });
                initTilemapEditor();
            });
        }
        const gist = urlParams.get("gist");
        if (gist) {
            (0, getMapFromGist_js_1.default)(gist, (mapData) => {
                tileMapData = mapData;
                initTilemapEditor();
            });
        }
        const tileSizeParam = urlParams.get("tileSize");
        if (tileSizeParam) {
            tileSize = parseInt(tileSizeParam, 10);
        }
    }
    else {
        initTilemapEditor();
    }
    // Pwa stuff
    let newWorker;
    function showUpdateBar() {
        let snackbar = document.getElementById("snackbar");
        if (snackbar) {
            snackbar.className = "show";
        }
        else {
            console.warn("not found: #snackbar");
        }
    }
    // The click event on the pop up notification
    const reloadLink = document.getElementById("reload");
    if (reloadLink) {
        reloadLink.addEventListener("click", function () {
            newWorker.postMessage({ action: "skipWaiting" });
        });
    }
    else {
        console.warn("not found: #reload");
    }
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/tilemap-editor/sw.js").then((reg) => {
            console.log("Service Worker Registered");
            reg.addEventListener("updatefound", () => {
                // A wild service worker has appeared in reg.installing!
                newWorker = reg.installing;
                if (newWorker) {
                    newWorker.addEventListener("statechange", () => {
                        // Has network.state changed?
                        switch (newWorker.state) {
                            case "installed":
                                if (navigator.serviceWorker.controller) {
                                    showUpdateBar();
                                }
                                break;
                        }
                    });
                }
                else {
                    console.warn("failed: newWorker");
                }
            });
        });
    }
    let refreshing;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (refreshing)
            return;
        window.location.reload();
        refreshing = true;
    });
    let deferredPrompt;
    const addBtn = document.getElementById("addPwaBtn");
    if (addBtn) {
        addBtn.style.display = "none";
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            addBtn.style.display = "block";
            addBtn.addEventListener("click", () => {
                addBtn.style.display = "none";
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === "accepted") {
                        console.log("User accepted the A2HS prompt");
                    }
                    deferredPrompt = null;
                });
            });
        });
        window.addEventListener("appinstalled", () => {
            addBtn.style.display = "none";
            deferredPrompt = null;
            console.log("PWA was installed");
        });
    }
    else {
        console.warn("not found: #addPwaBtn");
    }
});
define("src/constants/ioJsonData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Example data structure that tiledmap-editor can read and write
    //https://imgur.com/a/SjjsjTm
    exports.default = {
        tileSets: {
            0: {
                src: "https://i.imgur.com/ztwPZOI.png",
                name: "tileset 0",
                gridWidth: 8,
                gridHeight: 133,
                tileCount: 1064,
                tileData: {
                    "0-0": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                    "1-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                    "2-0": { x: 2, y: 0, tilesetIdx: 0, tileSymbol: "Å" },
                    "3-0": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                    "4-0": { x: 4, y: 0, tilesetIdx: 0, tileSymbol: "Ç" },
                    "5-0": { x: 5, y: 0, tilesetIdx: 0, tileSymbol: "È" },
                    "6-0": { x: 6, y: 0, tilesetIdx: 0, tileSymbol: "É" },
                    "7-0": { x: 7, y: 0, tilesetIdx: 0, tileSymbol: "Ê" },
                    "0-1": { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                    "1-1": { x: 1, y: 1, tilesetIdx: 0, tileSymbol: "Ì" },
                    "2-1": { x: 2, y: 1, tilesetIdx: 0, tileSymbol: "Í" },
                    "3-1": { x: 3, y: 1, tilesetIdx: 0, tileSymbol: "Î" },
                    "4-1": { x: 4, y: 1, tilesetIdx: 0, tileSymbol: "Ï" },
                    "5-1": { x: 5, y: 1, tilesetIdx: 0, tileSymbol: "Ð" },
                    "6-1": { x: 6, y: 1, tilesetIdx: 0, tileSymbol: "Ñ" },
                    "7-1": { x: 7, y: 1, tilesetIdx: 0, tileSymbol: "Ò" },
                    "0-2": { x: 0, y: 2, tilesetIdx: 0, tileSymbol: "Ó" },
                    "1-2": { x: 1, y: 2, tilesetIdx: 0, tileSymbol: "Ô" },
                    "2-2": { x: 2, y: 2, tilesetIdx: 0, tileSymbol: "Õ" },
                    "3-2": { x: 3, y: 2, tilesetIdx: 0, tileSymbol: "Ö" },
                    "4-2": { x: 4, y: 2, tilesetIdx: 0, tileSymbol: "×" },
                    "5-2": { x: 5, y: 2, tilesetIdx: 0, tileSymbol: "Ø" },
                    "6-2": { x: 6, y: 2, tilesetIdx: 0, tileSymbol: "Ù" },
                    "7-2": { x: 7, y: 2, tilesetIdx: 0, tileSymbol: "Ú" },
                    "0-3": { x: 0, y: 3, tilesetIdx: 0, tileSymbol: "Û" },
                    "1-3": { x: 1, y: 3, tilesetIdx: 0, tileSymbol: "Ü" },
                    "2-3": { x: 2, y: 3, tilesetIdx: 0, tileSymbol: "Ý" },
                    "3-3": { x: 3, y: 3, tilesetIdx: 0, tileSymbol: "Þ" },
                    "4-3": { x: 4, y: 3, tilesetIdx: 0, tileSymbol: "ß" },
                    "5-3": { x: 5, y: 3, tilesetIdx: 0, tileSymbol: "à" },
                    "6-3": { x: 6, y: 3, tilesetIdx: 0, tileSymbol: "á" },
                    "7-3": { x: 7, y: 3, tilesetIdx: 0, tileSymbol: "â" },
                    "0-4": { x: 0, y: 4, tilesetIdx: 0, tileSymbol: "ã" },
                    "1-4": { x: 1, y: 4, tilesetIdx: 0, tileSymbol: "ä" },
                    "2-4": { x: 2, y: 4, tilesetIdx: 0, tileSymbol: "å" },
                    "3-4": { x: 3, y: 4, tilesetIdx: 0, tileSymbol: "æ" },
                    "4-4": { x: 4, y: 4, tilesetIdx: 0, tileSymbol: "ç" },
                    "5-4": { x: 5, y: 4, tilesetIdx: 0, tileSymbol: "è" },
                    "6-4": { x: 6, y: 4, tilesetIdx: 0, tileSymbol: "é" },
                    "7-4": { x: 7, y: 4, tilesetIdx: 0, tileSymbol: "ê" },
                    "0-5": { x: 0, y: 5, tilesetIdx: 0, tileSymbol: "ë" },
                    "1-5": { x: 1, y: 5, tilesetIdx: 0, tileSymbol: "ì" },
                    "2-5": { x: 2, y: 5, tilesetIdx: 0, tileSymbol: "í" },
                    "3-5": { x: 3, y: 5, tilesetIdx: 0, tileSymbol: "î" },
                    "4-5": { x: 4, y: 5, tilesetIdx: 0, tileSymbol: "ï" },
                    "5-5": { x: 5, y: 5, tilesetIdx: 0, tileSymbol: "ð" },
                    "6-5": { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                    "7-5": { x: 7, y: 5, tilesetIdx: 0, tileSymbol: "ò" },
                    "0-6": { x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" },
                    "1-6": { x: 1, y: 6, tilesetIdx: 0, tileSymbol: "ô" },
                    "2-6": { x: 2, y: 6, tilesetIdx: 0, tileSymbol: "õ" },
                    "3-6": { x: 3, y: 6, tilesetIdx: 0, tileSymbol: "ö" },
                    "4-6": { x: 4, y: 6, tilesetIdx: 0, tileSymbol: "÷" },
                    "5-6": { x: 5, y: 6, tilesetIdx: 0, tileSymbol: "ø" },
                    "6-6": { x: 6, y: 6, tilesetIdx: 0, tileSymbol: "ù" },
                    "7-6": { x: 7, y: 6, tilesetIdx: 0, tileSymbol: "ú" },
                    "0-7": { x: 0, y: 7, tilesetIdx: 0, tileSymbol: "û" },
                    "1-7": { x: 1, y: 7, tilesetIdx: 0, tileSymbol: "ü" },
                    "2-7": { x: 2, y: 7, tilesetIdx: 0, tileSymbol: "ý" },
                    "3-7": { x: 3, y: 7, tilesetIdx: 0, tileSymbol: "þ" },
                    "4-7": { x: 4, y: 7, tilesetIdx: 0, tileSymbol: "ÿ" },
                    "5-7": { x: 5, y: 7, tilesetIdx: 0, tileSymbol: "Ā" },
                    "6-7": { x: 6, y: 7, tilesetIdx: 0, tileSymbol: "ā" },
                    "7-7": { x: 7, y: 7, tilesetIdx: 0, tileSymbol: "Ă" },
                    "0-8": { x: 0, y: 8, tilesetIdx: 0, tileSymbol: "ă" },
                    "1-8": { x: 1, y: 8, tilesetIdx: 0, tileSymbol: "Ą" },
                    "2-8": { x: 2, y: 8, tilesetIdx: 0, tileSymbol: "ą" },
                    "3-8": { x: 3, y: 8, tilesetIdx: 0, tileSymbol: "Ć" },
                    "4-8": { x: 4, y: 8, tilesetIdx: 0, tileSymbol: "ć" },
                    "5-8": { x: 5, y: 8, tilesetIdx: 0, tileSymbol: "Ĉ" },
                    "6-8": { x: 6, y: 8, tilesetIdx: 0, tileSymbol: "ĉ" },
                    "7-8": { x: 7, y: 8, tilesetIdx: 0, tileSymbol: "Ċ" },
                    "0-9": { x: 0, y: 9, tilesetIdx: 0, tileSymbol: "ċ" },
                    "1-9": { x: 1, y: 9, tilesetIdx: 0, tileSymbol: "Č" },
                    "2-9": { x: 2, y: 9, tilesetIdx: 0, tileSymbol: "č" },
                    "3-9": { x: 3, y: 9, tilesetIdx: 0, tileSymbol: "Ď" },
                    "4-9": { x: 4, y: 9, tilesetIdx: 0, tileSymbol: "ď" },
                    "5-9": { x: 5, y: 9, tilesetIdx: 0, tileSymbol: "Đ" },
                    "6-9": { x: 6, y: 9, tilesetIdx: 0, tileSymbol: "đ" },
                    "7-9": { x: 7, y: 9, tilesetIdx: 0, tileSymbol: "Ē" },
                    "0-10": { x: 0, y: 10, tilesetIdx: 0, tileSymbol: "ē" },
                    "1-10": { x: 1, y: 10, tilesetIdx: 0, tileSymbol: "Ĕ" },
                    "2-10": { x: 2, y: 10, tilesetIdx: 0, tileSymbol: "ĕ" },
                    "3-10": { x: 3, y: 10, tilesetIdx: 0, tileSymbol: "Ė" },
                    "4-10": { x: 4, y: 10, tilesetIdx: 0, tileSymbol: "ė" },
                    "5-10": { x: 5, y: 10, tilesetIdx: 0, tileSymbol: "Ę" },
                    "6-10": { x: 6, y: 10, tilesetIdx: 0, tileSymbol: "ę" },
                    "7-10": { x: 7, y: 10, tilesetIdx: 0, tileSymbol: "Ě" },
                    "0-11": { x: 0, y: 11, tilesetIdx: 0, tileSymbol: "ě" },
                    "1-11": { x: 1, y: 11, tilesetIdx: 0, tileSymbol: "Ĝ" },
                    "2-11": { x: 2, y: 11, tilesetIdx: 0, tileSymbol: "ĝ" },
                    "3-11": { x: 3, y: 11, tilesetIdx: 0, tileSymbol: "Ğ" },
                    "4-11": { x: 4, y: 11, tilesetIdx: 0, tileSymbol: "ğ" },
                    "5-11": { x: 5, y: 11, tilesetIdx: 0, tileSymbol: "Ġ" },
                    "6-11": { x: 6, y: 11, tilesetIdx: 0, tileSymbol: "ġ" },
                    "7-11": { x: 7, y: 11, tilesetIdx: 0, tileSymbol: "Ģ" },
                    "0-12": { x: 0, y: 12, tilesetIdx: 0, tileSymbol: "ģ" },
                    "1-12": { x: 1, y: 12, tilesetIdx: 0, tileSymbol: "Ĥ" },
                    "2-12": { x: 2, y: 12, tilesetIdx: 0, tileSymbol: "ĥ" },
                    "3-12": { x: 3, y: 12, tilesetIdx: 0, tileSymbol: "Ħ" },
                    "4-12": { x: 4, y: 12, tilesetIdx: 0, tileSymbol: "ħ" },
                    "5-12": { x: 5, y: 12, tilesetIdx: 0, tileSymbol: "Ĩ" },
                    "6-12": { x: 6, y: 12, tilesetIdx: 0, tileSymbol: "ĩ" },
                    "7-12": { x: 7, y: 12, tilesetIdx: 0, tileSymbol: "Ī" },
                    "0-13": { x: 0, y: 13, tilesetIdx: 0, tileSymbol: "ī" },
                    "1-13": { x: 1, y: 13, tilesetIdx: 0, tileSymbol: "Ĭ" },
                    "2-13": { x: 2, y: 13, tilesetIdx: 0, tileSymbol: "ĭ" },
                    "3-13": { x: 3, y: 13, tilesetIdx: 0, tileSymbol: "Į" },
                    "4-13": { x: 4, y: 13, tilesetIdx: 0, tileSymbol: "į" },
                    "5-13": { x: 5, y: 13, tilesetIdx: 0, tileSymbol: "İ" },
                    "6-13": { x: 6, y: 13, tilesetIdx: 0, tileSymbol: "ı" },
                    "7-13": { x: 7, y: 13, tilesetIdx: 0, tileSymbol: "Ĳ" },
                    "0-14": { x: 0, y: 14, tilesetIdx: 0, tileSymbol: "ĳ" },
                    "1-14": { x: 1, y: 14, tilesetIdx: 0, tileSymbol: "Ĵ" },
                    "2-14": { x: 2, y: 14, tilesetIdx: 0, tileSymbol: "ĵ" },
                    "3-14": { x: 3, y: 14, tilesetIdx: 0, tileSymbol: "Ķ" },
                    "4-14": { x: 4, y: 14, tilesetIdx: 0, tileSymbol: "ķ" },
                    "5-14": { x: 5, y: 14, tilesetIdx: 0, tileSymbol: "ĸ" },
                    "6-14": { x: 6, y: 14, tilesetIdx: 0, tileSymbol: "Ĺ" },
                    "7-14": { x: 7, y: 14, tilesetIdx: 0, tileSymbol: "ĺ" },
                    "0-15": { x: 0, y: 15, tilesetIdx: 0, tileSymbol: "Ļ" },
                    "1-15": { x: 1, y: 15, tilesetIdx: 0, tileSymbol: "ļ" },
                    "2-15": { x: 2, y: 15, tilesetIdx: 0, tileSymbol: "Ľ" },
                    "3-15": { x: 3, y: 15, tilesetIdx: 0, tileSymbol: "ľ" },
                    "4-15": { x: 4, y: 15, tilesetIdx: 0, tileSymbol: "Ŀ" },
                    "5-15": { x: 5, y: 15, tilesetIdx: 0, tileSymbol: "ŀ" },
                    "6-15": { x: 6, y: 15, tilesetIdx: 0, tileSymbol: "Ł" },
                    "7-15": { x: 7, y: 15, tilesetIdx: 0, tileSymbol: "ł" },
                    "0-16": { x: 0, y: 16, tilesetIdx: 0, tileSymbol: "Ń" },
                    "1-16": { x: 1, y: 16, tilesetIdx: 0, tileSymbol: "ń" },
                    "2-16": { x: 2, y: 16, tilesetIdx: 0, tileSymbol: "Ņ" },
                    "3-16": { x: 3, y: 16, tilesetIdx: 0, tileSymbol: "ņ" },
                    "4-16": { x: 4, y: 16, tilesetIdx: 0, tileSymbol: "Ň" },
                    "5-16": { x: 5, y: 16, tilesetIdx: 0, tileSymbol: "ň" },
                    "6-16": { x: 6, y: 16, tilesetIdx: 0, tileSymbol: "ŉ" },
                    "7-16": { x: 7, y: 16, tilesetIdx: 0, tileSymbol: "Ŋ" },
                    "0-17": { x: 0, y: 17, tilesetIdx: 0, tileSymbol: "ŋ" },
                    "1-17": { x: 1, y: 17, tilesetIdx: 0, tileSymbol: "Ō" },
                    "2-17": { x: 2, y: 17, tilesetIdx: 0, tileSymbol: "ō" },
                    "3-17": { x: 3, y: 17, tilesetIdx: 0, tileSymbol: "Ŏ" },
                    "4-17": { x: 4, y: 17, tilesetIdx: 0, tileSymbol: "ŏ" },
                    "5-17": { x: 5, y: 17, tilesetIdx: 0, tileSymbol: "Ő" },
                    "6-17": { x: 6, y: 17, tilesetIdx: 0, tileSymbol: "ő" },
                    "7-17": { x: 7, y: 17, tilesetIdx: 0, tileSymbol: "Œ" },
                    "0-18": { x: 0, y: 18, tilesetIdx: 0, tileSymbol: "œ" },
                    "1-18": { x: 1, y: 18, tilesetIdx: 0, tileSymbol: "Ŕ" },
                    "2-18": { x: 2, y: 18, tilesetIdx: 0, tileSymbol: "ŕ" },
                    "3-18": { x: 3, y: 18, tilesetIdx: 0, tileSymbol: "Ŗ" },
                    "4-18": { x: 4, y: 18, tilesetIdx: 0, tileSymbol: "ŗ" },
                    "5-18": { x: 5, y: 18, tilesetIdx: 0, tileSymbol: "Ř" },
                    "6-18": { x: 6, y: 18, tilesetIdx: 0, tileSymbol: "ř" },
                    "7-18": { x: 7, y: 18, tilesetIdx: 0, tileSymbol: "Ś" },
                    "0-19": { x: 0, y: 19, tilesetIdx: 0, tileSymbol: "ś" },
                    "1-19": { x: 1, y: 19, tilesetIdx: 0, tileSymbol: "Ŝ" },
                    "2-19": { x: 2, y: 19, tilesetIdx: 0, tileSymbol: "ŝ" },
                    "3-19": { x: 3, y: 19, tilesetIdx: 0, tileSymbol: "Ş" },
                    "4-19": { x: 4, y: 19, tilesetIdx: 0, tileSymbol: "ş" },
                    "5-19": { x: 5, y: 19, tilesetIdx: 0, tileSymbol: "Š" },
                    "6-19": { x: 6, y: 19, tilesetIdx: 0, tileSymbol: "š" },
                    "7-19": { x: 7, y: 19, tilesetIdx: 0, tileSymbol: "Ţ" },
                    "0-20": { x: 0, y: 20, tilesetIdx: 0, tileSymbol: "ţ" },
                    "1-20": { x: 1, y: 20, tilesetIdx: 0, tileSymbol: "Ť" },
                    "2-20": { x: 2, y: 20, tilesetIdx: 0, tileSymbol: "ť" },
                    "3-20": { x: 3, y: 20, tilesetIdx: 0, tileSymbol: "Ŧ" },
                    "4-20": { x: 4, y: 20, tilesetIdx: 0, tileSymbol: "ŧ" },
                    "5-20": { x: 5, y: 20, tilesetIdx: 0, tileSymbol: "Ũ" },
                    "6-20": { x: 6, y: 20, tilesetIdx: 0, tileSymbol: "ũ" },
                    "7-20": { x: 7, y: 20, tilesetIdx: 0, tileSymbol: "Ū" },
                    "0-21": { x: 0, y: 21, tilesetIdx: 0, tileSymbol: "ū" },
                    "1-21": { x: 1, y: 21, tilesetIdx: 0, tileSymbol: "Ŭ" },
                    "2-21": { x: 2, y: 21, tilesetIdx: 0, tileSymbol: "ŭ" },
                    "3-21": { x: 3, y: 21, tilesetIdx: 0, tileSymbol: "Ů" },
                    "4-21": { x: 4, y: 21, tilesetIdx: 0, tileSymbol: "ů" },
                    "5-21": { x: 5, y: 21, tilesetIdx: 0, tileSymbol: "Ű" },
                    "6-21": { x: 6, y: 21, tilesetIdx: 0, tileSymbol: "ű" },
                    "7-21": { x: 7, y: 21, tilesetIdx: 0, tileSymbol: "Ų" },
                    "0-22": { x: 0, y: 22, tilesetIdx: 0, tileSymbol: "ų" },
                    "1-22": { x: 1, y: 22, tilesetIdx: 0, tileSymbol: "Ŵ" },
                    "2-22": { x: 2, y: 22, tilesetIdx: 0, tileSymbol: "ŵ" },
                    "3-22": { x: 3, y: 22, tilesetIdx: 0, tileSymbol: "Ŷ" },
                    "4-22": { x: 4, y: 22, tilesetIdx: 0, tileSymbol: "ŷ" },
                    "5-22": { x: 5, y: 22, tilesetIdx: 0, tileSymbol: "Ÿ" },
                    "6-22": { x: 6, y: 22, tilesetIdx: 0, tileSymbol: "Ź" },
                    "7-22": { x: 7, y: 22, tilesetIdx: 0, tileSymbol: "ź" },
                    "0-23": { x: 0, y: 23, tilesetIdx: 0, tileSymbol: "Ż" },
                    "1-23": { x: 1, y: 23, tilesetIdx: 0, tileSymbol: "ż" },
                    "2-23": { x: 2, y: 23, tilesetIdx: 0, tileSymbol: "Ž" },
                    "3-23": { x: 3, y: 23, tilesetIdx: 0, tileSymbol: "ž" },
                    "4-23": { x: 4, y: 23, tilesetIdx: 0, tileSymbol: "ſ" },
                    "5-23": { x: 5, y: 23, tilesetIdx: 0, tileSymbol: "ƀ" },
                    "6-23": { x: 6, y: 23, tilesetIdx: 0, tileSymbol: "Ɓ" },
                    "7-23": { x: 7, y: 23, tilesetIdx: 0, tileSymbol: "Ƃ" },
                    "0-24": { x: 0, y: 24, tilesetIdx: 0, tileSymbol: "ƃ" },
                    "1-24": { x: 1, y: 24, tilesetIdx: 0, tileSymbol: "Ƅ" },
                    "2-24": { x: 2, y: 24, tilesetIdx: 0, tileSymbol: "ƅ" },
                    "3-24": { x: 3, y: 24, tilesetIdx: 0, tileSymbol: "Ɔ" },
                    "4-24": { x: 4, y: 24, tilesetIdx: 0, tileSymbol: "Ƈ" },
                    "5-24": { x: 5, y: 24, tilesetIdx: 0, tileSymbol: "ƈ" },
                    "6-24": { x: 6, y: 24, tilesetIdx: 0, tileSymbol: "Ɖ" },
                    "7-24": { x: 7, y: 24, tilesetIdx: 0, tileSymbol: "Ɗ" },
                    "0-25": { x: 0, y: 25, tilesetIdx: 0, tileSymbol: "Ƌ" },
                    "1-25": { x: 1, y: 25, tilesetIdx: 0, tileSymbol: "ƌ" },
                    "2-25": { x: 2, y: 25, tilesetIdx: 0, tileSymbol: "ƍ" },
                    "3-25": { x: 3, y: 25, tilesetIdx: 0, tileSymbol: "Ǝ" },
                    "4-25": { x: 4, y: 25, tilesetIdx: 0, tileSymbol: "Ə" },
                    "5-25": { x: 5, y: 25, tilesetIdx: 0, tileSymbol: "Ɛ" },
                    "6-25": { x: 6, y: 25, tilesetIdx: 0, tileSymbol: "Ƒ" },
                    "7-25": { x: 7, y: 25, tilesetIdx: 0, tileSymbol: "ƒ" },
                    "0-26": { x: 0, y: 26, tilesetIdx: 0, tileSymbol: "Ɠ" },
                    "1-26": { x: 1, y: 26, tilesetIdx: 0, tileSymbol: "Ɣ" },
                    "2-26": { x: 2, y: 26, tilesetIdx: 0, tileSymbol: "ƕ" },
                    "3-26": { x: 3, y: 26, tilesetIdx: 0, tileSymbol: "Ɩ" },
                    "4-26": { x: 4, y: 26, tilesetIdx: 0, tileSymbol: "Ɨ" },
                    "5-26": { x: 5, y: 26, tilesetIdx: 0, tileSymbol: "Ƙ" },
                    "6-26": { x: 6, y: 26, tilesetIdx: 0, tileSymbol: "ƙ" },
                    "7-26": { x: 7, y: 26, tilesetIdx: 0, tileSymbol: "ƚ" },
                    "0-27": { x: 0, y: 27, tilesetIdx: 0, tileSymbol: "ƛ" },
                    "1-27": { x: 1, y: 27, tilesetIdx: 0, tileSymbol: "Ɯ" },
                    "2-27": { x: 2, y: 27, tilesetIdx: 0, tileSymbol: "Ɲ" },
                    "3-27": { x: 3, y: 27, tilesetIdx: 0, tileSymbol: "ƞ" },
                    "4-27": { x: 4, y: 27, tilesetIdx: 0, tileSymbol: "Ɵ" },
                    "5-27": { x: 5, y: 27, tilesetIdx: 0, tileSymbol: "Ơ" },
                    "6-27": { x: 6, y: 27, tilesetIdx: 0, tileSymbol: "ơ" },
                    "7-27": { x: 7, y: 27, tilesetIdx: 0, tileSymbol: "Ƣ" },
                    "0-28": { x: 0, y: 28, tilesetIdx: 0, tileSymbol: "ƣ" },
                    "1-28": { x: 1, y: 28, tilesetIdx: 0, tileSymbol: "Ƥ" },
                    "2-28": { x: 2, y: 28, tilesetIdx: 0, tileSymbol: "ƥ" },
                    "3-28": { x: 3, y: 28, tilesetIdx: 0, tileSymbol: "Ʀ" },
                    "4-28": { x: 4, y: 28, tilesetIdx: 0, tileSymbol: "Ƨ" },
                    "5-28": { x: 5, y: 28, tilesetIdx: 0, tileSymbol: "ƨ" },
                    "6-28": { x: 6, y: 28, tilesetIdx: 0, tileSymbol: "Ʃ" },
                    "7-28": { x: 7, y: 28, tilesetIdx: 0, tileSymbol: "ƪ" },
                    "0-29": { x: 0, y: 29, tilesetIdx: 0, tileSymbol: "ƫ" },
                    "1-29": { x: 1, y: 29, tilesetIdx: 0, tileSymbol: "Ƭ" },
                    "2-29": { x: 2, y: 29, tilesetIdx: 0, tileSymbol: "ƭ" },
                    "3-29": { x: 3, y: 29, tilesetIdx: 0, tileSymbol: "Ʈ" },
                    "4-29": { x: 4, y: 29, tilesetIdx: 0, tileSymbol: "Ư" },
                    "5-29": { x: 5, y: 29, tilesetIdx: 0, tileSymbol: "ư" },
                    "6-29": { x: 6, y: 29, tilesetIdx: 0, tileSymbol: "Ʊ" },
                    "7-29": { x: 7, y: 29, tilesetIdx: 0, tileSymbol: "Ʋ" },
                    "0-30": { x: 0, y: 30, tilesetIdx: 0, tileSymbol: "Ƴ" },
                    "1-30": { x: 1, y: 30, tilesetIdx: 0, tileSymbol: "ƴ" },
                    "2-30": { x: 2, y: 30, tilesetIdx: 0, tileSymbol: "Ƶ" },
                    "3-30": { x: 3, y: 30, tilesetIdx: 0, tileSymbol: "ƶ" },
                    "4-30": { x: 4, y: 30, tilesetIdx: 0, tileSymbol: "Ʒ" },
                    "5-30": { x: 5, y: 30, tilesetIdx: 0, tileSymbol: "Ƹ" },
                    "6-30": { x: 6, y: 30, tilesetIdx: 0, tileSymbol: "ƹ" },
                    "7-30": { x: 7, y: 30, tilesetIdx: 0, tileSymbol: "ƺ" },
                    "0-31": { x: 0, y: 31, tilesetIdx: 0, tileSymbol: "ƻ" },
                    "1-31": { x: 1, y: 31, tilesetIdx: 0, tileSymbol: "Ƽ" },
                    "2-31": { x: 2, y: 31, tilesetIdx: 0, tileSymbol: "ƽ" },
                    "3-31": { x: 3, y: 31, tilesetIdx: 0, tileSymbol: "ƾ" },
                    "4-31": { x: 4, y: 31, tilesetIdx: 0, tileSymbol: "ƿ" },
                    "5-31": { x: 5, y: 31, tilesetIdx: 0, tileSymbol: "ǀ" },
                    "6-31": { x: 6, y: 31, tilesetIdx: 0, tileSymbol: "ǁ" },
                    "7-31": { x: 7, y: 31, tilesetIdx: 0, tileSymbol: "ǂ" },
                    "0-32": { x: 0, y: 32, tilesetIdx: 0, tileSymbol: "ǃ" },
                    "1-32": { x: 1, y: 32, tilesetIdx: 0, tileSymbol: "Ǆ" },
                    "2-32": { x: 2, y: 32, tilesetIdx: 0, tileSymbol: "ǅ" },
                    "3-32": { x: 3, y: 32, tilesetIdx: 0, tileSymbol: "ǆ" },
                    "4-32": { x: 4, y: 32, tilesetIdx: 0, tileSymbol: "Ǉ" },
                    "5-32": { x: 5, y: 32, tilesetIdx: 0, tileSymbol: "ǈ" },
                    "6-32": { x: 6, y: 32, tilesetIdx: 0, tileSymbol: "ǉ" },
                    "7-32": { x: 7, y: 32, tilesetIdx: 0, tileSymbol: "Ǌ" },
                    "0-33": { x: 0, y: 33, tilesetIdx: 0, tileSymbol: "ǋ" },
                    "1-33": { x: 1, y: 33, tilesetIdx: 0, tileSymbol: "ǌ" },
                    "2-33": { x: 2, y: 33, tilesetIdx: 0, tileSymbol: "Ǎ" },
                    "3-33": { x: 3, y: 33, tilesetIdx: 0, tileSymbol: "ǎ" },
                    "4-33": { x: 4, y: 33, tilesetIdx: 0, tileSymbol: "Ǐ" },
                    "5-33": { x: 5, y: 33, tilesetIdx: 0, tileSymbol: "ǐ" },
                    "6-33": { x: 6, y: 33, tilesetIdx: 0, tileSymbol: "Ǒ" },
                    "7-33": { x: 7, y: 33, tilesetIdx: 0, tileSymbol: "ǒ" },
                    "0-34": { x: 0, y: 34, tilesetIdx: 0, tileSymbol: "Ǔ" },
                    "1-34": { x: 1, y: 34, tilesetIdx: 0, tileSymbol: "ǔ" },
                    "2-34": { x: 2, y: 34, tilesetIdx: 0, tileSymbol: "Ǖ" },
                    "3-34": { x: 3, y: 34, tilesetIdx: 0, tileSymbol: "ǖ" },
                    "4-34": { x: 4, y: 34, tilesetIdx: 0, tileSymbol: "Ǘ" },
                    "5-34": { x: 5, y: 34, tilesetIdx: 0, tileSymbol: "ǘ" },
                    "6-34": { x: 6, y: 34, tilesetIdx: 0, tileSymbol: "Ǚ" },
                    "7-34": { x: 7, y: 34, tilesetIdx: 0, tileSymbol: "ǚ" },
                    "0-35": { x: 0, y: 35, tilesetIdx: 0, tileSymbol: "Ǜ" },
                    "1-35": { x: 1, y: 35, tilesetIdx: 0, tileSymbol: "ǜ" },
                    "2-35": { x: 2, y: 35, tilesetIdx: 0, tileSymbol: "ǝ" },
                    "3-35": { x: 3, y: 35, tilesetIdx: 0, tileSymbol: "Ǟ" },
                    "4-35": { x: 4, y: 35, tilesetIdx: 0, tileSymbol: "ǟ" },
                    "5-35": { x: 5, y: 35, tilesetIdx: 0, tileSymbol: "Ǡ" },
                    "6-35": { x: 6, y: 35, tilesetIdx: 0, tileSymbol: "ǡ" },
                    "7-35": { x: 7, y: 35, tilesetIdx: 0, tileSymbol: "Ǣ" },
                    "0-36": { x: 0, y: 36, tilesetIdx: 0, tileSymbol: "ǣ" },
                    "1-36": { x: 1, y: 36, tilesetIdx: 0, tileSymbol: "Ǥ" },
                    "2-36": { x: 2, y: 36, tilesetIdx: 0, tileSymbol: "ǥ" },
                    "3-36": { x: 3, y: 36, tilesetIdx: 0, tileSymbol: "Ǧ" },
                    "4-36": { x: 4, y: 36, tilesetIdx: 0, tileSymbol: "ǧ" },
                    "5-36": { x: 5, y: 36, tilesetIdx: 0, tileSymbol: "Ǩ" },
                    "6-36": { x: 6, y: 36, tilesetIdx: 0, tileSymbol: "ǩ" },
                    "7-36": { x: 7, y: 36, tilesetIdx: 0, tileSymbol: "Ǫ" },
                    "0-37": { x: 0, y: 37, tilesetIdx: 0, tileSymbol: "ǫ" },
                    "1-37": { x: 1, y: 37, tilesetIdx: 0, tileSymbol: "Ǭ" },
                    "2-37": { x: 2, y: 37, tilesetIdx: 0, tileSymbol: "ǭ" },
                    "3-37": { x: 3, y: 37, tilesetIdx: 0, tileSymbol: "Ǯ" },
                    "4-37": { x: 4, y: 37, tilesetIdx: 0, tileSymbol: "ǯ" },
                    "5-37": { x: 5, y: 37, tilesetIdx: 0, tileSymbol: "ǰ" },
                    "6-37": { x: 6, y: 37, tilesetIdx: 0, tileSymbol: "Ǳ" },
                    "7-37": { x: 7, y: 37, tilesetIdx: 0, tileSymbol: "ǲ" },
                    "0-38": { x: 0, y: 38, tilesetIdx: 0, tileSymbol: "ǳ" },
                    "1-38": { x: 1, y: 38, tilesetIdx: 0, tileSymbol: "Ǵ" },
                    "2-38": { x: 2, y: 38, tilesetIdx: 0, tileSymbol: "ǵ" },
                    "3-38": { x: 3, y: 38, tilesetIdx: 0, tileSymbol: "Ƕ" },
                    "4-38": { x: 4, y: 38, tilesetIdx: 0, tileSymbol: "Ƿ" },
                    "5-38": { x: 5, y: 38, tilesetIdx: 0, tileSymbol: "Ǹ" },
                    "6-38": { x: 6, y: 38, tilesetIdx: 0, tileSymbol: "ǹ" },
                    "7-38": { x: 7, y: 38, tilesetIdx: 0, tileSymbol: "Ǻ" },
                    "0-39": { x: 0, y: 39, tilesetIdx: 0, tileSymbol: "ǻ" },
                    "1-39": { x: 1, y: 39, tilesetIdx: 0, tileSymbol: "Ǽ" },
                    "2-39": { x: 2, y: 39, tilesetIdx: 0, tileSymbol: "ǽ" },
                    "3-39": { x: 3, y: 39, tilesetIdx: 0, tileSymbol: "Ǿ" },
                    "4-39": { x: 4, y: 39, tilesetIdx: 0, tileSymbol: "ǿ" },
                    "5-39": { x: 5, y: 39, tilesetIdx: 0, tileSymbol: "Ȁ" },
                    "6-39": { x: 6, y: 39, tilesetIdx: 0, tileSymbol: "ȁ" },
                    "7-39": { x: 7, y: 39, tilesetIdx: 0, tileSymbol: "Ȃ" },
                    "0-40": { x: 0, y: 40, tilesetIdx: 0, tileSymbol: "ȃ" },
                    "1-40": { x: 1, y: 40, tilesetIdx: 0, tileSymbol: "Ȅ" },
                    "2-40": { x: 2, y: 40, tilesetIdx: 0, tileSymbol: "ȅ" },
                    "3-40": { x: 3, y: 40, tilesetIdx: 0, tileSymbol: "Ȇ" },
                    "4-40": { x: 4, y: 40, tilesetIdx: 0, tileSymbol: "ȇ" },
                    "5-40": { x: 5, y: 40, tilesetIdx: 0, tileSymbol: "Ȉ" },
                    "6-40": { x: 6, y: 40, tilesetIdx: 0, tileSymbol: "ȉ" },
                    "7-40": { x: 7, y: 40, tilesetIdx: 0, tileSymbol: "Ȋ" },
                    "0-41": { x: 0, y: 41, tilesetIdx: 0, tileSymbol: "ȋ" },
                    "1-41": { x: 1, y: 41, tilesetIdx: 0, tileSymbol: "Ȍ" },
                    "2-41": { x: 2, y: 41, tilesetIdx: 0, tileSymbol: "ȍ" },
                    "3-41": { x: 3, y: 41, tilesetIdx: 0, tileSymbol: "Ȏ" },
                    "4-41": { x: 4, y: 41, tilesetIdx: 0, tileSymbol: "ȏ" },
                    "5-41": { x: 5, y: 41, tilesetIdx: 0, tileSymbol: "Ȑ" },
                    "6-41": { x: 6, y: 41, tilesetIdx: 0, tileSymbol: "ȑ" },
                    "7-41": { x: 7, y: 41, tilesetIdx: 0, tileSymbol: "Ȓ" },
                    "0-42": { x: 0, y: 42, tilesetIdx: 0, tileSymbol: "ȓ" },
                    "1-42": { x: 1, y: 42, tilesetIdx: 0, tileSymbol: "Ȕ" },
                    "2-42": { x: 2, y: 42, tilesetIdx: 0, tileSymbol: "ȕ" },
                    "3-42": { x: 3, y: 42, tilesetIdx: 0, tileSymbol: "Ȗ" },
                    "4-42": { x: 4, y: 42, tilesetIdx: 0, tileSymbol: "ȗ" },
                    "5-42": { x: 5, y: 42, tilesetIdx: 0, tileSymbol: "Ș" },
                    "6-42": { x: 6, y: 42, tilesetIdx: 0, tileSymbol: "ș" },
                    "7-42": { x: 7, y: 42, tilesetIdx: 0, tileSymbol: "Ț" },
                    "0-43": { x: 0, y: 43, tilesetIdx: 0, tileSymbol: "ț" },
                    "1-43": { x: 1, y: 43, tilesetIdx: 0, tileSymbol: "Ȝ" },
                    "2-43": { x: 2, y: 43, tilesetIdx: 0, tileSymbol: "ȝ" },
                    "3-43": { x: 3, y: 43, tilesetIdx: 0, tileSymbol: "Ȟ" },
                    "4-43": { x: 4, y: 43, tilesetIdx: 0, tileSymbol: "ȟ" },
                    "5-43": { x: 5, y: 43, tilesetIdx: 0, tileSymbol: "Ƞ" },
                    "6-43": { x: 6, y: 43, tilesetIdx: 0, tileSymbol: "ȡ" },
                    "7-43": { x: 7, y: 43, tilesetIdx: 0, tileSymbol: "Ȣ" },
                    "0-44": { x: 0, y: 44, tilesetIdx: 0, tileSymbol: "ȣ" },
                    "1-44": { x: 1, y: 44, tilesetIdx: 0, tileSymbol: "Ȥ" },
                    "2-44": { x: 2, y: 44, tilesetIdx: 0, tileSymbol: "ȥ" },
                    "3-44": { x: 3, y: 44, tilesetIdx: 0, tileSymbol: "Ȧ" },
                    "4-44": { x: 4, y: 44, tilesetIdx: 0, tileSymbol: "ȧ" },
                    "5-44": { x: 5, y: 44, tilesetIdx: 0, tileSymbol: "Ȩ" },
                    "6-44": { x: 6, y: 44, tilesetIdx: 0, tileSymbol: "ȩ" },
                    "7-44": { x: 7, y: 44, tilesetIdx: 0, tileSymbol: "Ȫ" },
                    "0-45": { x: 0, y: 45, tilesetIdx: 0, tileSymbol: "ȫ" },
                    "1-45": { x: 1, y: 45, tilesetIdx: 0, tileSymbol: "Ȭ" },
                    "2-45": { x: 2, y: 45, tilesetIdx: 0, tileSymbol: "ȭ" },
                    "3-45": { x: 3, y: 45, tilesetIdx: 0, tileSymbol: "Ȯ" },
                    "4-45": { x: 4, y: 45, tilesetIdx: 0, tileSymbol: "ȯ" },
                    "5-45": { x: 5, y: 45, tilesetIdx: 0, tileSymbol: "Ȱ" },
                    "6-45": { x: 6, y: 45, tilesetIdx: 0, tileSymbol: "ȱ" },
                    "7-45": { x: 7, y: 45, tilesetIdx: 0, tileSymbol: "Ȳ" },
                    "0-46": { x: 0, y: 46, tilesetIdx: 0, tileSymbol: "ȳ" },
                    "1-46": { x: 1, y: 46, tilesetIdx: 0, tileSymbol: "ȴ" },
                    "2-46": { x: 2, y: 46, tilesetIdx: 0, tileSymbol: "ȵ" },
                    "3-46": { x: 3, y: 46, tilesetIdx: 0, tileSymbol: "ȶ" },
                    "4-46": { x: 4, y: 46, tilesetIdx: 0, tileSymbol: "ȷ" },
                    "5-46": { x: 5, y: 46, tilesetIdx: 0, tileSymbol: "ȸ" },
                    "6-46": { x: 6, y: 46, tilesetIdx: 0, tileSymbol: "ȹ" },
                    "7-46": { x: 7, y: 46, tilesetIdx: 0, tileSymbol: "Ⱥ" },
                    "0-47": { x: 0, y: 47, tilesetIdx: 0, tileSymbol: "Ȼ" },
                    "1-47": { x: 1, y: 47, tilesetIdx: 0, tileSymbol: "ȼ" },
                    "2-47": { x: 2, y: 47, tilesetIdx: 0, tileSymbol: "Ƚ" },
                    "3-47": { x: 3, y: 47, tilesetIdx: 0, tileSymbol: "Ⱦ" },
                    "4-47": { x: 4, y: 47, tilesetIdx: 0, tileSymbol: "ȿ" },
                    "5-47": { x: 5, y: 47, tilesetIdx: 0, tileSymbol: "ɀ" },
                    "6-47": { x: 6, y: 47, tilesetIdx: 0, tileSymbol: "Ɂ" },
                    "7-47": { x: 7, y: 47, tilesetIdx: 0, tileSymbol: "ɂ" },
                    "0-48": { x: 0, y: 48, tilesetIdx: 0, tileSymbol: "Ƀ" },
                    "1-48": { x: 1, y: 48, tilesetIdx: 0, tileSymbol: "Ʉ" },
                    "2-48": { x: 2, y: 48, tilesetIdx: 0, tileSymbol: "Ʌ" },
                    "3-48": { x: 3, y: 48, tilesetIdx: 0, tileSymbol: "Ɇ" },
                    "4-48": { x: 4, y: 48, tilesetIdx: 0, tileSymbol: "ɇ" },
                    "5-48": { x: 5, y: 48, tilesetIdx: 0, tileSymbol: "Ɉ" },
                    "6-48": { x: 6, y: 48, tilesetIdx: 0, tileSymbol: "ɉ" },
                    "7-48": { x: 7, y: 48, tilesetIdx: 0, tileSymbol: "Ɋ" },
                    "0-49": { x: 0, y: 49, tilesetIdx: 0, tileSymbol: "ɋ" },
                    "1-49": { x: 1, y: 49, tilesetIdx: 0, tileSymbol: "Ɍ" },
                    "2-49": { x: 2, y: 49, tilesetIdx: 0, tileSymbol: "ɍ" },
                    "3-49": { x: 3, y: 49, tilesetIdx: 0, tileSymbol: "Ɏ" },
                    "4-49": { x: 4, y: 49, tilesetIdx: 0, tileSymbol: "ɏ" },
                    "5-49": { x: 5, y: 49, tilesetIdx: 0, tileSymbol: "ɐ" },
                    "6-49": { x: 6, y: 49, tilesetIdx: 0, tileSymbol: "ɑ" },
                    "7-49": { x: 7, y: 49, tilesetIdx: 0, tileSymbol: "ɒ" },
                    "0-50": { x: 0, y: 50, tilesetIdx: 0, tileSymbol: "ɓ" },
                    "1-50": { x: 1, y: 50, tilesetIdx: 0, tileSymbol: "ɔ" },
                    "2-50": { x: 2, y: 50, tilesetIdx: 0, tileSymbol: "ɕ" },
                    "3-50": { x: 3, y: 50, tilesetIdx: 0, tileSymbol: "ɖ" },
                    "4-50": { x: 4, y: 50, tilesetIdx: 0, tileSymbol: "ɗ" },
                    "5-50": { x: 5, y: 50, tilesetIdx: 0, tileSymbol: "ɘ" },
                    "6-50": { x: 6, y: 50, tilesetIdx: 0, tileSymbol: "ə" },
                    "7-50": { x: 7, y: 50, tilesetIdx: 0, tileSymbol: "ɚ" },
                    "0-51": { x: 0, y: 51, tilesetIdx: 0, tileSymbol: "ɛ" },
                    "1-51": { x: 1, y: 51, tilesetIdx: 0, tileSymbol: "ɜ" },
                    "2-51": { x: 2, y: 51, tilesetIdx: 0, tileSymbol: "ɝ" },
                    "3-51": { x: 3, y: 51, tilesetIdx: 0, tileSymbol: "ɞ" },
                    "4-51": { x: 4, y: 51, tilesetIdx: 0, tileSymbol: "ɟ" },
                    "5-51": { x: 5, y: 51, tilesetIdx: 0, tileSymbol: "ɠ" },
                    "6-51": { x: 6, y: 51, tilesetIdx: 0, tileSymbol: "ɡ" },
                    "7-51": { x: 7, y: 51, tilesetIdx: 0, tileSymbol: "ɢ" },
                    "0-52": { x: 0, y: 52, tilesetIdx: 0, tileSymbol: "ɣ" },
                    "1-52": { x: 1, y: 52, tilesetIdx: 0, tileSymbol: "ɤ" },
                    "2-52": { x: 2, y: 52, tilesetIdx: 0, tileSymbol: "ɥ" },
                    "3-52": { x: 3, y: 52, tilesetIdx: 0, tileSymbol: "ɦ" },
                    "4-52": { x: 4, y: 52, tilesetIdx: 0, tileSymbol: "ɧ" },
                    "5-52": { x: 5, y: 52, tilesetIdx: 0, tileSymbol: "ɨ" },
                    "6-52": { x: 6, y: 52, tilesetIdx: 0, tileSymbol: "ɩ" },
                    "7-52": { x: 7, y: 52, tilesetIdx: 0, tileSymbol: "ɪ" },
                    "0-53": { x: 0, y: 53, tilesetIdx: 0, tileSymbol: "ɫ" },
                    "1-53": { x: 1, y: 53, tilesetIdx: 0, tileSymbol: "ɬ" },
                    "2-53": { x: 2, y: 53, tilesetIdx: 0, tileSymbol: "ɭ" },
                    "3-53": { x: 3, y: 53, tilesetIdx: 0, tileSymbol: "ɮ" },
                    "4-53": { x: 4, y: 53, tilesetIdx: 0, tileSymbol: "ɯ" },
                    "5-53": { x: 5, y: 53, tilesetIdx: 0, tileSymbol: "ɰ" },
                    "6-53": { x: 6, y: 53, tilesetIdx: 0, tileSymbol: "ɱ" },
                    "7-53": { x: 7, y: 53, tilesetIdx: 0, tileSymbol: "ɲ" },
                    "0-54": { x: 0, y: 54, tilesetIdx: 0, tileSymbol: "ɳ" },
                    "1-54": { x: 1, y: 54, tilesetIdx: 0, tileSymbol: "ɴ" },
                    "2-54": { x: 2, y: 54, tilesetIdx: 0, tileSymbol: "ɵ" },
                    "3-54": { x: 3, y: 54, tilesetIdx: 0, tileSymbol: "ɶ" },
                    "4-54": { x: 4, y: 54, tilesetIdx: 0, tileSymbol: "ɷ" },
                    "5-54": { x: 5, y: 54, tilesetIdx: 0, tileSymbol: "ɸ" },
                    "6-54": { x: 6, y: 54, tilesetIdx: 0, tileSymbol: "ɹ" },
                    "7-54": { x: 7, y: 54, tilesetIdx: 0, tileSymbol: "ɺ" },
                    "0-55": { x: 0, y: 55, tilesetIdx: 0, tileSymbol: "ɻ" },
                    "1-55": { x: 1, y: 55, tilesetIdx: 0, tileSymbol: "ɼ" },
                    "2-55": { x: 2, y: 55, tilesetIdx: 0, tileSymbol: "ɽ" },
                    "3-55": { x: 3, y: 55, tilesetIdx: 0, tileSymbol: "ɾ" },
                    "4-55": { x: 4, y: 55, tilesetIdx: 0, tileSymbol: "ɿ" },
                    "5-55": { x: 5, y: 55, tilesetIdx: 0, tileSymbol: "ʀ" },
                    "6-55": { x: 6, y: 55, tilesetIdx: 0, tileSymbol: "ʁ" },
                    "7-55": { x: 7, y: 55, tilesetIdx: 0, tileSymbol: "ʂ" },
                    "0-56": { x: 0, y: 56, tilesetIdx: 0, tileSymbol: "ʃ" },
                    "1-56": { x: 1, y: 56, tilesetIdx: 0, tileSymbol: "ʄ" },
                    "2-56": { x: 2, y: 56, tilesetIdx: 0, tileSymbol: "ʅ" },
                    "3-56": { x: 3, y: 56, tilesetIdx: 0, tileSymbol: "ʆ" },
                    "4-56": { x: 4, y: 56, tilesetIdx: 0, tileSymbol: "ʇ" },
                    "5-56": { x: 5, y: 56, tilesetIdx: 0, tileSymbol: "ʈ" },
                    "6-56": { x: 6, y: 56, tilesetIdx: 0, tileSymbol: "ʉ" },
                    "7-56": { x: 7, y: 56, tilesetIdx: 0, tileSymbol: "ʊ" },
                    "0-57": { x: 0, y: 57, tilesetIdx: 0, tileSymbol: "ʋ" },
                    "1-57": { x: 1, y: 57, tilesetIdx: 0, tileSymbol: "ʌ" },
                    "2-57": { x: 2, y: 57, tilesetIdx: 0, tileSymbol: "ʍ" },
                    "3-57": { x: 3, y: 57, tilesetIdx: 0, tileSymbol: "ʎ" },
                    "4-57": { x: 4, y: 57, tilesetIdx: 0, tileSymbol: "ʏ" },
                    "5-57": { x: 5, y: 57, tilesetIdx: 0, tileSymbol: "ʐ" },
                    "6-57": { x: 6, y: 57, tilesetIdx: 0, tileSymbol: "ʑ" },
                    "7-57": { x: 7, y: 57, tilesetIdx: 0, tileSymbol: "ʒ" },
                    "0-58": { x: 0, y: 58, tilesetIdx: 0, tileSymbol: "ʓ" },
                    "1-58": { x: 1, y: 58, tilesetIdx: 0, tileSymbol: "ʔ" },
                    "2-58": { x: 2, y: 58, tilesetIdx: 0, tileSymbol: "ʕ" },
                    "3-58": { x: 3, y: 58, tilesetIdx: 0, tileSymbol: "ʖ" },
                    "4-58": { x: 4, y: 58, tilesetIdx: 0, tileSymbol: "ʗ" },
                    "5-58": { x: 5, y: 58, tilesetIdx: 0, tileSymbol: "ʘ" },
                    "6-58": { x: 6, y: 58, tilesetIdx: 0, tileSymbol: "ʙ" },
                    "7-58": { x: 7, y: 58, tilesetIdx: 0, tileSymbol: "ʚ" },
                    "0-59": { x: 0, y: 59, tilesetIdx: 0, tileSymbol: "ʛ" },
                    "1-59": { x: 1, y: 59, tilesetIdx: 0, tileSymbol: "ʜ" },
                    "2-59": { x: 2, y: 59, tilesetIdx: 0, tileSymbol: "ʝ" },
                    "3-59": { x: 3, y: 59, tilesetIdx: 0, tileSymbol: "ʞ" },
                    "4-59": { x: 4, y: 59, tilesetIdx: 0, tileSymbol: "ʟ" },
                    "5-59": { x: 5, y: 59, tilesetIdx: 0, tileSymbol: "ʠ" },
                    "6-59": { x: 6, y: 59, tilesetIdx: 0, tileSymbol: "ʡ" },
                    "7-59": { x: 7, y: 59, tilesetIdx: 0, tileSymbol: "ʢ" },
                    "0-60": { x: 0, y: 60, tilesetIdx: 0, tileSymbol: "ʣ" },
                    "1-60": { x: 1, y: 60, tilesetIdx: 0, tileSymbol: "ʤ" },
                    "2-60": { x: 2, y: 60, tilesetIdx: 0, tileSymbol: "ʥ" },
                    "3-60": { x: 3, y: 60, tilesetIdx: 0, tileSymbol: "ʦ" },
                    "4-60": { x: 4, y: 60, tilesetIdx: 0, tileSymbol: "ʧ" },
                    "5-60": { x: 5, y: 60, tilesetIdx: 0, tileSymbol: "ʨ" },
                    "6-60": { x: 6, y: 60, tilesetIdx: 0, tileSymbol: "ʩ" },
                    "7-60": { x: 7, y: 60, tilesetIdx: 0, tileSymbol: "ʪ" },
                    "0-61": { x: 0, y: 61, tilesetIdx: 0, tileSymbol: "ʫ" },
                    "1-61": { x: 1, y: 61, tilesetIdx: 0, tileSymbol: "ʬ" },
                    "2-61": { x: 2, y: 61, tilesetIdx: 0, tileSymbol: "ʭ" },
                    "3-61": { x: 3, y: 61, tilesetIdx: 0, tileSymbol: "ʮ" },
                    "4-61": { x: 4, y: 61, tilesetIdx: 0, tileSymbol: "ʯ" },
                    "5-61": { x: 5, y: 61, tilesetIdx: 0, tileSymbol: "ʰ" },
                    "6-61": { x: 6, y: 61, tilesetIdx: 0, tileSymbol: "ʱ" },
                    "7-61": { x: 7, y: 61, tilesetIdx: 0, tileSymbol: "ʲ" },
                    "0-62": { x: 0, y: 62, tilesetIdx: 0, tileSymbol: "ʳ" },
                    "1-62": { x: 1, y: 62, tilesetIdx: 0, tileSymbol: "ʴ" },
                    "2-62": { x: 2, y: 62, tilesetIdx: 0, tileSymbol: "ʵ" },
                    "3-62": { x: 3, y: 62, tilesetIdx: 0, tileSymbol: "ʶ" },
                    "4-62": { x: 4, y: 62, tilesetIdx: 0, tileSymbol: "ʷ" },
                    "5-62": { x: 5, y: 62, tilesetIdx: 0, tileSymbol: "ʸ" },
                    "6-62": { x: 6, y: 62, tilesetIdx: 0, tileSymbol: "ʹ" },
                    "7-62": { x: 7, y: 62, tilesetIdx: 0, tileSymbol: "ʺ" },
                    "0-63": { x: 0, y: 63, tilesetIdx: 0, tileSymbol: "ʻ" },
                    "1-63": { x: 1, y: 63, tilesetIdx: 0, tileSymbol: "ʼ" },
                    "2-63": { x: 2, y: 63, tilesetIdx: 0, tileSymbol: "ʽ" },
                    "3-63": { x: 3, y: 63, tilesetIdx: 0, tileSymbol: "ʾ" },
                    "4-63": { x: 4, y: 63, tilesetIdx: 0, tileSymbol: "ʿ" },
                    "5-63": { x: 5, y: 63, tilesetIdx: 0, tileSymbol: "ˀ" },
                    "6-63": { x: 6, y: 63, tilesetIdx: 0, tileSymbol: "ˁ" },
                    "7-63": { x: 7, y: 63, tilesetIdx: 0, tileSymbol: "˂" },
                    "0-64": { x: 0, y: 64, tilesetIdx: 0, tileSymbol: "˃" },
                    "1-64": { x: 1, y: 64, tilesetIdx: 0, tileSymbol: "˄" },
                    "2-64": { x: 2, y: 64, tilesetIdx: 0, tileSymbol: "˅" },
                    "3-64": { x: 3, y: 64, tilesetIdx: 0, tileSymbol: "ˆ" },
                    "4-64": { x: 4, y: 64, tilesetIdx: 0, tileSymbol: "ˇ" },
                    "5-64": { x: 5, y: 64, tilesetIdx: 0, tileSymbol: "ˈ" },
                    "6-64": { x: 6, y: 64, tilesetIdx: 0, tileSymbol: "ˉ" },
                    "7-64": { x: 7, y: 64, tilesetIdx: 0, tileSymbol: "ˊ" },
                    "0-65": { x: 0, y: 65, tilesetIdx: 0, tileSymbol: "ˋ" },
                    "1-65": { x: 1, y: 65, tilesetIdx: 0, tileSymbol: "ˌ" },
                    "2-65": { x: 2, y: 65, tilesetIdx: 0, tileSymbol: "ˍ" },
                    "3-65": { x: 3, y: 65, tilesetIdx: 0, tileSymbol: "ˎ" },
                    "4-65": { x: 4, y: 65, tilesetIdx: 0, tileSymbol: "ˏ" },
                    "5-65": { x: 5, y: 65, tilesetIdx: 0, tileSymbol: "ː" },
                    "6-65": { x: 6, y: 65, tilesetIdx: 0, tileSymbol: "ˑ" },
                    "7-65": { x: 7, y: 65, tilesetIdx: 0, tileSymbol: "˒" },
                    "0-66": { x: 0, y: 66, tilesetIdx: 0, tileSymbol: "˓" },
                    "1-66": { x: 1, y: 66, tilesetIdx: 0, tileSymbol: "˔" },
                    "2-66": { x: 2, y: 66, tilesetIdx: 0, tileSymbol: "˕" },
                    "3-66": { x: 3, y: 66, tilesetIdx: 0, tileSymbol: "˖" },
                    "4-66": { x: 4, y: 66, tilesetIdx: 0, tileSymbol: "˗" },
                    "5-66": { x: 5, y: 66, tilesetIdx: 0, tileSymbol: "˘" },
                    "6-66": { x: 6, y: 66, tilesetIdx: 0, tileSymbol: "˙" },
                    "7-66": { x: 7, y: 66, tilesetIdx: 0, tileSymbol: "˚" },
                    "0-67": { x: 0, y: 67, tilesetIdx: 0, tileSymbol: "˛" },
                    "1-67": { x: 1, y: 67, tilesetIdx: 0, tileSymbol: "˜" },
                    "2-67": { x: 2, y: 67, tilesetIdx: 0, tileSymbol: "˝" },
                    "3-67": { x: 3, y: 67, tilesetIdx: 0, tileSymbol: "˞" },
                    "4-67": { x: 4, y: 67, tilesetIdx: 0, tileSymbol: "˟" },
                    "5-67": { x: 5, y: 67, tilesetIdx: 0, tileSymbol: "ˠ" },
                    "6-67": { x: 6, y: 67, tilesetIdx: 0, tileSymbol: "ˡ" },
                    "7-67": { x: 7, y: 67, tilesetIdx: 0, tileSymbol: "ˢ" },
                    "0-68": { x: 0, y: 68, tilesetIdx: 0, tileSymbol: "ˣ" },
                    "1-68": { x: 1, y: 68, tilesetIdx: 0, tileSymbol: "ˤ" },
                    "2-68": { x: 2, y: 68, tilesetIdx: 0, tileSymbol: "˥" },
                    "3-68": { x: 3, y: 68, tilesetIdx: 0, tileSymbol: "˦" },
                    "4-68": { x: 4, y: 68, tilesetIdx: 0, tileSymbol: "˧" },
                    "5-68": { x: 5, y: 68, tilesetIdx: 0, tileSymbol: "˨" },
                    "6-68": { x: 6, y: 68, tilesetIdx: 0, tileSymbol: "˩" },
                    "7-68": { x: 7, y: 68, tilesetIdx: 0, tileSymbol: "˪" },
                    "0-69": { x: 0, y: 69, tilesetIdx: 0, tileSymbol: "˫" },
                    "1-69": { x: 1, y: 69, tilesetIdx: 0, tileSymbol: "ˬ" },
                    "2-69": { x: 2, y: 69, tilesetIdx: 0, tileSymbol: "˭" },
                    "3-69": { x: 3, y: 69, tilesetIdx: 0, tileSymbol: "ˮ" },
                    "4-69": { x: 4, y: 69, tilesetIdx: 0, tileSymbol: "˯" },
                    "5-69": { x: 5, y: 69, tilesetIdx: 0, tileSymbol: "˰" },
                    "6-69": { x: 6, y: 69, tilesetIdx: 0, tileSymbol: "˱" },
                    "7-69": { x: 7, y: 69, tilesetIdx: 0, tileSymbol: "˲" },
                    "0-70": { x: 0, y: 70, tilesetIdx: 0, tileSymbol: "˳" },
                    "1-70": { x: 1, y: 70, tilesetIdx: 0, tileSymbol: "˴" },
                    "2-70": { x: 2, y: 70, tilesetIdx: 0, tileSymbol: "˵" },
                    "3-70": { x: 3, y: 70, tilesetIdx: 0, tileSymbol: "˶" },
                    "4-70": { x: 4, y: 70, tilesetIdx: 0, tileSymbol: "˷" },
                    "5-70": { x: 5, y: 70, tilesetIdx: 0, tileSymbol: "˸" },
                    "6-70": { x: 6, y: 70, tilesetIdx: 0, tileSymbol: "˹" },
                    "7-70": { x: 7, y: 70, tilesetIdx: 0, tileSymbol: "˺" },
                    "0-71": { x: 0, y: 71, tilesetIdx: 0, tileSymbol: "˻" },
                    "1-71": { x: 1, y: 71, tilesetIdx: 0, tileSymbol: "˼" },
                    "2-71": { x: 2, y: 71, tilesetIdx: 0, tileSymbol: "˽" },
                    "3-71": { x: 3, y: 71, tilesetIdx: 0, tileSymbol: "˾" },
                    "4-71": { x: 4, y: 71, tilesetIdx: 0, tileSymbol: "˿" },
                    "5-71": { x: 5, y: 71, tilesetIdx: 0, tileSymbol: "̀" },
                    "6-71": { x: 6, y: 71, tilesetIdx: 0, tileSymbol: "́" },
                    "7-71": { x: 7, y: 71, tilesetIdx: 0, tileSymbol: "̂" },
                    "0-72": { x: 0, y: 72, tilesetIdx: 0, tileSymbol: "̃" },
                    "1-72": { x: 1, y: 72, tilesetIdx: 0, tileSymbol: "̄" },
                    "2-72": { x: 2, y: 72, tilesetIdx: 0, tileSymbol: "̅" },
                    "3-72": { x: 3, y: 72, tilesetIdx: 0, tileSymbol: "̆" },
                    "4-72": { x: 4, y: 72, tilesetIdx: 0, tileSymbol: "̇" },
                    "5-72": { x: 5, y: 72, tilesetIdx: 0, tileSymbol: "̈" },
                    "6-72": { x: 6, y: 72, tilesetIdx: 0, tileSymbol: "̉" },
                    "7-72": { x: 7, y: 72, tilesetIdx: 0, tileSymbol: "̊" },
                    "0-73": { x: 0, y: 73, tilesetIdx: 0, tileSymbol: "̋" },
                    "1-73": { x: 1, y: 73, tilesetIdx: 0, tileSymbol: "̌" },
                    "2-73": { x: 2, y: 73, tilesetIdx: 0, tileSymbol: "̍" },
                    "3-73": { x: 3, y: 73, tilesetIdx: 0, tileSymbol: "̎" },
                    "4-73": { x: 4, y: 73, tilesetIdx: 0, tileSymbol: "̏" },
                    "5-73": { x: 5, y: 73, tilesetIdx: 0, tileSymbol: "̐" },
                    "6-73": { x: 6, y: 73, tilesetIdx: 0, tileSymbol: "̑" },
                    "7-73": { x: 7, y: 73, tilesetIdx: 0, tileSymbol: "̒" },
                    "0-74": { x: 0, y: 74, tilesetIdx: 0, tileSymbol: "̓" },
                    "1-74": { x: 1, y: 74, tilesetIdx: 0, tileSymbol: "̔" },
                    "2-74": { x: 2, y: 74, tilesetIdx: 0, tileSymbol: "̕" },
                    "3-74": { x: 3, y: 74, tilesetIdx: 0, tileSymbol: "̖" },
                    "4-74": { x: 4, y: 74, tilesetIdx: 0, tileSymbol: "̗" },
                    "5-74": { x: 5, y: 74, tilesetIdx: 0, tileSymbol: "̘" },
                    "6-74": { x: 6, y: 74, tilesetIdx: 0, tileSymbol: "̙" },
                    "7-74": { x: 7, y: 74, tilesetIdx: 0, tileSymbol: "̚" },
                    "0-75": { x: 0, y: 75, tilesetIdx: 0, tileSymbol: "̛" },
                    "1-75": { x: 1, y: 75, tilesetIdx: 0, tileSymbol: "̜" },
                    "2-75": { x: 2, y: 75, tilesetIdx: 0, tileSymbol: "̝" },
                    "3-75": { x: 3, y: 75, tilesetIdx: 0, tileSymbol: "̞" },
                    "4-75": { x: 4, y: 75, tilesetIdx: 0, tileSymbol: "̟" },
                    "5-75": { x: 5, y: 75, tilesetIdx: 0, tileSymbol: "̠" },
                    "6-75": { x: 6, y: 75, tilesetIdx: 0, tileSymbol: "̡" },
                    "7-75": { x: 7, y: 75, tilesetIdx: 0, tileSymbol: "̢" },
                    "0-76": { x: 0, y: 76, tilesetIdx: 0, tileSymbol: "̣" },
                    "1-76": { x: 1, y: 76, tilesetIdx: 0, tileSymbol: "̤" },
                    "2-76": { x: 2, y: 76, tilesetIdx: 0, tileSymbol: "̥" },
                    "3-76": { x: 3, y: 76, tilesetIdx: 0, tileSymbol: "̦" },
                    "4-76": { x: 4, y: 76, tilesetIdx: 0, tileSymbol: "̧" },
                    "5-76": { x: 5, y: 76, tilesetIdx: 0, tileSymbol: "̨" },
                    "6-76": { x: 6, y: 76, tilesetIdx: 0, tileSymbol: "̩" },
                    "7-76": { x: 7, y: 76, tilesetIdx: 0, tileSymbol: "̪" },
                    "0-77": { x: 0, y: 77, tilesetIdx: 0, tileSymbol: "̫" },
                    "1-77": { x: 1, y: 77, tilesetIdx: 0, tileSymbol: "̬" },
                    "2-77": { x: 2, y: 77, tilesetIdx: 0, tileSymbol: "̭" },
                    "3-77": { x: 3, y: 77, tilesetIdx: 0, tileSymbol: "̮" },
                    "4-77": { x: 4, y: 77, tilesetIdx: 0, tileSymbol: "̯" },
                    "5-77": { x: 5, y: 77, tilesetIdx: 0, tileSymbol: "̰" },
                    "6-77": { x: 6, y: 77, tilesetIdx: 0, tileSymbol: "̱" },
                    "7-77": { x: 7, y: 77, tilesetIdx: 0, tileSymbol: "̲" },
                    "0-78": { x: 0, y: 78, tilesetIdx: 0, tileSymbol: "̳" },
                    "1-78": { x: 1, y: 78, tilesetIdx: 0, tileSymbol: "̴" },
                    "2-78": { x: 2, y: 78, tilesetIdx: 0, tileSymbol: "̵" },
                    "3-78": { x: 3, y: 78, tilesetIdx: 0, tileSymbol: "̶" },
                    "4-78": { x: 4, y: 78, tilesetIdx: 0, tileSymbol: "̷" },
                    "5-78": { x: 5, y: 78, tilesetIdx: 0, tileSymbol: "̸" },
                    "6-78": { x: 6, y: 78, tilesetIdx: 0, tileSymbol: "̹" },
                    "7-78": { x: 7, y: 78, tilesetIdx: 0, tileSymbol: "̺" },
                    "0-79": { x: 0, y: 79, tilesetIdx: 0, tileSymbol: "̻" },
                    "1-79": { x: 1, y: 79, tilesetIdx: 0, tileSymbol: "̼" },
                    "2-79": { x: 2, y: 79, tilesetIdx: 0, tileSymbol: "̽" },
                    "3-79": { x: 3, y: 79, tilesetIdx: 0, tileSymbol: "̾" },
                    "4-79": { x: 4, y: 79, tilesetIdx: 0, tileSymbol: "̿" },
                    "5-79": { x: 5, y: 79, tilesetIdx: 0, tileSymbol: "̀" },
                    "6-79": { x: 6, y: 79, tilesetIdx: 0, tileSymbol: "́" },
                    "7-79": { x: 7, y: 79, tilesetIdx: 0, tileSymbol: "͂" },
                    "0-80": { x: 0, y: 80, tilesetIdx: 0, tileSymbol: "̓" },
                    "1-80": { x: 1, y: 80, tilesetIdx: 0, tileSymbol: "̈́" },
                    "2-80": { x: 2, y: 80, tilesetIdx: 0, tileSymbol: "ͅ" },
                    "3-80": { x: 3, y: 80, tilesetIdx: 0, tileSymbol: "͆" },
                    "4-80": { x: 4, y: 80, tilesetIdx: 0, tileSymbol: "͇" },
                    "5-80": { x: 5, y: 80, tilesetIdx: 0, tileSymbol: "͈" },
                    "6-80": { x: 6, y: 80, tilesetIdx: 0, tileSymbol: "͉" },
                    "7-80": { x: 7, y: 80, tilesetIdx: 0, tileSymbol: "͊" },
                    "0-81": { x: 0, y: 81, tilesetIdx: 0, tileSymbol: "͋" },
                    "1-81": { x: 1, y: 81, tilesetIdx: 0, tileSymbol: "͌" },
                    "2-81": { x: 2, y: 81, tilesetIdx: 0, tileSymbol: "͍" },
                    "3-81": { x: 3, y: 81, tilesetIdx: 0, tileSymbol: "͎" },
                    "4-81": { x: 4, y: 81, tilesetIdx: 0, tileSymbol: "͏" },
                    "5-81": { x: 5, y: 81, tilesetIdx: 0, tileSymbol: "͐" },
                    "6-81": { x: 6, y: 81, tilesetIdx: 0, tileSymbol: "͑" },
                    "7-81": { x: 7, y: 81, tilesetIdx: 0, tileSymbol: "͒" },
                    "0-82": { x: 0, y: 82, tilesetIdx: 0, tileSymbol: "͓" },
                    "1-82": { x: 1, y: 82, tilesetIdx: 0, tileSymbol: "͔" },
                    "2-82": { x: 2, y: 82, tilesetIdx: 0, tileSymbol: "͕" },
                    "3-82": { x: 3, y: 82, tilesetIdx: 0, tileSymbol: "͖" },
                    "4-82": { x: 4, y: 82, tilesetIdx: 0, tileSymbol: "͗" },
                    "5-82": { x: 5, y: 82, tilesetIdx: 0, tileSymbol: "͘" },
                    "6-82": { x: 6, y: 82, tilesetIdx: 0, tileSymbol: "͙" },
                    "7-82": { x: 7, y: 82, tilesetIdx: 0, tileSymbol: "͚" },
                    "0-83": { x: 0, y: 83, tilesetIdx: 0, tileSymbol: "͛" },
                    "1-83": { x: 1, y: 83, tilesetIdx: 0, tileSymbol: "͜" },
                    "2-83": { x: 2, y: 83, tilesetIdx: 0, tileSymbol: "͝" },
                    "3-83": { x: 3, y: 83, tilesetIdx: 0, tileSymbol: "͞" },
                    "4-83": { x: 4, y: 83, tilesetIdx: 0, tileSymbol: "͟" },
                    "5-83": { x: 5, y: 83, tilesetIdx: 0, tileSymbol: "͠" },
                    "6-83": { x: 6, y: 83, tilesetIdx: 0, tileSymbol: "͡" },
                    "7-83": { x: 7, y: 83, tilesetIdx: 0, tileSymbol: "͢" },
                    "0-84": { x: 0, y: 84, tilesetIdx: 0, tileSymbol: "ͣ" },
                    "1-84": { x: 1, y: 84, tilesetIdx: 0, tileSymbol: "ͤ" },
                    "2-84": { x: 2, y: 84, tilesetIdx: 0, tileSymbol: "ͥ" },
                    "3-84": { x: 3, y: 84, tilesetIdx: 0, tileSymbol: "ͦ" },
                    "4-84": { x: 4, y: 84, tilesetIdx: 0, tileSymbol: "ͧ" },
                    "5-84": { x: 5, y: 84, tilesetIdx: 0, tileSymbol: "ͨ" },
                    "6-84": { x: 6, y: 84, tilesetIdx: 0, tileSymbol: "ͩ" },
                    "7-84": { x: 7, y: 84, tilesetIdx: 0, tileSymbol: "ͪ" },
                    "0-85": { x: 0, y: 85, tilesetIdx: 0, tileSymbol: "ͫ" },
                    "1-85": { x: 1, y: 85, tilesetIdx: 0, tileSymbol: "ͬ" },
                    "2-85": { x: 2, y: 85, tilesetIdx: 0, tileSymbol: "ͭ" },
                    "3-85": { x: 3, y: 85, tilesetIdx: 0, tileSymbol: "ͮ" },
                    "4-85": { x: 4, y: 85, tilesetIdx: 0, tileSymbol: "ͯ" },
                    "5-85": { x: 5, y: 85, tilesetIdx: 0, tileSymbol: "Ͱ" },
                    "6-85": { x: 6, y: 85, tilesetIdx: 0, tileSymbol: "ͱ" },
                    "7-85": { x: 7, y: 85, tilesetIdx: 0, tileSymbol: "Ͳ" },
                    "0-86": { x: 0, y: 86, tilesetIdx: 0, tileSymbol: "ͳ" },
                    "1-86": { x: 1, y: 86, tilesetIdx: 0, tileSymbol: "ʹ" },
                    "2-86": { x: 2, y: 86, tilesetIdx: 0, tileSymbol: "͵" },
                    "3-86": { x: 3, y: 86, tilesetIdx: 0, tileSymbol: "Ͷ" },
                    "4-86": { x: 4, y: 86, tilesetIdx: 0, tileSymbol: "ͷ" },
                    "5-86": { x: 5, y: 86, tilesetIdx: 0, tileSymbol: "͸" },
                    "6-86": { x: 6, y: 86, tilesetIdx: 0, tileSymbol: "͹" },
                    "7-86": { x: 7, y: 86, tilesetIdx: 0, tileSymbol: "ͺ" },
                    "0-87": { x: 0, y: 87, tilesetIdx: 0, tileSymbol: "ͻ" },
                    "1-87": { x: 1, y: 87, tilesetIdx: 0, tileSymbol: "ͼ" },
                    "2-87": { x: 2, y: 87, tilesetIdx: 0, tileSymbol: "ͽ" },
                    "3-87": { x: 3, y: 87, tilesetIdx: 0, tileSymbol: ";" },
                    "4-87": { x: 4, y: 87, tilesetIdx: 0, tileSymbol: "Ϳ" },
                    "5-87": { x: 5, y: 87, tilesetIdx: 0, tileSymbol: "΀" },
                    "6-87": { x: 6, y: 87, tilesetIdx: 0, tileSymbol: "΁" },
                    "7-87": { x: 7, y: 87, tilesetIdx: 0, tileSymbol: "΂" },
                    "0-88": { x: 0, y: 88, tilesetIdx: 0, tileSymbol: "΃" },
                    "1-88": { x: 1, y: 88, tilesetIdx: 0, tileSymbol: "΄" },
                    "2-88": { x: 2, y: 88, tilesetIdx: 0, tileSymbol: "΅" },
                    "3-88": { x: 3, y: 88, tilesetIdx: 0, tileSymbol: "Ά" },
                    "4-88": { x: 4, y: 88, tilesetIdx: 0, tileSymbol: "·" },
                    "5-88": { x: 5, y: 88, tilesetIdx: 0, tileSymbol: "Έ" },
                    "6-88": { x: 6, y: 88, tilesetIdx: 0, tileSymbol: "Ή" },
                    "7-88": { x: 7, y: 88, tilesetIdx: 0, tileSymbol: "Ί" },
                    "0-89": { x: 0, y: 89, tilesetIdx: 0, tileSymbol: "΋" },
                    "1-89": { x: 1, y: 89, tilesetIdx: 0, tileSymbol: "Ό" },
                    "2-89": { x: 2, y: 89, tilesetIdx: 0, tileSymbol: "΍" },
                    "3-89": { x: 3, y: 89, tilesetIdx: 0, tileSymbol: "Ύ" },
                    "4-89": { x: 4, y: 89, tilesetIdx: 0, tileSymbol: "Ώ" },
                    "5-89": { x: 5, y: 89, tilesetIdx: 0, tileSymbol: "ΐ" },
                    "6-89": { x: 6, y: 89, tilesetIdx: 0, tileSymbol: "Α" },
                    "7-89": { x: 7, y: 89, tilesetIdx: 0, tileSymbol: "Β" },
                    "0-90": { x: 0, y: 90, tilesetIdx: 0, tileSymbol: "Γ" },
                    "1-90": { x: 1, y: 90, tilesetIdx: 0, tileSymbol: "Δ" },
                    "2-90": { x: 2, y: 90, tilesetIdx: 0, tileSymbol: "Ε" },
                    "3-90": { x: 3, y: 90, tilesetIdx: 0, tileSymbol: "Ζ" },
                    "4-90": { x: 4, y: 90, tilesetIdx: 0, tileSymbol: "Η" },
                    "5-90": { x: 5, y: 90, tilesetIdx: 0, tileSymbol: "Θ" },
                    "6-90": { x: 6, y: 90, tilesetIdx: 0, tileSymbol: "Ι" },
                    "7-90": { x: 7, y: 90, tilesetIdx: 0, tileSymbol: "Κ" },
                    "0-91": { x: 0, y: 91, tilesetIdx: 0, tileSymbol: "Λ" },
                    "1-91": { x: 1, y: 91, tilesetIdx: 0, tileSymbol: "Μ" },
                    "2-91": { x: 2, y: 91, tilesetIdx: 0, tileSymbol: "Ν" },
                    "3-91": { x: 3, y: 91, tilesetIdx: 0, tileSymbol: "Ξ" },
                    "4-91": { x: 4, y: 91, tilesetIdx: 0, tileSymbol: "Ο" },
                    "5-91": { x: 5, y: 91, tilesetIdx: 0, tileSymbol: "Π" },
                    "6-91": { x: 6, y: 91, tilesetIdx: 0, tileSymbol: "Ρ" },
                    "7-91": { x: 7, y: 91, tilesetIdx: 0, tileSymbol: "΢" },
                    "0-92": { x: 0, y: 92, tilesetIdx: 0, tileSymbol: "Σ" },
                    "1-92": { x: 1, y: 92, tilesetIdx: 0, tileSymbol: "Τ" },
                    "2-92": { x: 2, y: 92, tilesetIdx: 0, tileSymbol: "Υ" },
                    "3-92": { x: 3, y: 92, tilesetIdx: 0, tileSymbol: "Φ" },
                    "4-92": { x: 4, y: 92, tilesetIdx: 0, tileSymbol: "Χ" },
                    "5-92": { x: 5, y: 92, tilesetIdx: 0, tileSymbol: "Ψ" },
                    "6-92": { x: 6, y: 92, tilesetIdx: 0, tileSymbol: "Ω" },
                    "7-92": { x: 7, y: 92, tilesetIdx: 0, tileSymbol: "Ϊ" },
                    "0-93": { x: 0, y: 93, tilesetIdx: 0, tileSymbol: "Ϋ" },
                    "1-93": { x: 1, y: 93, tilesetIdx: 0, tileSymbol: "ά" },
                    "2-93": { x: 2, y: 93, tilesetIdx: 0, tileSymbol: "έ" },
                    "3-93": { x: 3, y: 93, tilesetIdx: 0, tileSymbol: "ή" },
                    "4-93": { x: 4, y: 93, tilesetIdx: 0, tileSymbol: "ί" },
                    "5-93": { x: 5, y: 93, tilesetIdx: 0, tileSymbol: "ΰ" },
                    "6-93": { x: 6, y: 93, tilesetIdx: 0, tileSymbol: "α" },
                    "7-93": { x: 7, y: 93, tilesetIdx: 0, tileSymbol: "β" },
                    "0-94": { x: 0, y: 94, tilesetIdx: 0, tileSymbol: "γ" },
                    "1-94": { x: 1, y: 94, tilesetIdx: 0, tileSymbol: "δ" },
                    "2-94": { x: 2, y: 94, tilesetIdx: 0, tileSymbol: "ε" },
                    "3-94": { x: 3, y: 94, tilesetIdx: 0, tileSymbol: "ζ" },
                    "4-94": { x: 4, y: 94, tilesetIdx: 0, tileSymbol: "η" },
                    "5-94": { x: 5, y: 94, tilesetIdx: 0, tileSymbol: "θ" },
                    "6-94": { x: 6, y: 94, tilesetIdx: 0, tileSymbol: "ι" },
                    "7-94": { x: 7, y: 94, tilesetIdx: 0, tileSymbol: "κ" },
                    "0-95": { x: 0, y: 95, tilesetIdx: 0, tileSymbol: "λ" },
                    "1-95": { x: 1, y: 95, tilesetIdx: 0, tileSymbol: "μ" },
                    "2-95": { x: 2, y: 95, tilesetIdx: 0, tileSymbol: "ν" },
                    "3-95": { x: 3, y: 95, tilesetIdx: 0, tileSymbol: "ξ" },
                    "4-95": { x: 4, y: 95, tilesetIdx: 0, tileSymbol: "ο" },
                    "5-95": { x: 5, y: 95, tilesetIdx: 0, tileSymbol: "π" },
                    "6-95": { x: 6, y: 95, tilesetIdx: 0, tileSymbol: "ρ" },
                    "7-95": { x: 7, y: 95, tilesetIdx: 0, tileSymbol: "ς" },
                    "0-96": { x: 0, y: 96, tilesetIdx: 0, tileSymbol: "σ" },
                    "1-96": { x: 1, y: 96, tilesetIdx: 0, tileSymbol: "τ" },
                    "2-96": { x: 2, y: 96, tilesetIdx: 0, tileSymbol: "υ" },
                    "3-96": { x: 3, y: 96, tilesetIdx: 0, tileSymbol: "φ" },
                    "4-96": { x: 4, y: 96, tilesetIdx: 0, tileSymbol: "χ" },
                    "5-96": { x: 5, y: 96, tilesetIdx: 0, tileSymbol: "ψ" },
                    "6-96": { x: 6, y: 96, tilesetIdx: 0, tileSymbol: "ω" },
                    "7-96": { x: 7, y: 96, tilesetIdx: 0, tileSymbol: "ϊ" },
                    "0-97": { x: 0, y: 97, tilesetIdx: 0, tileSymbol: "ϋ" },
                    "1-97": { x: 1, y: 97, tilesetIdx: 0, tileSymbol: "ό" },
                    "2-97": { x: 2, y: 97, tilesetIdx: 0, tileSymbol: "ύ" },
                    "3-97": { x: 3, y: 97, tilesetIdx: 0, tileSymbol: "ώ" },
                    "4-97": { x: 4, y: 97, tilesetIdx: 0, tileSymbol: "Ϗ" },
                    "5-97": { x: 5, y: 97, tilesetIdx: 0, tileSymbol: "ϐ" },
                    "6-97": { x: 6, y: 97, tilesetIdx: 0, tileSymbol: "ϑ" },
                    "7-97": { x: 7, y: 97, tilesetIdx: 0, tileSymbol: "ϒ" },
                    "0-98": { x: 0, y: 98, tilesetIdx: 0, tileSymbol: "ϓ" },
                    "1-98": { x: 1, y: 98, tilesetIdx: 0, tileSymbol: "ϔ" },
                    "2-98": { x: 2, y: 98, tilesetIdx: 0, tileSymbol: "ϕ" },
                    "3-98": { x: 3, y: 98, tilesetIdx: 0, tileSymbol: "ϖ" },
                    "4-98": { x: 4, y: 98, tilesetIdx: 0, tileSymbol: "ϗ" },
                    "5-98": { x: 5, y: 98, tilesetIdx: 0, tileSymbol: "Ϙ" },
                    "6-98": { x: 6, y: 98, tilesetIdx: 0, tileSymbol: "ϙ" },
                    "7-98": { x: 7, y: 98, tilesetIdx: 0, tileSymbol: "Ϛ" },
                    "0-99": { x: 0, y: 99, tilesetIdx: 0, tileSymbol: "ϛ" },
                    "1-99": { x: 1, y: 99, tilesetIdx: 0, tileSymbol: "Ϝ" },
                    "2-99": { x: 2, y: 99, tilesetIdx: 0, tileSymbol: "ϝ" },
                    "3-99": { x: 3, y: 99, tilesetIdx: 0, tileSymbol: "Ϟ" },
                    "4-99": { x: 4, y: 99, tilesetIdx: 0, tileSymbol: "ϟ" },
                    "5-99": { x: 5, y: 99, tilesetIdx: 0, tileSymbol: "Ϡ" },
                    "6-99": { x: 6, y: 99, tilesetIdx: 0, tileSymbol: "ϡ" },
                    "7-99": { x: 7, y: 99, tilesetIdx: 0, tileSymbol: "Ϣ" },
                    "0-100": { x: 0, y: 100, tilesetIdx: 0, tileSymbol: "ϣ" },
                    "1-100": { x: 1, y: 100, tilesetIdx: 0, tileSymbol: "Ϥ" },
                    "2-100": { x: 2, y: 100, tilesetIdx: 0, tileSymbol: "ϥ" },
                    "3-100": { x: 3, y: 100, tilesetIdx: 0, tileSymbol: "Ϧ" },
                    "4-100": { x: 4, y: 100, tilesetIdx: 0, tileSymbol: "ϧ" },
                    "5-100": { x: 5, y: 100, tilesetIdx: 0, tileSymbol: "Ϩ" },
                    "6-100": { x: 6, y: 100, tilesetIdx: 0, tileSymbol: "ϩ" },
                    "7-100": { x: 7, y: 100, tilesetIdx: 0, tileSymbol: "Ϫ" },
                    "0-101": { x: 0, y: 101, tilesetIdx: 0, tileSymbol: "ϫ" },
                    "1-101": { x: 1, y: 101, tilesetIdx: 0, tileSymbol: "Ϭ" },
                    "2-101": { x: 2, y: 101, tilesetIdx: 0, tileSymbol: "ϭ" },
                    "3-101": { x: 3, y: 101, tilesetIdx: 0, tileSymbol: "Ϯ" },
                    "4-101": { x: 4, y: 101, tilesetIdx: 0, tileSymbol: "ϯ" },
                    "5-101": { x: 5, y: 101, tilesetIdx: 0, tileSymbol: "ϰ" },
                    "6-101": { x: 6, y: 101, tilesetIdx: 0, tileSymbol: "ϱ" },
                    "7-101": { x: 7, y: 101, tilesetIdx: 0, tileSymbol: "ϲ" },
                    "0-102": { x: 0, y: 102, tilesetIdx: 0, tileSymbol: "ϳ" },
                    "1-102": { x: 1, y: 102, tilesetIdx: 0, tileSymbol: "ϴ" },
                    "2-102": { x: 2, y: 102, tilesetIdx: 0, tileSymbol: "ϵ" },
                    "3-102": { x: 3, y: 102, tilesetIdx: 0, tileSymbol: "϶" },
                    "4-102": { x: 4, y: 102, tilesetIdx: 0, tileSymbol: "Ϸ" },
                    "5-102": { x: 5, y: 102, tilesetIdx: 0, tileSymbol: "ϸ" },
                    "6-102": { x: 6, y: 102, tilesetIdx: 0, tileSymbol: "Ϲ" },
                    "7-102": { x: 7, y: 102, tilesetIdx: 0, tileSymbol: "Ϻ" },
                    "0-103": { x: 0, y: 103, tilesetIdx: 0, tileSymbol: "ϻ" },
                    "1-103": { x: 1, y: 103, tilesetIdx: 0, tileSymbol: "ϼ" },
                    "2-103": { x: 2, y: 103, tilesetIdx: 0, tileSymbol: "Ͻ" },
                    "3-103": { x: 3, y: 103, tilesetIdx: 0, tileSymbol: "Ͼ" },
                    "4-103": { x: 4, y: 103, tilesetIdx: 0, tileSymbol: "Ͽ" },
                    "5-103": { x: 5, y: 103, tilesetIdx: 0, tileSymbol: "Ѐ" },
                    "6-103": { x: 6, y: 103, tilesetIdx: 0, tileSymbol: "Ё" },
                    "7-103": { x: 7, y: 103, tilesetIdx: 0, tileSymbol: "Ђ" },
                    "0-104": { x: 0, y: 104, tilesetIdx: 0, tileSymbol: "Ѓ" },
                    "1-104": { x: 1, y: 104, tilesetIdx: 0, tileSymbol: "Є" },
                    "2-104": { x: 2, y: 104, tilesetIdx: 0, tileSymbol: "Ѕ" },
                    "3-104": { x: 3, y: 104, tilesetIdx: 0, tileSymbol: "І" },
                    "4-104": { x: 4, y: 104, tilesetIdx: 0, tileSymbol: "Ї" },
                    "5-104": { x: 5, y: 104, tilesetIdx: 0, tileSymbol: "Ј" },
                    "6-104": { x: 6, y: 104, tilesetIdx: 0, tileSymbol: "Љ" },
                    "7-104": { x: 7, y: 104, tilesetIdx: 0, tileSymbol: "Њ" },
                    "0-105": { x: 0, y: 105, tilesetIdx: 0, tileSymbol: "Ћ" },
                    "1-105": { x: 1, y: 105, tilesetIdx: 0, tileSymbol: "Ќ" },
                    "2-105": { x: 2, y: 105, tilesetIdx: 0, tileSymbol: "Ѝ" },
                    "3-105": { x: 3, y: 105, tilesetIdx: 0, tileSymbol: "Ў" },
                    "4-105": { x: 4, y: 105, tilesetIdx: 0, tileSymbol: "Џ" },
                    "5-105": { x: 5, y: 105, tilesetIdx: 0, tileSymbol: "А" },
                    "6-105": { x: 6, y: 105, tilesetIdx: 0, tileSymbol: "Б" },
                    "7-105": { x: 7, y: 105, tilesetIdx: 0, tileSymbol: "В" },
                    "0-106": { x: 0, y: 106, tilesetIdx: 0, tileSymbol: "Г" },
                    "1-106": { x: 1, y: 106, tilesetIdx: 0, tileSymbol: "Д" },
                    "2-106": { x: 2, y: 106, tilesetIdx: 0, tileSymbol: "Е" },
                    "3-106": { x: 3, y: 106, tilesetIdx: 0, tileSymbol: "Ж" },
                    "4-106": { x: 4, y: 106, tilesetIdx: 0, tileSymbol: "З" },
                    "5-106": { x: 5, y: 106, tilesetIdx: 0, tileSymbol: "И" },
                    "6-106": { x: 6, y: 106, tilesetIdx: 0, tileSymbol: "Й" },
                    "7-106": { x: 7, y: 106, tilesetIdx: 0, tileSymbol: "К" },
                    "0-107": { x: 0, y: 107, tilesetIdx: 0, tileSymbol: "Л" },
                    "1-107": { x: 1, y: 107, tilesetIdx: 0, tileSymbol: "М" },
                    "2-107": { x: 2, y: 107, tilesetIdx: 0, tileSymbol: "Н" },
                    "3-107": { x: 3, y: 107, tilesetIdx: 0, tileSymbol: "О" },
                    "4-107": { x: 4, y: 107, tilesetIdx: 0, tileSymbol: "П" },
                    "5-107": { x: 5, y: 107, tilesetIdx: 0, tileSymbol: "Р" },
                    "6-107": { x: 6, y: 107, tilesetIdx: 0, tileSymbol: "С" },
                    "7-107": { x: 7, y: 107, tilesetIdx: 0, tileSymbol: "Т" },
                    "0-108": { x: 0, y: 108, tilesetIdx: 0, tileSymbol: "У" },
                    "1-108": { x: 1, y: 108, tilesetIdx: 0, tileSymbol: "Ф" },
                    "2-108": { x: 2, y: 108, tilesetIdx: 0, tileSymbol: "Х" },
                    "3-108": { x: 3, y: 108, tilesetIdx: 0, tileSymbol: "Ц" },
                    "4-108": { x: 4, y: 108, tilesetIdx: 0, tileSymbol: "Ч" },
                    "5-108": { x: 5, y: 108, tilesetIdx: 0, tileSymbol: "Ш" },
                    "6-108": { x: 6, y: 108, tilesetIdx: 0, tileSymbol: "Щ" },
                    "7-108": { x: 7, y: 108, tilesetIdx: 0, tileSymbol: "Ъ" },
                    "0-109": { x: 0, y: 109, tilesetIdx: 0, tileSymbol: "Ы" },
                    "1-109": { x: 1, y: 109, tilesetIdx: 0, tileSymbol: "Ь" },
                    "2-109": { x: 2, y: 109, tilesetIdx: 0, tileSymbol: "Э" },
                    "3-109": { x: 3, y: 109, tilesetIdx: 0, tileSymbol: "Ю" },
                    "4-109": { x: 4, y: 109, tilesetIdx: 0, tileSymbol: "Я" },
                    "5-109": { x: 5, y: 109, tilesetIdx: 0, tileSymbol: "а" },
                    "6-109": { x: 6, y: 109, tilesetIdx: 0, tileSymbol: "б" },
                    "7-109": { x: 7, y: 109, tilesetIdx: 0, tileSymbol: "в" },
                    "0-110": { x: 0, y: 110, tilesetIdx: 0, tileSymbol: "г" },
                    "1-110": { x: 1, y: 110, tilesetIdx: 0, tileSymbol: "д" },
                    "2-110": { x: 2, y: 110, tilesetIdx: 0, tileSymbol: "е" },
                    "3-110": { x: 3, y: 110, tilesetIdx: 0, tileSymbol: "ж" },
                    "4-110": { x: 4, y: 110, tilesetIdx: 0, tileSymbol: "з" },
                    "5-110": { x: 5, y: 110, tilesetIdx: 0, tileSymbol: "и" },
                    "6-110": { x: 6, y: 110, tilesetIdx: 0, tileSymbol: "й" },
                    "7-110": { x: 7, y: 110, tilesetIdx: 0, tileSymbol: "к" },
                    "0-111": { x: 0, y: 111, tilesetIdx: 0, tileSymbol: "л" },
                    "1-111": { x: 1, y: 111, tilesetIdx: 0, tileSymbol: "м" },
                    "2-111": { x: 2, y: 111, tilesetIdx: 0, tileSymbol: "н" },
                    "3-111": { x: 3, y: 111, tilesetIdx: 0, tileSymbol: "о" },
                    "4-111": { x: 4, y: 111, tilesetIdx: 0, tileSymbol: "п" },
                    "5-111": { x: 5, y: 111, tilesetIdx: 0, tileSymbol: "р" },
                    "6-111": { x: 6, y: 111, tilesetIdx: 0, tileSymbol: "с" },
                    "7-111": { x: 7, y: 111, tilesetIdx: 0, tileSymbol: "т" },
                    "0-112": { x: 0, y: 112, tilesetIdx: 0, tileSymbol: "у" },
                    "1-112": { x: 1, y: 112, tilesetIdx: 0, tileSymbol: "ф" },
                    "2-112": { x: 2, y: 112, tilesetIdx: 0, tileSymbol: "х" },
                    "3-112": { x: 3, y: 112, tilesetIdx: 0, tileSymbol: "ц" },
                    "4-112": { x: 4, y: 112, tilesetIdx: 0, tileSymbol: "ч" },
                    "5-112": { x: 5, y: 112, tilesetIdx: 0, tileSymbol: "ш" },
                    "6-112": { x: 6, y: 112, tilesetIdx: 0, tileSymbol: "щ" },
                    "7-112": { x: 7, y: 112, tilesetIdx: 0, tileSymbol: "ъ" },
                    "0-113": { x: 0, y: 113, tilesetIdx: 0, tileSymbol: "ы" },
                    "1-113": { x: 1, y: 113, tilesetIdx: 0, tileSymbol: "ь" },
                    "2-113": { x: 2, y: 113, tilesetIdx: 0, tileSymbol: "э" },
                    "3-113": { x: 3, y: 113, tilesetIdx: 0, tileSymbol: "ю" },
                    "4-113": { x: 4, y: 113, tilesetIdx: 0, tileSymbol: "я" },
                    "5-113": { x: 5, y: 113, tilesetIdx: 0, tileSymbol: "ѐ" },
                    "6-113": { x: 6, y: 113, tilesetIdx: 0, tileSymbol: "ё" },
                    "7-113": { x: 7, y: 113, tilesetIdx: 0, tileSymbol: "ђ" },
                    "0-114": { x: 0, y: 114, tilesetIdx: 0, tileSymbol: "ѓ" },
                    "1-114": { x: 1, y: 114, tilesetIdx: 0, tileSymbol: "є" },
                    "2-114": { x: 2, y: 114, tilesetIdx: 0, tileSymbol: "ѕ" },
                    "3-114": { x: 3, y: 114, tilesetIdx: 0, tileSymbol: "і" },
                    "4-114": { x: 4, y: 114, tilesetIdx: 0, tileSymbol: "ї" },
                    "5-114": { x: 5, y: 114, tilesetIdx: 0, tileSymbol: "ј" },
                    "6-114": { x: 6, y: 114, tilesetIdx: 0, tileSymbol: "љ" },
                    "7-114": { x: 7, y: 114, tilesetIdx: 0, tileSymbol: "њ" },
                    "0-115": { x: 0, y: 115, tilesetIdx: 0, tileSymbol: "ћ" },
                    "1-115": { x: 1, y: 115, tilesetIdx: 0, tileSymbol: "ќ" },
                    "2-115": { x: 2, y: 115, tilesetIdx: 0, tileSymbol: "ѝ" },
                    "3-115": { x: 3, y: 115, tilesetIdx: 0, tileSymbol: "ў" },
                    "4-115": { x: 4, y: 115, tilesetIdx: 0, tileSymbol: "џ" },
                    "5-115": { x: 5, y: 115, tilesetIdx: 0, tileSymbol: "Ѡ" },
                    "6-115": { x: 6, y: 115, tilesetIdx: 0, tileSymbol: "ѡ" },
                    "7-115": { x: 7, y: 115, tilesetIdx: 0, tileSymbol: "Ѣ" },
                    "0-116": { x: 0, y: 116, tilesetIdx: 0, tileSymbol: "ѣ" },
                    "1-116": { x: 1, y: 116, tilesetIdx: 0, tileSymbol: "Ѥ" },
                    "2-116": { x: 2, y: 116, tilesetIdx: 0, tileSymbol: "ѥ" },
                    "3-116": { x: 3, y: 116, tilesetIdx: 0, tileSymbol: "Ѧ" },
                    "4-116": { x: 4, y: 116, tilesetIdx: 0, tileSymbol: "ѧ" },
                    "5-116": { x: 5, y: 116, tilesetIdx: 0, tileSymbol: "Ѩ" },
                    "6-116": { x: 6, y: 116, tilesetIdx: 0, tileSymbol: "ѩ" },
                    "7-116": { x: 7, y: 116, tilesetIdx: 0, tileSymbol: "Ѫ" },
                    "0-117": { x: 0, y: 117, tilesetIdx: 0, tileSymbol: "ѫ" },
                    "1-117": { x: 1, y: 117, tilesetIdx: 0, tileSymbol: "Ѭ" },
                    "2-117": { x: 2, y: 117, tilesetIdx: 0, tileSymbol: "ѭ" },
                    "3-117": { x: 3, y: 117, tilesetIdx: 0, tileSymbol: "Ѯ" },
                    "4-117": { x: 4, y: 117, tilesetIdx: 0, tileSymbol: "ѯ" },
                    "5-117": { x: 5, y: 117, tilesetIdx: 0, tileSymbol: "Ѱ" },
                    "6-117": { x: 6, y: 117, tilesetIdx: 0, tileSymbol: "ѱ" },
                    "7-117": { x: 7, y: 117, tilesetIdx: 0, tileSymbol: "Ѳ" },
                    "0-118": { x: 0, y: 118, tilesetIdx: 0, tileSymbol: "ѳ" },
                    "1-118": { x: 1, y: 118, tilesetIdx: 0, tileSymbol: "Ѵ" },
                    "2-118": { x: 2, y: 118, tilesetIdx: 0, tileSymbol: "ѵ" },
                    "3-118": { x: 3, y: 118, tilesetIdx: 0, tileSymbol: "Ѷ" },
                    "4-118": { x: 4, y: 118, tilesetIdx: 0, tileSymbol: "ѷ" },
                    "5-118": { x: 5, y: 118, tilesetIdx: 0, tileSymbol: "Ѹ" },
                    "6-118": { x: 6, y: 118, tilesetIdx: 0, tileSymbol: "ѹ" },
                    "7-118": { x: 7, y: 118, tilesetIdx: 0, tileSymbol: "Ѻ" },
                    "0-119": { x: 0, y: 119, tilesetIdx: 0, tileSymbol: "ѻ" },
                    "1-119": { x: 1, y: 119, tilesetIdx: 0, tileSymbol: "Ѽ" },
                    "2-119": { x: 2, y: 119, tilesetIdx: 0, tileSymbol: "ѽ" },
                    "3-119": { x: 3, y: 119, tilesetIdx: 0, tileSymbol: "Ѿ" },
                    "4-119": { x: 4, y: 119, tilesetIdx: 0, tileSymbol: "ѿ" },
                    "5-119": { x: 5, y: 119, tilesetIdx: 0, tileSymbol: "Ҁ" },
                    "6-119": { x: 6, y: 119, tilesetIdx: 0, tileSymbol: "ҁ" },
                    "7-119": { x: 7, y: 119, tilesetIdx: 0, tileSymbol: "҂" },
                    "0-120": { x: 0, y: 120, tilesetIdx: 0, tileSymbol: "҃" },
                    "1-120": { x: 1, y: 120, tilesetIdx: 0, tileSymbol: "҄" },
                    "2-120": { x: 2, y: 120, tilesetIdx: 0, tileSymbol: "҅" },
                    "3-120": { x: 3, y: 120, tilesetIdx: 0, tileSymbol: "҆" },
                    "4-120": { x: 4, y: 120, tilesetIdx: 0, tileSymbol: "҇" },
                    "5-120": { x: 5, y: 120, tilesetIdx: 0, tileSymbol: "҈" },
                    "6-120": { x: 6, y: 120, tilesetIdx: 0, tileSymbol: "҉" },
                    "7-120": { x: 7, y: 120, tilesetIdx: 0, tileSymbol: "Ҋ" },
                    "0-121": { x: 0, y: 121, tilesetIdx: 0, tileSymbol: "ҋ" },
                    "1-121": { x: 1, y: 121, tilesetIdx: 0, tileSymbol: "Ҍ" },
                    "2-121": { x: 2, y: 121, tilesetIdx: 0, tileSymbol: "ҍ" },
                    "3-121": { x: 3, y: 121, tilesetIdx: 0, tileSymbol: "Ҏ" },
                    "4-121": { x: 4, y: 121, tilesetIdx: 0, tileSymbol: "ҏ" },
                    "5-121": { x: 5, y: 121, tilesetIdx: 0, tileSymbol: "Ґ" },
                    "6-121": { x: 6, y: 121, tilesetIdx: 0, tileSymbol: "ґ" },
                    "7-121": { x: 7, y: 121, tilesetIdx: 0, tileSymbol: "Ғ" },
                    "0-122": { x: 0, y: 122, tilesetIdx: 0, tileSymbol: "ғ" },
                    "1-122": { x: 1, y: 122, tilesetIdx: 0, tileSymbol: "Ҕ" },
                    "2-122": { x: 2, y: 122, tilesetIdx: 0, tileSymbol: "ҕ" },
                    "3-122": { x: 3, y: 122, tilesetIdx: 0, tileSymbol: "Җ" },
                    "4-122": { x: 4, y: 122, tilesetIdx: 0, tileSymbol: "җ" },
                    "5-122": { x: 5, y: 122, tilesetIdx: 0, tileSymbol: "Ҙ" },
                    "6-122": { x: 6, y: 122, tilesetIdx: 0, tileSymbol: "ҙ" },
                    "7-122": { x: 7, y: 122, tilesetIdx: 0, tileSymbol: "Қ" },
                    "0-123": { x: 0, y: 123, tilesetIdx: 0, tileSymbol: "қ" },
                    "1-123": { x: 1, y: 123, tilesetIdx: 0, tileSymbol: "Ҝ" },
                    "2-123": { x: 2, y: 123, tilesetIdx: 0, tileSymbol: "ҝ" },
                    "3-123": { x: 3, y: 123, tilesetIdx: 0, tileSymbol: "Ҟ" },
                    "4-123": { x: 4, y: 123, tilesetIdx: 0, tileSymbol: "ҟ" },
                    "5-123": { x: 5, y: 123, tilesetIdx: 0, tileSymbol: "Ҡ" },
                    "6-123": { x: 6, y: 123, tilesetIdx: 0, tileSymbol: "ҡ" },
                    "7-123": { x: 7, y: 123, tilesetIdx: 0, tileSymbol: "Ң" },
                    "0-124": { x: 0, y: 124, tilesetIdx: 0, tileSymbol: "ң" },
                    "1-124": { x: 1, y: 124, tilesetIdx: 0, tileSymbol: "Ҥ" },
                    "2-124": { x: 2, y: 124, tilesetIdx: 0, tileSymbol: "ҥ" },
                    "3-124": { x: 3, y: 124, tilesetIdx: 0, tileSymbol: "Ҧ" },
                    "4-124": { x: 4, y: 124, tilesetIdx: 0, tileSymbol: "ҧ" },
                    "5-124": { x: 5, y: 124, tilesetIdx: 0, tileSymbol: "Ҩ" },
                    "6-124": { x: 6, y: 124, tilesetIdx: 0, tileSymbol: "ҩ" },
                    "7-124": { x: 7, y: 124, tilesetIdx: 0, tileSymbol: "Ҫ" },
                    "0-125": { x: 0, y: 125, tilesetIdx: 0, tileSymbol: "ҫ" },
                    "1-125": { x: 1, y: 125, tilesetIdx: 0, tileSymbol: "Ҭ" },
                    "2-125": { x: 2, y: 125, tilesetIdx: 0, tileSymbol: "ҭ" },
                    "3-125": { x: 3, y: 125, tilesetIdx: 0, tileSymbol: "Ү" },
                    "4-125": { x: 4, y: 125, tilesetIdx: 0, tileSymbol: "ү" },
                    "5-125": { x: 5, y: 125, tilesetIdx: 0, tileSymbol: "Ұ" },
                    "6-125": { x: 6, y: 125, tilesetIdx: 0, tileSymbol: "ұ" },
                    "7-125": { x: 7, y: 125, tilesetIdx: 0, tileSymbol: "Ҳ" },
                    "0-126": { x: 0, y: 126, tilesetIdx: 0, tileSymbol: "ҳ" },
                    "1-126": { x: 1, y: 126, tilesetIdx: 0, tileSymbol: "Ҵ" },
                    "2-126": { x: 2, y: 126, tilesetIdx: 0, tileSymbol: "ҵ" },
                    "3-126": { x: 3, y: 126, tilesetIdx: 0, tileSymbol: "Ҷ" },
                    "4-126": { x: 4, y: 126, tilesetIdx: 0, tileSymbol: "ҷ" },
                    "5-126": { x: 5, y: 126, tilesetIdx: 0, tileSymbol: "Ҹ" },
                    "6-126": { x: 6, y: 126, tilesetIdx: 0, tileSymbol: "ҹ" },
                    "7-126": { x: 7, y: 126, tilesetIdx: 0, tileSymbol: "Һ" },
                    "0-127": { x: 0, y: 127, tilesetIdx: 0, tileSymbol: "һ" },
                    "1-127": { x: 1, y: 127, tilesetIdx: 0, tileSymbol: "Ҽ" },
                    "2-127": { x: 2, y: 127, tilesetIdx: 0, tileSymbol: "ҽ" },
                    "3-127": { x: 3, y: 127, tilesetIdx: 0, tileSymbol: "Ҿ" },
                    "4-127": { x: 4, y: 127, tilesetIdx: 0, tileSymbol: "ҿ" },
                    "5-127": { x: 5, y: 127, tilesetIdx: 0, tileSymbol: "Ӏ" },
                    "6-127": { x: 6, y: 127, tilesetIdx: 0, tileSymbol: "Ӂ" },
                    "7-127": { x: 7, y: 127, tilesetIdx: 0, tileSymbol: "ӂ" },
                    "0-128": { x: 0, y: 128, tilesetIdx: 0, tileSymbol: "Ӄ" },
                    "1-128": { x: 1, y: 128, tilesetIdx: 0, tileSymbol: "ӄ" },
                    "2-128": { x: 2, y: 128, tilesetIdx: 0, tileSymbol: "Ӆ" },
                    "3-128": { x: 3, y: 128, tilesetIdx: 0, tileSymbol: "ӆ" },
                    "4-128": { x: 4, y: 128, tilesetIdx: 0, tileSymbol: "Ӈ" },
                    "5-128": { x: 5, y: 128, tilesetIdx: 0, tileSymbol: "ӈ" },
                    "6-128": { x: 6, y: 128, tilesetIdx: 0, tileSymbol: "Ӊ" },
                    "7-128": { x: 7, y: 128, tilesetIdx: 0, tileSymbol: "ӊ" },
                    "0-129": { x: 0, y: 129, tilesetIdx: 0, tileSymbol: "Ӌ" },
                    "1-129": { x: 1, y: 129, tilesetIdx: 0, tileSymbol: "ӌ" },
                    "2-129": { x: 2, y: 129, tilesetIdx: 0, tileSymbol: "Ӎ" },
                    "3-129": { x: 3, y: 129, tilesetIdx: 0, tileSymbol: "ӎ" },
                    "4-129": { x: 4, y: 129, tilesetIdx: 0, tileSymbol: "ӏ" },
                    "5-129": { x: 5, y: 129, tilesetIdx: 0, tileSymbol: "Ӑ" },
                    "6-129": { x: 6, y: 129, tilesetIdx: 0, tileSymbol: "ӑ" },
                    "7-129": { x: 7, y: 129, tilesetIdx: 0, tileSymbol: "Ӓ" },
                    "0-130": { x: 0, y: 130, tilesetIdx: 0, tileSymbol: "ӓ" },
                    "1-130": { x: 1, y: 130, tilesetIdx: 0, tileSymbol: "Ӕ" },
                    "2-130": { x: 2, y: 130, tilesetIdx: 0, tileSymbol: "ӕ" },
                    "3-130": { x: 3, y: 130, tilesetIdx: 0, tileSymbol: "Ӗ" },
                    "4-130": { x: 4, y: 130, tilesetIdx: 0, tileSymbol: "ӗ" },
                    "5-130": { x: 5, y: 130, tilesetIdx: 0, tileSymbol: "Ә" },
                    "6-130": { x: 6, y: 130, tilesetIdx: 0, tileSymbol: "ә" },
                    "7-130": { x: 7, y: 130, tilesetIdx: 0, tileSymbol: "Ӛ" },
                    "0-131": { x: 0, y: 131, tilesetIdx: 0, tileSymbol: "ӛ" },
                    "1-131": { x: 1, y: 131, tilesetIdx: 0, tileSymbol: "Ӝ" },
                    "2-131": { x: 2, y: 131, tilesetIdx: 0, tileSymbol: "ӝ" },
                    "3-131": { x: 3, y: 131, tilesetIdx: 0, tileSymbol: "Ӟ" },
                    "4-131": { x: 4, y: 131, tilesetIdx: 0, tileSymbol: "ӟ" },
                    "5-131": { x: 5, y: 131, tilesetIdx: 0, tileSymbol: "Ӡ" },
                    "6-131": { x: 6, y: 131, tilesetIdx: 0, tileSymbol: "ӡ" },
                    "7-131": { x: 7, y: 131, tilesetIdx: 0, tileSymbol: "Ӣ" },
                    "0-132": { x: 0, y: 132, tilesetIdx: 0, tileSymbol: "ӣ" },
                    "1-132": { x: 1, y: 132, tilesetIdx: 0, tileSymbol: "Ӥ" },
                    "2-132": { x: 2, y: 132, tilesetIdx: 0, tileSymbol: "ӥ" },
                    "3-132": { x: 3, y: 132, tilesetIdx: 0, tileSymbol: "Ӧ" },
                    "4-132": { x: 4, y: 132, tilesetIdx: 0, tileSymbol: "ӧ" },
                    "5-132": { x: 5, y: 132, tilesetIdx: 0, tileSymbol: "Ө" },
                    "6-132": { x: 6, y: 132, tilesetIdx: 0, tileSymbol: "ө" },
                    "7-132": { x: 7, y: 132, tilesetIdx: 0, tileSymbol: "Ӫ" },
                },
                symbolStartIdx: 30,
                tileSize: 32,
                tags: {
                    "solid()": {
                        name: "solid()",
                        tiles: {
                            "3-3": "O",
                            "4-1": "O",
                            "5-1": "O",
                            "5-2": "O",
                            "4-2": "O",
                            "7-7": "O",
                            "7-8": "O",
                            "3-8": "O",
                            "4-8": "O",
                            "6-1": "O",
                            "7-2": "O",
                            "6-2": "O",
                            "7-1": "O",
                            "3-1": { mark: "O" },
                            "2-1": { mark: "O" },
                            "2-2": { mark: "O" },
                            "3-2": { mark: "O" },
                            "6-5": { mark: "O" },
                            "7-5": { mark: "O" },
                        },
                    },
                },
                frames: {
                    anim0: {
                        frameCount: 3,
                        width: 2,
                        height: 2,
                        start: { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                        tiles: [
                            { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                            { x: 0, y: 2, tilesetIdx: 0, tileSymbol: "Ó" },
                            { x: 1, y: 1, tilesetIdx: 0, tileSymbol: "Ì" },
                            { x: 1, y: 2, tilesetIdx: 0, tileSymbol: "Ô" },
                        ],
                        name: "anim0",
                        isFlippedX: false,
                        xPos: 0,
                        yPos: 0,
                    },
                    anim2: {
                        frameCount: 6,
                        width: 1,
                        height: 1,
                        start: { x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" },
                        tiles: [{ x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" }],
                        name: "anim2",
                        isFlippedX: false,
                        xPos: 0,
                        yPos: 0,
                    },
                    anim3: {
                        frameCount: 1,
                        width: 2,
                        height: 1,
                        start: { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                        tiles: [
                            { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                            { x: 7, y: 5, tilesetIdx: 0, tileSymbol: "ò" },
                        ],
                        name: "anim3",
                        isFlippedX: false,
                        xPos: 0,
                        yPos: 0,
                    },
                    anim1: {
                        frameCount: 2,
                        width: 2,
                        height: 2,
                        start: { x: 4, y: 1, tilesetIdx: 0, tileSymbol: "Ï" },
                        tiles: [
                            { x: 4, y: 1, tilesetIdx: 0, tileSymbol: "Ï" },
                            { x: 4, y: 2, tilesetIdx: 0, tileSymbol: "×" },
                            { x: 5, y: 1, tilesetIdx: 0, tileSymbol: "Ð" },
                            { x: 5, y: 2, tilesetIdx: 0, tileSymbol: "Ø" },
                        ],
                        name: "anim1",
                        isFlippedX: false,
                        xPos: 0,
                        yPos: 0,
                    },
                },
                description: "n/a",
            },
            1: {
                src: "./assets/free.png",
                name: "tileset 1",
                gridWidth: 5,
                gridHeight: 6,
                tileCount: 30,
                tileData: {
                    "0-0": { x: 0, y: 0, tilesetIdx: 1, tileSymbol: "¥" },
                    "1-0": { x: 1, y: 0, tilesetIdx: 1, tileSymbol: "¦" },
                    "2-0": { x: 2, y: 0, tilesetIdx: 1, tileSymbol: "§" },
                    "3-0": { x: 3, y: 0, tilesetIdx: 1, tileSymbol: "¨" },
                    "4-0": { x: 4, y: 0, tilesetIdx: 1, tileSymbol: "©" },
                    "0-1": { x: 0, y: 1, tilesetIdx: 1, tileSymbol: "ª" },
                    "1-1": { x: 1, y: 1, tilesetIdx: 1, tileSymbol: "«" },
                    "2-1": { x: 2, y: 1, tilesetIdx: 1, tileSymbol: "¬" },
                    "3-1": { x: 3, y: 1, tilesetIdx: 1, tileSymbol: "­" },
                    "4-1": { x: 4, y: 1, tilesetIdx: 1, tileSymbol: "®" },
                    "0-2": { x: 0, y: 2, tilesetIdx: 1, tileSymbol: "¯" },
                    "1-2": { x: 1, y: 2, tilesetIdx: 1, tileSymbol: "°" },
                    "2-2": { x: 2, y: 2, tilesetIdx: 1, tileSymbol: "±" },
                    "3-2": { x: 3, y: 2, tilesetIdx: 1, tileSymbol: "²" },
                    "4-2": { x: 4, y: 2, tilesetIdx: 1, tileSymbol: "³" },
                    "0-3": { x: 0, y: 3, tilesetIdx: 1, tileSymbol: "´" },
                    "1-3": { x: 1, y: 3, tilesetIdx: 1, tileSymbol: "µ" },
                    "2-3": { x: 2, y: 3, tilesetIdx: 1, tileSymbol: "¶" },
                    "3-3": { x: 3, y: 3, tilesetIdx: 1, tileSymbol: "·" },
                    "4-3": { x: 4, y: 3, tilesetIdx: 1, tileSymbol: "¸" },
                    "0-4": { x: 0, y: 4, tilesetIdx: 1, tileSymbol: "¹" },
                    "1-4": { x: 1, y: 4, tilesetIdx: 1, tileSymbol: "º" },
                    "2-4": { x: 2, y: 4, tilesetIdx: 1, tileSymbol: "»" },
                    "3-4": { x: 3, y: 4, tilesetIdx: 1, tileSymbol: "¼" },
                    "4-4": { x: 4, y: 4, tilesetIdx: 1, tileSymbol: "½" },
                    "0-5": { x: 0, y: 5, tilesetIdx: 1, tileSymbol: "¾" },
                    "1-5": { x: 1, y: 5, tilesetIdx: 1, tileSymbol: "¿" },
                    "2-5": { x: 2, y: 5, tilesetIdx: 1, tileSymbol: "À" },
                    "3-5": { x: 3, y: 5, tilesetIdx: 1, tileSymbol: "Á" },
                    "4-5": { x: 4, y: 5, tilesetIdx: 1, tileSymbol: "Â" },
                },
                symbolStartIdx: 0,
                tileSize: 32,
                tags: {},
                frames: {},
                description: "n/a",
            },
        },
        maps: {
            Map_1: {
                layers: [
                    { tiles: {}, visible: true, name: "bottom" },
                    { tiles: {}, visible: true, name: "middle" },
                    {
                        tiles: {
                            "6-7": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "5-9": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "5-10": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "5-11": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "6-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "6-13": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "7-13": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "7-14": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "8-14": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "8-15": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "9-15": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "10-15": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "11-15": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "12-16": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "13-16": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-16": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-15": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "15-15": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "15-14": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-14": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-13": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-11": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-10": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-9": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "16-8": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "15-8": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "15-7": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "15-6": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "15-5": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-5": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-3": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "13-3": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "13-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "12-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "11-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "10-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "9-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "8-4": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "8-5": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "7-5": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "6-6": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "5-7": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "6-8": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "9-11": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "9-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "10-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "11-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "12-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "13-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-12": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "14-11": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "10-7": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "10-8": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "12-7": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                            "12-8": { x: 0, y: 0, tilesetIdx: 0, tileSymbol: "Ã" },
                        },
                        visible: true,
                        name: "top",
                    },
                ],
                name: "Map 1",
                mapWidth: 18,
                mapHeight: 17,
                tileSize: 32,
                width: 320,
                height: 320,
            },
            Map_2: {
                layers: [
                    {
                        tiles: {
                            "0-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-0": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-1": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-2": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-3": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-4": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-5": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-6": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-7": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-8": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-9": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-10": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-11": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-12": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-13": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-14": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-15": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-15": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "2-15": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-15": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-15": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-15": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-15": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-16": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-16": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-16": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-16": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-16": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-16": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-17": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-17": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-17": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-17": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-17": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-18": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-18": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-18": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-18": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-18": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-19": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-19": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "3-19": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-19": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-19": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-19": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-20": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "0-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "2-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "3-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "4-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "5-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "6-21": { x: 1, y: 0, tilesetIdx: 0, tileSymbol: "Ä" },
                            "1-16": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "1-17": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "1-18": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "2-18": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "2-17": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                            "1-19": {
                                x: 1,
                                y: 0,
                                tilesetIdx: 0,
                                tileSymbol: "Ä",
                                isFlippedX: false,
                            },
                        },
                        visible: true,
                        name: "bottom",
                        animatedTiles: {
                            "3-1": {
                                frameCount: 2,
                                width: 2,
                                height: 2,
                                start: { x: 4, y: 1, tilesetIdx: 0, tileSymbol: "Ï" },
                                tiles: [
                                    { x: 4, y: 1, tilesetIdx: 0, tileSymbol: "Ï" },
                                    { x: 4, y: 2, tilesetIdx: 0, tileSymbol: "×" },
                                    { x: 5, y: 1, tilesetIdx: 0, tileSymbol: "Ð" },
                                    { x: 5, y: 2, tilesetIdx: 0, tileSymbol: "Ø" },
                                ],
                                name: "anim1",
                                layer: 0,
                                isFlippedX: false,
                                xPos: 96,
                                yPos: 32,
                            },
                        },
                    },
                    {
                        tiles: {
                            "2-6": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-7": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "1-7": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "1-8": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "1-9": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "1-10": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "1-11": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "1-12": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-12": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-13": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-13": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-12": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-12": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "5-11": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "5-10": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "6-10": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "6-9": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "6-8": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "5-8": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "5-7": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "5-6": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-6": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-5": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-5": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-6": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-11": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-10": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-10": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-9": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-8": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-8": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-9": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-9": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-8": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-10": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "2-11": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-11": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "5-9": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-7": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "3-7": { x: 3, y: 0, tilesetIdx: 0, tileSymbol: "Æ" },
                            "4-16": {
                                x: 6,
                                y: 1,
                                tilesetIdx: 0,
                                tileSymbol: "Ñ",
                                isFlippedX: false,
                            },
                            "4-17": {
                                x: 6,
                                y: 2,
                                tilesetIdx: 0,
                                tileSymbol: "Ù",
                                isFlippedX: false,
                            },
                            "5-16": {
                                x: 7,
                                y: 1,
                                tilesetIdx: 0,
                                tileSymbol: "Ò",
                                isFlippedX: false,
                            },
                            "5-17": {
                                x: 7,
                                y: 2,
                                tilesetIdx: 0,
                                tileSymbol: "Ú",
                                isFlippedX: false,
                            },
                        },
                        visible: true,
                        name: "middle",
                        opacity: 0.54,
                    },
                    {
                        tiles: {},
                        visible: true,
                        name: "top",
                        animatedTiles: {
                            "1-7": {
                                frameCount: 3,
                                width: 2,
                                height: 2,
                                start: { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                                tiles: [
                                    { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                                    { x: 0, y: 2, tilesetIdx: 0, tileSymbol: "Ó" },
                                    { x: 1, y: 1, tilesetIdx: 0, tileSymbol: "Ì" },
                                    { x: 1, y: 2, tilesetIdx: 0, tileSymbol: "Ô" },
                                ],
                                name: "anim0",
                                layer: 2,
                                isFlippedX: false,
                                xPos: 32,
                                yPos: 224,
                            },
                            "4-12": {
                                frameCount: 3,
                                width: 2,
                                height: 2,
                                start: { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                                tiles: [
                                    { x: 0, y: 1, tilesetIdx: 0, tileSymbol: "Ë" },
                                    { x: 0, y: 2, tilesetIdx: 0, tileSymbol: "Ó" },
                                    { x: 1, y: 1, tilesetIdx: 0, tileSymbol: "Ì" },
                                    { x: 1, y: 2, tilesetIdx: 0, tileSymbol: "Ô" },
                                ],
                                name: "anim0",
                                layer: 2,
                                isFlippedX: true,
                                xPos: 128,
                                yPos: 384,
                            },
                            "1-3": {
                                frameCount: 3,
                                width: 1,
                                height: 1,
                                start: { x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" },
                                tiles: [{ x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" }],
                                name: "anim2",
                                layer: 2,
                                isFlippedX: true,
                                xPos: 32,
                                yPos: 96,
                            },
                            "5-5": {
                                frameCount: 6,
                                width: 1,
                                height: 1,
                                start: { x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" },
                                tiles: [{ x: 0, y: 6, tilesetIdx: 0, tileSymbol: "ó" }],
                                name: "anim2",
                                layer: 2,
                                isFlippedX: true,
                                xPos: 160,
                                yPos: 160,
                            },
                            "3-10": {
                                frameCount: 1,
                                width: 2,
                                height: 1,
                                start: { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                                tiles: [
                                    { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                                    { x: 7, y: 5, tilesetIdx: 0, tileSymbol: "ò" },
                                ],
                                name: "anim3",
                                layer: 2,
                                isFlippedX: true,
                                xPos: 96,
                                yPos: 320,
                            },
                            "4-7": {
                                frameCount: 1,
                                width: 2,
                                height: 1,
                                start: { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                                tiles: [
                                    { x: 6, y: 5, tilesetIdx: 0, tileSymbol: "ñ" },
                                    { x: 7, y: 5, tilesetIdx: 0, tileSymbol: "ò" },
                                ],
                                name: "anim3",
                                layer: 2,
                                isFlippedX: false,
                                xPos: 128,
                                yPos: 224,
                            },
                        },
                        opacity: 1,
                    },
                ],
                name: "Map 2",
                mapWidth: 7,
                mapHeight: 22,
                tileSize: 32,
                width: 320,
                height: 320,
            },
        },
    };
});
//# sourceMappingURL=tilemap-editor.js.map