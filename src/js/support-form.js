// Support page form. Conditional branching and submit handling come from
// form.js, shared with the apply dialog.
(function () {
  const form = document.getElementById("support-form");
  const status = document.getElementById("support-form-status");
  if (!form || !window.cirenForm) return;

  window.cirenForm(form, {
    statusEl: status,
    successMessage:
      "Thank you. We have your details and will be in touch shortly.",
  });
})();
