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


  // Паломник: A — ихрам, B — белая арабская одежда с платком, C — коричневый плащ (бишт) и шапочка
  const SKIN = "#c68f5e", SKIN2 = "#ad7646", HAIR = "#24170c";
  const face = (beard) => `
      <path fill="${SKIN2}" d="M9 -76 L19 -76 C18 -70 18 -64 19 -58 L9 -58 C10 -64 10 -70 9 -76 Z"/>
      <path fill="${SKIN}" d="M0 -92 C0 -104 10 -110 20 -108 C28 -106 31 -98 31 -92 L35 -86 C36 -84 34 -83 32 -83 L32 -80 C32 -76 29 -72 24 -71 C16 -69 6 -72 3 -79 C1 -83 0 -88 0 -92 Z"/>
      <ellipse cx="9" cy="-90" rx="2.6" ry="4" fill="${SKIN2}"/>
      <circle cx="25" cy="-93" r="1.5" fill="#1d120a"/>
      <path fill="none" stroke="${HAIR}" stroke-width="1.7" stroke-linecap="round" d="M21.5 -97.5 L28.5 -97"/>
      <path fill="${HAIR}" d="M4 -83 C8 -74 16 -69 24 -70 C29 -71 32 -75 32 -79.5 C29 -78 25 -78 23 -80 C18 -82 11 -82 7 -86 Z"/>
      ${beard ? `<path fill="none" stroke="#3b2615" stroke-width="1.2" stroke-linecap="round" d="M26 -79 C28 -79 30 -80 31 -81"/>` : ""}`;
  const farArm = (fill) => `
      <path fill="${fill}" d="M10 -58 C20 -56 28 -48 32 -42 C38 -40 44 -38 48 -36 C50 -34 48 -31 45 -32 C38 -33 31 -35 26 -37 C20 -42 14 -48 8 -52 Z"/>
      <circle cx="48" cy="-34" r="3.6" fill="${SKIN2}"/>`;
  const torsoPath = "M-10 -4 C-14 -28 -10 -50 0 -60 C8 -67 20 -66 26 -58 C31 -48 31 -26 27 -4 C14 1 2 1 -10 -4 Z";
  const nearArm = (fill, edge) => `
      <path fill="${fill}" d="M8 -57 C16 -50 22 -38 26 -26 C28 -20 34 -16 40 -16 C44 -16 44 -11 40 -10 C30 -9 22 -14 18 -20 C12 -30 6 -42 2 -52 Z"/>
      ${edge ? `<path fill="none" stroke="${edge}" stroke-width="1.6" d="M2 -52 C6 -42 12 -30 18 -20"/>` : ""}
      <circle cx="42" cy="-13" r="3.7" fill="${SKIN}"/>`;
  const sandal = `<path fill="#5a3a1c" d="M16 59 L33 59 C35 62 33 65 29 65 L16 65 Z"/>`;
  const RIDERS = {
    a: `${farArm(SKIN2)}
      <path fill="url(#cloth)" d="M-8 -8 C6 -12 22 -10 34 -2 C40 4 38 14 32 18 L30 42 C28 46 20 46 19 42 L18 18 C10 12 0 8 -10 4 Z"/>
      <path fill="none" stroke="#d6cfc2" stroke-width="1.4" d="M4 -6 C16 -2 26 4 32 12 M22 20 L23 40 M-6 0 C4 2 12 6 18 12"/>
      <path fill="${SKIN}" d="M20 42 C21 48 22 54 21 60 L28 60 C29 54 30 48 30 42 Z"/>${sandal}
      <path fill="url(#cloth)" d="${torsoPath}"/>
      <path fill="none" stroke="#d6cfc2" stroke-width="1.6" d="M0 -60 C8 -44 16 -28 22 -8 M-6 -50 C0 -36 6 -22 10 -6 M10 -62 C16 -52 22 -42 26 -32"/>
      ${nearArm("url(#cloth)", "#d6cfc2")}
      ${face(true)}
      <path fill="${HAIR}" d="M0 -92 C-1 -104 10 -111 21 -109 C27 -108 30 -104 31 -100 C24 -104 14 -103 8 -98 C6 -94 4 -90 2 -86 Z"/>`,
    b: `${farArm("#efebe3")}
      <path fill="url(#cloth)" d="M-8 -8 C6 -12 22 -10 34 -2 C40 4 38 14 32 18 L32 57 C30 61 18 61 17 57 L18 18 C10 12 0 8 -10 4 Z"/>
      <path fill="none" stroke="#d6cfc2" stroke-width="1.4" d="M4 -6 C16 -2 26 4 32 12 M24 20 L25 56"/>${sandal}
      <path fill="url(#cloth)" d="${torsoPath}"/>
      <path fill="none" stroke="#d6cfc2" stroke-width="1.4" d="M22 -58 L20 -36"/>
      ${nearArm("url(#cloth)", "#d6cfc2")}
      ${face(true)}
      <path fill="#fbfaf6" d="M-6 -88 C-6 -106 6 -116 20 -114 C30 -112 35 -104 34 -95 L29 -95 C27 -100 21 -103 13 -102 C9 -96 9 -86 11 -76 C8 -64 0 -52 -12 -44 C-16 -58 -12 -74 -6 -88 Z"/>
      <path fill="none" stroke="#ddd6ca" stroke-width="1.3" d="M2 -96 C0 -84 -4 -70 -10 -56 M8 -100 C6 -88 4 -76 0 -64"/>
      <path fill="#1b1410" d="M-3 -104 C6 -112 23 -112 33 -104 L32 -100.5 C23 -107.5 7 -107.5 -1 -100 Z"/>
      <path fill="none" stroke="#1b1410" stroke-width="2" d="M-2 -98 C6 -105 22 -105 31 -98"/>`,
    c: `${farArm("#5a3a20")}
      <path fill="url(#cloth)" d="M-8 -8 C6 -12 22 -10 34 -2 C40 4 38 14 32 18 L32 57 C30 61 18 61 17 57 L18 18 C10 12 0 8 -10 4 Z"/>${sandal}
      <path fill="url(#cloth)" d="${torsoPath}"/>
      <path fill="url(#bisht)" d="M-12 0 C-16 -26 -12 -50 -2 -60 C4 -65 10 -66 14 -64 C10 -50 8 -30 10 -4 C14 10 20 20 26 30 C10 30 -6 22 -12 0 Z"/>
      <path fill="none" stroke="#e1b552" stroke-width="2.2" d="M14 -64 C10 -50 8 -30 10 -4 C14 10 20 20 26 30"/>
      ${nearArm("url(#bisht)", "#e1b552")}
      ${face(true)}
      <path fill="${HAIR}" d="M0 -92 C0 -98 2 -102 4 -104 C3 -98 3 -94 4 -90 Z"/>
      <path fill="#fbfaf6" d="M-1 -98 C-1 -108 9 -113 19 -112 C28 -111 32 -105 32 -99 C22 -102 10 -102 -1 -98 Z"/>
      <path fill="none" stroke="#ddd6ca" stroke-width="1.2" d="M1 -101 C10 -104 22 -104 31 -101"/>`,
  };
  const RIDER = "b"; // выбранный вариант

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
    <linearGradient id="bisht" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2f18"/><stop offset=".6" stop-color="#6e4a28"/><stop offset="1" stop-color="#583820"/></linearGradient>
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

    <!-- паломник (вариант A/B/C) -->
    <g id="rider" transform="translate(194 92)">${RIDERS[RIDER]}</g>
    <!-- поводья от руки к уздечке -->
    <path id="rein" fill="none" stroke="#5a3a1a" stroke-width="1.6" d="M242 58 C300 70 350 74 382 82"/>
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
