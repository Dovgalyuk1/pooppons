// ====== CONFIG — fill these in once the token exists ======
const CONFIG = {
  CA: "",                         // contract address once minted, e.g. "So1anaAddressHere..."
  BUY_URL: "",                    // pump.fun / DEX swap link
  CHART_URL: "",                  // dexscreener link
  X_URL: "",                      // twitter/x profile
  TELEGRAM_URL: "",               // telegram group
};

// ====== Contract bar ======
const contractValueEl = document.getElementById("contract-value");
const footerCaValueEl = document.getElementById("footer-ca-value");

function shortAddr(addr) {
  if (!addr) return "";
  return addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : addr;
}

if (CONFIG.CA) {
  contractValueEl.textContent = CONFIG.CA;
  footerCaValueEl.textContent = shortAddr(CONFIG.CA);
} else {
  contractValueEl.textContent = "COMING SOON — NOT MINTED YET";
  footerCaValueEl.textContent = "COMING SOON";
}

// ====== Copy CA ======
const copyBtn = document.getElementById("copy-ca");
const toast = document.getElementById("toast");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

copyBtn.addEventListener("click", async () => {
  if (!CONFIG.CA) {
    showToast("No CA yet — vault hasn't minted");
    return;
  }
  try {
    await navigator.clipboard.writeText(CONFIG.CA);
    showToast("Copied CA to clipboard");
  } catch (e) {
    showToast("Couldn't copy — copy manually");
  }
});

// ====== Link buttons (buy / chart / x / telegram) ======
function wireLink(id, url, fallbackMsg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (url) {
      window.open(url, "_blank", "noopener");
    } else {
      showToast(fallbackMsg);
    }
  });
}

wireLink("btn-buy-top", CONFIG.BUY_URL, "Buy link goes live at mint");
wireLink("btn-buy-hero", CONFIG.BUY_URL, "Buy link goes live at mint");
wireLink("btn-chart", CONFIG.CHART_URL, "Chart goes live once there's liquidity");
wireLink("btn-x", CONFIG.X_URL, "X account coming soon");
wireLink("footer-x", CONFIG.X_URL, "X account coming soon");
wireLink("footer-tg", CONFIG.TELEGRAM_URL, "Telegram coming soon");
wireLink("footer-chart", CONFIG.CHART_URL, "Chart goes live once there's liquidity");

// ====== Sound toggle (no audio wired yet, just a mute-state UI stub) ======
const soundBtn = document.getElementById("btn-sound");
let soundOn = false;
soundBtn.addEventListener("click", (e) => {
  e.preventDefault();
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 SOUND" : "🔇 SOUND";
});

// ====== Vault audit terminal ======
const terminalLines = [
  { t: "> initializing pons_vault_v2_audit.log", muted: true },
  { t: "> operator_keys: NONE FOUND (cat has root access)" },
  { t: "> fee_routing: rerouted through colon, per protocol rule" },
  { t: "> reserve_asset[0]: 1x chrome-plated feline (self-appointed)" },
  { t: "> reserve_asset[1]: 1x undisclosed pill (labelled \"yield\")" },
  { t: "> reserve_asset[2]: 1x undisclosed deposit (do not inspect)" },
  { t: "> collateral_ratio: emotionally, about 40%" },
  { t: "> audit_status: PASSED (self-graded, cat is the grader)" },
  { t: "> permissionless: yes, in the sense nobody asked for this" },
  { t: "> next_disbursement: whenever the cat feels like it", muted: true },
  { t: "> vault status: OPERATIONAL. do not feed after midnight." },
];

const terminalBody = document.getElementById("terminal-body");
let lineIndex = 0;

function typeNextLine() {
  if (lineIndex >= terminalLines.length) {
    setTimeout(() => {
      terminalBody.innerHTML = "";
      lineIndex = 0;
      typeNextLine();
    }, 3200);
    return;
  }
  const line = terminalLines[lineIndex];
  const div = document.createElement("div");
  div.className = "terminal-line" + (line.muted ? " muted" : "");
  div.textContent = line.t;
  terminalBody.appendChild(div);
  lineIndex++;
  setTimeout(typeNextLine, 480);
}
typeNextLine();

// ====== Live stats via DexScreener (only runs once CONFIG.CA is set) ======
const statPrice = document.getElementById("stat-price");
const statMcap = document.getElementById("stat-mcap");
const statLiq = document.getElementById("stat-liq");
const statVol = document.getElementById("stat-vol");
const statsNote = document.getElementById("stats-note");

function fmtUsd(n) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

async function loadStats() {
  if (!CONFIG.CA) return; // leave placeholders + note as-is
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONFIG.CA}`);
    const data = await res.json();
    const pair = data && data.pairs && data.pairs[0];
    if (!pair) {
      statsNote.textContent = "No trading pair found yet.";
      return;
    }
    statPrice.textContent = pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(6)}` : "—";
    statMcap.textContent = fmtUsd(pair.fdv || pair.marketCap);
    statLiq.textContent = fmtUsd(pair.liquidity && pair.liquidity.usd);
    statVol.textContent = fmtUsd(pair.volume && pair.volume.h24);
    statsNote.textContent = "Live from DexScreener.";
  } catch (e) {
    statsNote.textContent = "Couldn't reach DexScreener right now.";
  }
}
loadStats();
