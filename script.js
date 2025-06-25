new TradingView.widget({
  container_id: "tv_chart_container",
  autosize: true,
  symbol: "OANDA:XAUUSD",  // Default: GOLD
  interval: "3",  // 3-minute timeframe
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  toolbar_bg: "#000000",
  enable_publishing: false,
  hide_side_toolbar: false,
  allow_symbol_change: true,
  studies: [
    "Moving Average@tv-basicstudies",   // 22 SMA
    "Moving Average@tv-basicstudies",   // 33 SMA
    "Moving Average@tv-basicstudies"    // 44 SMA
  ],
  overrides: {
    "moving_average.linewidth": 2,
    "moving_average_1.length": 22,
    "moving_average_1.color": "#00FF00",
    "moving_average_2.length": 33,
    "moving_average_2.color": "#FFA500",
    "moving_average_3.length": 44,
    "moving_average_3.color": "#FF0000"
  },
  studies_overrides: {},
});
// Dragging Logic for Signal Box
const signalBox = document.getElementById("signal-box");
let isDragging = false, offsetX = 0, offsetY = 0;

signalBox.addEventListener("mousedown", function (e) {
  isDragging = true;
  offsetX = e.clientX - signalBox.offsetLeft;
  offsetY = e.clientY - signalBox.offsetTop;
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    signalBox.style.left = e.clientX - offsetX + "px";
    signalBox.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
});
function updateSignal(data) {
  if (data.length < 5) return;

  const lastCandle = data[data.length - 1];
  const prevCandle = data[data.length - 2];

  // Simple Moving Average (22)
  const smaPeriod = 22;
  const closes = data.slice(-smaPeriod).map(c => c.close);
  const sma = closes.reduce((a, b) => a + b, 0) / smaPeriod;

  const isSmaRising = closes[smaPeriod - 1] > closes[smaPeriod - 2];
  const isSmaFalling = closes[smaPeriod - 1] < closes[smaPeriod - 2];

  let direction = "-", entry = "-", sl = "-", target = "-";

  if (lastCandle.close > sma && isSmaRising) {
    direction = "BUY";
    entry = lastCandle.close;
    sl = lastCandle.low;
    target = entry + (entry - sl) * 2;
  } else if (lastCandle.close < sma && isSmaFalling) {
    direction = "SELL";
    entry = lastCandle.close;
    sl = lastCandle.high;
    target = entry - (sl - entry) * 2;
  }

  // Update box
  document.getElementById("signal-direction").innerText = direction;
  document.getElementById("signal-entry").innerText = entry.toFixed(2);
  document.getElementById("signal-sl").innerText = sl.toFixed(2);
  document.getElementById("signal-target").innerText = target.toFixed(2);
}
fetchCandles();

async function fetchCandles() {
  const response = await fetch('https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=1m&limit=100');
  const json = await response.json();
  const chartData = json.map(c => ({
    time: c[0] / 1000,
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4])
  }));

  drawChart(chartData); // तुमचं चार्ट update function
  updateSignal(chartData); // 👈 हे इथे कॉल करा
}
