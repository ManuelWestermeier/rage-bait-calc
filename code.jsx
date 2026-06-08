import { useState, useRef } from "react";

var tries1 = 0;
var tries2 = 0;

// 🎵 SOUND LISTE
const sounds = [
  "/fahhhhhhhhhhhhhh.mp3",
  "/ack.mp3",
  "/metal-pipe-clang.mp3"
];

// 🎲 RANDOM SOUND
function playRandomSound() {
  const src = sounds[Math.floor(Math.random() * sounds.length)];
  const audio = new Audio(src);
  audio.volume = 0.8;
  audio.play();
}

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

// 🔊 BOING SOUND (WebAudio)
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
  const [popup, setPopup] = useState(null);

  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const oscRef = useRef(null);

  function initAudio() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(5000, ctx.currentTime);

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

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  }

  function showRandomPopup() {
    const roll = Math.random();

    if (roll < 0.5) {
      setPopup({
        type: "ad",
        title: "🔥 Werbung",
        text: "Upgrade jetzt auf Premium Calculator++!"
      });
    } else {
      setPopup({
        type: "rating",
        title: "⭐ Bewertung",
        text: "Gefällt dir die App? Bitte 5 Sterne im Store!"
      });
    }

    setTimeout(() => setPopup(null), 4000);
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
        playRandomSound();

        if (Math.random() < 0.01) {
          showRandomPopup();
        }
      }}
    >
      {!audioEnabled && (
        <button
          className="start"
          onClick={async () => {
            initAudio();
            await ctxRef.current.resume?.();
            setAudioEnabled(true);

            playRandomSound();
          }}
        >
          Calculator starten
        </button>
      )}

      <br />

      <input
        type="number"
        value={count1}
        onInput={(e) => {
          playRandomSound();
          tries1++;

          if (tries1 < 5) {
            boing();

            setCount1(Math.floor(Math.random() * 10 ** (Math.random() * 5)));

            sendNotification("Noch " + (5 - tries1) + " mal warten", "");

            if (Math.random() < 0.3) showRandomPopup();
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
          playRandomSound();
          tries2++;

          if (tries2 < 5) {
            boing();

            setCount2(Math.floor(Math.random() * 10 ** (Math.random() * 5)));

            sendNotification("Noch " + (5 - tries2) + " mal warten", "");

            if (Math.random() < 0.3) showRandomPopup();
          } else {
            setCount2(parseInt(e.target.value) || 0);
          }
        }}
      />

      <br />

      <button
        onClick={() => {
          playRandomSound();
          alert(count1 * count2);
        }}
      >
        Multiplizieren
      </button>

      <br />

      <button
        onClick={() => {
          playRandomSound();
          alert(count1 / count2);
        }}
      >
        Division
      </button>

      <br />

      <button
        style={{ transition: "all 0.3s ease-in-out" }}
        onMouseOver={(e) => {
          e.target.style.scale = "0.1";
          boing();
          playRandomSound();
          if (Math.random() < 0.5) showRandomPopup();
        }}
        onClick={() => {
          playRandomSound();
          alert("Wartungsarbeiten....bitte 5 min warten");
        }}
      >
        Addition
      </button>

      <br />

      <button
        onClick={() => {
          playRandomSound();
          alert(count1 - count2);
        }}
      >
        Subtraktion
      </button>

      {/* POPUP UI */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: popup.type === "ad" ? "#ff9800" : "#90caf9",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 9999,
            boxShadow: "0 0 20px rgba(0,0,0,0.3)"
          }}
        >
          <h3>{popup.title}</h3>
          <p>{popup.text}</p>
          <button
            onClick={() => {
              document.documentElement.requestFullscreen({
                navigationUI: "hide"
              });
              playRandomSound();
              setPopup(null);
            }}
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}
