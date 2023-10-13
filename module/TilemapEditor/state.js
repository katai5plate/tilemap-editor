// memo: グローバルかつ再代入の変数の識別子
// _.init$ -- init で書き換わる
// _.mul$ -- 複数個所で書き換わる
// _.state$ -- 状態管理オブジェクト

export default {
  state$el: {
    tileFrameCount: "",
    animStart: "",
    animEnd: "",
    renameTileFrameBtn: "",
    renameTileAnimBtn: "",
    animSpeed: "",
    animLoop: "",
  },
  init$tilesetImage: undefined,
  init$canvas: undefined,
  init$tilesetContainer: undefined,
  /** @type {HTMLElement} */
  init$tilesetSelection: undefined,
  init$cropSize: undefined,
  init$confirmBtn: undefined,
  init$layersElement: undefined,
  /** @type {HTMLSelectElement} */
  init$tileDataSel: undefined,
  init$tileFrameSel: undefined,
  init$tileAnimSel: undefined,
  /** @type {HTMLSelectElement} */
  init$tilesetDataSel: undefined,
  init$mapsDataSel: undefined,
  /** @type {HTMLElement} */
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
  /** @type {{x: number, y: number}[]} */
  mul$selection: [],
  setLayer$currentLayer: 0,
  mul$isMouseDown: false,
  mul$maps: {},
  mul$tileSets: {},
  init_state$apiTileSetLoaders: {},
  init_state$selectedTileSetLoader: {},
  init_state$apiTileMapExporters: {},
  init_state$apiTileMapImporters: {},
  init$apiOnUpdateCallback: () => {},
  init$apiOnMouseUp: () => {},
  getTile$editedEntity: undefined,
  updateSelection$selectionSize: [1, 1],
  mul$undoStepPosition: -1,
  clearUndoStack$undoStack: [],
  mul$zoomIndex: 1,
  init$tileSelectStart: null,
};
