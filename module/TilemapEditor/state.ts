// memo: グローバルかつ再代入の変数の識別子
// _.init$ -- init で書き換わる
// _.mul$ -- 複数個所で書き換わる
// _.state$ -- 状態管理オブジェクト

import { Layer, QS, Tile, XY } from "./type";

export default {
  state$el: {
    tileFrameCount: (() => {}) as () => HTMLInputElement,
    animStart: (() => {}) as () => HTMLInputElement,
    animEnd: (() => {}) as () => HTMLInputElement,
    renameTileFrameBtn: (() => {}) as () => HTMLButtonElement,
    renameTileAnimBtn: (() => {}) as () => HTMLButtonElement,
    animSpeed: (() => {}) as () => HTMLInputElement,
    animLoop: (() => {}) as () => HTMLInputElement,
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
    tileSize?: number;
    name?: string;
    link?: string;
    description?: string;
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
  mul$maps: {} as {
    [key: string]: {
      name: string;
      layers: Layer[];
      mapWidth: number;
      mapHeight: number;
      tileSet?: unknown;
      gridColor: string;
      tileSize: number;
    };
  },
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
  init_state$apiTileSetLoaders: {} as {
    base64: {
      name: string;
      onSelectImage: (setSrc, file, base64) => void;
    };
  },
  init_state$selectedTileSetLoader: {
    onSelectImage: (() => {}) as (
      replaceSelectedTileSet,
      file,
      base64Src
    ) => void,
    prompt: (() => {}) as (replaceSelectedTileSet) => void,
  },
  init_state$apiTileMapExporters: {} as {
    exportAsImage: {
      name: string;
      transformer: () => void;
    };
    saveData: {
      name: string;
      transformer: () => void;
    };
    analizeTilemap: {
      name: string;
      transformer: () => void;
    };
    exportTilesFromMap: {
      name: string;
      transformer: () => void;
    };
  },
  init_state$apiTileMapImporters: {} as {
    openData: {
      name: string;
      onSelectFiles: (setData, files) => void;
      acceptFile: string;
    };
  },
  init$apiOnUpdateCallback: (() => {}) as (...args: any) => void,
  init$apiOnMouseUp: (() => {}) as (getAppState, apiTileMapExporters) => void,
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
  init$tileSelectStart: null as XY | null,
};
