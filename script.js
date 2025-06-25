window.addEventListener('DOMContentLoaded', () => {
  new TradingView.widget({
    autosize: true,
    symbol: "BINANCE:BTCUSDT",
    interval: "3",
    timezone: "Asia/Kolkata",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#000000",
    enable_publishing: false,
    hide_top_toolbar: false,
    hide_legend: false,
    allow_symbol_change: true,
    container_id: "tv-chart"
  });
});
