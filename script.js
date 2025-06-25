// script.js
// सध्या script.js रिकामा ठेवत आहोत. पुढच्या स्टेप्समध्ये इथे सिग्नल लॉजिक, चार्ट ओव्हरले इत्यादी येतील.

// पुढे यामध्ये आपल्या ट्रॅक्टरजी स्ट्रॅटेजीचं लॉजिक टाकणार आहोत.
console.log("CryptoTapZone script loaded.");
// --- 22 Simple Moving Average (SMA) Function ---
function calculateSMA(data, period = 22) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      sma.push(sum / period);
    }
  }
  return sma;
}

// --- Chart with 22 SMA Overlay ---
function drawChartWithSMA(candles) {
  const smaValues = calculateSMA(candles, 22);

  const series = chart.addLineSeries({
    color: '#22cc88',
    lineWidth: 2,
  });

  const smaFormatted = candles.map((candle, index) => ({
    time: candle.time,
    value: smaValues[index],
  })).filter(p => p.value !== null);

  series.setData(smaFormatted);
}
fetchData().then(candles => {
  drawChartWithSMA(candles);
});
