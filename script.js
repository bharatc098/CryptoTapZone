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
// Sample signal logic for Tractor Ji strategy
function checkTractorJiSignals(data) {
    const signals = [];

    for (let i = 22; i < data.length; i++) {
        const adx = data[i].adx; // ADX (8 period) value
        const sma = data[i].sma; // SMA (22 period)
        const close = data[i].close;
        const prevClose = data[i - 1].close;

        // BUY condition: ADX > 20 and price bouncing from SMA
        if (adx > 20 && close > sma && data[i - 1].close <= sma) {
            signals.push({
                time: data[i].time,
                type: 'buy',
                price: close,
                stopLoss: close - 1.5, // example SL
                target: close + 3,     // example target
            });
        }

        // SELL condition: ADX > 20 and price falling from SMA
        else if (adx > 20 && close < sma && data[i - 1].close >= sma) {
            signals.push({
                time: data[i].time,
                type: 'sell',
                price: close,
                stopLoss: close + 1.5,
                target: close - 3,
            });
        }
    }

    return signals;
}

// Draw arrows and SL/Target lines
function drawSignalsToChart(signals, chart) {
    signals.forEach((signal) => {
        const arrowSeries = chart.addShape({
            time: signal.time,
            position: 'aboveBar',
            shape: signal.type === 'buy' ? 'arrowUp' : 'arrowDown',
            color: signal.type === 'buy' ? 'green' : 'red',
            text: signal.type.toUpperCase(),
        });

        chart.createMultipointShape([
            { time: signal.time, price: signal.stopLoss },
            { time: signal.time + 1, price: signal.stopLoss },
        ], {
            shape: 'line',
            color: 'red',
            text: 'SL',
        });

        chart.createMultipointShape([
            { time: signal.time, price: signal.target },
            { time: signal.time + 1, price: signal.target },
        ], {
            shape: 'line',
            color: 'green',
            text: 'Target',
        });
    });
}
async function updateChartData() {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/binance-smart-chain/market_chart?vs_currency=usd&days=1&interval=minute`);
        const rawData = await response.json();

        const prices = rawData.prices;
        const chartData = prices.map(([time, price]) => ({
            time: Math.floor(time / 1000), // UNIX timestamp in seconds
            close: price,
        }));

        // Calculate SMA 22
        for (let i = 21; i < chartData.length; i++) {
            let sum = 0;
            for (let j = i - 21; j <= i; j++) {
                sum += chartData[j].close;
            }
            chartData[i].sma = sum / 22;
        }

        // Calculate ADX (simplified dummy logic for now)
        for (let i = 8; i < chartData.length; i++) {
            chartData[i].adx = 25 + Math.random() * 10; // dummy ADX for example
        }

        // Draw chart
        const lineSeries = chart.addLineSeries();
        lineSeries.setData(chartData);

        // Apply Tractor Ji strategy
        const signals = checkTractorJiSignals(chartData);
        drawSignalsToChart(signals, chart);

    } catch (err) {
        console.error("Data fetch error:", err);
    }
}
function drawSignals(chart, series, chartData) {
    chartData.forEach(data => {
        if (data.signal === 'buy') {
            chart.addShape({
                time: data.time,
                position: 'belowBar',
                color: 'green',
                shape: 'arrowUp',
                text: 'BUY'
            });
        } else if (data.signal === 'sell') {
            chart.addShape({
                time: data.time,
                position: 'aboveBar',
                color: 'red',
                shape: 'arrowDown',
                text: 'SELL'
            });
        }
    });
}
updateChartData()drawSignals(chart, candleSeries, processedData);
function checkTractorJiSignal(data) {
  const period = 22;

  for (let i = period; i < data.length; i++) {
    const price = data[i].close;
    const prevPrice = data[i - 1].close;

    // Calculate 22 SMA
    const sma = data.slice(i - period, i).reduce((sum, d) => sum + d.close, 0) / period;
    const prevSma = data.slice(i - period - 1, i - 1).reduce((sum, d) => sum + d.close, 0) / period;

    // Dummy ADX value
    const adx = 25; // Future step: calculate real ADX
    const isAdxAbove20 = adx > 20;

    // BUY condition
    if (price > sma && prevSma < sma && isAdxAbove20) {
      drawBuySellArrow(data[i].time, data[i].low, 'buy');
    }

    // SELL condition
    if (price < sma && prevSma > sma && isAdxAbove20) {
      drawBuySellArrow(data[i].time, data[i].high, 'sell');
    }
  }
}
fetchChartData().then(data => {
  updateChart(data);
  checkTractorJiSignal(data);  // 🎯 येथे कॉल करा
});
function calculateADX(data, period = 8) {
  let adxValues = [];

  let trList = [], plusDMList = [], minusDMList = [];

  for (let i = 1; i < data.length; i++) {
    const highDiff = data[i].high - data[i - 1].high;
    const lowDiff = data[i - 1].low - data[i].low;

    let plusDM = (highDiff > lowDiff && highDiff > 0) ? highDiff : 0;
    let minusDM = (lowDiff > highDiff && lowDiff > 0) ? lowDiff : 0;

    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );

    trList.push(tr);
    plusDMList.push(plusDM);
    minusDMList.push(minusDM);
  }

  let smoothedTR = trList.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedPlusDM = plusDMList.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedMinusDM = minusDMList.slice(0, period).reduce((a, b) => a + b, 0);

  for (let i = period; i < trList.length; i++) {
    smoothedTR = smoothedTR - (smoothedTR / period) + trList[i];
    smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / period) + plusDMList[i];
    smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / period) + minusDMList[i];

    const plusDI = 100 * (smoothedPlusDM / smoothedTR);
    const minusDI = 100 * (smoothedMinusDM / smoothedTR);
    const dx = 100 * (Math.abs(plusDI - minusDI) / (plusDI + minusDI));

    if (i === period) {
      adxValues.push(dx);
    } else {
      const prevADX = adxValues[adxValues.length - 1];
      const adx = ((prevADX * (period - 1)) + dx) / period;
      adxValues.push(adx);
    }
  }

  return adxValues;
}
checkTractorJiSignalfunction checkTractorJiSignal(data) {
  const period = 22;
  const adxPeriod = 8;
  const adxValues = calculateADX(data, adxPeriod);

  for (let i = period; i < data.length; i++) {
    const price = data[i].close;
    const prevPrice = data[i - 1].close;

    const sma = data.slice(i - period, i).reduce((sum, d) => sum + d.close, 0) / period;
    const prevSma = data.slice(i - period - 1, i - 1).reduce((sum, d) => sum + d.close, 0) / period;

    const adx = adxValues[i - period];
    const isAdxAbove20 = adx > 20;

    if (price > sma && prevSma < sma && isAdxAbove20) {
      drawBuySellArrow(data[i].time, data[i].low, 'buy');
    }

    if (price < sma && prevSma > sma && isAdxAbove20) {
      drawBuySellArrow(data[i].time, data[i].high, 'sell');
    }
  }
}
