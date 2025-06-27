// script.js

// Initialize the chart
const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  width: window.innerWidth,
  height: window.innerHeight,
  layout: {
    backgroundColor: '#000000',
    textColor: '#ffffff',
  },
  grid: {
    vertLines: { color: '#444' },
    horzLines: { color: '#444' },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
});

const candleSeries = chart.addCandlestickSeries();
const smaSeries = chart.addLineSeries({ color: 'green', lineWidth: 2 });
const adxSeries = chart.addLineSeries({ color: 'white', lineWidth: 1 });

// Dummy data (you will later replace this with live fetch)
fetch('https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=1m&limit=200')
  .then(res => res.json())
  .then(data => {
    const chartData = data.map(item => ({
      time: item[0] / 1000,
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));

    candleSeries.setData(chartData);

    const smaData = calculateSMA(chartData, 22);
    smaSeries.setData(smaData);

    const adxData = calculateADX(chartData, 8);
    adxSeries.setData(adxData.map(d => ({ time: d.time, value: d.adx })));

    drawSignals(chartData, smaData, adxData);
  });

// Calculate Simple Moving Average
function calculateSMA(data, period) {
  let sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, d) => sum + d.close, 0) / period;
    sma.push({ time: data[i].time, value: avg });
  }
  return sma;
}

// Calculate ADX indicator (simplified version)
function calculateADX(data, period) {
  let result = [];
  for (let i = period; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    const adxValue = (tr / data[i].close) * 100; // Simplified
    result.push({ time: data[i].time, adx: adxValue });
  }
  return result;
}

// Draw BUY/SELL signals
function drawSignals(candles, sma, adx) {
  for (let i = 1; i < sma.length; i++) {
    const candle = candles.find(c => c.time === sma[i].time);
    const adxPoint = adx.find(a => a.time === sma[i].time);

    if (!candle || !adxPoint) continue;

    if (sma[i].value > sma[i - 1].value && adxPoint.adx > 20) {
      candleSeries.setMarkers([{
        time: candle.time,
        position: 'belowBar',
        color: 'green',
        shape: 'arrowUp',
        text: 'BUY'
      }]);
    } else if (sma[i].value < sma[i - 1].value && adxPoint.adx > 20) {
      candleSeries.setMarkers([{
        time: candle.time,
        position: 'aboveBar',
        color: 'red',
        shape: 'arrowDown',
        text: 'SELL'
      }]);
    }
  }
}
