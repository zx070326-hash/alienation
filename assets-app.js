(function () {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
<symbol id="i-wave" viewBox="0 0 24 24"><path d="M2 13c1.6-3 3.2-3 4.8 0s3.2 3 4.8 0 3.2-3 4.8 0 3.2 3 4.8 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
<symbol id="i-layers" viewBox="0 0 24 24"><path d="M4 8h16M4 12h16M4 16h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
<symbol id="i-split" viewBox="0 0 24 24"><path d="M7 7h8M7 17h8M5 7l-2 0M19 7l2 0M5 17l-2 0M19 17l2 0M12 7v10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M17 5l3 2-3 2M7 15l-3 2 3 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5.5 19a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 15h8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
<symbol id="i-heat" viewBox="0 0 24 24"><path d="M12 3v3M5 8l2 2M19 8l-2 2M12 21a5 5 0 0 0 5-5c0-3-5-6-5-9 0 3-5 6-5 9a5 5 0 0 0 5 5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
<symbol id="i-book" viewBox="0 0 24 24"><path d="M5 4.5h11a3 3 0 0 1 3 3V20H8.5A3.5 3.5 0 0 0 5 16.5zM5 4.5V16.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M5 6h14v9H8l-3 3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v5l3 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
<symbol id="i-mark" viewBox="0 0 24 24"><path d="M12 3l2.2 4.6L19 8.2l-3.5 3.4.8 4.9L12 14.8 7.7 16.5l.8-4.9L5 8.2l4.8-.6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
<symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 17.2h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
</defs></svg>`;
  const holder = document.createElement('div');
  holder.innerHTML = raw;
  const svg = holder.querySelector('svg');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  document.body.prepend(svg);
  document.querySelectorAll('use[href*="#i-"]').forEach((node) => {
    const href = node.getAttribute('href') || '';
    const hash = href.slice(href.indexOf('#'));
    if (hash.startsWith('#i-')) node.setAttribute('href', hash);
  });
})();

const reading = document.querySelector('[data-reading]');
if (reading) {
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden', 'true');
  const span = document.createElement('span');
  bar.appendChild(span);
  document.body.prepend(bar);
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const mark = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    span.style.transform = `scaleX(${max > 0 ? Math.min(1, root.scrollTop / max) : 0})`;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) current = section;
    }
    for (const link of links) {
      const on = current && link.getAttribute('href') === `#${current.id}`;
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };
  mark();
  document.addEventListener('scroll', mark, { passive: true });
}

const themeButton = document.querySelector('.theme');
if (themeButton) {
  const sunIcon = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2m0 15v2M2.5 12h2m15 0h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M5.3 18.7l1.4-1.4m10.6-10.6 1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const getTheme = () => document.documentElement.dataset.theme || (mq.matches ? 'dark' : 'light');
  const syncIcon = () => {
    const isDark = getTheme() === 'dark';
    themeButton.innerHTML = isDark ? sunIcon : moonIcon;
    themeButton.setAttribute('aria-pressed', String(isDark));
  };
  themeButton.hidden = false;
  syncIcon();
  mq.addEventListener('change', syncIcon);
  themeButton.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('alienation-theme', next); } catch (_) {}
    syncIcon();
  });
}
