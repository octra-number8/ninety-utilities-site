// Progressive enhancement only — every page works without this file.

// Header becomes a solid ink bar on scroll (brand guidelines §6).
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var update = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Stamp form load time for the fast-submit spam check (optional server-side).
(function () {
  var ts = document.querySelector('input[name="form_ts"]');
  if (ts) ts.value = Date.now();
})();
