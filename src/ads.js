function validConfiguration(config) {
  return config?.enabled && /^ca-pub-\d+$/.test(config.client || '');
}

export function initializeAds() {
  const config = window.LOGOMEND_ADS;
  if (!validConfiguration(config)) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;
  document.head.append(script);

  document.querySelectorAll('[data-ad-position]').forEach(shell => {
    const position = shell.dataset.adPosition;
    const slot = config.slots?.[position];
    if (!/^\d+$/.test(slot || '')) return;
    const holder = shell.querySelector('.ad-placeholder');
    holder.innerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-client="${config.client}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
    shell.classList.add('ads-active');
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* AdSense retries after load. */ }
  });
}
