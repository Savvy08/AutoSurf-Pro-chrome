let autosurfIntervalId = null;

// 🔄 Запуск при старте браузера
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["autosurf_enabled"], (data) => {
    if (data.autosurf_enabled) startAutoSurf();
  });
});

// 📩 Обработка сообщений от popup.js
chrome.runtime.onMessage.addListener((req) => {
  if (req.action === "start_autosurf") startAutoSurf();
  if (req.action === "stop_autosurf") stopAutoSurf();
  if (req.action === "restart_autosurf") restartAutoSurf();
});

// 🧬 Инъекция content.js при загрузке вкладки
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && !tab.url.startsWith("chrome://")) {
    chrome.storage.local.get(["autosurf_enabled"], (data) => {
      if (data.autosurf_enabled) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"]
        });
      }
    });
  }
});

// 🚀 Запуск автосёрфинга
function startAutoSurf() {
  stopAutoSurf(); // Очищаем предыдущий таймер

  chrome.storage.local.get([
    "autosurf_enabled",
    "autosurf_sites",
    "autosurf_interval",
    "autosurf_blacklist"
  ], (data) => {
    if (!data.autosurf_enabled) return;

    const allSites = data.autosurf_sites || [];
    const blacklist = data.autosurf_blacklist || [];

    const filteredSites = allSites.filter(site => {
      return !blacklist.some(bl => site.includes(bl));
    });

    if (filteredSites.length === 0) return;

    autosurfIntervalId = setInterval(() => {
      const site = filteredSites[Math.floor(Math.random() * filteredSites.length)];
      chrome.tabs.create({ url: site, active: false }, (tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
      });
    }, (data.autosurf_interval || 5) * 60 * 1000);
  });
}

// ⛔ Остановка автосёрфинга
function stopAutoSurf() {
  if (autosurfIntervalId) clearInterval(autosurfIntervalId);
  autosurfIntervalId = null;
}

// 🔁 Перезапуск автосёрфинга
function restartAutoSurf() {
  stopAutoSurf();
  setTimeout(() => {
    chrome.storage.local.get(["autosurf_enabled"], (data) => {
      if (data.autosurf_enabled) startAutoSurf();
    });
  }, 150);
}

// 🧠 Реакция на изменения настроек
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  const keys = [
    "autosurf_enabled",
    "autosurf_sites",
    "autosurf_interval",
    "autosurf_blacklist"
  ];

  const hasChange = keys.some(key => key in changes);

  if (hasChange) {
    chrome.storage.local.get(["autosurf_enabled"], (data) => {
      if (data.autosurf_enabled) {
        startAutoSurf();
      } else {
        stopAutoSurf();
      }
    });
  }
});
