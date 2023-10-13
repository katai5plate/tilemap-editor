//Get imgur gallery from an id  -- example: SjjsjTm
export default (album_id, cb) => {
  const api_key = "a85ae3a537d345f";
  const request_url = "https://api.imgur.com/3/album/" + album_id;
  const requestAlbum = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        processRequest(req.responseText);
      } else {
        console.log("Error with Imgur Request.");
      }
    };
    req.open("GET", request_url, true); // true for asynchronous
    req.setRequestHeader("Authorization", "Client-ID " + api_key);
    req.send(null);
  };
  const processRequest = (response_text) => {
    if (response_text == "Not found") {
      console.log("Imgur album not found.");
    } else {
      const json = JSON.parse(response_text);
      console.log("Got images from imgur", json);
      cb(json.data);
    }
  };
  requestAlbum();
};
