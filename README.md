# $POOPPONS — The Vault That Finally Shipped Something

Satirical memecoin landing page parodying "vault protocol" DeFi jargon (PonsVault-style:
"no operator keys", "fees become a rule", "unaudited"), built around a chrome vault-cat
mascot that literally produces a pill and a deposit.

Static site, no build step: `index.html` + `style.css` + `script.js` + `assets/`.

## Deploy
1. Push these files to a GitHub repo (root of the repo, not a subfolder).
2. Import the repo into Vercel — framework preset "Other", no build command needed.
3. Once the token is minted, fill in `CONFIG` at the top of `script.js`:
   `CA`, `BUY_URL`, `CHART_URL`, `X_URL`, `TELEGRAM_URL`. The contract bar, buy/chart
   buttons, footer links and live stats panel all pick these up automatically —
   stats pull live from the public DexScreener API once `CA` is set.
