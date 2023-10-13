// memo: グローバルかつ再代入の変数の識別子
// _.init$ -- init で書き換わる
// _.mul$ -- 複数個所で書き換わる
// _.state$ -- 状態管理オブジェクト

interface XY {
  x: number;
  y: number;
}
type Tile = XY & { tilesetIdx: number; tileSymbol: string };
type QS<E> = E | null | undefined;

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
  init$tilesetImage: undefined as QS<HTMLImageElement>,
  init$canvas: undefined as QS<HTMLCanvasElement>,
  init$tilesetContainer: undefined as QS<HTMLElement>,
  init$tilesetSelection: undefined as QS<HTMLElement>,
  init$cropSize: undefined as QS<HTMLInputElement>,
  init$confirmBtn: undefined,
  init$layersElement: undefined as QS<HTMLElement>,
  init$tileDataSel: undefined as QS<HTMLSelectElement>,
  init$tileFrameSel: undefined as QS<HTMLSelectElement>,
  init$tileAnimSel: undefined as QS<HTMLSelectElement>,
  init$tilesetDataSel: undefined as QS<HTMLSelectElement>,
  init$mapsDataSel: undefined as QS<HTMLSelectElement>,
  init$objectParametersEditor: undefined as QS<HTMLElement>,
  mul$mapTileHeight: undefined as number | undefined,
  mul$mapTileWidth: undefined as number | undefined,
  reloadTilesets$TILESET_ELEMENTS: [] as (HTMLImageElement & {
    tileSize?: any;
  })[],
  mul$IMAGES: [{ src: "" }] as {
    src: string;
    tileSize: number;
    name: string;
    link: string;
    description: string;
  }[],
  mul$ZOOM: 1,
  mul$SIZE_OF_CROP: 32,
  mul$WIDTH: 0,
  mul$HEIGHT: 0,
  mul$PREV_ACTIVE_TOOL: 0,
  mul$ACTIVE_TOOL: 0,
  mul$ACTIVE_MAP: "",
  toggleSymbolsVisible$DISPLAY_SYMBOLS: false,
  init$SHOW_GRID: false,
  mul$selection: [] as Tile[],
  setLayer$currentLayer: 0,
  mul$isMouseDown: false,
  mul$maps: {},
  mul$tileSets: {} as {
    [key: string]: {
      src: string;
      name: string;
      gridWidth: number;
      gridHeight: number;
      tileData: {};
      symbolStartIdx: number;
      tileSize: number;
      tags: {};
      frames: {};
      width: number;
      height: number;
      description: string;
      tileCount: number;
    };
  },
  init_state$apiTileSetLoaders: {},
  init_state$selectedTileSetLoader: {},
  init_state$apiTileMapExporters: {},
  init_state$apiTileMapImporters: {},
  init$apiOnUpdateCallback: (() => {}) as (...args: any) => void,
  init$apiOnMouseUp: () => {},
  getTile$editedEntity: undefined as
    | { tiles: any; isFlippedX: any; layer: any; name: any }
    | undefined,
  updateSelection$selectionSize: [1, 1],
  mul$undoStepPosition: -1,
  clearUndoStack$undoStack: [] as {
    maps;
    tileSets;
    currentLayer;
    ACTIVE_MAP;
    IMAGES;
  }[],
  mul$zoomIndex: 1,
  /** @type {XY | null} */
  init$tileSelectStart: null,
};
