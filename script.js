window.onload = function () {
  let currentSymbol = "XAUUSD";

  // Load TradingView Chart
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
      withdateranges: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      save_image: false,
      show_popup_button: false,
      studies: [
        "ADX@tv-basicstudies",     // ADX default
        "MASimple@tv-basicstudies" // Simple Moving Average (SMA)
      ],
      overrides: {
        "study_Overlay@tv-basicstudies.linewidth": 2
      }
    });

    // TEMPORARY — Simulated signal
    updateSignal(54321, 54000, 55000);
  }

  // Update signal box
  function updateSignal(entry, sl, target) {
    document.getElementById("entry").innerText = entry;
    document.getElementById("stoploss").innerText = sl;
    document.getElementById("target").innerText = target;
  }

  // Theme switch
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

  // Symbol switch
  document.getElementById("symbolSelector").onchange = (e) => {
    currentSymbol = e.target.value;
    loadChart(currentSymbol);
  };

  // Draggable Box Logic
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

  // Initial chart load
  loadChart(currentSymbol);
};
