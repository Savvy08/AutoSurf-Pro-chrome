function applyStoredSettings() {
  chrome.storage.local.get([
    "autosurf_enabled",
    "autosurf_sites",
    "autosurf_interval",
    "autosurf_click_delay",
    "autosurf_scroll_type",
    "autosurf_blacklist"
  ], (data) => {
    document.getElementById("status").textContent = data.autosurf_enabled
      ? "🟢 Автосёрфинг включён"
      : "🔴 Отключен";
    document.getElementById("siteList").value = (data.autosurf_sites || []).join("\n");
    document.getElementById("interval").value = data.autosurf_interval || 5;
    document.getElementById("clickDelay").value = data.autosurf_click_delay || 10;
    document.getElementById("scrollType").value = data.autosurf_scroll_type || "smooth";
    document.getElementById("blacklist").value = (data.autosurf_blacklist || []).join(",");
  });
}

document.getElementById("siteFile").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const sites = e.target.result.split("\n").map(s => s.trim()).filter(Boolean);
    document.getElementById("siteList").value = sites.join("\n");
    chrome.storage.local.set({ autosurf_sites: sites });
  };
  reader.readAsText(file);
});

document.getElementById("start").addEventListener("click", () => {
  const sites = document.getElementById("siteList").value.split("\n").map(s => s.trim()).filter(Boolean);
  const interval = parseInt(document.getElementById("interval").value);
  const clickDelay = parseInt(document.getElementById("clickDelay").value);
  const scrollType = document.getElementById("scrollType").value;
  const blacklist = document.getElementById("blacklist").value.split(",").map(s => s.trim()).filter(Boolean);

  chrome.storage.local.set({
    autosurf_enabled: true,
    autosurf_sites: sites,
    autosurf_interval: interval,
    autosurf_click_delay: clickDelay,
    autosurf_scroll_type: scrollType,
    autosurf_blacklist: blacklist
  }, () => {
    chrome.runtime.sendMessage({ action: "start_autosurf" });
    applyStoredSettings();
  });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.storage.local.set({ autosurf_enabled: false }, () => {
    chrome.runtime.sendMessage({ action: "stop_autosurf" });
    applyStoredSettings();
  });
});

document.getElementById("restart").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "restart_autosurf" });
});

applyStoredSettings();
