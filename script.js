new TradingView.widget({
  container_id: "tv-chart",
  autosize: true,
  symbol: "NSE:NIFTY",
  interval: "3",
  timezone: "Asia/Kolkata",
  theme: "dark",
  style: "1",
  locale: "en",
  toolbar_bg: "#1e1e1e",
  enable_publishing: false,
  allow_symbol_change: true,
  hide_legend: false,
  studies: [
    "ADX@tv-basicstudies",          // ADX default
    "MAExp@tv-basicstudies",        // EMA (आपण नंतर 22 सेट करू)
  ],
});
