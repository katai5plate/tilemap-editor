// memo: グローバルかつ再代入の変数の識別子
// _.init$ -- init で書き換わる
// _.mul$ -- 複数個所で書き換わる
// _.state$ -- 状態管理オブジェクト

/** @typedef {{ x: number, y: number }} XY */
/** @typedef {XY & { tilesetIdx: number, tileSymbol: string }} Tile */
/**
 * @template E
 * @typedef {E | null | undefined} QS<E>
 */

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
  /** @type {QS<HTMLImageElement>} */
  init$tilesetImage: undefined,
  /** @type {QS<HTMLCanvasElement>} */
  init$canvas: undefined,
  /** @type {QS<HTMLElement>} */
  init$tilesetContainer: undefined,
  /** @type {QS<HTMLElement>} */
  init$tilesetSelection: undefined,
  /** @type {QS<HTMLInputElement>} */
  init$cropSize: undefined,
  init$confirmBtn: undefined,
  /** @type {QS<HTMLElement>} */
  init$layersElement: undefined,
  /** @type {QS<HTMLSelectElement>} */
  init$tileDataSel: undefined,
  /** @type {QS<HTMLSelectElement>} */
  init$tileFrameSel: undefined,
  /** @type {QS<HTMLSelectElement>} */
  init$tileAnimSel: undefined,
  /** @type {QS<HTMLSelectElement>} */
  init$tilesetDataSel: undefined,
  /** @type {QS<HTMLSelectElement>} */
  init$mapsDataSel: undefined,
  /** @type {QS<HTMLElement>} */
  init$objectParametersEditor: undefined,
  /** @type {number | undefined} */
  mul$mapTileHeight: undefined,
  /** @type {number | undefined} */
  mul$mapTileWidth: undefined,
  /** @type {(HTMLImageElement & {tileSize?})[]} */
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
  /** @type {Tile[]} */
  mul$selection: [],
  setLayer$currentLayer: 0,
  mul$isMouseDown: false,
  mul$maps: {},
  mul$tileSets: {},
  init_state$apiTileSetLoaders: {},
  init_state$selectedTileSetLoader: {},
  init_state$apiTileMapExporters: {},
  init_state$apiTileMapImporters: {},
  /** @type {(...args: any) => void} */
  init$apiOnUpdateCallback: () => {},
  init$apiOnMouseUp: () => {},
  /** @type {{tiles, isFlippedX, layer, name} | null} */
  getTile$editedEntity: undefined,
  updateSelection$selectionSize: [1, 1],
  mul$undoStepPosition: -1,
  /** @type {{maps, tileSets, currentLayer, ACTIVE_MAP, IMAGES}[]} */
  clearUndoStack$undoStack: [],
  mul$zoomIndex: 1,
  /** @type {XY | null} */
  init$tileSelectStart: null,
};
