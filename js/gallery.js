/* =====================================================================
   WAMBUI LUTHER ART — artwork gallery
   Renders WLA_CONFIG.artworks into an editorial masonry grid with
   animated category filtering (FLIP) and lightbox integration.
   ===================================================================== */
(function () {
  "use strict";
  window.WLA = window.WLA || {};

  var cfg, grid, filtersEl, statusEl, current = "all", nodes = [], busy = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ROW = 12;

  function catLabel(id) {
    var c = cfg.categories.find(function (x) { return x.id === id; });
    return c ? c.label : id;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Filters ---------- */
  function renderFilters() {
    cfg.categories.forEach(function (c, i) {
      var count = c.id === "all" ? cfg.artworks.length : cfg.artworks.filter(function (a) { return a.category === c.id; }).length;
      var b = el("button", "filter" + (c.id === current ? " is-active" : ""));
      b.type = "button";
      b.dataset.filter = c.id;
      b.setAttribute("aria-pressed", c.id === current ? "true" : "false");
      b.tabIndex = c.id === current ? 0 : -1;
      b.innerHTML = esc(c.label) + '<span class="filter__count" aria-hidden="true">' + count + "</span>" +
        '<svg class="filter__circle" viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true"><path d="M64 4 C100 3 117 14 115 26 C112 40 82 47 56 46 C26 45 5 37 5 24 C6 11 32 3 70 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" pathLength="100"/></svg>';
      b.setAttribute("aria-label", c.label + ", " + count + " artworks");
      filtersEl.appendChild(b);
    });

    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest(".filter");
      if (b) setFilter(b.dataset.filter);
    });
    // roving focus with arrow keys
    filtersEl.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
      var btns = Array.prototype.slice.call(filtersEl.querySelectorAll(".filter"));
      var i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = e.key === "Home" ? 0 : e.key === "End" ? btns.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length;
      btns.forEach(function (b) { b.tabIndex = -1; });
      btns[n].tabIndex = 0; btns[n].focus();
    });
  }

  /* ---------- Artwork cards ---------- */
  function renderItems() {
    var frag = document.createDocumentFragment();
    cfg.artworks.forEach(function (a, i) {
      var isPh = a.placeholder != null ? a.placeholder : !!cfg.artworksArePlaceholder;
      var alt = a.alt || (a.title + " — " + a.medium + (a.year ? ", " + a.year : "") + (isPh ? " (example placeholder image)" : ""));
      var extra = [a.dimensions, a.hours ? a.hours + " hours" : ""].filter(Boolean).join(" · ");
      var item = el("article", "art art--" + (a.size || "regular"));
      item.dataset.category = a.category;
      item.dataset.index = i;
      item.style.setProperty("--stagger", (i % 4) * 0.08 + "s");
      item.innerHTML =
        '<div class="art__inner">' +
          (a.note ? '<p class="art__note" aria-hidden="true">' + esc(a.note) + "</p>" : "") +
          '<button type="button" class="art__button" aria-label="View ' + esc(a.title) + ' larger">' +
            '<div class="art__media">' +
              (a.featured ? '<span class="art__featured">Featured</span>' : "") +
              '<img src="' + esc(a.image) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async"' +
                (a.width ? ' width="' + a.width + '" height="' + a.height + '"' : "") + ">" +
              '<span class="art__reveal" aria-hidden="true"><span class="art__reveal-title">' + esc(a.title) + '</span><span class="art__reveal-cta">click to look closer →</span></span>' +
            "</div>" +
          "</button>" +
          '<div class="art__caption"><div>' +
            '<h3 class="art__title">' + esc(a.title) + "</h3>" +
            '<p class="art__meta">' + esc(catLabel(a.category)) + (extra ? " · " + esc(extra) : "") + "</p>" +
          '</div>' + (a.year ? '<span class="art__year">' + esc(a.year) + "</span>" : "") + "</div>" +
          '<p class="art__desc">' + esc(a.description) + "</p>" +
        "</div>";
      item.querySelector("img").addEventListener("load", scheduleLayout);
      frag.appendChild(item);
      nodes.push(item);
    });
    grid.appendChild(frag);

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".art__button");
      if (!btn) return;
      var item = btn.closest(".art");
      var list = visibleArtworks();
      var a = cfg.artworks[+item.dataset.index];
      window.WLA.lightbox.open(list, list.indexOf(a), btn);
    });
  }

  function visibleArtworks() {
    return nodes.filter(function (n) { return !n.classList.contains("is-hidden"); })
      .map(function (n) { return cfg.artworks[+n.dataset.index]; });
  }

  /* ---------- Masonry: row spans from content height ---------- */
  var layoutQueued = false;
  function scheduleLayout() {
    if (layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(function () { layoutQueued = false; layout(); });
  }
  function layout() {
    nodes.forEach(function (n) {
      if (n.classList.contains("is-hidden")) return;
      var inner = n.firstElementChild;
      var mb = parseFloat(getComputedStyle(n).marginBottom) || 0;
      var span = Math.ceil((inner.getBoundingClientRect().height + mb) / ROW);
      n.style.gridRowEnd = "span " + span;
    });
  }

  /* ---------- Filtering with FLIP transitions ---------- */
  function matches(n, f) { return f === "all" || n.dataset.category === f; }

  function setFilter(f) {
    if (f === current || busy) return;
    current = f;
    filtersEl.querySelectorAll(".filter").forEach(function (b) {
      var on = b.dataset.filter === f;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });

    var leaving = nodes.filter(function (n) { return !n.classList.contains("is-hidden") && !matches(n, f); });
    var animate = !reduce.matches && typeof Element.prototype.animate === "function";

    function apply() {
      var staying = nodes.filter(function (n) { return !n.classList.contains("is-hidden") && matches(n, f); });
      var first = new Map();
      staying.forEach(function (n) { first.set(n, n.getBoundingClientRect()); });

      nodes.forEach(function (n) {
        n.classList.remove("is-leaving");
        n.classList.toggle("is-hidden", !matches(n, f));
      });
      layout();

      if (animate) {
        nodes.forEach(function (n) {
          if (n.classList.contains("is-hidden")) return;
          n.classList.add("is-visible");
          var a = first.get(n), b = n.getBoundingClientRect();
          if (a) {
            var dx = a.left - b.left, dy = a.top - b.top;
            if (dx || dy) n.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], { duration: 600, easing: "cubic-bezier(.22,.8,.24,1)" });
          } else {
            n.animate([{ opacity: 0, transform: "translateY(24px) scale(.96) rotate(1.5deg)" }, { opacity: 1, transform: "none" }],
              { duration: 650, delay: 60 + Math.random() * 160, easing: "cubic-bezier(.22,.8,.24,1)", fill: "backwards" });
          }
        });
      } else {
        nodes.forEach(function (n) { if (!n.classList.contains("is-hidden")) n.classList.add("is-visible"); });
      }
      if (grid.scrollLeft) grid.scrollTo({ left: 0, behavior: reduce.matches ? "auto" : "smooth" });
      updateProgress();
      var count = visibleArtworks().length;
      statusEl.textContent = "Showing " + count + " artwork" + (count === 1 ? "" : "s") + " in " + catLabel(f) + ".";
      busy = false;
    }

    busy = true;
    if (animate && leaving.length) {
      leaving.forEach(function (n) { n.classList.add("is-leaving"); });
      setTimeout(apply, 260);
    } else {
      apply();
    }
  }

  /* ---------- Phone swipe progress line ---------- */
  var progressEl = null;
  function updateProgress() {
    if (!progressEl) return;
    var max = grid.scrollWidth - grid.clientWidth;
    var p = max > 0 ? (grid.scrollLeft + grid.clientWidth) / grid.scrollWidth : 1;
    progressEl.style.width = Math.max(8, p * 100).toFixed(1) + "%";
  }

  function init() {
    cfg = window.WLA_CONFIG;
    grid = document.getElementById("gallery");
    filtersEl = document.getElementById("gallery-filters");
    statusEl = document.getElementById("gallery-status");
    if (!cfg || !grid) return;

    renderFilters();
    renderItems();
    layout();
    window.addEventListener("resize", scheduleLayout);
    progressEl = document.getElementById("gallery-progress");
    grid.addEventListener("scroll", function () { requestAnimationFrame(updateProgress); }, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleLayout);

    // staggered entrance as cards scroll into view
    if ("IntersectionObserver" in window && !reduce.matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      nodes.forEach(function (n) { io.observe(n); });
    } else {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
    }
  }

  window.WLA.gallery = { setFilter: setFilter, layout: scheduleLayout, visible: visibleArtworks };
  document.addEventListener("DOMContentLoaded", init);
})();
