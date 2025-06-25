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
