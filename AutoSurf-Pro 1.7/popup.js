function updateStatus(enabled) {
  document.getElementById("status").textContent = enabled
    ? "🟢 Автосёрфинг включён"
    : "🔴 Отключен";
}

function renderBlacklist(list) {
  const ul = document.getElementById("blacklistDisplay");
  ul.innerHTML = "";
  list.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;
    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.onclick = () => {
      list.splice(index, 1);
      chrome.storage.local.set({ autosurf_blacklist: list }, () => {
        renderBlacklist(list);
        document.getElementById("blacklistInput").value = list.join(",");
      });
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function loadSettings() {
  chrome.storage.local.get([
    "autosurf_enabled",
    "autosurf_sites",
    "autosurf_interval",
    "autosurf_click_delay",
    "autosurf_scroll_type",
    "autosurf_blacklist"
  ], (data) => {
    updateStatus(data.autosurf_enabled);
    document.getElementById("siteList").value = (data.autosurf_sites || []).join("\n");
    document.getElementById("interval").value = data.autosurf_interval || 5;
    document.getElementById("clickDelay").value = data.autosurf_click_delay || 10;
    document.getElementById("scrollType").value = data.autosurf_scroll_type || "smooth";
    document.getElementById("blacklistInput").value = (data.autosurf_blacklist || []).join(",");
    renderBlacklist(data.autosurf_blacklist || []);
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
  const blacklist = document.getElementById("blacklistInput").value.split(",").map(s => s.trim()).filter(Boolean);

  chrome.storage.local.set({
    autosurf_enabled: true,
    autosurf_sites: sites,
    autosurf_interval: interval,
    autosurf_click_delay: clickDelay,
    autosurf_scroll_type: scrollType,
    autosurf_blacklist: blacklist
  }, () => {
    updateStatus(true);
  });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.storage.local.set({ autosurf_enabled: false }, () => {
    updateStatus(false);
  });
});

document.getElementById("restart").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});

loadSettings();
