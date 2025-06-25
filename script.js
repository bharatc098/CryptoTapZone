let widget = new TradingView.widget({
  container_id: "tvchart",
  autosize: true,
  symbol: "OANDA:XAUUSD", // GOLD chart
  interval: "3", // 3 minute
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  enable_publishing: false,
  allow_symbol_change: true,
  hide_top_toolbar: false,
  hide_legend: false,
  studies: [
    "ADX@tv-basicstudies",           // ADX (default is 14, but we will change to 8)
    "MAExp@tv-basicstudies",         // Moving Average Exponential (change to SMA 22 manually)
  ],
  overrides: {
    "mainSeriesProperties.style": 1,
    "paneProperties.background": "#000000",
    "paneProperties.vertGridProperties.color": "#222",
    "paneProperties.horzGridProperties.color": "#222",
    "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",

    // Customize ADX to 8
    "indicator_properties.ADX.input1": 8,

    // Customize MA to SMA 22 (you can change type from EMA to SMA manually on chart if not working here)
    "moving average.ma.period": 22,
    "moving average.ma.type": "SMA",
    "moving average.ma.color": "#00FF00"
  },
});

