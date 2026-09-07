// The mobile menu is a <details>, so it already opens and closes with no
// JavaScript at all - navigation still works if this file fails to load.
// This only adds what a bare <details> lacks: closing when you click away,
// press Escape, or pick something from it. Without the last one, tapping
// "Apply" would leave the menu hanging open behind the dialog.
(function () {
  const menu = document.querySelector("[data-mobile-menu]");
  if (!menu) return;

  const close = () => menu.removeAttribute("open");

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  document.addEventListener("click", (e) => {
    if (menu.hasAttribute("open") && !menu.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.hasAttribute("open")) close();
  });
})();
