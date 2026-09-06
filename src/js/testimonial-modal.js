// Opens a testimonial card in a dialog so the full quote is readable - the
// cards clamp it to four lines and every one of the six is cut off.
//
// Content is read out of the clicked card rather than duplicated into the
// dialog markup or a second data blob, so there is only ever one copy of the
// copy. The clamp is a CSS effect, so the full text is already in the DOM.
(function () {
  const modal = document.getElementById("testimonial-modal");
  const cards = document.querySelectorAll(".carousel-card");
  if (!modal || !cards.length || !window.cirenModal) return;

  const out = {
    img: document.getElementById("testimonial-modal-img"),
    badge: document.getElementById("testimonial-modal-badge"),
    quote: document.getElementById("testimonial-modal-quote"),
    initials: document.getElementById("testimonial-modal-initials"),
    name: document.getElementById("testimonial-modal-name"),
    uni: document.getElementById("testimonial-modal-uni"),
  };

  const dialog = window.cirenModal(modal);

  function fill(card) {
    const img = card.querySelector("img");
    const badge = card.querySelector("span");
    const quote = card.querySelector("p.line-clamp-4");
    const name = card.querySelector("h4");
    const initials = card.querySelector(".border-t div");

    if (img) {
      out.img.src = img.getAttribute("src");
      out.img.alt = img.getAttribute("alt") || "";
    }
    if (badge) out.badge.textContent = badge.textContent.trim();
    if (quote) out.quote.textContent = quote.textContent.trim();
    if (initials) out.initials.textContent = initials.textContent.trim();
    if (name) {
      out.name.textContent = name.textContent.trim();
      const uni = name.nextElementSibling;
      out.uni.textContent = uni ? uni.textContent.trim() : "";
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      fill(card);
      dialog.open(card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fill(card);
        dialog.open(card);
      }
    });
  });
})();
