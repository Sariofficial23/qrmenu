// Пустыня и верблюд на заднем фоне: при прокрутке вниз верблюд идёт вправо, вверх — влево.
(function () {
  if (!document.body.classList.contains("desert")) return;

  const CAMEL = `
<svg viewBox="0 0 200 150" aria-hidden="true">
  <g class="body">
    <g fill="#9a652a">
      <rect class="leg b" x="64" y="82" width="7" height="64" rx="3.5"/>
      <rect class="leg a" x="140" y="80" width="7" height="66" rx="3.5"/>
    </g>
    <path d="M46 70 C37 72 34 84 37 94" fill="none" stroke="#a8722f" stroke-width="3" stroke-linecap="round"/>
    <path fill="#bd8743" d="M44 78 C42 60 56 52 70 52 C78 30 108 24 120 50 C134 50 146 58 148 72 C148 88 128 92 96 92 C66 92 46 90 44 78Z"/>
    <path fill="#bd8743" d="M138 64 C150 60 156 50 158 36 C159 26 166 18 176 19 C184 20 190 24 190 29 C190 33 186 35 180 35 C174 35 170 39 168 46 C165 60 158 74 146 82Z"/>
    <path fill="#a8722f" d="M169 20 l2 -6 l4 5z"/>
    <circle cx="179" cy="25.5" r="1.6" fill="#3b2410"/>
    <path fill="#c0392b" d="M80 56 C88 36 106 34 114 54 L113 72 C101 76 91 76 82 72Z"/>
    <path fill="none" stroke="#e8b84a" stroke-width="2.2" d="M82 70 C91 74 101 74 113 70 M81 60 C90 48 104 48 113 58"/>
    <g fill="#e8b84a"><circle cx="84" cy="76" r="2"/><circle cx="92" cy="78" r="2"/><circle cx="101" cy="78" r="2"/><circle cx="110" cy="76" r="2"/></g>
    <g fill="#b07936">
      <rect class="leg a" x="52" y="82" width="7.5" height="64" rx="3.7"/>
      <rect class="leg b" x="128" y="80" width="7.5" height="66" rx="3.7"/>
    </g>
  </g>
</svg>`;

  const LAND = `
<svg class="land" viewBox="0 0 1440 280" preserveAspectRatio="none" aria-hidden="true">
  <path fill="#f7dcae" opacity=".75" d="M0 140 C200 92 380 122 560 102 C760 80 900 132 1100 106 C1260 86 1360 112 1440 100 V280 H0Z"/>
  <path fill="#f0c98e" d="M0 192 C220 152 420 176 640 162 C860 147 1040 190 1240 170 C1340 160 1400 166 1440 162 V280 H0Z"/>
  <path fill="#e7b877" d="M0 236 C240 210 480 224 720 216 C960 208 1200 228 1440 218 V280 H0Z"/>
</svg>`;

  const sun = document.createElement("div");
  sun.className = "sun";
  const dunes = document.createElement("div");
  dunes.className = "dunes";
  dunes.innerHTML = LAND + `<div class="camel" id="camel"><div class="camel__inner">${CAMEL}</div><span class="camel__shadow"></span></div>`;
  document.body.prepend(dunes);
  document.body.prepend(sun);

  const camel = dunes.querySelector("#camel");
  let lastY = scrollY, stopTimer = 0, ticking = false;

  function place() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const room = innerWidth - camel.offsetWidth - 16;
    const x = 8 + p * room;
    const y = Math.sin(p * Math.PI * 4) * 6; // поднимается и опускается по барханам
    camel.style.transform = `translate(${x}px, ${y}px)`;
  }

  addEventListener("scroll", () => {
    const y = scrollY;
    if (y !== lastY) {
      camel.classList.toggle("left", y < lastY);
      camel.classList.add("walking");
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => camel.classList.remove("walking"), 220);
      lastY = y;
    }
    if (!ticking) { ticking = true; requestAnimationFrame(place); }
  }, { passive: true });
  addEventListener("resize", place);
  place();
})();
