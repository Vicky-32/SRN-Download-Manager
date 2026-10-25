(() => {
  'use strict';
  const release = window.SRN_RELEASE;
  const toast = document.querySelector('#toast');
  let toastTimer;
  function message(text) { if (!toast) return; toast.textContent = text; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500); }
  const themeButton = document.querySelector('.theme-button');
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    try { localStorage.setItem('srn-site-theme', theme); } catch { /* Storage is optional. */ }
  }
  try { const stored = localStorage.getItem('srn-site-theme'); if (stored === 'light' || stored === 'dark') setTheme(stored); } catch { /* Keep the default appearance. */ }
  themeButton?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
    const theme = button.dataset.preview;
    const preview = document.querySelector('#app-preview');
    if (preview && ['light', 'dark'].includes(theme)) preview.src = `assets/queue-${theme}.png`;
    document.querySelectorAll('[data-preview]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  if (!release) return;
  document.querySelectorAll('[data-version]').forEach(node => { node.textContent = release.version; });
  function trustedDownload(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.startsWith(`/${release.repository}/releases/download/`); } catch { return false; }
  }
  document.querySelectorAll('.download-link').forEach(link => {
    const asset = release.assets[link.dataset.asset];
    if (asset && trustedDownload(asset.url)) { link.href = asset.url; link.setAttribute('rel', 'noopener'); }
    else link.addEventListener('click', event => { event.preventDefault(); document.querySelector('#release-status')?.scrollIntoView({ block: 'center' }); message('Public download links are not published yet.'); });
  });
  document.querySelectorAll('[data-meta]').forEach(node => { const asset = release.assets[node.dataset.meta]; if (asset) node.textContent = `${asset.requirements} · ${(asset.bytes / 1048576).toFixed(1)} MiB · v${release.version}`; });
  document.querySelectorAll('[data-hash]').forEach(button => {
    const hash = release.assets[button.dataset.hash]?.sha256;
    button.disabled = !/^[a-f0-9]{64}$/.test(hash || '');
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(hash); message('SHA-256 copied. Compare it with the downloaded file.'); }
      catch { message('Clipboard unavailable. Open All checksums to copy the hash.'); }
    });
  });
  if (['windows','android','extension','source','checksums'].every(key => trustedDownload(release.assets[key]?.url))) {
    const status = document.querySelector('#release-status');
    if (status) status.textContent = `Version ${release.version} · Released ${release.date} · Versioned downloads hosted on GitHub Releases.`;
  }
})();
