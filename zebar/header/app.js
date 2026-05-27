import React, { useEffect, useState } from "https://esm.sh/react@18?dev";
import { createRoot } from "https://esm.sh/react-dom@18/client?dev";
import * as zebar from "https://esm.sh/zebar@2";
import htm from "https://esm.sh/htm@3";

const html = htm.bind(React.createElement);

const providers = zebar.createProviderGroup({
  glazewm: { type: "glazewm" },
  date: { type: "date", formatting: "EEE, MMM d · HH:mm" },
});

createRoot(document.getElementById("root")).render(html`<${App} />`);

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  const [btcData, setBtcData] = useState({ online: false, price: -1 });
  const [goldData, setGoldData] = useState({ online: false, price: -1 });
  const [nasData, setNasdaqData] = useState({ online: false, price: -1 });

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));

    const fetchBtc = async () => {
      try {
        const res = await fetch(
          "https://scanner.tradingview.com/symbol?symbol=BINANCE:BTCUSDT&fields=close&t=" +
            Date.now(),
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBtcData({ online: true, price: Number(data.close) });
      } catch (e) {
        setBtcData({ online: false, price: -1 });
      }
    };

    const fetchGold = async () => {
      try {
        const res = await fetch(
          "https://scanner.tradingview.com/symbol?symbol=OANDA:XAUUSD&fields=close&t=" +
            Date.now(),
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setGoldData({ online: true, price: Number(data.close) });
      } catch (e) {
        setGoldData({ online: false, price: -1 });
      }
    };

    const fetchNasdaq = async () => {
      try {
        const res = await fetch(
          "https://scanner.tradingview.com/symbol?symbol=NASDAQ:NDX&fields=close&t=" +
            Date.now(),
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setNasdaqData({ online: true, price: Number(data.close) });
      } catch (e) {
        setNasdaqData({ online: false, price: -1 });
      }
    };

    fetchBtc();
    fetchGold();
    fetchNasdaq();
    const interval = setInterval(() => {
      fetchBtc();
      fetchGold();
      fetchNasdaq();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return html`
    <div className="app">
      <div className="left">
        <i className="logo nf nf-fa-windows"></i>
        ${output.glazewm &&
        html`<div className="workspaces">
          ${output.glazewm.currentWorkspaces.map(
            (ws) =>
              html`<button
                key=${ws.name}
                className=${`workspace ${ws.hasFocus ? "focused" : ""} ${ws.isDisplayed ? "displayed" : ""}`}
                onClick=${() =>
                  output.glazewm.runCommand(`focus --workspace ${ws.name}`)}
              >
                ${ws.displayName ?? ws.name}
              </button>`,
          )}
        </div>`}
      </div>

      <div className="center">
        <span className="date">${output.date?.formatted ?? ""}</span>
        ${output.glazewm?.focusedContainer?.title
          ? html`<span className="separator">|</span>
              <span className="process"
                >${output.glazewm.focusedContainer.title}</span
              >`
          : null}
      </div>

      <div className="right">
        <div className=${`pill quant-pill ${btcData.online ? "" : "error"}`}>
          <i className="nf nf-fa-line_chart"></i>
          <span>BTC</span>
          <span>
            ${btcData.online ? btcData.price.toLocaleString() : "Offline"}</span
          >
        </div>

        <div className=${`pill nas-pill ${nasData.online ? "" : "error"}`}>
          <i className="nf nf-md-chart_line"></i>
          <span>NAS</span>
          <span>
            ${nasData.online
              ? nasData.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "Offline"}</span
          >
        </div>

        <div className=${`pill gold-pill ${goldData.online ? "" : "error"}`}>
          <i className="nf nf-md-gold"></i>
          <span>XAU</span>
          <span>
            ${goldData.online
              ? goldData.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "Offline"}</span
          >
        </div>
      </div>
    </div>
  `;
}
