// Load TradingView chart widget
new TradingView.widget({
  autosize: true,
  symbol: "OANDA:XAUUSD",
  interval: "1",
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  container_id: "tv_chart_container",
  studies: [
    "MASimple@tv-basicstudies", // 22 SMA
    "MASimple@tv-basicstudies", // 33 SMA
    "MASimple@tv-basicstudies"  // 44 SMA
  ],
  overrides: {
    "moving average.ma.linewidth": 2,
    "moving average.ma.color.0": "#00ff00", // 22 - Green
    "moving average.ma.color.1": "#ffff00", // 33 - Yellow
    "moving average.ma.color.2": "#ff0000"  // 44 - Red
  }
});

// Drag box movement logic
document.addEventListener("DOMContentLoaded", function () {
  const box = document.querySelector(".draggable-box");
  let offsetX, offsetY, isDragging = false;

  box.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - box.offsetLeft;
    offsetY = e.clientY - box.offsetTop;
  });

  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      box.style.left = `${e.clientX - offsetX}px`;
      box.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });
});
