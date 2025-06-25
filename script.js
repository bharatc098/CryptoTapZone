// Embed TradingView Full Widget for GOLD (XAUUSD)
new TradingView.widget({
  container_id: "tvchart",
  width: "100%",
  height: 600,
  symbol: "OANDA:XAUUSD",
  interval: "3",
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  toolbar_bg: "#f1f3f6",
  enable_publishing: false,
  allow_symbol_change: true,
  save_image: false,
  studies: [
    "MAExp@tv-basicstudies",       // Exponential MA (temporary)
    "Moving Average@tv-basicstudies" // Simple MA - add 22 manually
  ],
  overrides: {
    "mainSeriesProperties.style": 1,
  },
  studies_overrides: {},
});
