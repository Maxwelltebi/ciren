// Membership application dialog, opened by the header's Apply button.
// Conditional fields and submit handling come from form.js, shared with the
// support page.
(function () {
  const modal = document.getElementById("apply-modal");
  const form = document.getElementById("apply-form");
  const status = document.getElementById("apply-form-status");
  const triggers = document.querySelectorAll("[data-open-apply]");
  if (!modal || !form || !triggers.length || !window.cirenModal || !window.cirenForm)
    return;

  const controller = window.cirenForm(form, {
    statusEl: status,
    successMessage: "Thank you. Your application has been received.",
  });

  const dialog = window.cirenModal(modal, {
    onOpen: () => {
      controller.reset();
      controller.syncConditionals();
    },
  });

  triggers.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      dialog.open(t);
    });
  });
})();
