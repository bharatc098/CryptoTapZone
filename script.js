let chart, tvWidget;

function initChart() {
  const container = document.getElementById('chart');

  tvWidget = new TradingView.widget({
    autosize: true,
    symbol: 'BINANCE:XAUUSDT',
    interval: '1',
    container_id: container,
    datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
    library_path: "https://unpkg.com/lightweight-charts@3.4.0/dist/",
    locale: "en",
    disabled_features: ["header_symbol_search", "timeframes_toolbar"],
    enabled_features: ["study_templates"],
    charts_storage_url: '',
    charts_storage_api_version: "1.1",
    client_id: 'CryptoTapZone',
    user_id: 'public_user_id',
    fullscreen: false,
    studies_overrides: {},
  });

  setTimeout(() => {
    chart = tvWidget.activeChart();
    chart.onIntervalChanged().subscribe(null, function(interval) {
      console.log("Interval changed to", interval);
    });
    startSignalMonitoring();
  }, 3000);
}

function calculateSlope(data) {
  const len = data.length;
  if (len < 2) return 0;
  return data[len - 1] - data[len - 2];
}

function updateSignal(chartData) {
  const closingPrices = chartData.slice(-44).map(candle => candle.close);
  if (closingPrices.length < 44) return;

  const sma = (arr, len) => arr.slice(-len).reduce((a, b) => a + b, 0) / len;
  const sma22 = sma(closingPrices, 22);
  const sma33 = sma(closingPrices, 33);
  const sma44 = sma(closingPrices, 44);
  const slope22 = sma22 - sma(closingPrices.slice(0, -1), 22);

  const lastPrice = closingPrices[closingPrices.length - 1];
  const signalBox = document.getElementById('signal-box');

  if (slope22 > 0 && lastPrice > sma22) {
    signalBox.innerHTML = `<strong>BUY Signal</strong><br>Entry: ${lastPrice.toFixed(2)}<br>SL: ${(sma22 - 0.5).toFixed(2)}<br>Target: ${(lastPrice + 1).toFixed(2)}`;
    signalBox.classList.add("green");
    signalBox.classList.remove("red");
  } else if (slope22 < 0 && lastPrice < sma22) {
    signalBox.innerHTML = `<strong>SELL Signal</strong><br>Entry: ${lastPrice.toFixed(2)}<br>SL: ${(sma22 + 0.5).toFixed(2)}<br>Target: ${(lastPrice - 1).toFixed(2)}`;
    signalBox.classList.add("red");
    signalBox.classList.remove("green");
  } else {
    signalBox.innerHTML = "No clear signal";
    signalBox.classList.remove("green", "red");
  }
}

// Simulated data fetch loop
function startSignalMonitoring() {
  setInterval(() => {
    fetchDummyChartData().then(updateSignal);
  }, 5000);
}

// Dummy OHLC data generator
function fetchDummyChartData() {
  const now = Date.now();
  const candles = [];

  for (let i = 0; i < 60; i++) {
    const base = 2300 + Math.sin(i / 10) * 5;
    candles.push({
      time: now - (60 - i) * 60 * 1000,
      open: base,
      high: base + Math.random(),
      low: base - Math.random(),
      close: base + (Math.random() - 0.5),
      volume: Math.random() * 100
    });
  }

  return Promise.resolve(candles);
}

window.onload = () => {
  initChart();
};
