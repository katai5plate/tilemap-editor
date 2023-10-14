import { TileMapData } from "./TilemapEditor/store";

export default (gistId: string, cb: (mapFound: TileMapData) => void) => {
  console.log("Trying to get gist", `https://api.github.com/gists/=${gistId}`);
  fetch(`https://api.github.com/gists/${gistId}`)
    .then((blob) => blob.json())
    .then((data) => {
      let mapFound: TileMapData;
      Object.entries(data.files).forEach(([key, val]: any) => {
        if (!mapFound && key.endsWith(".json")) {
          fetch(val.raw_url)
            .then((blob) => blob.json())
            .then((jsonData) => {
              mapFound = jsonData;
              console.log("Got map!", mapFound);
              cb(mapFound);
            });
        }
      });
    });
};
