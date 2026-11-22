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
      if (section.getBoundingClientRect().top <= 140) current = section;
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
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('alienation-theme', next); } catch (_) {}
  });
}
