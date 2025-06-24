const chartContainer = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartContainer, {
  width: window.innerWidth,
  height: window.innerHeight,
  layout: { background: { color: '#fff' }, textColor: '#000' },
  grid: { vertLines: { visible: false }, horzLines: { visible: false } },
  priceScale: { position: 'right' },
  timeScale: { timeVisible: true, secondsVisible: false }
});

const candleSeries = chart.addCandlestickSeries();
const entryLine = chart.addLineSeries({ color: '#00b300', lineWidth: 2 });
const slLine = chart.addLineSeries({ color: '#ff3333', lineWidth: 2 });
const targetLine = chart.addLineSeries({ color: '#3366ff', lineWidth: 2 });

async function fetchData() {
  try {
    const res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60");
    const raw = await res.json();

    const candles = raw.map(c => ({
      time: Math.floor(c[0] / 1000),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4])
    }));

    candleSeries.setData(candles);

    const closes = candles.map(c => c.close);
    const sma = (arr, len) => {
      const res = [];
      for (let i = len - 1; i < arr.length; i++) {
        const slice = arr.slice(i - len + 1, i + 1);
        const avg = slice.reduce((a, b) => a + b, 0) / len;
        res.push({ index: i, value: avg });
      }
      return res;
    };

    const sma22 = sma(closes, 22);
    const sma33 = sma(closes, 33);
    const lastIdx = candles.length - 2;
    const last = candles[lastIdx];
    const lastSMA22 = sma22.find(s => s.index === lastIdx)?.value;
    const lastSMA33 = sma33.find(s => s.index === lastIdx)?.value;

    let signal = "No Signal", entry = 0, sl = 0, target = 0;

    if (lastSMA22 && lastSMA33) {
      const rising = lastSMA22 > sma22.find(s => s.index === lastIdx - 1)?.value &&
                     lastSMA33 > sma33.find(s => s.index === lastIdx - 1)?.value;

      const falling = lastSMA22 < sma22.find(s => s.index === lastIdx - 1)?.value &&
                      lastSMA33 < sma33.find(s => s.index === lastIdx - 1)?.value;

      const nearSupport = (last.low <= lastSMA22 && last.high >= lastSMA22) ||
                          (last.low <= lastSMA33 && last.high >= lastSMA33);

      const nearResistance = (last.high >= lastSMA22 && last.low <= lastSMA22) ||
                             (last.high >= lastSMA33 && last.low <= lastSMA33);

      if (rising && nearSupport && last.close > last.open) {
        signal = "Buy";
        entry = last.high;
        sl = last.low;
        target = entry + 2 * (entry - sl);
      } else if (falling && nearResistance && last.close < last.open) {
        signal = "Sell";
        entry = last.low;
        sl = last.high;
        target = entry - 2 * (sl - entry);
      }
    }

    document.getElementById("signal").innerText = signal;
    document.getElementById("entry").innerText = entry.toFixed(2);
    document.getElementById("sl").innerText = sl.toFixed(2);
    document.getElementById("target").innerText = target.toFixed(2);

    if (signal !== "No Signal") {
      const t = last.time;
      entryLine.setData([{ time: t, value: entry }, { time: t + 60, value: entry }]);
      slLine.setData([{ time: t, value: sl }, { time: t + 60, value: sl }]);
      targetLine.setData([{ time: t, value: target }, { time: t + 60, value: target }]);
    }
  } catch (err) {
    console.error(err);
    document.getElementById("signal").innerText = "Error";
  }
}

fetchData();
setInterval(fetchData, 60000);
