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
