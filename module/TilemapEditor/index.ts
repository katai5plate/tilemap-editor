import init from "./init/index.js";
import { getAppState } from "./nodep.js";
import _ from "./state.js";
import { toBase64 } from "./utils.js";

Object.keys(_.state$el).forEach((key) => {
  _.state$el[key] = () => document.getElementById(key);
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
