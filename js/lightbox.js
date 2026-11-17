/* =====================================================================
   WAMBUI LUTHER ART — full-screen artwork lightbox
   Usage: WLA.lightbox.open(listOfArtworks, startIndex, triggerElement)
   ===================================================================== */
(function () {
  "use strict";
  window.WLA = window.WLA || {};

  var root, img, els = {}, items = [], index = 0, lastFocus = null, touchX = null;

  function catLabel(id) {
    var c = (window.WLA_CONFIG.categories || []).find(function (x) { return x.id === id; });
    return c ? c.label : id;
  }

  function render(direction) {
    var a = items[index];
    if (!a) return;
    img.classList.remove("is-swapping");
    void img.offsetWidth; // restart the "smudge-in" animation
    img.src = a.image;
    img.alt = a.alt || (a.title + " — " + a.medium + (a.year ? ", " + a.year : "") + ((a.placeholder != null ? a.placeholder : window.WLA_CONFIG.artworksArePlaceholder) ? " (example placeholder image)" : ""));
    if (direction) img.classList.add("is-swapping");
    els.title.textContent = a.title;
    els.cat.textContent = (Array.isArray(a.category) ? a.category : [a.category]).map(catLabel).join(" · ");
    els.medium.textContent = a.medium;
    els.year.textContent = a.year || "—";
    els.size.textContent = a.dimensions || "—";
    els.hours.textContent = a.hours ? a.hours + " hours" : "—";
    els.size.parentNode.hidden = !a.dimensions;
    els.hours.parentNode.hidden = !a.hours;
    els.desc.textContent = a.description;
    els.note.textContent = a.note || "";
    els.count.textContent = "No. " + String(index + 1).padStart(2, "0") + " of " + String(items.length).padStart(2, "0");
    var single = items.length < 2;
    els.prev.hidden = single; els.next.hidden = single;
    // preload neighbours
    [index - 1, index + 1].forEach(function (i) {
      var n = items[(i + items.length) % items.length];
      if (n) { var p = new Image(); p.src = n.image; }
    });
  }

  function go(step) {
    if (items.length < 2) return;
    index = (index + step + items.length) % items.length;
    render(step);
  }

  function focusables() {
    return Array.prototype.filter.call(
      root.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])"),
      function (el) { return !el.hidden && el.offsetParent !== null; }
    );
  }

  function onKey(e) {
    if (root.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Tab") {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(list, start, trigger) {
    items = list || []; index = start || 0;
    lastFocus = trigger || document.activeElement;
    render(0);
    root.hidden = false;
    document.body.classList.add("lb-open");
    document.addEventListener("keydown", onKey);
    setTimeout(function () { root.querySelector(".lightbox__close").focus(); }, 30);
  }

  function close() {
    root.hidden = true;
    document.body.classList.remove("lb-open");
    document.removeEventListener("keydown", onKey);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  function init() {
    root = document.getElementById("lightbox");
    if (!root) return;
    img = document.getElementById("lb-img");
    ["title", "cat", "medium", "year", "size", "hours", "desc", "note", "count", "prev", "next"].forEach(function (k) {
      els[k] = document.getElementById("lb-" + k);
    });
    els.prev.addEventListener("click", function () { go(-1); });
    els.next.addEventListener("click", function () { go(1); });

    root.addEventListener("click", function (e) {
      var c = e.target.closest("[data-lb-close]");
      if (!c) return;
      if (c.hasAttribute("data-lb-commission")) {
        // pre-select a matching service in the enquiry form
        var a = items[index];
        var m = a && /\b(A[0-4])\b/.exec(a.dimensions || "");
        if (window.WLA.commissions) window.WLA.commissions.select(m ? m[1] : "A3", false);
        close();
        return; // the anchor's href handles scrolling
      }
      e.preventDefault();
      close();
    });

    // swipe on touch screens
    root.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }

  window.WLA.lightbox = { open: open, close: close, init: init };
  document.addEventListener("DOMContentLoaded", init);
})();
