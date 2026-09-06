// Membership application dialog, opened by the header's Apply button.
//
// On submit: if the form has an `action`, it posts there. If it does not - the
// current state, since no backend is configured - it says so plainly instead of
// showing a fake confirmation. An application that silently goes nowhere is
// worse than one that admits it, because the applicant thinks they have applied.
(function () {
  const modal = document.getElementById("apply-modal");
  const form = document.getElementById("apply-form");
  const status = document.getElementById("apply-form-status");
  const triggers = document.querySelectorAll("[data-open-apply]");
  if (!modal || !form || !triggers.length || !window.cirenModal) return;

  // Conditional fields (see showWhen in applyForm.json): shown only when their
  // controlling field holds a matching value.
  //
  // Hiding alone is not enough. A hidden field that is still `required` makes
  // the browser refuse to submit and try to focus something invisible - the
  // form just dies with no message. Disabling it takes it out of validation
  // AND out of the submitted data, while keeping anything already typed in
  // case the visitor switches back.
  const conditionals = [...form.querySelectorAll("[data-show-when-field]")];

  function syncConditionals() {
    for (const wrap of conditionals) {
      const control = form.elements[wrap.dataset.showWhenField];
      const wanted = (wrap.dataset.showWhenValues || "").split("|");
      const show = !!control && wanted.indexOf(control.value) !== -1;

      wrap.classList.toggle("hidden", !show);
      wrap.querySelectorAll("input,select,textarea").forEach((el) => {
        el.disabled = !show;
      });
    }
  }

  form.addEventListener("change", syncConditionals);
  syncConditionals();

  const dialog = window.cirenModal(modal, {
    onOpen: () => {
      status.className = "hidden text-sm px-4 py-3";
      status.textContent = "";
      syncConditionals();
    },
  });

  triggers.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      dialog.open(t);
    });
  });

  function say(message, tone) {
    const tones = {
      warn: "bg-amber-50 text-amber-900 border border-amber-300",
      ok: "bg-[#E8F8E5] text-[#046e00] border border-[#40b830]",
      error: "bg-red-50 text-red-800 border border-red-300",
    };
    status.className = "text-sm px-4 py-3 rounded-none " + tones[tone];
    status.textContent = message;
  }

  form.addEventListener("submit", async (e) => {
    // NB: form.action (the IDL property) resolves to the document URL when the
    // attribute is absent, so it is never falsy. Read the attribute instead.
    const endpoint = form.getAttribute("action");

    // Native validation handles required/email; this only runs once it passes.
    //
    // DEMO MODE. With no endpoint configured this confirms success without
    // sending anything anywhere. That is deliberate for a pre-production
    // preview and MUST NOT SHIP: a real applicant would be told their
    // application was received when nothing was transmitted. Set `action` in
    // src/_data/applyForm.json to a real endpoint before launch.
    if (!endpoint) {
      e.preventDefault();
      form.reset();
      syncConditionals();
      say("Thank you. Your application has been received.", "ok");
      return;
    }

    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say("Sending your application…", "ok");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say("Thank you. Your application has been received.", "ok");
    } catch (err) {
      say(
        "Something went wrong sending your application. Please try again, or " +
          "email us if the problem persists.",
        "error",
      );
    } finally {
      button.disabled = false;
    }
  });
})();
