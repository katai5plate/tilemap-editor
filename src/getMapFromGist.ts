export default (gistId, cb) => {
  console.log("Trying to get gist", `https://api.github.com/gists/=${gistId}`);
  fetch(`https://api.github.com/gists/${gistId}`)
    .then((blob) => blob.json())
    .then((data) => {
      let mapFound;
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
