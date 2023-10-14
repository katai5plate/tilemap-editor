import { getAppState } from "./features.js";
import init from "./init/index.js";
import { _ } from "./store.js";
import { toBase64 } from "./utils.js";

Object.keys(_.state$el).forEach((key) => {
  (_.state$el as Record<string, () => HTMLElement | null>)[key] = () =>
    document.getElementById(key);
});

export default class TilemapEditor {
  static toBase64 = toBase64;
  static getLayers = () => _.mul$maps[_.mul$ACTIVE_MAP].layers;
  static init = init(TilemapEditor);
  static getState = () => getAppState();
  static onUpdate = _.init$apiOnUpdateCallback;
  static onMouseUp = _.init$apiOnMouseUp;
  static getTilesets = () => _.mul$tileSets;
}
