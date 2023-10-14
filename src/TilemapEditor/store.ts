// memo: グローバルかつ再代入の変数の識別子
// _.init$ -- init で書き換わる
// _.mul$ -- 複数個所で書き換わる
// _.state$ -- 状態管理オブジェクト

// export interface FlattenedDataItem {
//   map?: string;
//   maps?: Record<string, TileMap>;
//   tileSet?: TileSet;
//   tileSets?: Record<string, TileSet>;
//   flattenedData: {
//     tile: Tile | null;
//     tileSymbol: string;
//   }[][][];
//   activeMap?: string;
//   downloadAsTextFile?: (input: unknown, fileName?: string) => void;
// }
// export type FlattenedData = FlattenedDataItem[];

export type FlattenedDataItem = any;
export type FlattenedData = any;

export interface AppState {
  undoStack: Stack[];
  undoStepPosition: number;
  currentLayer: number;
  PREV_ACTIVE_TOOL: number;
  ACTIVE_TOOL: number;
  ACTIVE_MAP: string;
  SHOW_GRID: boolean;
  selection: Tile[];
}
export interface Stack {
  maps: Record<string, TileMap>;
  tileSets: Record<string, TileSet>;
  currentLayer: AppState["currentLayer"];
  ACTIVE_MAP: AppState["ACTIVE_MAP"];
  IMAGES: ImageJSON[];
}

export interface AllAppState {
  tileMapData: TileMapData;
  appState: AppState;
}

export interface TileMapData {
  tileSets: Record<string, TileSet>;
  maps: Record<string, TileMap>;
}

export interface TileSet {
  src: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  tileData: Record<string, Tile>;
  symbolStartIdx: number;
  tileSize: number;
  tags: Record<string, Tag>;
  frames: Record<string, Frame>;
  width?: number;
  height?: number;
  description: string;
  tileCount: number;
}

// AnimatedTile
export interface Frame {
  frameCount: number;
  width?: number;
  height?: number;
  start?: Tile;
  tiles?: Tile[];
  name?: string;
  layer?: number;
  isFlippedX?: boolean;
  xPos?: number;
  yPos?: number;
  animations?: Record<
    string,
    {
      start: number;
      end: number;
      name?: string;
      loop: boolean;
      speed: number;
    }
  >;
}

export interface Tag {
  name: string;
  code?: string;
  tiles: Record<
    string,
    | string
    | {
        mark: string;
      }
  >;
}

export interface Layer {
  tiles: Record<string, Tile>;
  visible: boolean;
  name: string;
  animatedTiles?: Record<string, Frame>;
  opacity?: number;
}

export interface TileMap {
  name: string;
  layers: Layer[];
  mapWidth: number;
  mapHeight: number;
  tileSet?: TileSet;
  gridColor?: string;
  tileSize: number;
  width?: number;
  height?: number;
}

export interface Tile {
  x: number;
  y: number;
  tilesetIdx: number;
  tileSymbol: string;
  isFlippedX?: boolean;
}

export interface XY {
  x?: number;
  y?: number;
}
export type QS<E> = E | null | undefined;

export interface ImageJSON {
  src?: string;
  tileSize?: number;
  name?: string;
  link?: string;
  description?: string;
}

export interface ApiTileMapExporters {
  exportAsImage?: {
    name: string;
    transformer: () => void;
  };
  saveData?: {
    name: string;
    transformer: () => void;
  };
  analizeTilemap?: {
    name: string;
    transformer: () => void;
  };
  exportTilesFromMap?: {
    name: string;
    transformer: () => void;
  };
}
export interface ApiTileMapImporters {
  openData?: {
    name: string;
    onSelectFiles: (setData: (json: unknown) => void, files: File[]) => void;
    acceptFile: string;
  };
}
export type ApiTileSetLoaders = {
  base64?: {
    name: string;
    onSelectImage: (
      setSrc: (base64: unknown) => void,
      file: unknown,
      base64: unknown
    ) => void;
  };
  onSelectImage?: (
    replaceSelectedTileSet: unknown,
    file: unknown,
    base64Src: unknown
  ) => void;
  prompt?: (replaceSelectedTileSet: unknown) => void;
};

export interface Refs {
  tileFrameCount?: () => HTMLInputElement;
  animStart?: () => HTMLInputElement;
  animEnd?: () => HTMLInputElement;
  renameTileFrameBtn?: () => HTMLButtonElement;
  renameTileAnimBtn?: () => HTMLButtonElement;
  animSpeed?: () => HTMLInputElement;
  animLoop?: () => HTMLInputElement;
}
interface State {
  state$el: Refs;

  clearUndoStack$undoStack: AppState["undoStack"];
  mul$undoStepPosition: AppState["undoStepPosition"];
  setLayer$currentLayer: AppState["currentLayer"];
  mul$PREV_ACTIVE_TOOL: AppState["PREV_ACTIVE_TOOL"];
  mul$ACTIVE_TOOL: AppState["ACTIVE_TOOL"];
  mul$ACTIVE_MAP: AppState["ACTIVE_MAP"];
  init$SHOW_GRID: AppState["SHOW_GRID"];
  mul$selection: AppState["selection"];

  init$tilesetImage: QS<HTMLImageElement>;
  init$canvas: QS<HTMLCanvasElement>;
  init$tilesetContainer: QS<HTMLElement>;
  init$tilesetSelection: QS<HTMLElement>;
  init$cropSize: QS<HTMLInputElement>;
  init$confirmBtn: QS<HTMLButtonElement>;
  init$layersElement: QS<HTMLElement>;
  init$tileDataSel: QS<HTMLSelectElement>;
  init$tileFrameSel: QS<HTMLSelectElement>;
  init$tileAnimSel: QS<HTMLSelectElement>;
  init$tilesetDataSel: QS<HTMLSelectElement>;
  init$mapsDataSel: QS<HTMLSelectElement>;
  init$objectParametersEditor: QS<HTMLElement>;
  mul$mapTileHeight?: number;
  mul$mapTileWidth?: number;
  reloadTilesets$TILESET_ELEMENTS: (HTMLImageElement & {
    tileSize?: number;
  })[];
  mul$IMAGES: Stack["IMAGES"];
  mul$ZOOM: number;
  mul$SIZE_OF_CROP: number;
  mul$WIDTH: number;
  mul$HEIGHT: number;
  toggleSymbolsVisible$DISPLAY_SYMBOLS: boolean;
  mul$isMouseDown: boolean;
  mul$maps: Stack["maps"];
  mul$tileSets: Stack["tileSets"];
  init_state$apiTileSetLoaders: ApiTileSetLoaders;
  init_state$selectedTileSetLoader: ApiTileSetLoaders;
  init_state$apiTileMapExporters: ApiTileMapExporters;
  init_state$apiTileMapImporters: ApiTileMapImporters;
  init$apiOnUpdateCallback: (...args: unknown[]) => void;
  init$apiOnMouseUp: (
    getAppState: unknown,
    apiTileMapExporters: unknown
  ) => void;
  getTile$editedEntity: Frame | undefined;
  updateSelection$selectionSize: [number, number];
  mul$zoomIndex: number;
  init$tileSelectStart: XY | null;
}

export const _: State = {
  state$el: {
    tileFrameCount: undefined,
    animStart: undefined,
    animEnd: undefined,
    renameTileFrameBtn: undefined,
    renameTileAnimBtn: undefined,
    animSpeed: undefined,
    animLoop: undefined,
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
    onSelectImage: (_, __, ___) => {},
    prompt: (_) => {},
  },
  init_state$apiTileMapExporters: {},
  init_state$apiTileMapImporters: {},
  init$apiOnUpdateCallback: () => {},
  init$apiOnMouseUp: (_, __) => {},
  getTile$editedEntity: undefined,
  updateSelection$selectionSize: [1, 1],
  mul$undoStepPosition: -1,
  clearUndoStack$undoStack: [],
  mul$zoomIndex: 1,
  init$tileSelectStart: null,
};

export type DeferredPrompt = Event & {
  prompt: () => void;
  userChoice: Promise<{ outcome: string }>;
};
