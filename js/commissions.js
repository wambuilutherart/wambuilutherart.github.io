/* =====================================================================
   WAMBUI LUTHER ART — commissions, rate card & WhatsApp enquiry
   Prices come from WLA_CONFIG.sizes (the official rate card).
   No data is sent anywhere: the form builds a pre-filled WhatsApp
   message that the visitor sends themselves.
   ===================================================================== */
(function () {
  "use strict";
  window.WLA = window.WLA || {};

  var cfg, form, f = {}, refFile = null, refUrl = null, finishView = "drawing";
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var PEOPLE = [{ v: "1", label: "1 person" }, { v: "2", label: "2 people" }, { v: "3", label: "3 people" }, { v: "4+", label: "4 or more" }];
  var FINISH = [{ v: "drawing", label: "Drawing only" }, { v: "framed", label: "Framed" }];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(n) { return Number(n).toLocaleString("en-KE"); }
  function money(n) { return cfg.currency + " " + num(n); }
  function size(id) { return cfg.sizes.find(function (s) { return s.id === id; }); }
  function style(id) { return cfg.styles.find(function (s) { return s.id === id; }); }
  var circlePath = '<svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true"><path d="M64 4 C100 3 117 14 115 26 C112 40 82 47 56 46 C26 45 5 37 5 24 C6 11 32 3 70 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" pathLength="100"/></svg>';

  /* ---------- Find your size: nested sheets drawn to scale ---------- */
  function renderSizeGuide() {
    var svg = document.getElementById("size-scale"), list = document.getElementById("size-list");
    var pad = 4, maxH = cfg.sizes[cfg.sizes.length - 1].h; // A0 tallest
    var k = 120 / maxH;
    var shapes = cfg.sizes.slice().reverse().map(function (s) {
      var w = s.w * k, h = s.h * k, y = pad + (120 - h);
      return '<g class="sheet" data-size="' + s.id + '"><rect x="' + pad + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="0.6"/>' +
        '<text x="' + (pad + w - 2).toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="end">' + s.id + "</text></g>";
    }).join("");
    svg.innerHTML = shapes;
    list.innerHTML = cfg.sizes.map(function (s) {
      return '<li><button type="button" class="size-row" data-size="' + s.id + '">' +
        '<span class="size-row__id">' + s.id + '</span><span class="size-row__cm">' + esc(s.cm) + '</span>' +
        '<span class="size-row__desc">' + esc(s.desc) + "</span></button></li>";
    }).join("");

    function highlight(id) {
      svg.querySelectorAll(".sheet").forEach(function (g) { g.classList.toggle("is-on", g.dataset.size === id); });
      list.querySelectorAll(".size-row").forEach(function (b) { b.classList.toggle("is-on", b.dataset.size === id); });
    }
    list.addEventListener("pointerover", function (e) { var b = e.target.closest(".size-row"); if (b) highlight(b.dataset.size); });
    list.addEventListener("focusin", function (e) { var b = e.target.closest(".size-row"); if (b) highlight(b.dataset.size); });
    list.addEventListener("click", function (e) { var b = e.target.closest(".size-row"); if (b) select(b.dataset.size, true); });
    svg.addEventListener("pointerover", function (e) { var g = e.target.closest(".sheet"); if (g) highlight(g.dataset.size); });
    svg.addEventListener("click", function (e) { var g = e.target.closest(".sheet"); if (g) select(g.dataset.size, true); });
    highlight("A3");
  }

  /* ---------- Price cards ---------- */
  function renderPriceCards() {
    var wrap = document.getElementById("price-cards");
    wrap.innerHTML = cfg.sizes.map(function (s, i) {
      var rows = [0, 1, 2].map(function (n) {
        return '<li><span>' + (n + 1) + (n ? " people" : " person") + '</span><span class="price-val" data-d="' + s.drawing[n] + '" data-f="' + s.framed[n] + '">' + num(s[finishView][n]) + "</span></li>";
      }).join("");
      return '<article class="rate' + (s.popular ? " rate--popular" : "") + (s.id === "A0" ? " rate--grand" : "") + '" data-service="' + s.id + '" style="--stagger:' + (i % 3) * 0.1 + 's">' +
        '<span class="rate__tag" aria-hidden="true">' + esc(s.tag) + "</span>" +
        '<div class="rate__top"><h4 class="rate__name">' + s.id + '</h4><span class="rate__cm">' + esc(s.cm) + " cm</span></div>" +
        '<p class="rate__price"><small>From</small><strong><span>' + esc(cfg.currency) + '</span><em class="price-val" data-d="' + s.drawing[0] + '" data-f="' + s.framed[0] + '">' + num(s[finishView][0]) + "</em></strong>" + circlePath + "</p>" +
        '<ul class="rate__facts">' + rows + "</ul>" +
        '<p class="rate__frame">Frame adds ' + esc(money(s.frameAdds)) + "</p>" +
        '<a href="#enquire" class="btn btn--line" data-request="' + s.id + '">Request ' + s.id + " portrait</a></article>";
    }).join("");

    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-request]");
      if (b) select(b.dataset.request, false);
    });
    if (finePointer.matches && !reduce.matches) wrap.querySelectorAll(".rate").forEach(addTilt);

    document.querySelectorAll(".finish-toggle__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        finishView = b.dataset.finish;
        document.querySelectorAll(".finish-toggle__btn").forEach(function (x) {
          var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on ? "true" : "false");
        });
        wrap.querySelectorAll(".price-val").forEach(function (el) {
          countTo(el, +(finishView === "framed" ? el.dataset.f : el.dataset.d));
        });
      });
    });

    document.getElementById("custom-quote").textContent = cfg.customQuoteNote;
  }

  // numbers roll like a counter when switching drawing/framed
  function countTo(el, to) {
    var from = +String(el.textContent).replace(/\D/g, "") || 0;
    if (reduce.matches || from === to) { el.textContent = num(to); return; }
    var t0 = performance.now(), dur = 500;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = num(Math.round((from + (to - from) * e) / 50) * 50);
      if (p < 1) requestAnimationFrame(step); else el.textContent = num(to);
    })(t0);
  }

  function addTilt(card) {
    var raf = null;
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        card.style.transform = "perspective(900px) rotateX(" + (-y * 5).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg) translateY(-6px)";
      });
    });
    card.addEventListener("pointerleave", function () { if (raf) cancelAnimationFrame(raf); card.style.transform = ""; });
  }

  /* ---------- Styles, add-ons, inclusions ---------- */
  function renderStyles() {
    document.getElementById("styles").innerHTML = cfg.styles.map(function (s, i) {
      return '<article class="style-card style-card--' + s.id + ' reveal" style="--stagger:' + i * 0.1 + 's">' +
        '<span class="style-card__swatch" aria-hidden="true"></span>' +
        '<h4 class="style-card__name">' + esc(s.name) + "</h4>" +
        '<p class="style-card__desc">' + esc(s.desc) + "</p>" +
        '<span class="style-card__badge">' + esc(s.badge) + "</span></article>";
    }).join("");
    document.getElementById("addons").innerHTML = '<span class="hand">colour pencil add-on:</span> ' +
      cfg.sizes.map(function (s) { return "<span>" + s.id + " +" + num(s.colourAddOn) + "</span>"; }).join(" · ");
    document.getElementById("includes").innerHTML = cfg.includes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
  }

  /* ---------- Form pickers ---------- */
  function chips(id, name, items, checked) {
    document.getElementById(id).innerHTML = items.map(function (it) {
      return '<label class="chip"><input type="radio" name="' + name + '" value="' + esc(it.v) + '"' + (it.v === checked ? " checked" : "") + "><span>" + esc(it.label) + "</span></label>";
    }).join("");
  }
  function renderPickers() {
    document.getElementById("size-picker").innerHTML = cfg.sizes.map(function (s) {
      return '<label class="size-opt"><input type="radio" name="size" value="' + s.id + '"><span>' + s.id + "<small>" + esc(s.cm) + " cm</small></span></label>";
    }).join("");
    chips("people-picker", "people", PEOPLE, "1");
    chips("finish-picker", "finish", FINISH, "drawing");
    chips("style-picker", "style", cfg.styles.map(function (s) { return { v: s.id, label: s.name }; }), "plain");
  }
  function val(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ""; }
  function setVal(name, v) { var r = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (r) r.checked = true; }

  /* ---------- Estimate ---------- */
  function estimate() {
    var s = size(val("size")), people = val("people"), finish = val("finish"), st = val("style");
    if (!s) return null;
    if (people === "4+") return { custom: true, s: s };
    var n = (parseInt(people, 10) || 1) - 1;
    var base = s[finish === "framed" ? "framed" : "drawing"][n];
    var add = st === "colour" ? s.colourAddOn : 0;
    return { s: s, base: base, add: add, total: base + add };
  }

  // Public: pre-select a size (from cards, size guide or lightbox)
  function select(id, scroll) {
    if (!size(id)) return;
    setVal("size", id);
    document.querySelectorAll(".rate").forEach(function (c) { c.classList.toggle("is-selected", c.dataset.service === id); });
    clearError("size");
    update();
    if (scroll) document.getElementById("enquire").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
    setTimeout(function () { f.name.focus({ preventScroll: true }); }, 700);
  }

  /* ---------- Reference image ---------- */
  function setRef(file) {
    var zone = document.getElementById("dropzone");
    var empty = zone.querySelector(".dropzone__empty"), prev = zone.querySelector(".dropzone__preview");
    if (refUrl) { URL.revokeObjectURL(refUrl); refUrl = null; }
    if (file && !/^image\//.test(file.type)) { f.ref.value = ""; file = null; }
    refFile = file || null;
    if (refFile) {
      refUrl = URL.createObjectURL(refFile);
      document.getElementById("ref-preview").src = refUrl;
      document.getElementById("ref-name").textContent = refFile.name + " · " + Math.max(1, Math.round(refFile.size / 1024)) + " KB";
      empty.hidden = true; prev.hidden = false;
    } else { empty.hidden = false; prev.hidden = true; }
    update();
  }
  function initDropzone() {
    var zone = document.getElementById("dropzone");
    f.ref.addEventListener("change", function () { setRef(f.ref.files[0]); });
    document.getElementById("ref-remove").addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); f.ref.value = ""; setRef(null); });
    ["dragenter", "dragover"].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add("is-drag"); }); });
    ["dragleave", "drop"].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.remove("is-drag"); }); });
    zone.addEventListener("drop", function (e) { var file = e.dataTransfer && e.dataTransfer.files[0]; if (file) setRef(file); });
  }

  /* ---------- Validation ---------- */
  function showError(key, msg) {
    var err = document.getElementById("e-" + key); if (err) err.textContent = msg;
    var input = key === "size" ? form.querySelector(".field--sizes") : f[key];
    if (input) input.setAttribute("aria-invalid", "true");
  }
  function clearError(key) {
    var err = document.getElementById("e-" + key); if (err) err.textContent = "";
    var input = key === "size" ? form.querySelector(".field--sizes") : f[key];
    if (input) input.removeAttribute("aria-invalid");
  }
  function validate() {
    var errors = [], digits = f.phone.value.replace(/\D/g, "");
    if (f.name.value.trim().length < 2) errors.push(["name", "Please tell me your name."]);
    if (!f.phone.value.trim()) errors.push(["phone", "Please add your WhatsApp number."]);
    else if (digits.length < 9 || digits.length > 15 || /[^\d\s()+-]/.test(f.phone.value)) errors.push(["phone", "That number doesn't look quite right. Try e.g. 0712 345 678 or +254 712 345 678."]);
    if (!val("size")) errors.push(["size", "Please choose a size."]);
    ["name", "phone", "size"].forEach(clearError);
    errors.forEach(function (e) { showError(e[0], e[1]); });
    return errors;
  }

  /* ---------- Message ---------- */
  function buildMessage() {
    var est = estimate(), s = size(val("size")), st = style(val("style"));
    var people = val("people"), finish = val("finish");
    var lines = [
      "Hello " + cfg.brand.name + "! I'd like to enquire about commissioning a portrait.",
      "",
      "*Commission enquiry*",
      "• Name: " + (f.name.value.trim() || "—"),
      "• WhatsApp: " + (f.phone.value.trim() || "—"),
      "• Size: " + (s ? s.id + " (" + s.cm + " cm)" : "—"),
      "• People: " + (PEOPLE.find(function (p) { return p.v === people; }) || PEOPLE[0]).label,
      "• Finish: " + (finish === "framed" ? "Framed" : "Drawing only"),
      "• Style: " + (st ? st.name : "Plain"),
      "• Estimate: " + (!est ? "—" : est.custom ? "Custom quote please" : money(est.total) + (est.add ? " (incl. colour add-on " + money(est.add) + ")" : "")),
      "• Reference photo: " + (refFile ? "Yes, I'll attach it in this chat." : "Not yet")
    ];
    var notes = f.notes.value.trim();
    if (notes) lines.push("", "*Details*", notes);
    lines.push("", "Thank you!", "— Sent from the " + cfg.brand.name + " website");
    return lines.join("\n");
  }
  function waUrl(msg) { return "https://wa.me/" + String(cfg.contact.whatsappNumber).replace(/\D/g, "") + "?text=" + encodeURIComponent(msg); }

  function update() {
    document.getElementById("review-message").innerHTML = esc(buildMessage()).replace(/\*(.+?)\*/g, "<strong>$1</strong>");
    document.getElementById("review-attach").hidden = !refFile;
    var est = estimate(), box = document.getElementById("review-estimate");
    if (!est) box.innerHTML = '<span class="hand">estimate</span><strong>Pick a size</strong>';
    else if (est.custom) box.innerHTML = '<span class="hand">estimate</span><strong>Custom quote</strong><small>Four or more people: send your photo and I\'ll quote you.</small>';
    else box.innerHTML = '<span class="hand">estimate</span><strong>' + esc(money(est.total)) + "</strong><small>" +
      esc(est.s.id + " · " + (val("finish") === "framed" ? "framed" : "drawing only") + (est.add ? " · incl. colour add-on" : "") + " · delivery extra") + "</small>";
    document.querySelectorAll(".rate").forEach(function (c) { c.classList.toggle("is-selected", c.dataset.service === val("size")); });
  }

  function onSubmit(e) {
    e.preventDefault();
    var errors = validate();
    if (errors.length) {
      var key = errors[0][0];
      var target = key === "size" ? form.querySelector('input[name="size"]') : f[key];
      var field = target && target.closest(".field");
      if (field && !reduce.matches) { field.classList.remove("is-shake"); void field.offsetWidth; field.classList.add("is-shake"); }
      if (target) target.focus();
      return;
    }
    var url = waUrl(buildMessage());
    document.getElementById("wa-fallback").href = url;
    window.open(url, "_blank", "noopener");
    var done = document.getElementById("review-done");
    document.getElementById("done-attach").hidden = !refFile;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "nearest" });
  }

  function init() {
    cfg = window.WLA_CONFIG;
    form = document.getElementById("enquiry-form");
    if (!cfg || !form) return;
    ["name", "phone", "notes", "ref"].forEach(function (k) { f[k] = document.getElementById("f-" + k); });

    renderSizeGuide();
    renderPriceCards();
    renderStyles();
    renderPickers();
    initDropzone();
    if (cfg.contact.whatsappIsPlaceholder) document.getElementById("review-warn").hidden = false;

    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") clearError(e.target.id.replace("f-", ""));
      update();
    });
    form.addEventListener("change", function (e) { if (e.target.name === "size") clearError("size"); update(); });
    form.addEventListener("submit", onSubmit);
    update();
  }

  window.WLA.commissions = { select: select, buildMessage: function () { return buildMessage(); }, estimate: function () { return estimate(); } };
  document.addEventListener("DOMContentLoaded", init);
})();
