import React, { useEffect, useState } from "https://esm.sh/react@18?dev";
import { createRoot } from "https://esm.sh/react-dom@18/client?dev";
import * as zebar from "https://esm.sh/zebar@2";
import htm from "https://esm.sh/htm@3";

const html = htm.bind(React.createElement);

const providers = zebar.createProviderGroup({
  network: { type: "network" },
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  date: { type: "date", formatting: "EEE, MMM d · HH:mm" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  weather: { type: "weather" },
  audio: { type: "audio" },
  disk: { type: "disk" },
});

createRoot(document.getElementById("root")).render(html`<${App} />`);

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  const [cryptoData, setCryptoData] = useState({ online: false, price: -1 });

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));

    const fetchQuant = async () => {
      try {
        const res = await fetch(
          "https://fapi.binance.com/fapi/v1/ticker/price?symbol=BTCUSDT&t=" +
            Date.now(),
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCryptoData({ online: true, price: Number(data.price) });
      } catch (e) {
        setCryptoData({ online: false, price: -1 });
      }
    };

    fetchQuant();
    const interval = setInterval(fetchQuant, 1000);
    return () => clearInterval(interval);
  }, []);

  function getNetworkIcon(network) {
    if (network.defaultInterface?.type === "ethernet")
      return html`<i className="nf nf-md-ethernet_cable"></i>`;
    const strength = network.defaultGateway?.signalStrength || 0;
    if (strength >= 80)
      return html`<i className="nf nf-md-wifi_strength_4"></i>`;
    if (strength >= 65)
      return html`<i className="nf nf-md-wifi_strength_3"></i>`;
    if (strength >= 40)
      return html`<i className="nf nf-md-wifi_strength_2"></i>`;
    if (strength >= 25)
      return html`<i className="nf nf-md-wifi_strength_1"></i>`;
    return html`<i className="nf nf-md-wifi_strength_off_outline"></i>`;
  }

  function getBatteryIcon(battery) {
    if (battery.isCharging)
      return html`<i className="nf nf-md-power_plug charging"></i>`;
    if (battery.chargePercent > 90)
      return html`<i className="nf nf-fa-battery_4"></i>`;
    if (battery.chargePercent > 20)
      return html`<i className="nf nf-fa-battery_2"></i>`;
    return html`<i className="nf nf-fa-battery_0 low-battery"></i>`;
  }

  function getAudioIcon(audio) {
    const vol = Math.round(audio.defaultPlaybackDevice?.volume ?? 0);
    if (vol === 0) return html`<i className="nf nf-fa-volume_off muted"></i>`;
    return html`<i className="nf nf-fa-volume_up"></i>`;
  }

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
        <div className=${`pill quant-pill ${cryptoData.online ? "" : "error"}`}>
          <i className="nf nf-fa-line_chart"></i>
          <span
            >${cryptoData.online
              ? cryptoData.price.toLocaleString()
              : "Offline"}</span
          >
        </div>

        <div className="pill status-pill">
          ${output.network &&
          html`<div className="item">
            ${getNetworkIcon(output.network)}
            <span className="traffic"
              >↓${output.network.traffic?.received?.siValue ?? ""}</span
            >
          </div>`}
          ${output.cpu &&
          html`<div className="item">
            <i className="nf nf-oct-cpu"></i>
            <span className=${output.cpu.usage > 80 ? "danger-text" : ""}
              >${String(Math.round(output.cpu.usage)).padStart(
                3,
                "\u00A0",
              )}%</span
            >
          </div>`}
          ${output.memory &&
          html`<div className="item">
            <i className="nf nf-fae-chip"></i>
            <span
              >${String(Math.round(output.memory.usage)).padStart(
                3,
                "\u00A0",
              )}%</span
            >
          </div>`}
          ${output.audio &&
          html`<div className="item">
            ${getAudioIcon(output.audio)}
            <span
              >${String(
                Math.round(output.audio.defaultPlaybackDevice?.volume ?? 0),
              ).padStart(3, "\u00A0")}%</span
            >
          </div>`}
          ${output.battery &&
          html`<div className="item">
            ${getBatteryIcon(output.battery)}
            <span
              className=${output.battery.chargePercent <= 20 &&
              !output.battery.isCharging
                ? "danger-text"
                : ""}
            >
              ${String(Math.round(output.battery.chargePercent)).padStart(
                3,
                "\u00A0",
              )}%
            </span>
          </div>`}
        </div>
      </div>
    </div>
  `;
}
