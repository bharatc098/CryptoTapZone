new TradingView.widget({
    container_id: "chart",
    autosize: true,
    symbol: "BINANCE:XAUUSDT",
    interval: "1",
    timezone: "Asia/Kolkata",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#222",
    enable_publishing: false,
    allow_symbol_change: true,
    hide_legend: false,
    hide_side_toolbar: false,
    withdateranges: true,
    studies: [], // येथे आपण नंतर SMA 22, 33, 44 indicators लावू
});
