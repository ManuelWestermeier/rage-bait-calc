import { useState, useRef } from "react";

var tries1 = 0;
var tries2 = 0;

async function sendNotification(title, text) {
  if (!("Notification" in window)) return;

  let permission = Notification.permission;

  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") return;

  const notification = new Notification(title, {
    body: text
  });

  setTimeout(() => {
    notification.close();
  }, 25000);
}

// bleibt drin (dein bestehender Sound)
function boing() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";

  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

export default function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const oscRef = useRef(null);

  function initAudio() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(5000, ctx.currentTime); // 5 kHz

    gain.gain.setValueAtTime(0.0, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    ctxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;
  }

  function triggerMouseSound() {
    if (!audioEnabled || !gainRef.current || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const gain = gainRef.current;

    const now = ctx.currentTime;

    // kurz laut, dann sofort wieder leise
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  }

  return (
    <div
      onMouseMove={(e) => {
        e.currentTarget.style.backgroundColor = `rgb(${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )})`;

        e.currentTarget.style.transform = `translate(${Math.floor(
          Math.random() * 40
        )}px, ${Math.floor(Math.random() * 15)}px)`;

        triggerMouseSound();
      }}
    >
      {!audioEnabled && (
        <button
          onClick={async () => {
            initAudio();
            await ctxRef.current.resume?.();
            setAudioEnabled(true);
          }}
        >
          Calculator starten
        </button>
      )}

      <input
        type="number"
        value={count1}
        onInput={(e) => {
          tries1++;

          if (tries1 < 5) {
            boing();

            setCount1(Math.floor(Math.random() * 10 ** (Math.random() * 5)));

            sendNotification(
              "Noch " + (5 - tries1) + " mal warten",
              ""
            );
          } else {
            setCount1(parseInt(e.target.value) || 0);
          }
        }}
      />

      <br />

      <input
        type="number"
        value={count2}
        onInput={(e) => {
          tries2++;

          if (tries2 < 5) {
            boing();

            setCount2(Math.floor(Math.random() * 10 ** (Math.random() * 5)));

            sendNotification(
              "Noch " + (5 - tries2) + " mal warten",
              ""
            );
          } else {
            setCount2(parseInt(e.target.value) || 0);
          }
        }}
      />

      <br />

      <button onClick={() => alert(count1 * count2)}>
        Multiplizieren
      </button>

      <br />

      <button onClick={() => alert(count1 / count2)}>
        Division
      </button>

      <br />

      <button
        style={{ transition: "all 0.3s ease-in-out" }}
        onMouseOver={(e) => {
          e.target.style.scale = "0.1";
          boing();
        }}
        onClick={() =>
          alert("Wartungsarbeiten....bitte 5 min warten")
        }
      >
        Addition
      </button>

      <br />

      <button onClick={() => alert(count1 - count2)}>
        Subtraktion
      </button>
    </div>
  );
}
