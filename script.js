window.onload = function () {
  let currentSymbol = "XAUUSD";

  function loadChart(symbol) {
    document.getElementById("tv_chart_container").innerHTML = "";

    new TradingView.widget({
      container_id: "tv_chart_container",
      width: "100%",
      height: "100%",
      symbol: symbol,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      studies: [
        "MASimple@tv-basicstudies",  // Simple Moving Average
        "ADX@tv-basicstudies"        // ADX
      ],
      overrides: {},
    });

    // सिग्नल टाकतो (डेमो)
    updateSignal(54321, 54000, 55000);
  }

  function updateSignal(entry, sl, target) {
    document.getElementById("entry").innerText = entry;
    document.getElementById("stoploss").innerText = sl;
    document.getElementById("target").innerText = target;
  }

  // Theme बदल
  document.getElementById("themeToggle").onclick = () => {
    const body = document.body;
    if (body.classList.contains("theme-black")) {
      body.className = "theme-grey";
    } else if (body.classList.contains("theme-grey")) {
      body.className = "theme-blue";
    } else {
      body.className = "theme-black";
    }
  };

  // Symbol बदल
  document.getElementById("symbolSelector").onchange = (e) => {
    currentSymbol = e.target.value;
    loadChart(currentSymbol);
  };

  // Draggable बॉक्स
  const box = document.getElementById("signalBox");
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  box.addEventListener("mousedown", (e) => {
    isDragging = true;
    offset.x = e.clientX - box.offsetLeft;
    offset.y = e.clientY - box.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      box.style.left = e.clientX - offset.x + "px";
      box.style.top = e.clientY - offset.y + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // सुरुवातीचा चार्ट लोड करा
  loadChart(currentSymbol);
};
const adxSeries = chart.addLineSeries({
  color: 'orange',
  lineWidth: 2,
});
adxSeries.setData(adxData);
