const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
const maxPointsInformation = document.getElementById("maxPoints");
const generatePointsInput = document.getElementById("generatePoints");
const maxPointInput = document.getElementById("numPoints");

let numPoints = 100;
let ongoingTimeout;

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

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  start(numPoints, canvas.width, canvas.height);
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

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  function drawPolygonWithDelay(index, delay) {
    const polygon = voronoi.polygons(points)[index];
    if (!polygon) return;

    context.beginPath();
    context.moveTo(polygon[0][0], polygon[0][1]);
    polygon.forEach((point) => context.lineTo(point[0], point[1]));
    context.closePath();

    context.strokeStyle = "black";
    context.stroke();

    context.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 0.5)`;
    context.fill();

    if (index < points.length - 1) {
      ongoingTimeout = setTimeout(
        () => drawPolygonWithDelay(index + 1, delay),
        delay
      );
    } else {
      // After all polygons are drawn, draw the points
      drawPoints(points);
    }
  }

  // Adjust the delay based on the number of points
  const delay = Math.max(100 - numPoints, 10);

  drawPolygonWithDelay(0, delay);
}

function drawPoints(points) {
  points.forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, 2, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
  });
}

function start(numPoints, canvasWidth, canvasHeight) {
  const points = generateRandomPoints(numPoints, canvasWidth, canvasHeight);
  drawVoronoiDiagram(points, canvasWidth, canvasHeight);
}
