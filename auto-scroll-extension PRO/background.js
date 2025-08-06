let autosurfIntervalId = null;

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["autosurf_enabled"], (data) => {
    if (data.autosurf_enabled) startAutoSurf();
  });
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.action === "start_autosurf") startAutoSurf();
  if (req.action === "stop_autosurf") stopAutoSurf();
  if (req.action === "restart_autosurf") {
    stopAutoSurf();
    startAutoSurf();
  }
});

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

function startAutoSurf() {
  chrome.storage.local.get(["autosurf_enabled", "autosurf_sites", "autosurf_interval"], (data) => {
    if (!data.autosurf_enabled) return;
    if (autosurfIntervalId) clearInterval(autosurfIntervalId);

    autosurfIntervalId = setInterval(() => {
      const sites = data.autosurf_sites || [];
      if (sites.length) {
        const site = sites[Math.floor(Math.random() * sites.length)];
        chrome.tabs.create({ url: site, active: false }, (tab) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          });
        });
      }
    }, (data.autosurf_interval || 5) * 60 * 1000);
  });
}

function stopAutoSurf() {
  if (autosurfIntervalId) clearInterval(autosurfIntervalId);
  autosurfIntervalId = null;
}
