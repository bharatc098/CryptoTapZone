// Create the chart
const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  width: window.innerWidth,
  height: window.innerHeight,
  layout: { background: { color: '#000' }, textColor: '#DDD' },
  grid: { vertLines: { color: '#333' }, horzLines: { color: '#333' } },
  timeScale: { timeVisible: true, secondsVisible: true }
});

const candleSeries = chart.addCandlestickSeries();
const smaSeries = chart.addLineSeries({ color: 'blue', lineWidth: 2 });
const adxSeries = chart.addLineSeries({ color: 'orange', lineWidth: 2 });

// Fetch data from Binance
fetch('https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=1m&limit=1000')
  .then(res => res.json())
  .then(data => {
    const chartData = data.map(d => ({
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4])
    }));

    candleSeries.setData(chartData);

    // Calculate SMA-22
    const smaData = chartData.map((d, i, arr) => {
      if (i < 21) return null;
      const avg = arr.slice(i - 21, i + 1).reduce((sum, c) => sum + c.close, 0) / 22;
      return { time: d.time, value: avg };
    }).filter(Boolean);
    smaSeries.setData(smaData);

    // Dummy ADX-8 (placeholder logic for now)
    const adxData = chartData.map((d, i) => ({
      time: d.time,
      value: 10 + Math.sin(i / 10) * 20 // placeholder
    }));
    adxSeries.setData(adxData);

    // Set entry/stoploss/target
    updateSignalBox(chartData[chartData.length - 1].close);
  });

function updateSignalBox(entryPrice) {
  const stoploss = (entryPrice * 0.995).toFixed(2);
  const target = (entryPrice * 1.01).toFixed(2);
  document.getElementById('entryPrice').innerText = entryPrice.toFixed(2);
  document.getElementById('stoplossPrice').innerText = stoploss;
  document.getElementById('targetPrice').innerText = target;
}
