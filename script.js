new TradingView.widget({
  container_id: "chart",
  autosize: true,
  symbol: "BINANCE:XAUUSDT",
  interval: "1",
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  studies: [
    { id: "MASimple@tv-basicstudies", inputs: { length: 22 } },
    { id: "MASimple@tv-basicstudies", inputs: { length: 33 } },
    { id: "MASimple@tv-basicstudies", inputs: { length: 44 } }
  ],
  overrides: {
    "moving average.ma.color.0": "#00ff00",   // SMA‑22 – green
    "moving average.ma.color.1": "#ffff00",   // SMA‑33 – yellow
    "moving average.ma.color.2": "#ff0000",   // SMA‑44 – red
    "moving average.ma.linewidth": 2
  }
});
const chart = LightweightCharts.createChart(document.getElementById("chart"), {
  layout: { background: { color: "#0e0e0e" }, textColor: "white" },
  grid: { vertLines: { color: "#333" }, horzLines: { color: "#333" } },
  timeScale: { timeVisible: true, secondsVisible: false }
});
chart.addCandlestickSeries();
fetch("https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=1m&limit=100")
  .then(res => res.json())
  .then(raw => {
    const data = raw.map(c => ({
      time: c[0] / 1000,
      open: +c[1], high: +c[2], low: +c[3], close: +c[4]
    }));
    candleSeries.setData(data);
    // SMA आणि signal logic पुढे जोडू शकतो
  });
