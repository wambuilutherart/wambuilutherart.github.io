/* =====================================================================
   WAMBUI LUTHER ART — main interactions
   Config bindings · loader · navigation · reveals · SVG drawing ·
   process timeline · parallax · pencil cursor · hero sketch trail ·
   doodle pad · back-to-top · scroll progress
   ===================================================================== */
(function () {
  "use strict";

  var cfg = window.WLA_CONFIG;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var desktop = window.matchMedia("(min-width: 921px)");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, cfg); }

  /* ---------- 1. Bind config values into the page ---------- */
  function bindConfig() {
    $$("[data-bind]").forEach(function (el) { var v = get(el.dataset.bind); if (v != null) el.textContent = v; });
    $$("[data-bind-src]").forEach(function (el) { var v = get(el.dataset.bindSrc); if (v) el.src = v; });

    var greet = "Hello " + cfg.brand.name + "! I'd like to enquire about commissioning an artwork.";
    var links = {
      whatsapp: "https://wa.me/" + String(cfg.contact.whatsappNumber).replace(/\D/g, "") + "?text=" + encodeURIComponent(greet),
      instagram: cfg.contact.instagramUrl,
      email: "mailto:" + cfg.contact.email + "?subject=" + encodeURIComponent("Commission enquiry — " + cfg.brand.name)
    };
    $$("[data-link]").forEach(function (el) { if (links[el.dataset.link]) el.href = links[el.dataset.link]; });

    $("#year").textContent = new Date().getFullYear();
    if (cfg.contact.location) $("#footer-location").textContent = " · " + cfg.contact.location;
  }

  /* ---------- 2. Render About, Process, Testimonials from config ---------- */
  function renderContent() {
    var a = cfg.about;
    $("#about-bio").innerHTML = a.biography.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var list = function (id, arr) { $(id).innerHTML = arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    list("#about-enjoys", a.enjoys);
    list("#about-materials", a.materials);
    list("#about-interests", a.interests);
    $("#about-philosophy").textContent = a.philosophy;
    $("#about-inspiration").textContent = a.inspiration;
    var ap = $("#about-portrait"); ap.src = a.portrait; ap.alt = a.portraitAlt;

    $("#timeline-list").innerHTML = cfg.process.map(function (s, i) {
      return '<li class="stage" style="--stagger:' + (i * 0.12) + 's">' +
        '<span class="stage__num" aria-hidden="true">' + (i + 1) + '<svg viewBox="0 0 120 110"><path d="M66 9 C98 8 117 32 112 60 C107 90 76 106 48 101 C19 96 3 70 9 44 C15 18 42 3 74 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>' +
        '<div class="stage__card">' +
          '<img src="' + esc(s.image) + '" alt="Placeholder image for process stage ' + (i + 1) + ': ' + esc(s.title) + '" width="800" height="600" loading="lazy" decoding="async">' +
          '<h3 class="stage__title"><span class="sr-only">Stage ' + (i + 1) + ': </span>' + esc(s.title) + "</h3>" +
          '<p class="stage__text">' + esc(s.text) + "</p>" +
          '<p class="stage__note" aria-hidden="true">' + esc(s.note) + "</p>" +
        "</div></li>";
    }).join("");

    $("#quotes").innerHTML = cfg.testimonials.map(function (t, i) {
      return '<figure class="quote" style="--stagger:' + (i * 0.12) + 's">' +
        '<span class="quote__flag">Placeholder</span>' +
        '<svg class="quote__mark" aria-hidden="true"><use href="#i-quote"/></svg>' +
        "<blockquote><p>" + esc(t.quote) + "</p></blockquote>" +
        "<footer><cite>" + esc(t.name) + "</cite><span>" + esc(t.detail) + "</span></footer></figure>";
    }).join("");
  }

  /* ---------- 3. Measure SVG paths so they can "draw" themselves ---------- */
  function prepareDrawPaths() {
    $$(".draw").forEach(function (p) {
      if (typeof p.getTotalLength !== "function") return;
      var len = p.getTotalLength();
      // paths with non-scaling strokes are dashed in screen space: scale up
      if (getComputedStyle(p).vectorEffect === "non-scaling-stroke" && p.getScreenCTM()) {
        var m = p.getScreenCTM();
        len *= Math.max(Math.hypot(m.a, m.b), Math.hypot(m.c, m.d), 1);
      }
      len = Math.ceil(len + 4);
      p.style.setProperty("--len", len);
    });
  }

  /* ---------- 4. Loader ---------- */
  function initLoader() {
    var loader = $("#loader");
    var start = performance.now();
    var done = false;
    function finish() {
      if (done) return; done = true;
      var wait = reduce ? 0 : Math.max(0, 1100 - (performance.now() - start));
      setTimeout(function () {
        prepareDrawPaths();
        loader.classList.add("is-done");
        document.body.classList.add("is-loaded");
        setTimeout(function () { loader.remove(); }, 900);
      }, wait);
    }
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    setTimeout(finish, 2600); // never hold the page hostage
  }

  /* ---------- 5. Navigation ---------- */
  function initNav() {
    var header = $(".site-header");
    var links = $$(".nav__link");
    var indicator = $(".nav__indicator");
    var ul = $("#nav-links");
    var toggle = $(".nav__toggle");
    var menu = $("#mobile-menu");
    var activeId = null;

    function moveIndicator(link) {
      if (!link || !indicator) { if (indicator) indicator.style.opacity = 0; return; }
      var lr = link.getBoundingClientRect(), ur = ul.getBoundingClientRect();
      indicator.style.width = (lr.width - 16) + "px";
      indicator.style.transform = "translateX(" + (lr.left - ur.left + 8) + "px)";
      indicator.style.opacity = 1;
      indicator.classList.remove("is-redraw"); void indicator.offsetWidth; indicator.classList.add("is-redraw");
    }

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      var match = null;
      links.forEach(function (l) {
        var on = l.getAttribute("href") === "#" + id;
        l.classList.toggle("is-active", on);
        if (on) { l.setAttribute("aria-current", "true"); match = l; } else l.removeAttribute("aria-current");
      });
      moveIndicator(match);
    }

    var sections = links.map(function (l) { return $(l.getAttribute("href")); }).filter(Boolean);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { io.observe(s); });
    }
    window.addEventListener("resize", function () { moveIndicator($(".nav__link.is-active")); });

    window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", window.scrollY > 20); }, { passive: true });

    // mobile "sketchbook index"
    function openMenu(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
      document.documentElement.classList.toggle("menu-open", open);
      if (open) { var first = $("a", menu); if (first) first.focus(); }
    }
    toggle.addEventListener("click", function () { openMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) openMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { openMenu(false); toggle.focus(); }
    });
    desktop.addEventListener("change", function (e) { if (e.matches) openMenu(false); });
  }

  /* ---------- 6. Scroll reveals ---------- */
  function initReveals() {
    var targets = $$(".reveal, .stage, .rate, .quote, .contact__pencil");
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- 7. Scroll-linked effects: progress, timeline, parallax, back-to-top ---------- */
  function initScrollFx() {
    var bar = $(".scroll-progress__line");
    var toTop = $("#to-top");
    var ring = $(".to-top__ring path");
    var timeline = $("#timeline");
    var tlPaths = $$(".timeline__path");
    var parallax = $$("[data-parallax]");
    var ticking = false;

    tlPaths.forEach(function (p) {
      var len = p.getTotalLength() * 1.6; // generous: non-scaling stroke in stretched SVG
      p.dataset.len = len;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduce ? 0 : len;
    });

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      var p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
      ring.style.strokeDashoffset = (360 * (1 - p)).toFixed(1);
      toTop.classList.toggle("is-visible", window.scrollY > vh * 0.8);

      if (!reduce && timeline) {
        var r = timeline.getBoundingClientRect();
        var prog = clamp((vh * 0.8 - r.top) / (r.height * 0.9), 0, 1);
        tlPaths.forEach(function (path) { path.style.strokeDashoffset = (path.dataset.len * (1 - prog)).toFixed(1); });
      }

      if (!reduce && desktop.matches) {
        parallax.forEach(function (el) {
          var rr = el.getBoundingClientRect();
          if (rr.bottom < -200 || rr.top > vh + 200) return;
          var offset = (rr.top + rr.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax);
          el.style.setProperty("--py", offset.toFixed(1) + "px");
        });
      } else {
        parallax.forEach(function (el) { el.style.removeProperty("--py"); });
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      $(".wordmark").focus({ preventScroll: true });
    });
  }

  /* ---------- 8. Desktop pencil cursor ---------- */
  function initCursor() {
    if (!finePointer || reduce) return;
    var cur = $(".pencil-cursor");
    var x = -100, y = -100, raf = null;
    document.documentElement.classList.add("has-pencil-cursor");
    function paint() { raf = null; cur.style.transform = "translate3d(" + x + "px," + y + "px,0)"; }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
      var t = e.target;
      cur.classList.toggle("is-text", !!t.closest("input:not([type=radio]):not([type=file]), textarea, select"));
      cur.classList.toggle("is-hover", !!t.closest("a, button, .art__button, .size-opt, .dropzone"));
    }, { passive: true });
    document.addEventListener("pointerdown", function () { cur.classList.add("is-down"); });
    document.addEventListener("pointerup", function () { cur.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { cur.style.opacity = 0; });
    document.addEventListener("mouseenter", function () { cur.style.opacity = ""; });
  }

  /* ---------- 9. Hero: faint graphite trail that follows the pointer ---------- */
  function initHeroSketch() {
    if (!finePointer || reduce) return;
    var hero = $(".hero"), canvas = $(".hero__sketch-canvas");
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var last = null, running = false, idle = 0;

    function size() {
      canvas.width = hero.clientWidth * dpr; canvas.height = hero.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
    }
    size();
    window.addEventListener("resize", size);

    function loop() {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.035)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      if (++idle < 180) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }

    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = hero.getBoundingClientRect();
      var p = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (last) {
        var d = Math.hypot(p.x - last.x, p.y - last.y);
        if (d > 1.5 && d < 120) {
          for (var k = 0; k < 2; k++) {
            ctx.strokeStyle = "rgba(41,39,37," + (k ? 0.12 : 0.28) + ")";
            ctx.lineWidth = k ? 0.6 : 1.1;
            ctx.beginPath();
            ctx.moveTo(last.x + (Math.random() - 0.5) * 1.6, last.y + (Math.random() - 0.5) * 1.6);
            ctx.lineTo(p.x + (Math.random() - 0.5) * 1.6, p.y + (Math.random() - 0.5) * 1.6);
            ctx.stroke();
          }
        }
      }
      last = p; idle = 0;
      if (!running) { running = true; requestAnimationFrame(loop); }
    });
    hero.addEventListener("pointerleave", function () { last = null; });
  }

  /* ---------- 10. Doodle pad ---------- */
  function initDoodle() {
    var canvas = $("#doodle-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var tool = "pencil", drawing = false, last = null, hasDrawn = false;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function hint() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.save();
      ctx.fillStyle = "rgba(119,115,109,.55)";
      ctx.font = "500 " + Math.round(w / 14) + "px Caveat, cursive";
      ctx.textAlign = "center";
      ctx.fillText("draw something here ✎", w / 2, h / 2);
      ctx.restore();
    }
    function size() {
      var snapshot = hasDrawn ? canvas.toDataURL() : null;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (snapshot) {
        var im = new Image();
        im.onload = function () { ctx.drawImage(im, 0, 0, canvas.clientWidth, canvas.clientHeight); };
        im.src = snapshot;
      } else hint();
    }
    var resizeT;
    window.addEventListener("resize", function () { clearTimeout(resizeT); resizeT = setTimeout(size, 150); });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(size);

    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, p: e.pressure || 0.5 }; }

    function stroke(a, b) {
      var pr = (b.p > 0 && b.p !== 0.5) ? b.p : 0.5;
      ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      if (tool === "eraser") {
        ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = 22;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      } else if (tool === "pencil") {
        // a few slightly offset thin lines = graphite texture
        for (var i = 0; i < 3; i++) {
          ctx.strokeStyle = "rgba(41,39,37," + (0.25 + pr * 0.4) + ")";
          ctx.lineWidth = 0.6 + pr * 1.4;
          var j = function () { return (Math.random() - 0.5) * 1.2; };
          ctx.beginPath(); ctx.moveTo(a.x + j(), a.y + j()); ctx.lineTo(b.x + j(), b.y + j()); ctx.stroke();
        }
      } else {
        // charcoal: soft wide stroke + grainy speckles
        ctx.strokeStyle = "rgba(25,23,21,0.16)"; ctx.lineWidth = 9 + pr * 8;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.fillStyle = "rgba(20,18,16,0.35)";
        var d = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        for (var k = 0; k < d * 1.5; k++) {
          var t = Math.random();
          ctx.fillRect(a.x + (b.x - a.x) * t + (Math.random() - 0.5) * 14, a.y + (b.y - a.y) * t + (Math.random() - 0.5) * 14, 1.2, 1.2);
        }
      }
    }

    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      if (!hasDrawn) { ctx.clearRect(0, 0, canvas.width, canvas.height); hasDrawn = true; }
      drawing = true; last = pos(e);
      canvas.setPointerCapture(e.pointerId);
      stroke(last, { x: last.x + 0.1, y: last.y + 0.1, p: last.p });
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      var events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      events.forEach(function (ev) { var p = pos(ev); stroke(last, p); last = p; });
    });
    ["pointerup", "pointercancel"].forEach(function (t) { canvas.addEventListener(t, function () { drawing = false; last = null; }); });

    $$(".doodle__tools [data-tool]").forEach(function (b) {
      b.addEventListener("click", function () {
        tool = b.dataset.tool;
        $$(".doodle__tools [data-tool]").forEach(function (x) {
          var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on ? "true" : "false");
        });
      });
    });
    $("#doodle-clear").addEventListener("click", function () {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasDrawn = false; hint();
    });
    $("#doodle-save").addEventListener("click", function () {
      var out = document.createElement("canvas");
      out.width = canvas.width; out.height = canvas.height;
      var o = out.getContext("2d");
      o.fillStyle = "#F5F2EA"; o.fillRect(0, 0, out.width, out.height);
      o.drawImage(canvas, 0, 0);
      o.font = (16 * dpr) + "px Caveat, cursive"; o.fillStyle = "#A58D72";
      o.fillText("doodled at " + cfg.brand.name, 14 * dpr, out.height - 14 * dpr);
      var a = document.createElement("a");
      a.download = "my-doodle.png"; a.href = out.toDataURL("image/png"); a.click();
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (!cfg) { console.error("WLA_CONFIG missing — check js/config.js"); return; }
    bindConfig();
    renderContent();
    initLoader();
    initNav();
    initReveals();
    initScrollFx();
    initCursor();
    initHeroSketch();
    initDoodle();
  });
})();
