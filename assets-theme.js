try {
  var preferredTheme = localStorage.getItem('alienation-theme');
  if (preferredTheme === 'light' || preferredTheme === 'dark') document.documentElement.dataset.theme = preferredTheme;
} catch (_) { /* The system preference remains available when storage is blocked. */ }
