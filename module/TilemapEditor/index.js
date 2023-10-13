import main from "./main.js";

// (function (root, factory) {
//   if (typeof exports === "object" && typeof exports.nodeName !== "string") {
//     // CommonJS
//     factory(exports);
//   } else {
//     // Browser globals
//     factory((root.TilemapEditor = {}));
//   }
// })(typeof self !== "undefined" ? self : this, main);

const root = typeof self !== "undefined" ? self : this;

if (typeof exports === "object" && typeof exports.nodeName !== "string") {
  // CommonJS
  main(exports);
} else {
  // Browser globals
  root.TilemapEditor = {};
  main(root.TilemapEditor);
}
