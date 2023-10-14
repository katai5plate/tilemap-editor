// upload to imgur, then return the src
export default (blob: Blob) => {
  const formData = new FormData();
  formData.append("type", "file");
  formData.append("image", blob);
  return fetch("https://api.imgur.com/3/upload.json", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Client-ID 1bddacd2afe5039", // imgur specific
    },
    body: formData,
  })
    .then((response) => {
      if (response.status === 200 || response.status === 0)
        return Promise.resolve(response);
      return Promise.reject(new Error("Error loading image"));
    })
    .then((response) => response.json());
};
