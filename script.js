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
