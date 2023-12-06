const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
const maxPointsInformation = document.getElementById("maxPoints");
const generatePointsInput = document.getElementById("generatePoints");
const maxPointInput = document.getElementById("numPoints");

let numPoints = 100;
let ongoingTimeout;
let hue;

// Utils
const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.addEventListener("load", resetCanvas);
generatePointsInput.addEventListener("click", resetCanvas);
maxPointInput.addEventListener("change", (e) => {
  maxPointsInformation.innerText = e.target.value;
  numPoints = e.target.value;
  resetCanvas();
});

function resetCanvas() {
  // Clear the ongoing drawing process
  clearTimeout(ongoingTimeout);
  hue = Math.floor(Math.random() * 360);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  start(numPoints, canvas.width, canvas.height, hue);
}

function generateRandomPoints(numPoints, canvasWidth, canvasHeight) {
  return Array.from({ length: numPoints }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
  }));
}

function drawVoronoiDiagram(points, canvasWidth, canvasHeight) {
  const voronoi = d3
    .voronoi()
    .extent([
      [0, 0],
      [canvasWidth, canvasHeight],
    ])
    .x((d) => d.x)
    .y((d) => d.y);

  function drawPolygonWithDelay(index, hue, alpha) {
    const polygon = voronoi.polygons(points)[index];
    if (!polygon) return;

    context.beginPath();
    context.moveTo(polygon[0][0], polygon[0][1]);
    polygon.forEach((point) => context.lineTo(point[0], point[1]));
    context.closePath();

    context.strokeStyle = `hsl(${hue}, 100%, 30%)`;

    // Use RGBA for fill style with dynamic alpha
    context.fillStyle = `hsla(${hue}, ${randInt(30, 70)}%, ${randInt(
      40,
      60
    )}%, ${alpha})`;

    context.stroke();
    context.fill();

    if (index < points.length - 1) {
      ongoingTimeout = setTimeout(() => {
        drawPolygonWithDelay(index + 1, hue, alpha + 0.001); // Increment alpha
      });
    } else {
      // After all polygons are drawn, draw the points
      drawPoints(points, hue);
    }
  }

  const fixedDelay = 0.0005;
  const delay = Math.max(fixedDelay, fixedDelay + (2000 - numPoints) * 0.009);

  function startDrawing() {
    context.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
    drawPolygonWithDelay(0, hue, 0);
  }

  startDrawing();
}

function drawPoints(points, hue) {


  points.forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, 2, 0, Math.PI * 2);
    context.fillStyle = `hsl(${hue}, 100%, 30%)`;
    context.fill();
  });
}

function start(numPoints, canvasWidth, canvasHeight, hue) {
  const points = generateRandomPoints(numPoints, canvasWidth, canvasHeight);
  drawVoronoiDiagram(points, canvasWidth, canvasHeight, hue);
}
