// Shared form behaviour: conditional fields and submit handling.
//
// Two forms use this (the apply dialog and the support page). Duplicating the
// endpoint/demo logic across them is exactly the copy-paste this codebase
// exists to remove - and it is the kind of duplication that goes wrong
// quietly, since a form that silently stops sending looks fine on screen.
//
// Markup conventions:
//   [data-show-when-field]   wrapper shown only when that field matches
//   [data-show-when-values]  "|"-separated list of matching values
window.cirenForm = function (form, { statusEl, successMessage } = {}) {
  const SUCCESS =
    successMessage || "Thank you. We have received your details and will be in touch.";
  // Conditional wrappers. Hiding alone is not enough: a hidden field that is
  // still `required` makes the browser refuse to submit and try to focus
  // something invisible, so the form dies with no message the visitor can see.
  // Disabling removes it from validation AND from the submitted data, while
  // keeping anything already typed in case they switch back.
  //
  // Wrappers holding no inputs (a payment panel, say) simply show and hide.
  const conditionals = [...form.querySelectorAll("[data-show-when-field]")];

  function syncConditionals() {
    // Repeated until stable, because conditionals can chain: the payment
    // panels depend on a field that is itself conditional, and DOM order does
    // not guarantee the controlling field is resolved first.
    for (let pass = 0; pass < 5; pass++) {
      let changed = false;

      for (const wrap of conditionals) {
        const control = form.elements[wrap.dataset.showWhenField];
        const wanted = (wrap.dataset.showWhenValues || "").split("|");

        // A control that is itself switched off has no effective value - it
        // keeps whatever was last chosen, so testing `.value` alone would leave
        // dependants on screen after the branch above them was abandoned.
        const show =
          !!control && !control.disabled && wanted.indexOf(control.value) !== -1;

        if (show === wrap.classList.contains("hidden")) changed = true;
        wrap.classList.toggle("hidden", !show);
        wrap.querySelectorAll("input,select,textarea").forEach((el) => {
          el.disabled = !show;
        });
      }

      if (!changed) break;
    }
  }

  form.addEventListener("change", syncConditionals);
  syncConditionals();

  function say(message, tone) {
    if (!statusEl) return;
    const tones = {
      ok: "bg-[#E8F8E5] text-[#046e00] border border-[#40b830]",
      error: "bg-red-50 text-red-800 border border-red-300",
    };
    statusEl.className = "text-sm px-4 py-3 rounded-none " + tones[tone];
    statusEl.textContent = message;
  }

  function reset() {
    if (statusEl) {
      statusEl.className = "hidden text-sm px-4 py-3";
      statusEl.textContent = "";
    }
  }

  form.addEventListener("submit", async (e) => {
    // NB: form.action (the IDL property) resolves to the document URL when the
    // attribute is absent, so it is never falsy. Read the attribute instead.
    const endpoint = form.getAttribute("action");

    // Native validation handles required/email; this only runs once it passes.
    //
    // DEMO MODE. With no endpoint configured this confirms success without
    // sending anything anywhere. Deliberate for a pre-production preview, and
    // MUST NOT SHIP: the sender would be told their message was received when
    // nothing was transmitted.
    if (!endpoint) {
      e.preventDefault();
      form.reset();
      syncConditionals();
      say(SUCCESS, "ok");
      return;
    }

    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    say("Sending…", "ok");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      syncConditionals();
      say(SUCCESS, "ok");
    } catch (err) {
      say(
        "Something went wrong sending this. Please try again, or email us if " +
          "the problem persists.",
        "error",
      );
    } finally {
      if (button) button.disabled = false;
    }
  });

  return { syncConditionals, reset, say };
};
