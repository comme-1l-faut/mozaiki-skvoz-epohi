// Добавляй реальные мозаики в этот массив.
// Координаты можно получить из Google Maps: нажми на место правой кнопкой
// мыши (или удерживай палец на телефоне) и скопируй широту и долготу.
// Не оставляй выдуманные сведения: год и автора указывай только после проверки.
const mosaics = [
  // Пример структуры (раскомментируй и замени значения на проверенные):
  // {
  //   title: "Название или краткое описание мозаики",
  //   coords: [49.806, 73.085], // [широта, долгота]
  //   year: "1960-е / точный год, если подтверждён",
  //   author: "Имя автора или «не установлен»",
  //   subject: "Что изображено",
  //   image: "https://ссылка-на-фотографию.jpg",
  //   source: "Откуда получены сведения и фотография"
  // }
];

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
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  target.classList.add("active");
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (viewId === "map") {
    setTimeout(() => {
      if (window.mosaicMap) window.mosaicMap.invalidateSize();
    }, 180);
  }
}

document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

// Карта Караганды. Leaflet и OpenStreetMap используются бесплатно
// в рамках их условий использования. Для большого публичного проекта
// проверь правила использования тайлов OpenStreetMap.
const karagandaCenter = [49.806, 73.085];
const map = L.map("mapCanvas").setView(karagandaCenter, 13);
window.mosaicMap = map;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const heartIcon = L.divIcon({
  className: "heart-marker-wrap",
  html: '<div class="heart-marker" aria-label="Мозаика">♥</div>',
  iconSize: [30, 34],
  iconAnchor: [15, 28]
});

mosaics.forEach(mosaic => {
  if (!Array.isArray(mosaic.coords) || mosaic.coords.length !== 2) return;

  const imagePart = mosaic.image
    ? `<img src="${escapeHTML(mosaic.image)}" alt="${escapeHTML(mosaic.title)}">`
    : `<div class="no-image">ДОБАВЬ ФОТОГРАФИЮ<br>МОЗАИКИ</div>`;

  const popup = `
    <div class="mosaic-popup">
      <div class="popup-info">
        <div class="popup-kicker">КАРАГАНДА · МОЗАИЧНОЕ НАСЛЕДИЕ</div>
        <h3>${escapeHTML(mosaic.title || "Мозаика")}</h3>
        <table>
          <tr><td>Год</td><td>${escapeHTML(mosaic.year || "Уточняется")}</td></tr>
          <tr><td>Автор</td><td>${escapeHTML(mosaic.author || "Не установлен")}</td></tr>
          <tr><td>Сюжет</td><td>${escapeHTML(mosaic.subject || "Описание добавляется")}</td></tr>
          <tr><td>Источник</td><td>${escapeHTML(mosaic.source || "Указать источник")}</td></tr>
        </table>
      </div>
      <div class="popup-image">${imagePart}</div>
    </div>`;

  L.marker(mosaic.coords, { icon: heartIcon })
    .addTo(map)
    .bindPopup(popup, { maxWidth: 430, minWidth: 280 });
});
