// Make signalBox draggable
const signalBox = document.getElementById("signalBox");
let isDragging = false, offsetX, offsetY;

signalBox.addEventListener("mousedown", function(e) {
  isDragging = true;
  offsetX = e.clientX - signalBox.offsetLeft;
  offsetY = e.clientY - signalBox.offsetTop;
});

document.addEventListener("mousemove", function(e) {
  if (isDragging) {
    signalBox.style.left = e.clientX - offsetX + "px";
    signalBox.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", function() {
  isDragging = false;
});
function updateSignalBox(signal, entry, stopLoss, target) {
  const box = document.querySelector('#signalBox .info-content');
  box.innerHTML = `
    <p><strong>Signal:</strong> ${signal}</p>
    <p><strong>Entry:</strong> ${entry.toFixed(2)}</p>
    <p><strong>Stop Loss:</strong> ${stopLoss.toFixed(2)}</p>
    <p><strong>Target:</strong> ${target.toFixed(2)}</p>
  `;
}
// Add SMA lines
chartApi.createMovingAverage({ length: 22, color: '#00ff00' }); // Green
chartApi.createMovingAverage({ length: 33, color: '#0000ff' }); // Blue
chartApi.createMovingAverage({ length: 44, color: '#ff0000' }); // Red
function createMovingAverage({ length, color }) {
  chartApi.createShape({
    shape: 'moving_average',
    options: {
      length: length,
      type: 'sma',
      color: color,
      lineWidth: 2,
    }
  });
}

// make it global
window.chartApi.createMovingAverage = createMovingAverage;
