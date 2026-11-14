/* =====================================================================
   WAMBUI LUTHER ART — commissions, rate card & WhatsApp enquiry
   No data is sent anywhere: the form builds a pre-filled WhatsApp
   message that the visitor sends themselves.
   ===================================================================== */
(function () {
  "use strict";
  window.WLA = window.WLA || {};

  var cfg, form, f = {}, refFile = null, refUrl = null;
  var SIZE_INFO = { A5: "14.8×21cm", A4: "21×29.7cm", A3: "29.7×42cm", A2: "42×59.4cm", A1: "59.4×84cm" };
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return cfg.currency + " " + Number(n).toLocaleString("en-KE"); }
  function service(id) { return cfg.services.find(function (s) { return s.id === id; }); }

  /* ---------- Rate cards ---------- */
  function renderCards() {
    var wrap = document.getElementById("rate-cards");
    cfg.services.forEach(function (s, i) {
      var card = document.createElement("article");
      card.className = "rate";
      card.dataset.service = s.id;
      card.style.setProperty("--stagger", (i % 3) * 0.1 + "s");
      card.innerHTML =
        (s.note ? '<span class="rate__tag" aria-hidden="true">' + esc(s.note) + "</span>" : "") +
        '<span class="rate__num" aria-hidden="true">No. ' + String(i + 1).padStart(2, "0") + "</span>" +
        '<h3 class="rate__name">' + esc(s.name) + "</h3>" +
        '<p class="rate__desc">' + esc(s.description) + "</p>" +
        '<p class="rate__price"><small>Starting from' + (cfg.pricesArePlaceholder ? " · placeholder" : "") + "</small>" +
          "<strong><span>" + esc(cfg.currency) + "</span>" + Number(s.priceFrom).toLocaleString("en-KE") + "</strong>" +
          '<svg viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true"><path d="M64 4 C100 3 117 14 115 26 C112 40 82 47 56 46 C26 45 5 37 5 24 C6 11 32 3 70 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" pathLength="100"/></svg></p>' +
        '<ul class="rate__facts">' +
          "<li><span>Sizes</span><span>" + esc(s.sizes.join(" · ")) + "</span></li>" +
          "<li><span>Turnaround</span><span>" + esc(s.turnaround) + "</span></li>" +
        "</ul>" +
        '<a href="#enquire" class="btn btn--line" data-request="' + esc(s.id) + '">Request This Artwork</a>';
      wrap.appendChild(card);
      if (finePointer.matches && !reduce.matches) addTilt(card);
    });

    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-request]");
      if (!b) return;
      select(b.dataset.request, false);
    });

    document.getElementById("pricing-note").textContent = cfg.pricingNote;
    if (!cfg.pricesArePlaceholder) document.getElementById("price-flag").hidden = true;
  }

  // gentle 3D tilt that follows the pointer, like lifting a sheet of paper
  function addTilt(card) {
    var raf = null;
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        card.style.transform = "perspective(900px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 7).toFixed(2) + "deg) translateY(-6px)";
      });
    });
    card.addEventListener("pointerleave", function () {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  }

  /* ---------- Form setup ---------- */
  function fillSelects() {
    f.category.innerHTML = '<option value="">Choose an artwork type…</option>' +
      cfg.services.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(s.name) + " — from " + esc(money(s.priceFrom)) + "</option>"; }).join("");
    f.budget.innerHTML = '<option value="">Prefer not to say</option>' +
      cfg.budgetRanges.map(function (b) { return "<option>" + esc(b) + "</option>"; }).join("");
  }

  function renderSizes(keep) {
    var s = service(f.category.value);
    var sizes = s ? s.sizes : ["A4", "A3", "A2"];
    var picker = document.getElementById("size-picker");
    picker.innerHTML = sizes.map(function (z) {
      return '<label class="size-opt"><input type="radio" name="size" value="' + esc(z) + '"' + (z === keep ? " checked" : "") + ">" +
        "<span>" + esc(z) + (SIZE_INFO[z] ? "<small>" + SIZE_INFO[z] + "</small>" : "") + "</span></label>";
    }).join("");
  }

  function selectedSize() {
    var r = form.querySelector('input[name="size"]:checked');
    return r ? r.value : "";
  }

  // Public: pre-select a service (from rate cards or lightbox)
  function select(id, scroll) {
    if (!service(id)) return;
    f.category.value = id;
    renderSizes(selectedSize());
    var subj = { couple: 2, family: 3 }[id];
    if (subj && +f.subjects.value < subj) f.subjects.value = subj;
    document.querySelectorAll(".rate").forEach(function (c) { c.classList.toggle("is-selected", c.dataset.service === id); });
    clearError("category");
    update();
    if (scroll) document.getElementById("enquire").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
    setTimeout(function () { f.name.focus({ preventScroll: true }); }, scroll ? 700 : 600);
  }

  /* ---------- Reference image ---------- */
  function setRef(file) {
    var zone = document.getElementById("dropzone");
    var empty = zone.querySelector(".dropzone__empty"), prev = zone.querySelector(".dropzone__preview");
    if (refUrl) { URL.revokeObjectURL(refUrl); refUrl = null; }
    if (file && !/^image\//.test(file.type)) {
      showError("ref", "Please choose an image file (JPG, PNG, HEIC…).");
      f.ref.value = ""; file = null;
    }
    refFile = file || null;
    if (refFile) {
      refUrl = URL.createObjectURL(refFile);
      document.getElementById("ref-preview").src = refUrl;
      document.getElementById("ref-name").textContent = refFile.name + " · " + Math.max(1, Math.round(refFile.size / 1024)) + " KB";
      empty.hidden = true; prev.hidden = false;
    } else {
      empty.hidden = false; prev.hidden = true;
    }
    update();
  }

  function initDropzone() {
    var zone = document.getElementById("dropzone");
    f.ref.addEventListener("change", function () { setRef(f.ref.files[0]); });
    document.getElementById("ref-remove").addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      f.ref.value = ""; setRef(null);
    });
    ["dragenter", "dragover"].forEach(function (t) {
      zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add("is-drag"); });
    });
    ["dragleave", "drop"].forEach(function (t) {
      zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.remove("is-drag"); });
    });
    zone.addEventListener("drop", function (e) {
      var file = e.dataTransfer && e.dataTransfer.files[0];
      if (file) setRef(file);
    });
  }

  /* ---------- Validation ---------- */
  function showError(key, msg) {
    var err = document.getElementById("e-" + key);
    if (err) err.textContent = msg;
    var input = key === "size" ? form.querySelector(".field--sizes") : f[key];
    if (input) input.setAttribute("aria-invalid", "true");
  }
  function clearError(key) {
    var err = document.getElementById("e-" + key);
    if (err) err.textContent = "";
    var input = key === "size" ? form.querySelector(".field--sizes") : f[key];
    if (input) input.removeAttribute("aria-invalid");
  }

  function validate() {
    var errors = [];
    var name = f.name.value.trim();
    var digits = f.phone.value.replace(/[^\d]/g, "");
    if (name.length < 2) errors.push(["name", "Please tell me your name."]);
    if (!f.phone.value.trim()) errors.push(["phone", "Please add your WhatsApp number."]);
    else if (digits.length < 9 || digits.length > 15 || /[^\d\s()+-]/.test(f.phone.value)) errors.push(["phone", "That number doesn't look quite right — try e.g. +254 712 345 678."]);
    if (!f.category.value) errors.push(["category", "Which type of artwork are you interested in?"]);
    if (!selectedSize()) errors.push(["size", "Please choose a preferred size."]);

    ["name", "phone", "category", "size"].forEach(clearError);
    errors.forEach(function (e) { showError(e[0], e[1]); });
    return errors;
  }

  /* ---------- Message ---------- */
  function buildMessage() {
    var s = service(f.category.value);
    var lines = [
      "Hello " + cfg.brand.name + "! I'd like to enquire about commissioning an artwork.",
      "",
      "*Commission enquiry*",
      "• Name: " + (f.name.value.trim() || "—"),
      "• WhatsApp: " + (f.phone.value.trim() || "—"),
      "• Artwork: " + (s ? s.name + " (from " + money(s.priceFrom) + ")" : "—"),
      "• Size: " + (selectedSize() ? selectedSize() + (SIZE_INFO[selectedSize()] ? " (" + SIZE_INFO[selectedSize()] + ")" : "") : "—"),
      "• Number of subjects: " + (f.subjects.value || "1"),
      "• Budget: " + (f.budget.value || "Prefer not to say"),
      "• Reference photo: " + (refFile ? "Yes — I'll attach it in this chat." : "Not yet")
    ];
    var notes = f.notes.value.trim();
    if (notes) lines.push("", "*Additional instructions*", notes);
    lines.push("", "Thank you!", "— Sent from the " + cfg.brand.name + " website");
    return lines.join("\n");
  }

  function waUrl(msg) {
    return "https://wa.me/" + String(cfg.contact.whatsappNumber).replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
  }

  var pulseT;
  function update() {
    var box = document.getElementById("review-message");
    // render with *bold* like WhatsApp does
    box.innerHTML = esc(buildMessage()).replace(/\*(.+?)\*/g, "<strong>$1</strong>");
    document.getElementById("review-attach").hidden = !refFile;
    clearTimeout(pulseT);
    pulseT = setTimeout(function () { box.classList.remove("is-pulse"); }, 520);
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
    var w = window.open(url, "_blank", "noopener");
    var done = document.getElementById("review-done");
    document.getElementById("done-attach").hidden = !refFile;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "nearest" });
    return w;
  }

  function init() {
    cfg = window.WLA_CONFIG;
    form = document.getElementById("enquiry-form");
    if (!cfg || !form) return;
    ["name", "phone", "category", "subjects", "budget", "notes", "ref"].forEach(function (k) { f[k] = document.getElementById("f-" + k); });

    renderCards();
    fillSelects();
    renderSizes();
    initDropzone();
    if (cfg.contact.whatsappIsPlaceholder) document.getElementById("review-warn").hidden = false;

    f.category.addEventListener("change", function () {
      renderSizes(selectedSize());
      document.querySelectorAll(".rate").forEach(function (c) { c.classList.toggle("is-selected", c.dataset.service === f.category.value); });
      if (f.category.value) clearError("category");
    });
    form.querySelectorAll(".stepper__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = Math.min(12, Math.max(1, (parseInt(f.subjects.value, 10) || 1) + +b.dataset.step));
        f.subjects.value = v; update();
      });
    });
    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") clearError(e.target.id.replace("f-", ""));
      update();
    });
    form.addEventListener("change", function (e) {
      if (e.target.name === "size") clearError("size");
      update();
    });
    form.addEventListener("submit", onSubmit);
    update();
  }

  window.WLA.commissions = { select: select, buildMessage: function () { return buildMessage(); }, waUrl: function () { return waUrl(buildMessage()); } };
  document.addEventListener("DOMContentLoaded", init);
})();
