(async () => {
  const settings = await chrome.storage.local.get([
    "autosurf_enabled",
    "autosurf_sites",
    "autosurf_click_delay",
    "autosurf_scroll_type",
    "autosurf_blacklist"
  ]);
  if (!settings.autosurf_enabled) return;

  const blacklist = (settings.autosurf_blacklist || [])
    .map(s => s.trim())
    .filter(Boolean);

  const domain = location.hostname;
  if (blacklist.some(site => domain.includes(site))) {
    console.log("⛔ Автосёрфинг отключён на", domain);
    return;
  }

  const speedMap = { slow: 1, smooth: 3, fast: 6 };
  const speed = speedMap[settings.autosurf_scroll_type] || 2;
  let scrollY = 0;
  const scrollInterval = setInterval(() => {
    scrollY += speed;
    window.scrollBy(0, speed);
    if (scrollY >= document.body.scrollHeight - window.innerHeight) {
      clearInterval(scrollInterval);
    }
  }, 30);

  const delay = (settings.autosurf_click_delay || 10) * 1000;
  setTimeout(() => {
    const links = Array.from(document.querySelectorAll("a, button, input[type=submit]"))
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
    if (links.length > 0) {
      const el = links[Math.floor(Math.random() * links.length)];
      el.click();
      el.style.boxShadow = "0 0 10px 2px #ff0";
      setTimeout(() => el.style.boxShadow = "", 500);
    }
  }, delay);
})();
