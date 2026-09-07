// Behaviour test: loads the real built page into a real DOM, runs the real
// shipped scripts, and drives them the way a visitor would.
//
// Checks 1-4 in verify.mjs are all static. They cannot tell you that clicking
// a card opens the dialog, or that the arrows are wired up - a file can parse
// perfectly and still do nothing.
import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";

const dom = new JSDOM(readFileSync("dist/index.html", "utf8"), {
  url: "http://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
});
const { window } = dom;
const doc = window.document;

// jsdom fetches no external resources, so the page's own <script src> tags are
// inert. Inject the real shipped files as inline scripts so they execute in the
// window's own global scope.
//
// jsdom implements no layout, so measurements come back 0 and the scroll maths
// is a no-op. That is fine: this tests wiring, not pixel positions.
for (const f of [
  "dist/js/header-menu.js",
  "dist/js/modal.js",
  "dist/js/form.js",
  "dist/js/carousel.js",
  "dist/js/testimonial-modal.js",
  "dist/js/apply-modal.js",
]) {
  const el = doc.createElement("script");
  el.textContent = readFileSync(f, "utf8");
  doc.body.appendChild(el);
}

let ok = true;
const check = (cond, label, detail = "") => {
  if (!cond) ok = false;
  console.log(`${cond ? "PASS " : "FAIL "} ${label}${detail ? "  " + detail : ""}`);
};

const cards = doc.querySelectorAll(".carousel-card");
const modal = doc.getElementById("testimonial-modal");
const closeBtn = doc.getElementById("testimonial-modal-close");

console.log("=== 6. testimonial dialog behaviour (real DOM) ===");
check(cards.length === 6, `6 cards found`, `(${cards.length})`);
check(!!modal, "dialog markup present in the page");
check(modal.classList.contains("hidden"), "dialog starts hidden");

// --- click a card -----------------------------------------------------------
const card = cards[3]; // Faith Wanjiku
const fire = (el, type, init = {}) =>
  el.dispatchEvent(new window.MouseEvent(type, { bubbles: true, ...init }));

fire(card, "click");
check(!modal.classList.contains("hidden"), "clicking a card opens the dialog");
check(modal.classList.contains("flex"), "dialog becomes a flex container");

const nameOut = doc.getElementById("testimonial-modal-name").textContent;
const quoteOut = doc.getElementById("testimonial-modal-quote").textContent;
const uniOut = doc.getElementById("testimonial-modal-uni").textContent;
const cardQuote = card.querySelector("p.line-clamp-4").textContent.trim();

check(nameOut === "Faith Wanjiku", "name copied from the clicked card", `"${nameOut}"`);
check(uniOut === "University of Nairobi", "university copied", `"${uniOut}"`);
check(
  quoteOut === cardQuote && quoteOut.length > 100,
  "full quote copied, untruncated",
  `${quoteOut.length} chars`,
);
check(
  doc.getElementById("testimonial-modal-img").getAttribute("src") ===
    card.querySelector("img").getAttribute("src"),
  "photo matches the clicked card",
);
check(doc.body.style.overflow === "hidden", "page scroll locked while open");
check(doc.activeElement === closeBtn, "focus moved into the dialog");

// --- close via Escape -------------------------------------------------------
doc.dispatchEvent(
  new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
);
check(modal.classList.contains("hidden"), "Escape closes the dialog");
check(doc.body.style.overflow !== "hidden", "page scroll restored");
check(doc.activeElement === card, "focus returned to the card that opened it");

// --- keyboard opening -------------------------------------------------------
card.dispatchEvent(
  new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
);
check(!modal.classList.contains("hidden"), "Enter on a card opens the dialog");

// --- close via backdrop -----------------------------------------------------
fire(modal.querySelector("[data-modal-backdrop]"), "click");
check(modal.classList.contains("hidden"), "clicking the backdrop closes it");

// --- every card opens with its own content ----------------------------------
let allDistinct = true;
const seen = new Set();
for (const c of cards) {
  fire(c, "click");
  seen.add(doc.getElementById("testimonial-modal-name").textContent);
  fire(closeBtn, "click");
}
allDistinct = seen.size === 6;
check(allDistinct, "all 6 cards open with distinct content", [...seen].join(", "));

// --- the carousel is still wired --------------------------------------------
console.log("\n=== 7. carousel still wired ===");
const deck = doc.getElementById("carousel-deck");
let scrolled = false;
deck.scrollBy = () => (scrolled = true);
fire(doc.getElementById("carousel-next"), "click");
check(scrolled, "next arrow calls scrollBy on the deck");
scrolled = false;
fire(doc.getElementById("carousel-prev"), "click");
check(scrolled, "prev arrow calls scrollBy on the deck");

// --- apply dialog -----------------------------------------------------------
console.log("\n=== 8. apply dialog behaviour ===");
const applyModal = doc.getElementById("apply-modal");
const applyBtn = doc.querySelector("[data-open-apply]");
const applyForm = doc.getElementById("apply-form");
const applyStatus = doc.getElementById("apply-form-status");
const fieldSpec = JSON.parse(readFileSync("src/_data/applyForm.json", "utf8"));

check(!!applyBtn, "header Apply button is a dialog trigger");
check(applyModal.classList.contains("hidden"), "apply dialog starts hidden");

fire(applyBtn, "click");
check(!applyModal.classList.contains("hidden"), "Apply opens the dialog");
check(doc.body.style.overflow === "hidden", "page scroll locked while open");

const rendered = applyForm.querySelectorAll("input,select,textarea");
check(
  rendered.length === fieldSpec.fields.length,
  "every field in applyForm.json is rendered",
  `${rendered.length}/${fieldSpec.fields.length}`,
);
for (const f of fieldSpec.fields) {
  const el = doc.getElementById("apply-" + f.name);
  const label = applyForm.querySelector(`label[for="apply-${f.name}"]`);
  check(!!el && !!label, `field "${f.name}" rendered with a matching label`);
  if (el && f.required) check(el.hasAttribute("required"), `field "${f.name}" is required`);
}
const role = doc.getElementById("apply-role");
check(
  role && role.tagName === "SELECT" &&
    role.querySelectorAll("option").length === fieldSpec.fields.find(f => f.name === "role").options.length + 1,
  "select renders its options plus a placeholder",
);

// Submitting with no endpoint configured must NOT claim success.
applyForm.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
const msg = applyStatus.textContent.toLowerCase();
check(!applyStatus.classList.contains("hidden"), "submitting shows a status message");
check(
  Boolean(fieldSpec.demoMode) === !fieldSpec.action,
  "demoMode flag agrees with whether an endpoint is configured",
);
if (fieldSpec.action) {
  check(!msg.includes("thank you") || msg.includes("received"), "configured submit reports a real outcome");
} else {
  // DEMO: no endpoint, so this confirms receipt without sending anything.
  check(msg.includes("thank you"), "demo submit confirms receipt", `"${applyStatus.textContent.trim().slice(0, 50)}…"`);
}

doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
check(applyModal.classList.contains("hidden"), "Escape closes the apply dialog");
check(doc.activeElement === applyBtn, "focus returns to the Apply button");

// --- conditional branching ---------------------------------------------------
console.log("");
console.log("=== 9. conditional fields (host a club vs join CIReN) ===");
fire(applyBtn, "click");

const typeSel = doc.getElementById("apply-application_type");
const motivation = doc.getElementById("apply-motivation");
const journey = doc.getElementById("apply-tech_journey");
const wrapOf = (el) => el.closest("[data-show-when-field]");
const choose = (v) => {
  typeSel.value = v;
  typeSel.dispatchEvent(new window.Event("change", { bubbles: true }));
};
const submittedKeys = () => [...new window.FormData(applyForm).keys()];

check(!!typeSel, "application type dropdown exists");
check(typeSel.querySelectorAll("option").length === 3, "two choices plus a placeholder");
check(!!motivation && !!journey, "both extra questions exist in the markup");

check(wrapOf(motivation).classList.contains("hidden"), "extra questions hidden before a choice is made");
check(motivation.disabled && journey.disabled, "extra questions disabled before a choice is made");

choose("Host a campus club");
check(wrapOf(motivation).classList.contains("hidden"), "'Host a campus club' keeps the form simple");
check(motivation.disabled && journey.disabled, "extra questions stay disabled for club hosts");
const clubKeys = submittedKeys();
check(
  clubKeys.indexOf("motivation") === -1 && clubKeys.indexOf("tech_journey") === -1,
  "club application does not submit the extra questions",
  `${clubKeys.length} fields`,
);

choose("Join CIReN");
check(!wrapOf(motivation).classList.contains("hidden"), "'Join CIReN' reveals the extra questions");
check(!motivation.disabled && !journey.disabled, "extra questions become active");
check(
  motivation.hasAttribute("required") && journey.hasAttribute("required"),
  "extra questions are required once shown",
);
const joinKeys = submittedKeys();
check(
  joinKeys.indexOf("motivation") !== -1 && joinKeys.indexOf("tech_journey") !== -1,
  "join application submits the extra questions",
  `${joinKeys.length} fields`,
);

choose("Host a campus club");
check(
  motivation.disabled && wrapOf(motivation).classList.contains("hidden"),
  "switching back hides and disables them again",
);

// --- programs page -----------------------------------------------------------
console.log("");
console.log("=== 10. programs page (real DOM) ===");
{
  const pdom = new JSDOM(readFileSync("dist/programs/index.html", "utf8"), {
    url: "http://localhost/programs/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
  });
  const pwin = pdom.window;
  const pdoc = pwin.document;
  for (const f of ["dist/js/header-menu.js",
  "dist/js/modal.js", "dist/js/programs.js"]) {
    const el = pdoc.createElement("script");
    el.textContent = readFileSync(f, "utf8");
    pdoc.body.appendChild(el);
  }
  const pfire = (el, type) =>
    el.dispatchEvent(new pwin.MouseEvent(type, { bubbles: true }));
  const data = JSON.parse(readFileSync("src/_data/programs.json", "utf8"));

  // shared chrome
  check(pdoc.querySelector("header") !== null, "page reuses the shared header");
  check(/All rights reserved/.test(pdoc.body.innerHTML), "page reuses the shared footer");
  check(
    pdoc.querySelector('[data-open-apply]') !== null,
    "Apply dialog trigger is present on this page too",
  );

  // cards
  const flips = pdoc.querySelectorAll(".flip-card");
  const expected = data.societies.length + data.events.length;
  check(flips.length === expected, "every society and event renders a card", `${flips.length}/${expected}`);
  const names = [...flips].map((c) => c.textContent.replace(/[^a-zA-Z& ]/g, " ").trim());
  check(
    data.societies.concat(data.events).every((c, i) => flips[i].textContent.includes(c.name)),
    "cards render in data order with their names",
  );
  check(
    data.societies.concat(data.events).every((c, i) => flips[i].textContent.includes(c.description)),
    "each card's full description is on its back face",
  );
  check([...flips].every((c) => c.tagName === "BUTTON"), "cards are buttons, so keyboard reaches them");

  const allCards = data.societies.concat(data.events);
  check(
    allCards.every((c, i) => {
      const img = flips[i].querySelector("img");
      return img && img.getAttribute("src") === c.image;
    }),
    "each card renders the image configured for it",
  );
  check(
    allCards.every((c) => existsSync("dist" + c.image)),
    "every card image exists in the build",
  );
  check(
    [...flips].every((c) => c.querySelector("img").getAttribute("alt") === ""),
    "card photos are alt='' (decorative; the card name carries the meaning)",
  );

  // flipping
  const card0 = flips[0];
  check(card0.getAttribute("aria-expanded") === "false", "card starts unflipped");
  pfire(card0, "click");
  check(card0.classList.contains("is-flipped"), "clicking flips the card");
  check(card0.getAttribute("aria-expanded") === "true", "flip state is announced");
  pfire(card0, "click");
  check(!card0.classList.contains("is-flipped"), "clicking again flips it back");
  check(card0.getAttribute("aria-expanded") === "false", "unflipped state is announced");

  // case study dialog
  const csModal = pdoc.getElementById("case-study-modal");
  const csBtn = pdoc.querySelector("[data-open-case-study]");
  check(!!csModal && !!csBtn, "case study dialog and its trigger exist");
  check(csBtn.textContent.includes(data.inspiration.caseStudyButton), "trigger uses the configured label");
  check(csModal.classList.contains("hidden"), "case study starts hidden");
  pfire(csBtn, "click");
  check(!csModal.classList.contains("hidden"), "'Tell Me' opens the case study");
  check(
    data.inspiration.caseStudy.body.every((para) => csModal.textContent.includes(para)),
    "every case study paragraph is rendered",
  );
  pdoc.dispatchEvent(new pwin.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  check(csModal.classList.contains("hidden"), "Escape closes the case study");
  check(pdoc.activeElement === csBtn, "focus returns to the Tell Me button");

  // research paper link
  const paperUrl = data.inspiration.paperUrl;
  const paperLink = [...pdoc.querySelectorAll("a")].find((a) =>
    a.textContent.includes(data.inspiration.paperButton),
  );
  if (paperUrl) {
    check(!!paperLink, "paper button is a real link when a URL is configured");
    check(paperLink.getAttribute("target") === "_blank", "paper opens in a new tab");
    check(
      /noopener/.test(paperLink.getAttribute("rel") || ""),
      "external paper link sets rel=noopener",
    );
  } else {
    check(!paperLink, "no dead link rendered while the paper URL is unset");
    check(
      /coming soon|has not been added/i.test(pdoc.body.textContent),
      "absent paper URL is stated rather than silently broken",
    );
  }
}

// --- papers page -------------------------------------------------------------
console.log("");
console.log("=== 11. papers page (real DOM) ===");
{
  const wdom = new JSDOM(readFileSync("dist/papers/index.html", "utf8"), {
    url: "http://localhost/papers/",
  });
  const wdoc = wdom.window.document;
  const data = JSON.parse(readFileSync("src/_data/papers.json", "utf8"));

  check(wdoc.querySelector("header") !== null, "page reuses the shared header");
  check(/All rights reserved/.test(wdoc.body.innerHTML), "page reuses the shared footer");
  check(
    wdoc.querySelector("h1").textContent.includes(data.heading),
    "page heading comes from the data",
  );
  check(wdoc.body.textContent.includes(data.intro), "intro paragraph is rendered");

  const rows = wdoc.querySelectorAll("#papers li");
  check(
    rows.length === data.papers.length,
    "one row per paper in the data",
    `${rows.length}/${data.papers.length}`,
  );
  check(
    data.papers.every((paper, i) => {
      const t = rows[i].textContent;
      return (
        t.includes(paper.title) &&
        t.includes(paper.authors) &&
        t.includes(String(paper.year))
      );
    }),
    "every row shows its title, authors and year",
  );
  check(
    data.papers.every((paper, i) => {
      const link = rows[i].querySelector("a");
      return paper.url ? !!link && link.getAttribute("href") === paper.url : !link;
    }),
    "titles link out only when a URL is set, never as a dead link",
  );
  check(
    data.papers.every((paper, i) => {
      const link = rows[i].querySelector("a");
      return !link || /noopener/.test(link.getAttribute("rel") || "");
    }),
    "any paper link sets rel=noopener",
  );
  if (data.papers.length === 0)
    check(
      /No papers listed yet/i.test(wdoc.body.textContent),
      "an empty list renders an explicit empty state",
    );
}

// --- support page ------------------------------------------------------------
console.log("");
console.log("=== 12. support page (real DOM) ===");
{
  const sdom = new JSDOM(readFileSync("dist/support/index.html", "utf8"), {
    url: "http://localhost/support/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
  });
  const swin = sdom.window;
  const sdoc = swin.document;
  for (const f of ["dist/js/header-menu.js",
  "dist/js/modal.js", "dist/js/form.js", "dist/js/support-form.js"]) {
    const el = sdoc.createElement("script");
    el.textContent = readFileSync(f, "utf8");
    sdoc.body.appendChild(el);
  }
  const cfg = JSON.parse(readFileSync("src/_data/supportForm.json", "utf8"));
  const sform = sdoc.getElementById("support-form");
  const sstatus = sdoc.getElementById("support-form-status");
  const pick = (id, v) => {
    const el = sdoc.getElementById(id);
    el.value = v;
    el.dispatchEvent(new swin.Event("change", { bubbles: true }));
  };
  const keys = () => [...new swin.FormData(sform).keys()];
  const panel = (v) =>
    sdoc.querySelector(`[data-show-when-field="payment_method"][data-show-when-values="${v}"]`);
  const shown = (el) => !el.classList.contains("hidden");

  check(sdoc.querySelector("header") !== null, "page reuses the shared header");
  check(/All rights reserved/.test(sdoc.body.innerHTML), "page reuses the shared footer");
  check(
    cfg.fields.every((f) => sdoc.getElementById("support-" + f.name)),
    "every field in supportForm.json is rendered",
  );

  // The notify address must not be scrapable from the page.
  check(
    !sdoc.body.innerHTML.includes(cfg.notifyEmail),
    "notify email is not exposed in the page HTML",
  );

  // Default state: neither branch is showing.
  check(
    !shown(sdoc.getElementById("support-payment_method").closest("[data-show-when-field]")),
    "payment choice hidden before a support type is picked",
  );
  check(
    sdoc.getElementById("support-support_description").disabled,
    "description disabled before a support type is picked",
  );
  check(!shown(panel("Paystack")) && !shown(panel("PayPal")), "no payment panel showing initially");

  // Financial branch.
  pick("support-support_type", "A financial contribution");
  check(
    !sdoc.getElementById("support-payment_method").disabled,
    "'A financial contribution' reveals the payment choice",
  );
  check(
    sdoc.getElementById("support-support_description").disabled,
    "description stays out of the financial branch",
  );
  pick("support-payment_method", "Paystack");
  check(shown(panel("Paystack")) && !shown(panel("PayPal")), "choosing Paystack shows only the Paystack link");
  pick("support-payment_method", "PayPal");
  check(shown(panel("PayPal")) && !shown(panel("Paystack")), "choosing PayPal shows only the PayPal link");
  const cashKeys = keys();
  check(
    cashKeys.indexOf("payment_method") !== -1 && cashKeys.indexOf("support_description") === -1,
    "financial submission carries the payment method, not the description",
    `${cashKeys.length} fields`,
  );

  // Other-support branch.
  pick("support-support_type", "Another kind of support");
  check(
    !sdoc.getElementById("support-support_description").disabled,
    "'Another kind of support' reveals the description",
  );
  check(
    sdoc.getElementById("support-payment_method").disabled,
    "payment choice is withdrawn on the other branch",
  );
  check(!shown(panel("Paystack")) && !shown(panel("PayPal")), "payment panels hide on the other branch");
  const otherKeys = keys();
  check(
    otherKeys.indexOf("support_description") !== -1 && otherKeys.indexOf("payment_method") === -1,
    "other-support submission carries the description, not a payment method",
    `${otherKeys.length} fields`,
  );

  // Payment links.
  for (const opt of cfg.payment.options) {
    const link = panel(opt.value).querySelector("a");
    check(link && link.getAttribute("href") === opt.url, `${opt.value} link points at its configured URL`);
    check(
      link && link.getAttribute("target") === "_blank" &&
        /noopener/.test(link.getAttribute("rel") || ""),
      `${opt.value} link opens safely in a new tab`,
    );
  }

  // Submit.
  check(
    Boolean(cfg.demoMode) === !cfg.action,
    "demoMode flag agrees with whether an endpoint is configured",
  );
  sform.dispatchEvent(new swin.Event("submit", { bubbles: true, cancelable: true }));
  check(!sstatus.classList.contains("hidden"), "submitting shows a status message");
  check(
    /thank you/i.test(sstatus.textContent),
    "submit confirms receipt",
    `"${sstatus.textContent.trim().slice(0, 45)}…"`,
  );
}

// --- mobile header -----------------------------------------------------------
console.log("");
console.log("=== 13. mobile header ===");
{
  const menu = doc.querySelector("[data-mobile-menu]");
  check(!!menu, "a mobile menu exists");
  check(menu.tagName === "DETAILS", "it is a <details>, so it works without JavaScript");
  check(!menu.hasAttribute("open"), "it starts closed");
  check(/md:hidden/.test(menu.className), "it is hidden from md upwards");

  // Desktop nav and the mobile menu must offer the same destinations.
  const deskNav = [...doc.querySelectorAll("header nav a")].map((a) => a.getAttribute("href"));
  const mobNav = [...menu.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  check(
    deskNav.every((h) => mobNav.indexOf(h) !== -1),
    "every desktop nav link is reachable from the mobile menu",
    deskNav.join(", "),
  );
  check(
    !!menu.querySelector("[data-open-apply]"),
    "Apply is reachable on mobile",
  );
  check(
    mobNav.indexOf("/support/") !== -1,
    "Support Us is reachable on mobile",
  );

  // The desktop CTA cluster must be out of the way on a phone, or it crowds
  // the logo off the screen - which is the bug this fixes.
  const cta = doc.querySelector("header .items-center.gap-3");
  check(
    cta && /hidden/.test(cta.className) && /md:flex/.test(cta.className),
    "desktop CTA cluster is hidden below md",
  );
  check(
    /min-w-0/.test(doc.querySelector('header a[href="/"]').className),
    "logo can shrink instead of pushing the menu button off screen",
  );

  // Enhancement: picking something closes the menu.
  menu.setAttribute("open", "");
  menu.querySelector("a").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  check(!menu.hasAttribute("open"), "choosing a link closes the menu");
  menu.setAttribute("open", "");
  doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  check(!menu.hasAttribute("open"), "Escape closes the menu");
}

process.exit(ok ? 0 : 1);
