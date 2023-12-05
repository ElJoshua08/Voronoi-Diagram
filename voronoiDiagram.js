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

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  function drawPolygonWithFadeIn(index, alpha, hue) {
    const polygon = voronoi.polygons(points)[index];
    if (!polygon) return;

    const fadeInSpeed = 1 / 60; // Adjust the speed of the fade-in effect

    context.beginPath();
    context.moveTo(polygon[0][0], polygon[0][1]);

    // Draw each segment with a fade-in effect
    for (let i = 0; i < polygon.length; i++) {
      const currentPoint = polygon[i];
      context.lineTo(currentPoint[0], currentPoint[1]);

      // Increase the alpha (transparency) gradually
      context.globalAlpha = alpha;
    }

    context.closePath();

    context.strokeStyle = `hsl(${hue}, 100%, 30%)`;
    context.fillStyle = `hsl(${hue}, ${randInt(30, 70)}%, ${randInt(40, 60)}%)`;
    context.stroke();
    context.fill();

    context.globalAlpha = 1; // Reset alpha to ensure other drawings are not affected

    if (alpha < 1) {
      const newAlpha = alpha + fadeInSpeed;
      requestAnimationFrame(() => drawPolygonWithFadeIn(index, newAlpha, hue));
    } else if (index < points.length - 1) {
      // Calculate the delay based on the polygon index
      const delay = Math.max(100 - index, 3);

      // Move to the next polygon after completing the current one with a delay
      setTimeout(() => {
        drawPolygonWithFadeIn(index + 1, 0, hue);
      }, delay); // Adjust the delay before moving to the next polygon
    }
  }

  drawPolygonWithFadeIn(0, 0, hue);
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
