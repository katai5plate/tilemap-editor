import { Tile, TileSet } from "./TilemapEditor/store";

// kaboomJs example exporter
export default ({
  flattenedData,
  // maps,
  // activeMap,
  // downloadAsTextFile,
  tileSets,
}: {
  flattenedData: { flattenedData: [] }[];
  tileSets: Record<string, TileSet>;
}) => {
  const getTileData = (tileSet: TileSet, tileSetIdx: number) =>
    Array.from({ length: tileSet.tileCount }, (x, i) => i)
      .map((tile) => {
        const x = tile % tileSet.gridWidth;
        const y = Math.floor(tile / tileSet.gridWidth);
        const tileKey = `${x}-${y}`;

        const tags = Object.keys(tileSet.tags).filter(
          (tagKey) => !!tileSet.tags[tagKey]?.tiles[tileKey]
        );
        return `"${tileSet.tileData[tileKey]?.tileSymbol}": [
          sprite("tileset-${tileSetIdx}", { frame: ${tile}, }),
          ${tags?.join(",") || ""}
        ],`;
      })
      .join("\n");

  const getAsciiMap = (flattenedDataLayer: Tile[][]) =>
    `\n${
      flattenedDataLayer
        .map(
          (row, rowIndex) => "'" + row.map((tile) => tile.tileSymbol).join("")
        )
        .join("',\n") + "'"
    }`;

  console.log("TILESETS", tileSets, flattenedData);
  const kaboomBoiler = `
      kaboom({
        global: true,
        fullscreen: true,
        scale: 1,
        debug: true,
        clearColor: [0, 0, 0, 1],
      });

      // Load assets
      ${Object.values<TileSet>(tileSets)
        .map(
          (tileSet, tileSetIdx) => `
            loadSprite("tileset-${tileSetIdx}", "${tileSet.src}", {
            sliceX: ${tileSet.gridWidth},
            sliceY: ${tileSet.gridHeight},
        });
      `
        )
        .join("\n")}


      scene("main", () => {
      // tileset
        ${Object.values(tileSets)
          .map(
            (tileSet: any, tileSetIdx) => `
            const tileset_${tileSetIdx}_data = {
            width: ${tileSet.tileSize},
            height: ${tileSet.tileSize},
            pos: vec2(0, 0),
             ${getTileData(tileSet, tileSetIdx)}
             };
        `
          )
          .join("\n")}
      // maps
      ${flattenedData
        .map(
          (map, index) => `
        const map_${index} = [${getAsciiMap(
            map.flattenedData[map.flattenedData.length - 1]
          )}];
      `
        )
        .join("\n")}

      addLevel(map_0, tileset_0_data);
      })

      start("main");
      `;
  console.log(kaboomBoiler);
  // return the transformed data in the end
  return kaboomBoiler;
};
