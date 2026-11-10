(function () {
  var KEY = "alienation-dashboard";
  var LANG_KEY = "alienation-dashboard-lang";
  var data = null;
  var lang = "en";

  var UI = {
    en: {
      htmlLang: "en",
      title: "Personal notes — alienation",
      home: "Notebook",
      homeHref: "../en-index.html",
      lang: "中文",
      lock: "Lock",
      kicker: "Personal / not private",
      h1: "A page for myself.",
      lede: "Projects, milestones, and a note about what to look at. The screen only reads dashboard/data.json.",
      warn: "GitHub Pages is public. The passphrase is the string in dashboard/config.js. The placeholder is change-me. noindex asks crawlers to skip this path. It does not stop a person who opens the URL. A private host is required before this page is actually private.",
      alt: "中文：这不是保密区。口令写在源码里，data.json 也可以被直接下载。",
      phrase: "Passphrase",
      open: "Open",
      bad: "That passphrase does not match.",
      nocrypto: "This browser cannot check the passphrase. Use http://localhost or https, not a file:// URL.",
      colon: ": ",
      theme: "Toggle light and dark theme",
      foot: "Personal notes. The files stay public.",
      now: "Now",
      projects: "Projects",
      milestones: "Milestones",
      edit: "Edit dashboard/data.json. Priorities and next actions are blank on purpose. Change the passphrase in dashboard/config.js, then press Lock once.",
      priority: "Priority",
      unset: "not set",
      next: "Next",
      unverified: "Unverified",
      checked: "Checked",
      missing: "Could not read data.json. From the repository root, run python3 -m http.server and open /dashboard/. Opening the file directly will not work.",
      empty: "Nothing in this section.",
      vis: { public: "Public", "private-placeholder": "Placeholder" },
      status: { preprint: "Preprint", paused: "Paused", demo: "Demo", notes: "Notes", unset: "Unset", placeholder: "Placeholder" }
    },
    zh: {
      htmlLang: "zh-CN",
      title: "个人记录 — alienation",
      home: "札记",
      homeHref: "../zh-index.html",
      lang: "EN",
      lock: "锁定",
      kicker: "个人 / 并非保密",
      h1: "给自己看的一页。",
      lede: "项目、节点，以及眼下想看的一段话。页面只读取 dashboard/data.json。",
      warn: "GitHub Pages 是公开的。口令就是 dashboard/config.js 里的字符串，默认占位是 change-me。noindex 只是请爬虫跳过，拦不住直接打开网址的人。要真正不公开，需要以后换到私有托管。",
      alt: "English: this is not a private area. The passphrase is in the source, and data.json can be downloaded.",
      phrase: "口令",
      open: "进入",
      bad: "口令不对。",
      nocrypto: "这个浏览器没法核对口令。请用 http://localhost 或 https 打开，不要用 file://。",
      colon: "：",
      theme: "切换明暗主题",
      foot: "个人记录。文件本身仍然公开。",
      now: "此刻",
      projects: "项目",
      milestones: "节点",
      edit: "改 dashboard/data.json。优先级和下一步故意留空。口令在 dashboard/config.js，改完按一次「锁定」。",
      priority: "优先级",
      unset: "未填写",
      next: "下一步",
      unverified: "未核实",
      checked: "已核对",
      missing: "读不到 data.json。请在仓库根目录运行 python3 -m http.server，再打开 /dashboard/。不要直接双击文件。",
      empty: "这一栏还是空的。",
      vis: { public: "公开", "private-placeholder": "占位" },
      status: { preprint: "预印本", paused: "暂停", demo: "演示", notes: "笔记", unset: "未标", placeholder: "占位" }
    }
  };

  var gate = document.getElementById("gate");
  var board = document.getElementById("board");
  var form = document.getElementById("gate-form");
  var input = document.getElementById("phrase");
  var error = document.getElementById("gate-error");
  var lock = document.getElementById("dash-lock");
  var langButton = document.getElementById("dash-lang");

  function text(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function storedLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "zh" || saved === "en") return saved;
    } catch (_) {}
    return "en";
  }

  function applyChrome() {
    var ui = UI[lang];
    document.documentElement.lang = ui.htmlLang;
    document.title = ui.title;
    text("dash-kicker", ui.kicker);
    text("dash-h1", ui.h1);
    text("dash-lede", ui.lede);
    text("dash-warn", ui.warn);
    text("dash-alt", ui.alt);
    text("phrase-label", ui.phrase);
    text("gate-submit", ui.open);
    langButton.textContent = ui.lang;
    lock.textContent = ui.lock;
    var home = document.getElementById("dash-home");
    home.textContent = ui.home;
    home.href = ui.homeHref;
    document.querySelector(".wordmark").href = ui.homeHref;
    document.getElementById("dash-foot-brand").href = ui.homeHref;
    text("dash-foot-note", ui.foot);
    var theme = document.querySelector(".theme");
    if (theme) {
      theme.setAttribute("aria-label", ui.theme);
      theme.title = ui.theme;
    }
    input.setAttribute("aria-label", ui.phrase);
  }

  function sha256(value) {
    if (!window.crypto || !crypto.subtle) return Promise.resolve(null);
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function expected() {
    var config = window.ALIENATION_DASHBOARD || {};
    var phrase = typeof config.passphrase === "string" ? config.passphrase : "";
    if (!phrase) return Promise.resolve(null);
    return sha256(phrase);
  }

  function saved() {
    try { return localStorage.getItem(KEY) || ""; } catch (_) { return ""; }
  }

  function remember(hash) {
    try { localStorage.setItem(KEY, hash); } catch (_) {}
  }

  function forget() {
    try { localStorage.removeItem(KEY); } catch (_) {}
  }

  function pill(label, unverified) {
    var node = document.createElement("span");
    node.className = "pill";
    if (unverified) node.dataset.kind = "unverified";
    node.textContent = label;
    return node;
  }

  function linkList(links) {
    var row = document.createElement("div");
    row.className = "card-links";
    (links || []).forEach(function (item) {
      if (!item || !item.href || !/^https:\/\//.test(item.href)) return;
      var a = document.createElement("a");
      a.href = item.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.label || item.href;
      row.appendChild(a);
    });
    return row;
  }

  function field(record, key) {
    var value = record && record[key];
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || value.zh || "";
  }

  function render() {
    var ui = UI[lang];
    board.replaceChildren();
    if (!data) {
      var fail = document.createElement("p");
      fail.className = "dash-foot";
      fail.textContent = ui.missing;
      board.appendChild(fail);
      return;
    }

    var now = document.createElement("section");
    now.className = "dash-section";
    now.innerHTML = '<div class="section-heading"><div><span class="eyebrow">NOW</span><h2></h2></div></div>';
    now.querySelector("h2").textContent = ui.now;
    var nowCard = document.createElement("div");
    nowCard.className = "dash-now";
    var nowText = document.createElement("p");
    nowText.textContent = field(data, "now");
    nowCard.appendChild(nowText);
    now.appendChild(nowCard);
    board.appendChild(now);

    var projects = document.createElement("section");
    projects.className = "dash-section";
    projects.innerHTML = '<div class="section-heading"><div><span class="eyebrow">PROJECTS</span><h2></h2></div></div>';
    projects.querySelector("h2").textContent = ui.projects;
    var grid = document.createElement("div");
    grid.className = "dash-grid";
    (data.projects || []).forEach(function (item) {
      var card = document.createElement("article");
      card.className = "dash-card";
      var meta = document.createElement("div");
      meta.className = "dash-meta";
      meta.appendChild(pill(ui.vis[item.visibility] || item.visibility || ui.unset, item.verified === false));
      meta.appendChild(pill(ui.status[item.status] || item.status || ui.unset, false));
      if (item.verified === false) meta.appendChild(pill(ui.unverified, true));
      else meta.appendChild(pill(ui.checked, false));
      var priority = document.createElement("span");
      priority.className = "card-meta";
      priority.textContent = ui.priority + ui.colon + (item.priority ? item.priority : ui.unset);
      meta.appendChild(priority);
      var title = document.createElement("h3");
      title.textContent = typeof item.name === "string" ? item.name : field(item, "name");
      var summary = document.createElement("p");
      summary.textContent = field(item, "summary");
      var next = document.createElement("p");
      next.className = "dash-next";
      var nextLabel = document.createElement("span");
      nextLabel.textContent = ui.next;
      next.appendChild(nextLabel);
      next.appendChild(document.createTextNode(field(item, "next")));
      card.appendChild(meta);
      card.appendChild(title);
      card.appendChild(summary);
      card.appendChild(next);
      var links = linkList(item.links);
      if (links.childNodes.length) card.appendChild(links);
      grid.appendChild(card);
    });
    if (!grid.childNodes.length) {
      var empty = document.createElement("p");
      empty.className = "dash-foot";
      empty.textContent = ui.empty;
      grid.appendChild(empty);
    }
    projects.appendChild(grid);
    board.appendChild(projects);

    var done = document.createElement("section");
    done.className = "dash-section";
    done.innerHTML = '<div class="section-heading"><div><span class="eyebrow">MILESTONES</span><h2></h2></div></div>';
    done.querySelector("h2").textContent = ui.milestones;
    var list = document.createElement("div");
    list.className = "entries";
    (data.achievements || []).forEach(function (item) {
      var row = document.createElement("article");
      row.className = "entry-row";
      var body = document.createElement("div");
      var kicker = document.createElement("p");
      kicker.className = "eyebrow";
      kicker.textContent = (item.date || "—") + " · " + (item.verified === false ? ui.unverified : ui.checked);
      var title = document.createElement("h2");
      if (item.href && /^https:\/\//.test(item.href)) {
        var a = document.createElement("a");
        a.href = item.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = field(item, "title");
        title.appendChild(a);
      } else {
        title.textContent = field(item, "title");
      }
      var detail = document.createElement("p");
      detail.textContent = field(item, "detail");
      body.appendChild(kicker);
      body.appendChild(title);
      body.appendChild(detail);
      var mark = document.createElement("span");
      mark.textContent = item.verified === false ? ui.unverified : ui.checked;
      row.appendChild(body);
      row.appendChild(mark);
      list.appendChild(row);
    });
    done.appendChild(list);
    board.appendChild(done);

    var foot = document.createElement("p");
    foot.className = "dash-foot";
    foot.textContent = ui.edit + (data.updated ? " (" + data.updated + ")" : "");
    board.appendChild(foot);
  }

  function showBoard() {
    gate.hidden = true;
    board.hidden = false;
    lock.hidden = false;
    render();
  }

  function showGate() {
    gate.hidden = false;
    board.hidden = true;
    lock.hidden = true;
    error.textContent = "";
  }

  function load() {
    return fetch("data.json", { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error("status " + response.status);
      return response.json();
    }).then(function (json) {
      data = json;
      showBoard();
    }).catch(function () {
      data = null;
      showBoard();
    });
  }

  lang = storedLang();
  applyChrome();

  langButton.addEventListener("click", function () {
    lang = lang === "en" ? "zh" : "en";
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
    applyChrome();
    if (!board.hidden) render();
  });

  lock.addEventListener("click", function () {
    forget();
    data = null;
    input.value = "";
    showGate();
    input.focus();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    error.textContent = "";
    expected().then(function (hash) {
      var given = input.value;
      if (!hash) {
        error.textContent = UI[lang].nocrypto;
        return;
      }
      return sha256(given).then(function (got) {
        if (got && got === hash) {
          remember(hash);
          input.value = "";
          return load();
        }
        error.textContent = UI[lang].bad;
        input.select();
      });
    });
  });

  expected().then(function (hash) {
    if (hash && saved() === hash) return load();
    showGate();
  });
})();
