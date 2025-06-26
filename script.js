window.addEventListener('DOMContentLoaded', function () {
  new TradingView.widget({
    autosize: true,
    symbol: "OANDA:XAUUSD", // GOLD symbol
    interval: "1",          // 1-minute timeframe
    timezone: "Asia/Kolkata",
    theme: "dark",
    style: "1",
    locale: "en",
    container_id: "chart-container",
    withdateranges: true,
    allow_symbol_change: true,
    save_image: false,
    hideideas: true,
    studies: [],
    toolbar_bg: "#222",
  });
});
