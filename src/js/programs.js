// Programs page: flip cards and the case study dialog.
// No-ops on pages that contain neither, so it is safe to load site-wide.
(function () {
  // Cards are <button>s, so Enter and Space already fire click. Hover flipping
  // is CSS-only (pointer devices); this is what makes touch and keyboard work.
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-expanded", flipped ? "true" : "false");
    });
  });

  const modal = document.getElementById("case-study-modal");
  const triggers = document.querySelectorAll("[data-open-case-study]");
  if (!modal || !triggers.length || !window.cirenModal) return;

  const dialog = window.cirenModal(modal);
  triggers.forEach((t) => {
    t.addEventListener("click", () => dialog.open(t));
  });
})();
