<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tractor Ji Strategy - Forex & Indian Market</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      overflow: hidden;
      transition: background 0.3s;
    }
    #tv_chart_container {
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      bottom: 0;
    }
    #controls {
      position: fixed;
      top: 5px;
      left: 5px;
      z-index: 10;
    }
    #symbolSelector, #themeToggle {
      padding: 6px 10px;
      margin-right: 6px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
    #themeToggle {
      background: #444;
      color: white;
    }
    .draggable {
      position: absolute;
      top: 60px;
      left: 60px;
      background: rgba(255,255,255,0.1);
      border: 1px solid #ccc;
      color: white;
      padding: 10px;
      border-radius: 10px;
      cursor: move;
      z-index: 20;
      width: 180px;
    }
    body.theme-black {
      background: #000;
    }
    body.theme-grey {
      background: #1e1e1e;
    }
    body.theme-blue {
      background: #0D1B2A;
    }
  </style>
</head>
<body class="theme-black">  <!-- Symbol Selector + Theme Switcher -->  <div id="controls">
    <select id="symbolSelector">
      <option value="XAUUSD">XAUUSD</option>
      <option value="EURUSD">EURUSD</option>
      <option value="GBPUSD">GBPUSD</option>
      <option value="USDJPY">USDJPY</option>
      <option value="NSE:BANKNIFTY">BANKNIFTY</option>
      <option value="NSE:NIFTY">NIFTY</option>
      <option value="NSE:RELIANCE">RELIANCE</option>
      <option value="NSE:TCS">TCS</option>
    </select>
    <button id="themeToggle">🎨</button>
  </div>  <!-- TradingView Widget -->  <div id="tv_chart_container"></div>  <!-- Draggable Entry/SL/Target Box -->  <div id="signalBox" class="draggable">
    <p>📍 <strong>Entry:</strong> <span id="entry">0000</span></p>
    <p>🛑 <strong>Stop Loss:</strong> <span id="stoploss">0000</span></p>
    <p>🎯 <strong>Target:</strong> <span id="target">0000</span></p>
  </div>  <!-- Scripts -->  <script src="https://s3.tradingview.com/tv.js"></script>  <script>
    // Theme switch
    let themes = ['theme-black', 'theme-grey', 'theme-blue'];
    let currentTheme = 0;
    document.getElementById('themeToggle').onclick = () => {
      document.body.classList.remove(themes[currentTheme]);
      currentTheme = (currentTheme + 1) % themes.length;
      document.body.classList.add(themes[currentTheme]);
    };

    // TradingView embed
    function loadTradingView(symbol = 'XAUUSD') {
      document.getElementById('tv_chart_container').innerHTML = '';
      new TradingView.widget({
        container_id: 'tv_chart_container',
        autosize: true,
        symbol: symbol,
        interval: '3',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        studies: ['ADX@tv-basicstudies', 'MASimple@tv-basicstudies'],
        overrides: {
          'mainSeriesProperties.style': 1,
        }
      });
    }
    loadTradingView();

    // Symbol change
    document.getElementById('symbolSelector').onchange = function () {
      loadTradingView(this.value);
    };

    // Draggable box
    let box = document.getElementById("signalBox");
    let isDown = false, offset = [0, 0];

    box.addEventListener('mousedown', function(e) {
      isDown = true;
      offset = [box.offsetLeft - e.clientX, box.offsetTop - e.clientY];
    });
    document.addEventListener('mouseup', () => isDown = false);
    document.addEventListener('mousemove', function(e) {
      e.preventDefault();
      if (isDown) {
        box.style.left = (e.clientX + offset[0]) + 'px';
        box.style.top = (e.clientY + offset[1]) + 'px';
      }
    });
  </script></body>
</html>
