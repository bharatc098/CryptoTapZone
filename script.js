const chart = LightweightCharts.createChart(document.getElementById("chart"), {
  layout: {
    background: { color: "#0e0e0e" },
    textColor: "white",
  },
  grid: {
    vertLines: { color: "#333" },
    horzLines: { color: "#333" },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: true,
  },
});

const candleSeries = chart.addCandlestickSeries();
const sma22Series = chart.addLineSeries({ color: "#00ff00", lineWidth: 2 });
const adxSeries = chart.addLineSeries({ color: "#ffffff", lineWidth: 1 });

const signalBox = document.getElementById("signalBox");
const signalText = document.getElementById("signalText");
const entryLevel = document.getElementById("entryLevel");
const stopLoss = document.getElementById("stopLoss");
const target = document.getElementById("target");

async function fetchData() {
  const response = await fetch("https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=1m&limit=1000");
  const data = await response.json();

  const chartData = data.map(d => ({
    time: d[0] / 1000,
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
  }));
  candleSeries.setData(chartData);

  const closes = chartData.map(d => d.close);

  const sma22 = calculateSMA(closes, 22);
  sma22Series.setData(chartData.map((d, i) => ({ time: d.time, value: sma22[i] || null })).filter(p => p.value));

  const adx = calculateADX(chartData, 8);
  adxSeries.setData(chartData.map((d, i) => ({ time: d.time, value: adx[i] || null })).filter(p => p.value));

  checkSignal(chartData, sma22, adx);
}

function calculateSMA(values, period) {
  const sma = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

function calculateADX(data, period) {
  const adx = Array(data.length).fill(null);
  for (let i = 1; i < data.length; i++) {
    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    const upMove = data[i].high - data[i - 1].high;
    const downMove = data[i - 1].low - data[i].low;
    const plusDM = upMove > downMove && upMove > 0 ? upMove : 0;
    const minusDM = downMove > upMove && downMove > 0 ? downMove : 0;

    const prev = adx[i - 1] || 0;
    const smoothedTR = prev + (tr - prev) / period;
    const smoothedPlusDM = prev + (plusDM - prev) / period;
    const smoothedMinusDM = prev + (minusDM - prev) / period;

    const plusDI = 100 * (smoothedPlusDM / smoothedTR);
    const minusDI = 100 * (smoothedMinusDM / smoothedTR);
    const dx = 100 * Math.abs(plusDI - minusDI) / (plusDI + minusDI);

    adx[i] = (prev * (period - 1) + dx) / period;
  }
  return adx;
}

function checkSignal(data, sma22, adx) {
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const sma = sma22[sma22.length - 1];
  const adxVal = adx[adx.length - 1];

  const isRising = sma > sma22[sma22.length - 2];

  if (adxVal > 20 && isRising && last.close > sma) {
    signalText.textContent = "BUY";
    entryLevel.textContent = last.close.toFixed(2);
    stopLoss.textContent = last.low.toFixed(2);
    target.textContent = (last.close + 2 * (last.close - last.low)).toFixed(2);
  } else if (adxVal > 20 && !isRising && last.close < sma) {
    signalText.textContent = "SELL";
    entryLevel.textContent = last.close.toFixed(2);
    stopLoss.textContent = last.high.toFixed(2);
    target.textContent = (last.close - 2 * (last.high - last.close)).toFixed(2);
  } else {
    signalText.textContent = "Waiting...";
    entryLevel.textContent = stopLoss.textContent = target.textContent = "-";
  }
}

fetchData();
setInterval(fetchData, 60000);
      
