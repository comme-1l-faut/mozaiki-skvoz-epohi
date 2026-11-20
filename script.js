// Меню и переключение разделов. Карта убрана — всё работает просто.

const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenu");

function openMenu() {
  sidebar.classList.add("open");
  scrim.classList.add("show");
  menuButton.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  sidebar.classList.remove("open");
  scrim.classList.remove("show");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", openMenu);
closeMenuButton.addEventListener("click", closeMenu);
scrim.addEventListener("click", closeMenu);

function showView(viewId) {
  const target = document.getElementById(viewId);
  if (!target) return;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  target.classList.add("active");
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    showView(button.dataset.view);
  });
});
