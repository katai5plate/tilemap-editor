declare module "src/TilemapEditor/store" {
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
        animations?: Record<string, {
            start: number;
            end: number;
            name?: string;
            loop: boolean;
            speed: number;
        }>;
    }
    export interface Tag {
        name: string;
        code?: string;
        tiles: Record<string, string | {
            mark: string;
        }>;
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
            onSelectImage: (setSrc: (base64: unknown) => void, file: unknown, base64: unknown) => void;
        };
        onSelectImage?: (replaceSelectedTileSet: unknown, file: unknown, base64Src: unknown) => void;
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
        init$apiOnMouseUp: (getAppState: unknown, apiTileMapExporters: unknown) => void;
        getTile$editedEntity: Frame | undefined;
        updateSelection$selectionSize: [number, number];
        mul$zoomIndex: number;
        init$tileSelectStart: XY | null;
    }
    export const _: State;
    export type DeferredPrompt = Event & {
        prompt: () => void;
        userChoice: Promise<{
            outcome: string;
        }>;
    };
}
declare module "src/getImgurGallery" {
    import { ImageJSON } from "src/TilemapEditor/store";
    const _default: (album_id: string, cb: (data: {
        images: ImageJSON[];
    }) => void) => void;
    export default _default;
}
declare module "src/getMapFromGist" {
    import { TileMapData } from "src/TilemapEditor/store";
    const _default_1: (gistId: string, cb: (mapFound: TileMapData) => void) => void;
    export default _default_1;
}
declare module "src/helper" {
    export const target: (e: Event) => HTMLInputElement & {
        result: string;
    };
}
declare module "src/constants/enums" {
    export const TOOLS: {
        BRUSH: number;
        ERASE: number;
        PAN: number;
        PICK: number;
        RAND: number;
        FILL: number;
    };
    export const RANDOM_LETTERS: string[];
    export const ZOOM_LEVELS: number[];
}
declare module "src/constants/html" {
    import { Layer } from "src/TilemapEditor/store";
    export const tilemapEditorRootHTML: ({ width, height, mapTileWidth, }: {
        width: number;
        height: number;
        mapTileWidth: number;
    }) => string;
    export const activeLayerLabelHTML: ({ name, opacity }: Layer) => string;
    export const layersElementHTML: ({ index, layer, enableButton, }: {
        index: number;
        layer: Layer;
        enableButton: boolean;
    }) => string;
}
declare module "src/TilemapEditor/utils" {
    import { Layer } from "src/TilemapEditor/store";
    export const toBase64: (file: File) => Promise<unknown>;
    export const drawGrid: (w: number, h: number, ctx: CanvasRenderingContext2D, step?: number, color?: string) => void;
    export const decoupleReferenceFromObj: (obj: unknown) => any;
    export const getEmptyLayer: (name?: string) => Layer;
}
declare module "src/TilemapEditor/features" {
    import { AllAppState, Frame, Tile, TileMap, XY } from "src/TilemapEditor/store";
    export const getEmptyMap: (name?: string, mapWidth?: number, mapHeight?: number, tileSize?: number, gridColor?: string) => {
        layers: import("src/TilemapEditor/store").Layer[];
        name: string;
        mapWidth: number;
        mapHeight: number;
        tileSize: number;
        width: number;
        height: number;
        gridColor: string;
    };
    export const getTileData: (x?: number, y?: number) => Tile;
    export const shouldHideSymbols: () => boolean;
    export const getAppState: () => AllAppState | null;
    export const onUpdateState: () => void;
    export const draw: (shouldDrawGrid?: boolean) => void;
    export const getSelectedTile: (event: MouseEvent) => {
        x: number;
        y: number;
        tilesetIdx: number;
        tileSymbol: string;
        isFlippedX?: boolean | undefined;
    }[];
    export const setActiveTool: (toolIdx: number) => void;
    export const updateSelection: (autoSelectTool?: boolean) => void;
    export const setMouseIsTrue: (e: MouseEvent) => void;
    export const setMouseIsFalse: (e: MouseEvent) => void;
    export const removeTile: (key: string) => void;
    export const getCurrentFrames: () => Frame;
    export const getSelectedFrameCount: () => number;
    export const shouldNotAddAnimatedTile: () => boolean;
    export const addTile: (key: string) => void;
    export const addRandomTile: (key: string) => void;
    export const fillEmptyOrSameTiles: (key: string) => void;
    export const updateTilesetGridContainer: () => void;
    export const selectMode: (mode?: string) => void;
    export const downloadAsTextFile: (input: unknown, fileName?: string) => void;
    export const getTilesAnalisis: (ctx: CanvasRenderingContext2D, width: number, height: number, sizeOfTile: number) => {
        analizedTiles: Record<string, {
            uuid: number;
            coords: XY[];
            times: number;
            tileData: ImageData;
        }>;
        uniqueTiles: number;
    };
    export const updateMapSize: (size: Partial<TileMap>) => void;
    export const clearUndoStack: () => void;
    export const addToUndoStack: () => void;
    export const updateZoom: () => void;
    export const getCurrentAnimation: (getAnim?: string) => {
        start: number;
        end: number;
        name?: string | undefined;
        loop: boolean;
        speed: number;
    } | undefined;
    export const updateTilesetDataList: (populateFrames?: boolean) => void;
    export const reevaluateTilesetsData: () => void;
    export const setCropSize: (newSize: number) => void;
    export const setLayer: (newLayer: number) => void;
    export const updateLayers: () => void;
    export const getTile: (key: string, allLayers?: boolean) => boolean;
    export const setActiveMap: (id: string) => void;
    export const reloadTilesets: () => void;
    export const updateMaps: () => void;
    export const restoreFromUndoStackData: () => void;
}
declare module "src/TilemapEditor/init/index" {
    import { ApiTileMapExporters, ApiTileMapImporters, ApiTileSetLoaders, AppState, FlattenedDataItem, ImageJSON, TileMapData } from "src/TilemapEditor/store";
    const _default_2: (exports: Function) => (attachToId: string, { tileMapData, tileSize, mapWidth, mapHeight, tileSetImages, applyButtonText, onApply, tileSetLoaders, tileMapExporters, tileMapImporters, onUpdate, onMouseUp, appState, }: {
        tileMapData: TileMapData;
        tileSize: number;
        mapWidth: number;
        mapHeight: number;
        tileSetImages: ImageJSON[];
        applyButtonText: string;
        onApply?: {
            onClick: (data: FlattenedDataItem) => void;
        } | undefined;
        tileSetLoaders: ApiTileSetLoaders;
        tileMapExporters: ApiTileMapExporters;
        tileMapImporters: ApiTileMapImporters;
        onUpdate?: (() => void) | undefined;
        onMouseUp?: (() => void) | undefined;
        appState: AppState;
    }) => void;
    export default _default_2;
}
declare module "src/TilemapEditor/index" {
    export default class TilemapEditor {
        static toBase64: (file: File) => Promise<unknown>;
        static getLayers: () => import("src/TilemapEditor/store").Layer[];
        static init: (attachToId: string, { tileMapData, tileSize, mapWidth, mapHeight, tileSetImages, applyButtonText, onApply, tileSetLoaders, tileMapExporters, tileMapImporters, onUpdate, onMouseUp, appState, }: {
            tileMapData: import("src/TilemapEditor/store").TileMapData;
            tileSize: number;
            mapWidth: number;
            mapHeight: number;
            tileSetImages: import("src/TilemapEditor/store").ImageJSON[];
            applyButtonText: string;
            onApply?: {
                onClick: (data: any) => void;
            } | undefined;
            tileSetLoaders: import("src/TilemapEditor/store").ApiTileSetLoaders;
            tileMapExporters: import("src/TilemapEditor/store").ApiTileMapExporters;
            tileMapImporters: import("src/TilemapEditor/store").ApiTileMapImporters;
            onUpdate?: (() => void) | undefined;
            onMouseUp?: (() => void) | undefined;
            appState: import("src/TilemapEditor/store").AppState;
        }) => void;
        static getState: () => import("src/TilemapEditor/store").AllAppState | null;
        static onUpdate: (...args: unknown[]) => void;
        static onMouseUp: (getAppState: unknown, apiTileMapExporters: unknown) => void;
        static getTilesets: () => Record<string, import("src/TilemapEditor/store").TileSet>;
    }
}
declare module "src/constants/tileSetImages" {
    import { ImageJSON } from "src/TilemapEditor/store";
    const _default_3: ImageJSON[];
    export default _default_3;
}
declare module "src/kaboomJsExport" {
    import { FlattenedData, TileSet } from "src/TilemapEditor/store";
    const _default_4: ({ flattenedData, tileSets, }: {
        flattenedData: FlattenedData;
        tileSets: Record<string, TileSet>;
    }) => string;
    export default _default_4;
}
declare module "src/uploadImageToImgur" {
    const _default_5: (blob: Blob) => Promise<any>;
    export default _default_5;
}
declare module "src/index" { }
declare module "src/constants/ioJsonData" {
    import { TileMapData } from "src/TilemapEditor/store";
    const _default_6: TileMapData;
    export default _default_6;
}
