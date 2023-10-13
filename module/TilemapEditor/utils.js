//@ts-check
export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const drawGrid = (
  w,
  h,
  ctx,
  step = 16,
  color = "rgba(0,255,217,0.5)"
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = 0; x < w + 1; x += step) {
    ctx.moveTo(x, 0.5);
    ctx.lineTo(x, h + 0.5);
  }
  for (let y = 0; y < h + 1; y += step) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();
};

export const decoupleReferenceFromObj = (obj) =>
  JSON.parse(JSON.stringify(obj));

export const getEmptyLayer = (name = "layer") => ({
  tiles: {},
  visible: true,
  name,
  animatedTiles: {},
  opacity: 1,
});
