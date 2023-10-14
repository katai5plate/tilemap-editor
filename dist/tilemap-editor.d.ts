declare module "src/getImgurGallery" {
    const _default: (album_id: any, cb: any) => void;
    export default _default;
}
declare module "src/getMapFromGist" {
    const _default_1: (gistId: any, cb: any) => void;
    export default _default_1;
}
declare module "src/helper" {
    export const target: (e: Event) => HTMLInputElement & {
        result: any;
    };
}
declare module "src/constants/tileSetImages" {
    const _default_2: ({
        src: string;
        name: string;
        tileSize: number;
        link: string;
        description: string;
    } | {
        src: string;
        name?: undefined;
        tileSize?: undefined;
        link?: undefined;
        description?: undefined;
    })[];
    export default _default_2;
}
declare module "src/kaboomJsExport" {
    const _default_3: ({ flattenedData, tileSets, }: {
        flattenedData: any;
        tileSets: any;
    }) => string;
    export default _default_3;
}
declare module "src/uploadImageToImgur" {
    const _default_4: (blob: any) => Promise<any>;
    export default _default_4;
}
declare module "src/constants/html" {
    export const tilemapEditorRootHTML: ({ width, height, mapTileWidth }: {
        width: any;
        height: any;
        mapTileWidth: any;
    }) => string;
    export const activeLayerLabelHTML: ({ name, opacity }: {
        name: any;
        opacity: any;
    }) => string;
    export const layersElementHTML: ({ index, layer, enableButton }: {
        index: any;
        layer: any;
        enableButton: any;
    }) => string;
}
declare module "src/TilemapEditor/utils" {
    export const toBase64: (file: any) => Promise<unknown>;
    export const drawGrid: (w: any, h: any, ctx: any, step?: number, color?: string) => void;
    export const decoupleReferenceFromObj: (obj: any) => any;
    export const getEmptyLayer: (name?: string) => {
        tiles: {};
        visible: boolean;
        name: string;
        animatedTiles: {};
        opacity: number;
    };
}
declare module "src/TilemapEditor/type" {
    export interface XY {
        x: number;
        y: number;
    }
    export type Tile = XY & {
        tilesetIdx: number;
        tileSymbol: string;
        isFlippedX: boolean;
    };
    export type QS<E> = E | null | undefined;
    export interface Layer {
        tiles: Record<number, Tile>;
        visible: boolean;
        name: string;
        animatedTiles: {};
        opacity: number;
    }
}
declare module "src/TilemapEditor/state" {
    import { Layer, Tile, XY } from "src/TilemapEditor/type";
    const _default_5: {
        state$el: {
            tileFrameCount: () => HTMLInputElement;
            animStart: () => HTMLInputElement;
            animEnd: () => HTMLInputElement;
            renameTileFrameBtn: () => HTMLButtonElement;
            renameTileAnimBtn: () => HTMLButtonElement;
            animSpeed: () => HTMLInputElement;
            animLoop: () => HTMLInputElement;
        };
        init$tilesetImage: HTMLImageElement;
        init$canvas: HTMLCanvasElement;
        init$tilesetContainer: HTMLElement;
        init$tilesetSelection: HTMLElement;
        init$cropSize: HTMLInputElement;
        init$confirmBtn: any;
        init$layersElement: HTMLElement;
        init$tileDataSel: HTMLSelectElement;
        init$tileFrameSel: HTMLSelectElement;
        init$tileAnimSel: HTMLSelectElement;
        init$tilesetDataSel: HTMLSelectElement;
        init$mapsDataSel: HTMLSelectElement;
        init$objectParametersEditor: HTMLElement;
        mul$mapTileHeight: number;
        mul$mapTileWidth: number;
        reloadTilesets$TILESET_ELEMENTS: (HTMLImageElement & {
            tileSize?: any;
        })[];
        mul$IMAGES: {
            src: string;
            tileSize?: number;
            name?: string;
            link?: string;
            description?: string;
        }[];
        mul$ZOOM: number;
        mul$SIZE_OF_CROP: number;
        mul$WIDTH: number;
        mul$HEIGHT: number;
        mul$PREV_ACTIVE_TOOL: number;
        mul$ACTIVE_TOOL: number;
        mul$ACTIVE_MAP: string;
        toggleSymbolsVisible$DISPLAY_SYMBOLS: boolean;
        init$SHOW_GRID: boolean;
        mul$selection: Tile[];
        setLayer$currentLayer: number;
        mul$isMouseDown: boolean;
        mul$maps: {
            [key: string]: {
                name: string;
                layers: Layer[];
                mapWidth: number;
                mapHeight: number;
                tileSet?: unknown;
                gridColor: string;
                tileSize: number;
            };
        };
        mul$tileSets: {
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
        };
        init_state$apiTileSetLoaders: {
            base64: {
                name: string;
                onSelectImage: (setSrc: any, file: any, base64: any) => void;
            };
        };
        init_state$selectedTileSetLoader: {
            onSelectImage: (replaceSelectedTileSet: any, file: any, base64Src: any) => void;
            prompt: (replaceSelectedTileSet: any) => void;
        };
        init_state$apiTileMapExporters: {
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
        };
        init_state$apiTileMapImporters: {
            openData: {
                name: string;
                onSelectFiles: (setData: any, files: any) => void;
                acceptFile: string;
            };
        };
        init$apiOnUpdateCallback: (...args: any) => void;
        init$apiOnMouseUp: (getAppState: any, apiTileMapExporters: any) => void;
        getTile$editedEntity: {
            tiles: any;
            isFlippedX: any;
            layer: any;
            name: any;
        };
        updateSelection$selectionSize: number[];
        mul$undoStepPosition: number;
        clearUndoStack$undoStack: {
            maps: any;
            tileSets: any;
            currentLayer: any;
            ACTIVE_MAP: any;
            IMAGES: any;
        }[];
        mul$zoomIndex: number;
        init$tileSelectStart: XY;
    };
    export default _default_5;
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
declare module "src/TilemapEditor/features" {
    import { Tile, XY } from "src/TilemapEditor/type";
    export const getEmptyMap: (name?: string, mapWidth?: number, mapHeight?: number, tileSize?: number, gridColor?: string) => {
        layers: {
            tiles: {};
            visible: boolean;
            name: string;
            animatedTiles: {};
            opacity: number;
        }[];
        name: string;
        mapWidth: number;
        mapHeight: number;
        tileSize: number;
        width: number;
        height: number;
        gridColor: string;
    };
    export const getTileData: (x?: number, y?: number) => any;
    export const shouldHideSymbols: () => boolean;
    export const getAppState: () => {
        tileMapData: {
            tileSets: {
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
            };
            maps: {
                [key: string]: {
                    name: string;
                    layers: import("src/TilemapEditor/type").Layer[];
                    mapWidth: number;
                    mapHeight: number;
                    tileSet?: unknown;
                    gridColor: string;
                    tileSize: number;
                };
            };
        };
        appState: {
            undoStack: {
                maps: any;
                tileSets: any;
                currentLayer: any;
                ACTIVE_MAP: any;
                IMAGES: any;
            }[];
            undoStepPosition: number;
            currentLayer: number;
            PREV_ACTIVE_TOOL: number;
            ACTIVE_TOOL: number;
            ACTIVE_MAP: string;
            SHOW_GRID: boolean;
            selection: Tile[];
        };
    };
    export const onUpdateState: () => void;
    export const draw: (shouldDrawGrid?: boolean) => void;
    export const getSelectedTile: (event: any) => any[];
    export const setActiveTool: (toolIdx: any) => void;
    export const updateSelection: (autoSelectTool?: boolean) => void;
    export const setMouseIsTrue: (e: any) => void;
    export const setMouseIsFalse: (e: any) => void;
    export const removeTile: (key: any) => void;
    export const getCurrentFrames: () => any;
    export const getSelectedFrameCount: () => any;
    export const shouldNotAddAnimatedTile: () => boolean;
    export const addTile: (key: any) => void;
    export const addRandomTile: (key: any) => void;
    export const fillEmptyOrSameTiles: (key: any) => void;
    export const updateTilesetGridContainer: () => void;
    export const selectMode: (mode?: string) => void;
    export const downloadAsTextFile: (input: any, fileName?: string) => void;
    export const getTilesAnalisis: (ctx: any, width: any, height: any, sizeOfTile: any) => {
        analizedTiles: Record<string, {
            uuid: number;
            coords: XY[];
            times: number;
            tileData: ImageData;
        }>;
        uniqueTiles: number;
    };
    export const updateMapSize: (size: any) => void;
    export const clearUndoStack: () => void;
    export const addToUndoStack: () => void;
    export const updateZoom: () => void;
    export const getCurrentAnimation: (getAnim?: any) => any;
    export const updateTilesetDataList: (populateFrames?: boolean) => void;
    export const reevaluateTilesetsData: () => void;
    export const setCropSize: (newSize: any) => void;
    export const setLayer: (newLayer: any) => void;
    export const updateLayers: () => void;
    export const getTile: (key: any, allLayers?: boolean) => boolean;
    export const setActiveMap: (id: any) => void;
    export const reloadTilesets: () => void;
    export const updateMaps: () => void;
    export const restoreFromUndoStackData: () => void;
}
declare module "src/TilemapEditor/init/index" {
    const _default_6: (exports: any) => (attachToId: any, { tileMapData, tileSize, mapWidth, mapHeight, tileSetImages, applyButtonText, onApply, tileSetLoaders, tileMapExporters, tileMapImporters, onUpdate, onMouseUp, appState, }: {
        tileMapData: any;
        tileSize: any;
        mapWidth: any;
        mapHeight: any;
        tileSetImages: any;
        applyButtonText: any;
        onApply: any;
        tileSetLoaders: any;
        tileMapExporters: any;
        tileMapImporters: any;
        onUpdate?: () => void;
        onMouseUp?: () => void;
        appState: any;
    }) => void;
    export default _default_6;
}
declare module "src/TilemapEditor/index" {
    export default class TilemapEditor {
        static toBase64: (file: any) => Promise<unknown>;
        static getLayers: () => import("src/TilemapEditor/type").Layer[];
        static init: (attachToId: any, { tileMapData, tileSize, mapWidth, mapHeight, tileSetImages, applyButtonText, onApply, tileSetLoaders, tileMapExporters, tileMapImporters, onUpdate, onMouseUp, appState, }: {
            tileMapData: any;
            tileSize: any;
            mapWidth: any;
            mapHeight: any;
            tileSetImages: any;
            applyButtonText: any;
            onApply: any;
            tileSetLoaders: any;
            tileMapExporters: any;
            tileMapImporters: any;
            onUpdate?: () => void;
            onMouseUp?: () => void;
            appState: any;
        }) => void;
        static getState: () => {
            tileMapData: {
                tileSets: {
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
                };
                maps: {
                    [key: string]: {
                        name: string;
                        layers: import("src/TilemapEditor/type").Layer[];
                        mapWidth: number;
                        mapHeight: number;
                        tileSet?: unknown;
                        gridColor: string;
                        tileSize: number;
                    };
                };
            };
            appState: {
                undoStack: {
                    maps: any;
                    tileSets: any;
                    currentLayer: any;
                    ACTIVE_MAP: any;
                    IMAGES: any;
                }[];
                undoStepPosition: number;
                currentLayer: number;
                PREV_ACTIVE_TOOL: number;
                ACTIVE_TOOL: number;
                ACTIVE_MAP: string;
                SHOW_GRID: boolean;
                selection: import("src/TilemapEditor/type").Tile[];
            };
        };
        static onUpdate: (...args: any) => void;
        static onMouseUp: (getAppState: any, apiTileMapExporters: any) => void;
        static getTilesets: () => {
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
        };
    }
}
declare module "src/index" { }
declare module "src/constants/ioJsonData" {
    const _default_7: {
        tileSets: {
            0: {
                src: string;
                name: string;
                gridWidth: number;
                gridHeight: number;
                tileCount: number;
                tileData: {
                    "0-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-6": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-7": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-8": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-9": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-10": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-11": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-12": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-13": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-14": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-15": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-16": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-17": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-18": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-19": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-20": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-21": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-22": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-23": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-24": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-25": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-26": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-27": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-28": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-29": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-30": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-31": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-32": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-33": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-34": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-35": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-36": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-37": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-38": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-39": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-40": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-41": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-42": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-43": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-44": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-45": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-46": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-47": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-48": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-49": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-50": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-51": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-52": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-53": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-54": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-55": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-56": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-57": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-58": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-59": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-60": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-61": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-62": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-63": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-64": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-65": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-66": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-67": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-68": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-69": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-70": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-71": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-72": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-73": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-74": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-75": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-76": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-77": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-78": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-79": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-80": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-81": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-82": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-83": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-84": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-85": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-86": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-87": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-88": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-89": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-90": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-91": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-92": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-93": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-94": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-95": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-96": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-97": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-98": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-99": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-100": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-101": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-102": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-103": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-104": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-105": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-106": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-107": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-108": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-109": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-110": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-111": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-112": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-113": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-114": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-115": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-116": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-117": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-118": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-119": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-120": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-121": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-122": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-123": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-124": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-125": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-126": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-127": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-128": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-129": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-130": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-131": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "5-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "6-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "7-132": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                };
                symbolStartIdx: number;
                tileSize: number;
                tags: {
                    "solid()": {
                        name: string;
                        tiles: {
                            "3-3": string;
                            "4-1": string;
                            "5-1": string;
                            "5-2": string;
                            "4-2": string;
                            "7-7": string;
                            "7-8": string;
                            "3-8": string;
                            "4-8": string;
                            "6-1": string;
                            "7-2": string;
                            "6-2": string;
                            "7-1": string;
                            "3-1": {
                                mark: string;
                            };
                            "2-1": {
                                mark: string;
                            };
                            "2-2": {
                                mark: string;
                            };
                            "3-2": {
                                mark: string;
                            };
                            "6-5": {
                                mark: string;
                            };
                            "7-5": {
                                mark: string;
                            };
                        };
                    };
                };
                frames: {
                    anim0: {
                        frameCount: number;
                        width: number;
                        height: number;
                        start: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        tiles: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        }[];
                        name: string;
                        isFlippedX: boolean;
                        xPos: number;
                        yPos: number;
                    };
                    anim2: {
                        frameCount: number;
                        width: number;
                        height: number;
                        start: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        tiles: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        }[];
                        name: string;
                        isFlippedX: boolean;
                        xPos: number;
                        yPos: number;
                    };
                    anim3: {
                        frameCount: number;
                        width: number;
                        height: number;
                        start: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        tiles: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        }[];
                        name: string;
                        isFlippedX: boolean;
                        xPos: number;
                        yPos: number;
                    };
                    anim1: {
                        frameCount: number;
                        width: number;
                        height: number;
                        start: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        tiles: {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        }[];
                        name: string;
                        isFlippedX: boolean;
                        xPos: number;
                        yPos: number;
                    };
                };
                description: string;
            };
            1: {
                src: string;
                name: string;
                gridWidth: number;
                gridHeight: number;
                tileCount: number;
                tileData: {
                    "0-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-0": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-1": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-2": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-3": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-4": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "0-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "1-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "2-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "3-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                    "4-5": {
                        x: number;
                        y: number;
                        tilesetIdx: number;
                        tileSymbol: string;
                    };
                };
                symbolStartIdx: number;
                tileSize: number;
                tags: {};
                frames: {};
                description: string;
            };
        };
        maps: {
            Map_1: {
                layers: ({
                    tiles: {
                        "6-7"?: undefined;
                        "5-9"?: undefined;
                        "5-10"?: undefined;
                        "5-11"?: undefined;
                        "6-12"?: undefined;
                        "6-13"?: undefined;
                        "7-13"?: undefined;
                        "7-14"?: undefined;
                        "8-14"?: undefined;
                        "8-15"?: undefined;
                        "9-15"?: undefined;
                        "10-15"?: undefined;
                        "11-15"?: undefined;
                        "12-16"?: undefined;
                        "13-16"?: undefined;
                        "14-16"?: undefined;
                        "14-15"?: undefined;
                        "15-15"?: undefined;
                        "15-14"?: undefined;
                        "16-14"?: undefined;
                        "16-13"?: undefined;
                        "16-12"?: undefined;
                        "16-11"?: undefined;
                        "16-10"?: undefined;
                        "16-9"?: undefined;
                        "16-8"?: undefined;
                        "15-8"?: undefined;
                        "15-7"?: undefined;
                        "15-6"?: undefined;
                        "15-5"?: undefined;
                        "14-5"?: undefined;
                        "14-4"?: undefined;
                        "14-3"?: undefined;
                        "13-3"?: undefined;
                        "13-4"?: undefined;
                        "12-4"?: undefined;
                        "11-4"?: undefined;
                        "10-4"?: undefined;
                        "9-4"?: undefined;
                        "8-4"?: undefined;
                        "8-5"?: undefined;
                        "7-5"?: undefined;
                        "6-6"?: undefined;
                        "5-7"?: undefined;
                        "6-8"?: undefined;
                        "9-11"?: undefined;
                        "9-12"?: undefined;
                        "10-12"?: undefined;
                        "11-12"?: undefined;
                        "12-12"?: undefined;
                        "13-12"?: undefined;
                        "14-12"?: undefined;
                        "14-11"?: undefined;
                        "10-7"?: undefined;
                        "10-8"?: undefined;
                        "12-7"?: undefined;
                        "12-8"?: undefined;
                    };
                    visible: boolean;
                    name: string;
                } | {
                    tiles: {
                        "6-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "7-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "7-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "8-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "8-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "9-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "10-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "11-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "12-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "13-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "15-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "15-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "16-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "15-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "15-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "15-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "15-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "13-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "13-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "12-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "11-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "10-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "9-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "8-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "8-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "7-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "9-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "9-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "10-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "11-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "12-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "13-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "14-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "10-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "10-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "12-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "12-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                    };
                    visible: boolean;
                    name: string;
                })[];
                name: string;
                mapWidth: number;
                mapHeight: number;
                tileSize: number;
                width: number;
                height: number;
            };
            Map_2: {
                layers: ({
                    tiles: {
                        "0-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-0": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-1": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-2": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-3": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-4": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-14": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "2-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-15": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX?: undefined;
                        };
                        "5-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX?: undefined;
                        };
                        "6-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX?: undefined;
                        };
                        "5-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX?: undefined;
                        };
                        "6-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "3-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-20": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "0-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-21": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "1-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "1-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "2-18": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "2-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "1-19": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                    };
                    visible: boolean;
                    name: string;
                    animatedTiles: {
                        "3-1": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "1-7"?: undefined;
                        "4-12"?: undefined;
                        "1-3"?: undefined;
                        "5-5"?: undefined;
                        "3-10"?: undefined;
                        "4-7"?: undefined;
                    };
                    opacity?: undefined;
                } | {
                    tiles: {
                        "2-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "1-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-13": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-12": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "6-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-5": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-6": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-8": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-10": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "2-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-11": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "5-9": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "3-7": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                        };
                        "4-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "4-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "5-16": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "5-17": {
                            x: number;
                            y: number;
                            tilesetIdx: number;
                            tileSymbol: string;
                            isFlippedX: boolean;
                        };
                        "0-0"?: undefined;
                        "1-0"?: undefined;
                        "2-0"?: undefined;
                        "3-0"?: undefined;
                        "4-0"?: undefined;
                        "5-0"?: undefined;
                        "6-0"?: undefined;
                        "0-1"?: undefined;
                        "1-1"?: undefined;
                        "2-1"?: undefined;
                        "3-1"?: undefined;
                        "4-1"?: undefined;
                        "5-1"?: undefined;
                        "6-1"?: undefined;
                        "0-2"?: undefined;
                        "1-2"?: undefined;
                        "2-2"?: undefined;
                        "3-2"?: undefined;
                        "4-2"?: undefined;
                        "5-2"?: undefined;
                        "6-2"?: undefined;
                        "0-3"?: undefined;
                        "1-3"?: undefined;
                        "2-3"?: undefined;
                        "3-3"?: undefined;
                        "4-3"?: undefined;
                        "5-3"?: undefined;
                        "6-3"?: undefined;
                        "0-4"?: undefined;
                        "1-4"?: undefined;
                        "2-4"?: undefined;
                        "3-4"?: undefined;
                        "4-4"?: undefined;
                        "5-4"?: undefined;
                        "6-4"?: undefined;
                        "0-5"?: undefined;
                        "1-5"?: undefined;
                        "2-5"?: undefined;
                        "5-5"?: undefined;
                        "6-5"?: undefined;
                        "0-6"?: undefined;
                        "1-6"?: undefined;
                        "6-6"?: undefined;
                        "0-7"?: undefined;
                        "6-7"?: undefined;
                        "0-8"?: undefined;
                        "0-9"?: undefined;
                        "0-10"?: undefined;
                        "0-11"?: undefined;
                        "6-11"?: undefined;
                        "0-12"?: undefined;
                        "5-12"?: undefined;
                        "6-12"?: undefined;
                        "0-13"?: undefined;
                        "1-13"?: undefined;
                        "4-13"?: undefined;
                        "5-13"?: undefined;
                        "6-13"?: undefined;
                        "0-14"?: undefined;
                        "1-14"?: undefined;
                        "2-14"?: undefined;
                        "3-14"?: undefined;
                        "4-14"?: undefined;
                        "5-14"?: undefined;
                        "6-14"?: undefined;
                        "0-15"?: undefined;
                        "1-15"?: undefined;
                        "2-15"?: undefined;
                        "3-15"?: undefined;
                        "4-15"?: undefined;
                        "5-15"?: undefined;
                        "6-15"?: undefined;
                        "0-16"?: undefined;
                        "2-16"?: undefined;
                        "3-16"?: undefined;
                        "6-16"?: undefined;
                        "0-17"?: undefined;
                        "3-17"?: undefined;
                        "6-17"?: undefined;
                        "0-18"?: undefined;
                        "3-18"?: undefined;
                        "4-18"?: undefined;
                        "5-18"?: undefined;
                        "6-18"?: undefined;
                        "0-19"?: undefined;
                        "2-19"?: undefined;
                        "3-19"?: undefined;
                        "4-19"?: undefined;
                        "5-19"?: undefined;
                        "6-19"?: undefined;
                        "0-20"?: undefined;
                        "1-20"?: undefined;
                        "2-20"?: undefined;
                        "3-20"?: undefined;
                        "4-20"?: undefined;
                        "5-20"?: undefined;
                        "6-20"?: undefined;
                        "0-21"?: undefined;
                        "1-21"?: undefined;
                        "2-21"?: undefined;
                        "3-21"?: undefined;
                        "4-21"?: undefined;
                        "5-21"?: undefined;
                        "6-21"?: undefined;
                        "1-16"?: undefined;
                        "1-17"?: undefined;
                        "1-18"?: undefined;
                        "2-18"?: undefined;
                        "2-17"?: undefined;
                        "1-19"?: undefined;
                    };
                    visible: boolean;
                    name: string;
                    opacity: number;
                    animatedTiles?: undefined;
                } | {
                    tiles: {
                        "0-0"?: undefined;
                        "1-0"?: undefined;
                        "2-0"?: undefined;
                        "3-0"?: undefined;
                        "4-0"?: undefined;
                        "5-0"?: undefined;
                        "6-0"?: undefined;
                        "0-1"?: undefined;
                        "1-1"?: undefined;
                        "2-1"?: undefined;
                        "3-1"?: undefined;
                        "4-1"?: undefined;
                        "5-1"?: undefined;
                        "6-1"?: undefined;
                        "0-2"?: undefined;
                        "1-2"?: undefined;
                        "2-2"?: undefined;
                        "3-2"?: undefined;
                        "4-2"?: undefined;
                        "5-2"?: undefined;
                        "6-2"?: undefined;
                        "0-3"?: undefined;
                        "1-3"?: undefined;
                        "2-3"?: undefined;
                        "3-3"?: undefined;
                        "4-3"?: undefined;
                        "5-3"?: undefined;
                        "6-3"?: undefined;
                        "0-4"?: undefined;
                        "1-4"?: undefined;
                        "2-4"?: undefined;
                        "3-4"?: undefined;
                        "4-4"?: undefined;
                        "5-4"?: undefined;
                        "6-4"?: undefined;
                        "0-5"?: undefined;
                        "1-5"?: undefined;
                        "2-5"?: undefined;
                        "3-5"?: undefined;
                        "4-5"?: undefined;
                        "5-5"?: undefined;
                        "6-5"?: undefined;
                        "0-6"?: undefined;
                        "1-6"?: undefined;
                        "2-6"?: undefined;
                        "3-6"?: undefined;
                        "4-6"?: undefined;
                        "5-6"?: undefined;
                        "6-6"?: undefined;
                        "0-7"?: undefined;
                        "1-7"?: undefined;
                        "2-7"?: undefined;
                        "3-7"?: undefined;
                        "4-7"?: undefined;
                        "5-7"?: undefined;
                        "6-7"?: undefined;
                        "0-8"?: undefined;
                        "1-8"?: undefined;
                        "2-8"?: undefined;
                        "3-8"?: undefined;
                        "4-8"?: undefined;
                        "5-8"?: undefined;
                        "6-8"?: undefined;
                        "0-9"?: undefined;
                        "1-9"?: undefined;
                        "2-9"?: undefined;
                        "3-9"?: undefined;
                        "4-9"?: undefined;
                        "5-9"?: undefined;
                        "6-9"?: undefined;
                        "0-10"?: undefined;
                        "1-10"?: undefined;
                        "2-10"?: undefined;
                        "3-10"?: undefined;
                        "4-10"?: undefined;
                        "5-10"?: undefined;
                        "6-10"?: undefined;
                        "0-11"?: undefined;
                        "1-11"?: undefined;
                        "2-11"?: undefined;
                        "3-11"?: undefined;
                        "4-11"?: undefined;
                        "5-11"?: undefined;
                        "6-11"?: undefined;
                        "0-12"?: undefined;
                        "1-12"?: undefined;
                        "2-12"?: undefined;
                        "3-12"?: undefined;
                        "4-12"?: undefined;
                        "5-12"?: undefined;
                        "6-12"?: undefined;
                        "0-13"?: undefined;
                        "1-13"?: undefined;
                        "2-13"?: undefined;
                        "3-13"?: undefined;
                        "4-13"?: undefined;
                        "5-13"?: undefined;
                        "6-13"?: undefined;
                        "0-14"?: undefined;
                        "1-14"?: undefined;
                        "2-14"?: undefined;
                        "3-14"?: undefined;
                        "4-14"?: undefined;
                        "5-14"?: undefined;
                        "6-14"?: undefined;
                        "0-15"?: undefined;
                        "1-15"?: undefined;
                        "2-15"?: undefined;
                        "3-15"?: undefined;
                        "4-15"?: undefined;
                        "5-15"?: undefined;
                        "6-15"?: undefined;
                        "0-16"?: undefined;
                        "2-16"?: undefined;
                        "3-16"?: undefined;
                        "4-16"?: undefined;
                        "5-16"?: undefined;
                        "6-16"?: undefined;
                        "0-17"?: undefined;
                        "3-17"?: undefined;
                        "4-17"?: undefined;
                        "5-17"?: undefined;
                        "6-17"?: undefined;
                        "0-18"?: undefined;
                        "3-18"?: undefined;
                        "4-18"?: undefined;
                        "5-18"?: undefined;
                        "6-18"?: undefined;
                        "0-19"?: undefined;
                        "2-19"?: undefined;
                        "3-19"?: undefined;
                        "4-19"?: undefined;
                        "5-19"?: undefined;
                        "6-19"?: undefined;
                        "0-20"?: undefined;
                        "1-20"?: undefined;
                        "2-20"?: undefined;
                        "3-20"?: undefined;
                        "4-20"?: undefined;
                        "5-20"?: undefined;
                        "6-20"?: undefined;
                        "0-21"?: undefined;
                        "1-21"?: undefined;
                        "2-21"?: undefined;
                        "3-21"?: undefined;
                        "4-21"?: undefined;
                        "5-21"?: undefined;
                        "6-21"?: undefined;
                        "1-16"?: undefined;
                        "1-17"?: undefined;
                        "1-18"?: undefined;
                        "2-18"?: undefined;
                        "2-17"?: undefined;
                        "1-19"?: undefined;
                    };
                    visible: boolean;
                    name: string;
                    animatedTiles: {
                        "1-7": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "4-12": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "1-3": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "5-5": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "3-10": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "4-7": {
                            frameCount: number;
                            width: number;
                            height: number;
                            start: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            };
                            tiles: {
                                x: number;
                                y: number;
                                tilesetIdx: number;
                                tileSymbol: string;
                            }[];
                            name: string;
                            layer: number;
                            isFlippedX: boolean;
                            xPos: number;
                            yPos: number;
                        };
                        "3-1"?: undefined;
                    };
                    opacity: number;
                })[];
                name: string;
                mapWidth: number;
                mapHeight: number;
                tileSize: number;
                width: number;
                height: number;
            };
        };
    };
    export default _default_7;
}
