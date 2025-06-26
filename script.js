// Load the TradingView widget
new TradingView.widget({
  container_id: "chart-container",
  autosize: true,
  symbol: "OANDA:XAUUSD", // GOLD
  interval: "1",
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  toolbar_bg: "#f1f3f6",
  enable_publishing: false,
  allow_symbol_change: true,
  hide_top_toolbar: false,
  withdateranges: true,
  details: true,
  studies: [],
});
