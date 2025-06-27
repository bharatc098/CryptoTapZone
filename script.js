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
// Function to check signals (Tractor Ji Strategy)
function checkSignal(data) {
  let signals = [];

  for (let i = 22; i < data.length; i++) {
    const sma22 = data.slice(i - 22, i).reduce((sum, d) => sum + d.close, 0) / 22;
    const currentClose = data[i].close;

    // Mock ADX logic: use close-to-close movement as pseudo strength (replace with real later)
    const adx = Math.abs(data[i].close - data[i - 1].close) * 10;

    if (currentClose > sma22 && adx > 20) {
      signals.push({ index: i, type: "BUY", price: currentClose });
    } else if (currentClose < sma22 && adx > 20) {
      signals.push({ index: i, type: "SELL", price: currentClose });
    }
  }

  return signals;
}
function addSignalMarkers(chart, series, signals, candleData) {
  const markers = signals.map(signal => {
    const time = candleData[signal.index].time;
    return {
      time: time,
      position: signal.type === "BUY" ? 'belowBar' : 'aboveBar',
      color: signal.type === "BUY" ? 'green' : 'red',
      shape: signal.type === "BUY" ? 'arrowUp' : 'arrowDown',
      text: signal.type
    };
  });

  series.setMarkers(markers);
}
// Assume 'candles' is your OHLC array
const signals = checkSignal(candles);

// Draw signal arrows
addSignalMarkers(chart, candleSeries, signals, candles);
// script.js

const defaultSymbol = "XAUUSDT"; // GOLD
const defaultInterval = "1m";

// वेबसाईट लोड होताच हे symbol आणि interval वापरून डेटा लोड करा
fetchCandleData(defaultSymbol, defaultInterval);
function fetchCandleData(symbol, interval) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const candles = data.map(d => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      candleSeries.setData(candles);

      const signals = checkSignal(candles);
      addSignalMarkers(chart, candleSeries, signals, candles);
    });
}
addSignalMarkers()function addSignalMarkers(chart, series, signals, candles) {
  const markers = signals.map(signal => {
    const candle = candles.find(c => c.time === signal.time);

    return {
      time: signal.time,
      position: signal.type === "buy" ? "belowBar" : "aboveBar",
      color: signal.type === "buy" ? "green" : "red",
      shape: signal.type === "buy" ? "arrowUp" : "arrowDown",
      text: signal.type.toUpperCase(),
    };
  });

  series.setMarkers(markers);
}
function checkSignal(candles) {
  const signals = [];

  for (let i = 22; i < candles.length; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];

    const sma = candles
      .slice(i - 21, i + 1)
      .reduce((sum, c) => sum + c.close, 0) / 22;

    const adxFake = Math.random() * 40; // Placeholder ADX value

    if (curr.close > sma && adxFake > 20) {
      signals.push({ time: curr.time, type: "buy" });
    } else if (curr.close < sma && adxFake > 20) {
      signals.push({ time: curr.time, type: "sell" });
    }
  }

  return signals;
}
drawTradeLevels()function drawTradeLevels(chart, series, signals, candles) {
  signals.forEach(signal => {
    const candle = candles.find(c => c.time === signal.time);
    if (!candle) return;

    const entry = candle.close;
    const sl = signal.type === "buy" ? candle.low : candle.high;
    const rr = 2; // risk-reward ratio

    const target = signal.type === "buy"
      ? entry + (entry - sl) * rr
      : entry - (sl - entry) * rr;

    // ENTRY line
    chart.addLineSeries({
      color: 'white',
      lineWidth: 1,
      priceLineVisible: true,
    }).setData([{ time: signal.time, value: entry }]);

    // SL line
    chart.addLineSeries({
      color: 'red',
      lineWidth: 1,
      priceLineVisible: true,
    }).setData([{ time: signal.time, value: sl }]);

    // TARGET line
    chart.addLineSeries({
      color: 'green',
      lineWidth: 1,
      priceLineVisible: true,
    }).setData([{ time: signal.time, value: target }]);
  });
}
updateChart()const signals = checkSignal(chartData);
addSignalMarkers(chart, series, signals, chartData);
drawTradeLevels(chart, series, signals, chartData);
// Calculate SMA (Simple Moving Average)
function calculateSMA(data, period = 22) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, c) => a + c.close, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

// Calculate ADX (simplified version)
function calculateADX(data, period = 8) {
  const adx = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      adx.push(null);
      continue;
    }
    let trSum = 0;
    let pdmSum = 0;
    let ndmSum = 0;

    for (let j = i - period + 1; j <= i; j++) {
      const current = data[j];
      const previous = data[j - 1];

      const highDiff = current.high - previous.high;
      const lowDiff = previous.low - current.low;

      const pdm = highDiff > lowDiff && highDiff > 0 ? highDiff : 0;
      const ndm = lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0;

      const tr = Math.max(
        current.high - current.low,
        Math.abs(current.high - previous.close),
        Math.abs(current.low - previous.close)
      );

      pdmSum += pdm;
      ndmSum += ndm;
      trSum += tr;
    }

    const pdi = (pdmSum / trSum) * 100;
    const ndi = (ndmSum / trSum) * 100;
    const dx = (Math.abs(pdi - ndi) / (pdi + ndi)) * 100;
    adx.push(dx);
  }
  return adx;
}
const sma22 = calculateSMA(chartData, 22);
const adx8 = calculateADX(chartData, 8);
const signals = checkSignal(chartData, sma22, adx8);
