let chart;

async function fetchData() {
  const response = await fetch('https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=1m&limit=500');
  const rawData = await response.json();

  const data = rawData.map(item => ({
    time: item[0] / 1000,
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
  }));

  return data;
}

function calculateSMA(data, period) {
  return data.map((_, i) => {
    if (i < period) return null;
    const sum = data.slice(i - period, i).reduce((a, b) => a + b.close, 0);
    return sum / period;
  });
}

function calculateADX(data, period = 8) {
  const adx = [];
  let prevHigh = data[0].high;
  let prevLow = data[0].low;
  let prevClose = data[0].close;

  let trList = [], plusDMList = [], minusDMList = [];

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const close = data[i].close;

    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    const plusDM = high - prevHigh > low - prevLow && high - prevHigh > 0 ? high - prevHigh : 0;
    const minusDM = low - prevLow > high - prevHigh && low - prevLow > 0 ? prevLow - low : 0;

    trList.push(tr);
    plusDMList.push(plusDM);
    minusDMList.push(minusDM);

    prevHigh = high;
    prevLow = low;
    prevClose = close;
  }

  for (let i = 0; i < trList.length; i++) {
    if (i < period) {
      adx.push(null);
      continue;
    }

    const atr = trList.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const plusDI = (plusDMList.slice(i - period, i).reduce((a, b) => a + b, 0) / atr) * 100;
    const minusDI = (minusDMList.slice(i - period, i).reduce((a, b) => a + b, 0) / atr) * 100;
    const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;

    adx.push(dx);
  }

  return adx;
}

function detectSignals(data, sma, adx) {
  const buySignals = [];
  const sellSignals = [];

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    if (!sma[i] || !adx[i]) continue;

    const entry = curr.close;

    if (curr.close > sma[i] && sma[i] > sma[i - 1] && adx[i] > 20) {
      buySignals.push({ time: curr.time, value: entry, text: 'BUY' });
    }

    if (curr.close < sma[i] && sma[i] < sma[i - 1] && adx[i] > 20) {
      sellSignals.push({ time: curr.time, value: entry, text: 'SELL' });
    }
  }

  return { buySignals, sellSignals };
}

function drawSignals(series, signals) {
  signals.forEach(signal => {
    series.setMarkers([{
      time: signal.time,
      position: signal.text === 'BUY' ? 'belowBar' : 'aboveBar',
      color: signal.text === 'BUY' ? 'lime' : 'red',
      shape: signal.text === 'BUY' ? 'arrowUp' : 'arrowDown',
      text: signal.text,
    }]);
  });
}

function drawEntrySLTarget(data, signals) {
  if (!chart) return;

  signals.forEach(signal => {
    const candle = data.find(d => Math.floor(d.time) === signal.time);
    if (!candle) return;

    const entry = candle.close;
    let sl, target;

    if (signal.text === 'BUY') {
      sl = candle.low;
      target = entry + (entry - sl) * 1.5;
    } else if (signal.text === 'SELL') {
      sl = candle.high;
      target = entry - (sl - entry) * 1.5;
    }

    const slLine = chart.addLineSeries({ color: 'orange', lineWidth: 1 });
    slLine.setData([{ time: signal.time, value: sl }]);

    const targetLine = chart.addLineSeries({ color: 'blue', lineWidth: 1 });
    targetLine.setData([{ time: signal.time, value: target }]);
  });
}

async function main() {
  const data = await fetchData();

  chart = LightweightCharts.createChart(document.getElementById('chart'), {
    layout: { background: { color: 'black' }, textColor: 'white' },
    grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const series = chart.addCandlestickSeries();
  series.setData(data);

  const sma = calculateSMA(data, 22);
  const adx = calculateADX(data);

  const { buySignals, sellSignals } = detectSignals(data, sma, adx);
  drawSignals(series, buySignals.concat(sellSignals));
  drawEntrySLTarget(data, buySignals.concat(sellSignals));
}

main();
