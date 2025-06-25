// script.js

let chart;

function loadChart() {
  const chartContainer = document.getElementById("tvchart");

  chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 400,
    layout: {
      backgroundColor: "#000",
      textColor: "#DDD",
    },
    grid: {
      vertLines: { color: "#222" },
      horzLines: { color: "#222" },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  });

  const candleSeries = chart.addCandlestickSeries();
  const sma22Series = chart.addLineSeries({ color: "yellow", lineWidth: 2 });
  const adxSeries = [];

  fetch('https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=3m&limit=300')
    .then(res => res.json())
    .then(data => {
      const candles = data.map(d => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      candleSeries.setData(candles);

      // Calculate SMA 22
      const sma22 = calculateSMA(candles, 22);
      sma22Series.setData(sma22);

      // Detect Signals
      const signals = detectSignals(candles, sma22);
      drawSignals(signals);
    });
}

function calculateSMA(data, period) {
  let sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) continue;
    let sum = 0;
    for (let j = i - period; j < i; j++) {
      sum += data[j].close;
    }
    const avg = sum / period;
    sma.push({ time: data[i].time, value: avg });
  }
  return sma;
}

function detectSignals(candles, smaData) {
  let signals = [];
  for (let i = 1; i < smaData.length; i++) {
    const prevSma = smaData[i - 1].value;
    const currSma = smaData[i].value;
    const candle = candles.find(c => c.time === smaData[i].time);

    const rising = currSma > prevSma;
    const falling = currSma < prevSma;

    if (rising && candle.close > currSma) {
      signals.push({
        type: 'buy',
        time: candle.time,
        entry: candle.close,
        stop: candle.low,
        target: candle.close + (candle.close - candle.low) * 2,
      });
    } else if (falling && candle.close < currSma) {
      signals.push({
        type: 'sell',
        time: candle.time,
        entry: candle.close,
        stop: candle.high,
        target: candle.close - (candle.high - candle.close) * 2,
      });
    }
  }
  return signals;
}

function drawSignals(signals) {
  signals.forEach(sig => {
    const color = sig.type === 'buy' ? 'green' : 'red';
    const entryLine = {
      price: sig.entry,
      color,
      lineWidth: 2,
      lineStyle: LightweightCharts.LineStyle.Solid,
      axisLabelVisible: true,
      title: `${sig.type.toUpperCase()} ENTRY`,
    };
    const stopLine = {
      price: sig.stop,
      color: 'red',
      lineWidth: 1,
      axisLabelVisible: true,
      title: 'STOP LOSS',
    };
    const targetLine = {
      price: sig.target,
      color: 'blue',
      lineWidth: 1,
      axisLabelVisible: true,
      title: 'TARGET',
    };

    chart.addLineSeries().createPriceLine(entryLine);
    chart.addLineSeries().createPriceLine(stopLine);
    chart.addLineSeries().createPriceLine(targetLine);
  });
}

document.addEventListener("DOMContentLoaded", loadChart);
