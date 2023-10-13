//@ts-check
import importTiledJson from "../importers/tiled.js";
import tileSetImages from "./constants/tileSetImages.js";
import getImgurGallery from "./getImgurGallery.js";
import getMapFromGist from "./getMapFromGist.js";
import kaboomJsExport from "./kaboomJsExport.js";
import uploadImageToImgur from "./uploadImageToImgur.js";
import TilemapEditor from "./TilemapEditor/index.js";
// import ioJsonData from "./constants/ioJsonData.js";

let _tileSetImages = tileSetImages;

importTiledJson();

let tileSize = 32;
let mapWidth = 10;
let mapHeight = 10;
let tileMapData; //= ioJsonData;
const initTilemapEditor = () => {
  console.log("INIT with", { tileSetImages: _tileSetImages, tileSize });
  // TODO move this under after parsing url params and get everything from there
  TilemapEditor.init("tileMapEditor", {
    // The id of the element that will become the tilemap-editor (must exist in your dom)
    // loads tilemap data which was saved before. undefined will start you with an empty map.
    // Takes a parsed json object with a data struct that tiled-editor can read (an object with maps and tileSets):
    // { maps : {...}, tileSets: {...}}
    tileMapData, //TODO this needs to work without tilemapData (new file)
    // tileSize is used to slice the tileset and give the tilemap the right sized grid
    tileSize,
    // How many tiles is the initial map wide
    mapWidth,
    // How many tiles is the initial map tall
    mapHeight,
    // tileset images [{src (required), description (optional)}]
    tileSetImages: _tileSetImages,
    // You can write your own custom load image function here and use it for the tileset src. If you dont, the base64 string will be used instead
    tileSetLoaders: {
      fromUrl: {
        name: "Any url", // name is required and used for the loader's title in the select menu
        prompt: (setSrc) => {
          // Pass prompt ot onSelectImage. Prompt lets you do anything without asking the user to select a file
          const fileUrl = window.prompt(
            "What is the url of the tileset?",
            "https://i.imgur.com/ztwPZOI.png"
          );
          if (fileUrl !== null) setSrc(fileUrl);
        },
      },
      imgur: {
        name: "Imgur (host)",
        onSelectImage: (setSrc, file, base64) => {
          // In case you want them to give you a file from the fs, you can do this instead of prompt
          uploadImageToImgur(file).then((result) => {
            console.log(file, base64);
            console.log("Uploaded to imgur", result);
            setSrc(result.data.link);
          });
        },
      },
    },
    // You can write your own tilemap exporters here. Whatever they return will get added to the export data you get out when you trigger onAppy
    tileMapExporters: {
      // kaboomJs: { // the exporter's key is later used by the onApply option
      //   name: "Download KaboomJs boilerplate code", // name of menu entry
      //   description: "Exports boilerplate js code for KaboomJs",
      //   transformer: ({flattenedData, maps, tileSets, activeMap, downloadAsTextFile})=> {
      //     const text = kaboomJsExport({flattenedData, maps, tileSets, activeMap});
      //     downloadAsTextFile(text, "KaboomJsMapData.js");// you can use this util method to get your text as a file
      //   }
      // },
    },
    tileMapImporters: {
      //similar to the exporters, you can write your own data importer, which will then be added to the file menu
      // tiledImport: {
      //   name: "Import Tiled json file (TODO)", // name of menu entry
      //   onSelectFiles: (setData, files) => { // callback that is triggered when file(s) are selected.
      //     const readFile = new FileReader();
      //     readFile.onload = (e) => {
      //       const json = JSON.parse(e.target.result);
      //       // At this point we got the json data from the tiled file. We need to convert it into
      //       // a data struct that tiled-editor can read (an object with maps and tileSets):
      //       // { maps : {...}, tileSets: {...}}
      //       alert("Not implemented yet... pr welcome ;)");
      //       return;// TODO tiled json file parser
      //
      //       setData(json); // Finally pass that to the setData function, which will load it into tiled-editor
      //     };
      //     readFile.readAsText(files[0]);
      //   },
      //   acceptFile: "application/JSON" // You can control what files are accepted
      // }
    },
    // If passed, a new button gets added to the header, upon being clicked, you can get data from the tilemap editor and trigger events
    onApply: {
      onClick: ({ flattenedData, maps, tileSets, activeMap }) => {
        console.log("onClick, gets the data too");
        const copyText = document.createElement("input");
        document.body.appendChild(copyText);
        copyText.value = kaboomJsExport({
          flattenedData,
          // maps,
          tileSets,
          // activeMap,
        });
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand("copy");

        /* Alert the copied text */
        // alert("Copied the text: " + copyText.value);
        // const kbCode = kaboomJsExport({flattenedData, maps, tileSets, activeMap});
      },
      buttonText: "Copy Kb to clip", // controls the apply button's text
    },
    onUpdate(ev) {
      // callback for when the app updates its state (loaded data, tool, etc)
      // console.log("-->>", ev)
    },
  });
  console.log("Got App State:", TilemapEditor.getState());
};

if (window.location.href.includes("?")) {
  const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
  const imgur = urlParams.get("imgur");
  if (imgur) {
    getImgurGallery(imgur, (data) => {
      console.log("ALBUM", data.images);
      // const images = data.images //description and link
      _tileSetImages = data.images.map((image) => {
        let extractedSourceMatch;
        if (image.description && image.description.includes("tileSize:")) {
          const extractedTileSizeMatch = image.description.match(
            /tileSize\:\s*([0-9]+)/
          );
          if (extractedTileSizeMatch && extractedTileSizeMatch.length > 1) {
            tileSize = parseInt(extractedTileSizeMatch[1], 10);
            console.info("set tileSize from description", tileSize);
            if (tileSize === 8) {
              mapWidth = 20; // Detect map size for a gameboy room
              mapHeight = 18;
            }
          }
          extractedSourceMatch = image.description.match(/source\:\s*(.*)/);
        }
        let extractedTilesetName;
        if (image.description && image.description.includes("name:")) {
          extractedTilesetName = image.description.match(/name\:\s*(.*)/);
        }
        return {
          src: image.link,
          tileSize,
          name: extractedTilesetName.length > 1 ? extractedTilesetName[1] : "",
          description: image.description,
          link:
            extractedSourceMatch && extractedSourceMatch.length > 1
              ? `https://${extractedSourceMatch[1]}`
              : `https://imgur.com/a/${imgur}`,
        };
      });
      initTilemapEditor();
    });
  }
  const gist = urlParams.get("gist");
  if (gist) {
    getMapFromGist(gist, (mapData) => {
      tileMapData = mapData;
      initTilemapEditor();
    });
  }
  const tileSizeParam = urlParams.get("tileSize");
  if (tileSizeParam) {
    tileSize = parseInt(tileSizeParam, 10);
  }
} else {
  initTilemapEditor();
}
// Pwa stuff
let newWorker;
function showUpdateBar() {
  let snackbar = document.getElementById("snackbar");
  if (snackbar) {
    snackbar.className = "show";
  } else {
    console.warn("not found: #snackbar");
  }
}
// The click event on the pop up notification
const reloadLink = document.getElementById("reload");
if (reloadLink) {
  reloadLink.addEventListener("click", function () {
    newWorker.postMessage({ action: "skipWaiting" });
  });
} else {
  console.warn("not found: #reload");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/tilemap-editor/sw.js").then((reg) => {
    console.log("Service Worker Registered");
    reg.addEventListener("updatefound", () => {
      // A wild service worker has appeared in reg.installing!
      newWorker = reg.installing;

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          // Has network.state changed?
          switch (newWorker.state) {
            case "installed":
              if (navigator.serviceWorker.controller) {
                showUpdateBar();
              }
              break;
          }
        });
      } else {
        console.warn("failed: newWorker");
      }
    });
  });
}
let refreshing;
navigator.serviceWorker.addEventListener("controllerchange", function () {
  if (refreshing) return;
  window.location.reload();
  refreshing = true;
});

let deferredPrompt;
const addBtn = document.getElementById("addPwaBtn");
if (addBtn) {
  addBtn.style.display = "none";
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = "block";
    addBtn.addEventListener("click", () => {
      addBtn.style.display = "none";
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });
  });
  window.addEventListener("appinstalled", () => {
    addBtn.style.display = "none";
    deferredPrompt = null;
    console.log("PWA was installed");
  });
} else {
  console.warn("not found: #addPwaBtn");
}
