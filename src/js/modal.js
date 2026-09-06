// Shared dialog behaviour. Two dialogs now use this (testimonials, apply), and
// duplicating focus handling across them is exactly the kind of copy-paste this
// codebase exists to avoid.
//
// Conventions the markup must follow:
//   [data-modal-backdrop]      click target that closes
//   [data-modal-close]         any number of close controls
//   [data-modal-initial-focus] optional; where focus lands on open
window.cirenModal = function (modal, { onOpen, onClose } = {}) {
  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),' +
    'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  const backdrop = modal.querySelector("[data-modal-backdrop]");
  let opener = null;
  let savedOverflow = "";

  const isOpen = () => !modal.classList.contains("hidden");
  const focusable = () =>
    [...modal.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );

  function open(trigger) {
    opener = trigger || null;
    if (onOpen) onOpen(modal);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    // Stop the page scrolling behind the dialog.
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const first =
      modal.querySelector("[data-modal-initial-focus]") ||
      modal.querySelector("[data-modal-close]") ||
      focusable()[0];
    if (first) first.focus();
  }

  function close() {
    if (!isOpen()) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = savedOverflow;
    // Send focus back where it came from, or keyboard users lose their place.
    if (opener && typeof opener.focus === "function") opener.focus();
    opener = null;
    if (onClose) onClose(modal);
  }

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", close);
  });
  if (backdrop) backdrop.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });

  // Keep Tab inside the dialog and cycle at both ends.
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const items = focusable();
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  return { open, close, isOpen };
};
