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
