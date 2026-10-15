// Пустыня и верблюд с паломником на заднем фоне.
// Прокрутка вниз — верблюд идёт вправо, вверх — влево. Ноги двигаются в такт пройденному пути (иноходь).
(function () {
  if (!document.body.classList.contains("desert")) return;

  // Нога: бедро вращается в «плече», голень — в колене. far = дальняя сторона (темнее)
  const leg = (id, x, y, front, far) => {
    const c1 = far ? "url(#legFar)" : "url(#legNear)";
    const thigh = front
      ? `M-11 -6 C-13 20 -9 42 -6 62 L6 62 C9 42 13 20 11 -6 C11 -16 -11 -16 -11 -6 Z`
      : `M-17 -14 C-22 14 -14 38 -7 62 L7 62 C12 38 22 14 15 -14 C15 -28 -17 -28 -17 -14 Z`;
    return `<g id="${id}" transform="translate(${x} ${y})">
      <path d="${thigh}" fill="${c1}"/>
      <g class="shin" transform="translate(0 60)">
        <circle r="7" fill="${c1}"/>
        <path d="M-5.5 0 C-6 22 -5 44 -5 62 L5 62 C5 44 6 22 5.5 0 Z" fill="${c1}"/>
        <path d="M-9 60 C-11 66 -8 70 0 70 C9 70 12 66 9 60 Z" fill="${far ? "#5e3d1c" : "#6e4822"}"/>
      </g>
    </g>`;
  };

  const CAMEL = `
<svg viewBox="0 0 430 335" aria-hidden="true">
  <defs>
    <linearGradient id="hide" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9ac6c"/><stop offset=".55" stop-color="#c08a4a"/><stop offset="1" stop-color="#9b6a33"/>
    </linearGradient>
    <radialGradient id="humpLight" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#f1cf93" stop-opacity=".8"/><stop offset="1" stop-color="#f1cf93" stop-opacity="0"/></radialGradient>
    <linearGradient id="legNear" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a87439"/><stop offset=".5" stop-color="#c79458"/><stop offset="1" stop-color="#9c6831"/></linearGradient>
    <linearGradient id="legFar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7f5428"/><stop offset="1" stop-color="#8f5f2e"/></linearGradient>
    <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3ddd2"/></linearGradient>
    <linearGradient id="rug" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8e1f1a"/><stop offset=".5" stop-color="#b8322a"/><stop offset="1" stop-color="#7d1a16"/></linearGradient>
  </defs>

  <ellipse cx="205" cy="324" rx="150" ry="9" fill="rgba(110,70,25,.22)"/>

  <!-- дальние ноги -->
  ${leg("hf", 142, 196, false, true)}
  ${leg("ff", 270, 200, true, true)}

  <!-- ближние ноги -->
  ${leg("hn", 126, 194, false, false)}
  ${leg("fn", 286, 202, true, false)}
  <g id="torso">
    <!-- хвост -->
    <g id="tail" transform="translate(98 168)"><path d="M0 0 C-10 8 -14 26 -12 48 C-11 54 -5 54 -5 48 C-6 30 -3 14 4 6 Z" fill="#9b6a33"/><path d="M-12 46 C-16 54 -10 62 -6 58 C-4 54 -6 50 -8 48 Z" fill="#5e3d1c"/></g>
    <!-- туловище с горбом -->
    <path fill="url(#hide)" d="M96 170 C92 146 108 132 130 128 C150 124 158 94 190 90 C224 87 240 114 252 126 C270 132 292 140 304 156 C316 172 312 198 296 208 C270 216 238 214 206 216 C172 218 132 216 114 207 C100 199 97 186 96 170 Z"/>
    <path fill="url(#humpLight)" d="M140 128 C152 104 168 92 190 91 C214 90 232 108 244 126 C214 116 172 116 140 128 Z"/>
    <path fill="none" stroke="#8f5f2e" stroke-opacity=".35" stroke-width="2" d="M118 205 C150 214 230 214 290 204 M128 170 C130 186 124 196 116 202"/>
    <!-- шея и голова -->
    <g id="neck" transform="translate(292 160)">
      <path fill="url(#hide)" d="M-14 -22 C6 -30 26 -16 36 4 C44 20 48 10 52 -12 C56 -36 54 -64 62 -80 C68 -92 82 -98 96 -94 L118 -86 C126 -82 126 -72 116 -70 L94 -66 C84 -64 80 -58 78 -48 C74 -24 72 4 66 30 C60 54 34 62 14 52 C0 44 -8 26 -14 8 Z"/>
      <path fill="#b07a3e" d="M90 -96 C88 -104 92 -110 98 -106 C100 -102 98 -98 96 -95 Z"/>
      <ellipse cx="100" cy="-84" rx="3" ry="2.4" fill="#2b1a0b"/>
      <path fill="none" stroke="#3b2410" stroke-width="1.6" stroke-linecap="round" d="M97 -88 C100 -90 103 -89 105 -87"/>
      <path fill="#a06c33" d="M116 -78 C120 -76 120 -72 116 -71 Z"/>
      <path fill="none" stroke="#8f5f2e" stroke-width="1.6" stroke-linecap="round" d="M112 -72 C108 -70 104 -70 100 -71"/>
      <!-- уздечка -->
      <path fill="none" stroke="#7d1a16" stroke-width="2.4" d="M86 -94 C88 -84 90 -76 92 -68 M90 -80 C100 -80 110 -78 118 -76"/>
    </g>
    <!-- попона и седло на горбе -->
    <path fill="url(#rug)" d="M150 120 C160 96 176 90 192 90 C210 90 226 100 236 120 L238 168 C210 176 176 176 148 168 Z"/>
    <path fill="none" stroke="#e8b84a" stroke-width="3" d="M148 162 C176 170 210 170 238 162"/>
    <path fill="none" stroke="#e8b84a" stroke-width="1.6" stroke-dasharray="4 5" d="M150 150 C178 158 208 158 236 150"/>
    <g fill="#e8b84a"><circle cx="152" cy="172" r="3"/><circle cx="166" cy="176" r="3"/><circle cx="180" cy="178" r="3"/><circle cx="194" cy="178" r="3"/><circle cx="208" cy="177" r="3"/><circle cx="222" cy="174" r="3"/><circle cx="236" cy="170" r="3"/></g>
    <path fill="#6b3f1c" d="M164 96 C176 84 210 84 222 96 L218 104 C206 96 180 96 168 104 Z"/>

    <!-- паломник в ихраме -->
    <g id="rider" transform="translate(194 92)">
      <path fill="url(#cloth)" d="M8 -8 C22 -6 30 6 34 22 C36 34 34 46 30 56 L22 58 C22 44 18 30 10 22 Z"/>
      <path fill="#c48a5a" d="M28 54 C30 62 32 70 30 76 L22 76 C22 68 21 62 22 56 Z"/>
      <path fill="#6b4422" d="M18 76 L34 76 C36 79 34 81 30 81 L18 81 Z"/>
      <path fill="url(#cloth)" d="M-14 -4 C-16 -26 -12 -50 -2 -62 C6 -70 18 -70 24 -62 C30 -52 30 -30 26 -8 C14 -2 -2 -2 -14 -4 Z"/>
      <path fill="none" stroke="#d6cfc2" stroke-width="2" d="M-4 -58 C6 -46 16 -30 24 -14"/>
      <path fill="#c48a5a" d="M20 -60 C26 -64 30 -60 30 -52 L22 -52 Z"/>
      <path fill="url(#cloth)" d="M14 -58 C24 -54 34 -46 44 -38 C48 -35 46 -30 42 -32 C32 -38 22 -44 12 -48 Z"/>
      <circle cx="46" cy="-34" r="4.2" fill="#c48a5a"/>
      <rect x="2" y="-80" width="16" height="12" rx="4" fill="#c48a5a"/>
      <circle cx="10" cy="-88" r="13" fill="#c48a5a"/>
      <path fill="#2e1d10" d="M-3 -90 C-2 -102 10 -106 20 -100 C24 -97 24 -92 22 -90 C16 -96 4 -96 -3 -90 Z"/>
      <path fill="#3a2414" d="M0 -84 C2 -74 14 -72 21 -80 C20 -76 16 -70 10 -70 C4 -70 0 -76 0 -84 Z"/>
      <circle cx="17" cy="-89" r="1.4" fill="#2b1a0b"/>
    </g>
    <!-- поводья от руки к уздечке -->
    <path id="rein" fill="none" stroke="#5a3a1a" stroke-width="1.6" d="M240 58 C300 70 350 74 382 82"/>
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
  dunes.innerHTML = LAND + `<div class="camel" id="camel"><div class="camel__inner">${CAMEL}</div></div>`;
  document.body.prepend(dunes);
  document.body.prepend(sun);

  const camel = dunes.querySelector("#camel");
  const $ = (id) => camel.querySelector("#" + id);
  const legs = { hn: $("hn"), fn: $("fn"), hf: $("hf"), ff: $("ff") };
  const base = {};
  for (const k in legs) base[k] = legs[k].getAttribute("transform");
  const torso = $("torso"), neck = $("neck"), tail = $("tail"), rider = $("rider");
  const neckBase = neck.getAttribute("transform"), tailBase = tail.getAttribute("transform"), riderBase = rider.getAttribute("transform");

  let phase = 0, amp = 0, lastY = scrollY, lastX = 0, lastMove = 0, x = 0;

  function pose() {
    // иноходь: ближние ноги вместе, дальние — в противофазе
    const set = (k, ph, front) => {
      const thigh = 17 * Math.sin(ph) * amp;
      const knee = (front ? 38 : 30) * Math.max(0, -Math.cos(ph)) * amp; // колено сгибается, когда нога идёт вперёд
      legs[k].setAttribute("transform", `${base[k]} rotate(${thigh.toFixed(2)})`);
      legs[k].querySelector(".shin").setAttribute("transform", `translate(0 60) rotate(${(front ? knee : knee * 0.8).toFixed(2)})`);
    };
    set("hn", phase, false); set("fn", phase, true);
    set("hf", phase + Math.PI, false); set("ff", phase + Math.PI, true);
    const bob = Math.abs(Math.sin(phase)) * 3 * amp;
    torso.setAttribute("transform", `translate(0 ${(-bob).toFixed(2)})`);
    neck.setAttribute("transform", `${neckBase} rotate(${(3.5 * Math.sin(phase * 2) * amp).toFixed(2)})`);
    tail.setAttribute("transform", `${tailBase} rotate(${(6 * Math.sin(phase) * amp).toFixed(2)})`);
    rider.setAttribute("transform", `${riderBase} rotate(${(2 * Math.sin(phase * 2 + 0.6) * amp).toFixed(2)})`);
  }

  function target() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    return 6 + p * (innerWidth - camel.offsetWidth - 12);
  }

  function frame(t) {
    const tx = target();
    x += (tx - x) * 0.18;                       // плавно догоняет позицию прокрутки
    const dx = x - lastX; lastX = x;
    const stride = camel.offsetWidth * 0.55;      // длина шага в пикселях
    if (Math.abs(dx) > 0.05) {
      phase += (Math.abs(dx) / stride) * Math.PI * 2;
      lastMove = t;
    }
    const moving = t - lastMove < 140;
    amp += ((moving ? 1 : 0) - amp) * (moving ? 0.25 : 0.08);
    camel.style.transform = `translate(${x.toFixed(1)}px, ${(Math.sin((x / innerWidth) * Math.PI * 4) * 5).toFixed(1)}px)`;
    pose();
    requestAnimationFrame(frame);
  }

  addEventListener("scroll", () => {
    const y = scrollY;
    if (y !== lastY) { camel.classList.toggle("left", y < lastY); lastY = y; }
  }, { passive: true });

  x = lastX = target();
  pose();
  requestAnimationFrame(frame);
})();
