(function () {
  const h = location.hash.slice(1);
  let d = localStorage.getItem("d");
  if (h.startsWith("d=")) { d = decodeURIComponent(h.slice(2)); localStorage.setItem("d", d); }
  const status = document.getElementById("status");
  const bal = document.getElementById("bal");
  const act = document.getElementById("activity");
  const modeEl = document.getElementById("mode");
  if (!d) { status.textContent = "Open with #d=… once to bind this device."; return; }
  // Pages project site: poll relative d/{DATA_PATH}/
  const base = "d/" + encodeURIComponent(d) + "/";
  async function poll() {
    try {
      const s = await fetch(base + "state.json?t=" + Date.now()).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
      bal.textContent = "$" + Number(s.balance ?? 0).toFixed(2);
      if (modeEl) modeEl.textContent = s.mode || "PAPER";
      status.textContent = (s.open_positions || 0) + " open · " + (s.updated_at || "");
      const a = await fetch(base + "activity.json?t=" + Date.now()).then(r => r.json());
      act.innerHTML = (a.items || []).map(x =>
        "<div><strong>" + (x.title || "") + "</strong><br/><span style='opacity:.6'>" +
        (x.subtitle || "") + " · " + (x.value || "") + "</span></div>").join("") || "<div>No activity yet</div>";
    } catch (e) { status.textContent = "poll error: " + e.message; }
  }
  poll(); setInterval(poll, 15000);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
