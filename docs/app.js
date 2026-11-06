(function () {
  const h = location.hash.slice(1);
  let d = localStorage.getItem("d");
  if (h.startsWith("d=")) { d = h.slice(2); localStorage.setItem("d", d); }
  const status = document.getElementById("status");
  const bal = document.getElementById("bal");
  const act = document.getElementById("activity");
  if (!d) { status.textContent = "Open with #d=… once to bind this device."; return; }
  const base = "d/" + encodeURIComponent(d) + "/";
  async function poll() {
    try {
      const s = await fetch(base + "state.json?t=" + Date.now()).then(r => r.json());
      bal.textContent = "$" + Number(s.balance ?? 0).toFixed(2);
      status.textContent = "mode=" + (s.mode || "PAPER") + " · " + (s.updated_at || "");
      const a = await fetch(base + "activity.json?t=" + Date.now()).then(r => r.json());
      act.innerHTML = (a.items || []).map(x => "<div>" + (x.title || "") + "</div>").join("") || "<div>No activity yet</div>";
    } catch (e) { status.textContent = "poll error: " + e.message; }
  }
  poll(); setInterval(poll, 15000);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
