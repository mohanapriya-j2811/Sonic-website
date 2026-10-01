const PRODUCTS = [
  {id:1,name:"Sonic Buds Pro",cat:"Earbuds",price:1499,old:3999,rating:4.5,emoji:"🎧",colors:["#ff9a9e","#a18cd1","#fbc2eb"],desc:"ANC earbuds with 40hr playtime and quad mic ENC."},
  {id:2,name:"Sonic Air TWS",cat:"Earbuds",price:999,old:2499,rating:4.2,emoji:"🎵",colors:["#84fab0","#8fd3f4","#a6c0fe"],desc:"Lightweight TWS with 13mm drivers and instant connect."},
  {id:3,name:"Sonic Rockerz",cat:"Headphones",price:1799,old:4499,rating:4.4,emoji:"🎧",colors:["#f6d365","#fda085","#ffecd2"],desc:"Over-ear wireless headphones with 60hr battery."},
  {id:4,name:"Sonic Studio Max",cat:"Headphones",price:2999,old:6999,rating:4.7,emoji:"🎧",colors:["#667eea","#764ba2","#89f7fe"],desc:"Premium ANC headphones with spatial audio."},
  {id:5,name:"Sonic Wave Watch",cat:"Smartwatch",price:2499,old:5999,rating:4.3,emoji:"⌚",colors:["#43e97b","#38f9d7","#c3cfe2"],desc:"1.96\" AMOLED, BT calling, 100+ sports modes."},
  {id:6,name:"Sonic Fit Band",cat:"Smartwatch",price:1299,old:2999,rating:4.1,emoji:"⌚",colors:["#fa709a","#fee140","#ff9a9e"],desc:"Slim fitness band with SpO2 and 14-day battery."},
  {id:7,name:"Sonic Boom Speaker",cat:"Speakers",price:1999,old:4999,rating:4.6,emoji:"🔊",colors:["#30cfd0","#330867","#5ee7df"],desc:"20W portable speaker with RGB lights and IPX7."},
  {id:8,name:"Sonic Mini Speaker",cat:"Speakers",price:799,old:1999,rating:4.0,emoji:"🔈",colors:["#ffd1ff","#fad0c4","#a1c4fd"],desc:"Pocket-size 10W speaker with 12hr playtime."}
];

/* ===================== PRODUCT IMAGES ===================== */
/* Photos: images/<id>-1.jpg (main), <id>-2.jpg, <id>-3.jpg. Missing photo = SVG art shows automatically. */
const USE_PHOTOS = true;

const Art = (() => {
  let uid = 0;
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const toHex = a => "#" + a.map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
  const mix = (h, t) => toHex(rgb(h).map(v => v + (255 - v) * t));
  const shade = (h, t) => toHex(rgb(h).map(v => v * (1 - t)));
  const INK = "#181a26";

  const shapes = {
    Earbuds: c => `
      <ellipse cx="200" cy="250" rx="100" ry="10" fill="#000" opacity=".12"/>
      <rect x="128" y="150" width="144" height="94" rx="40" fill="${INK}"/>
      <rect x="186" y="176" width="28" height="7" rx="3.5" fill="${c}"/>
      <g transform="rotate(-12 160 110)"><ellipse cx="160" cy="108" rx="26" ry="34" fill="#fff"/><rect x="168" y="122" width="13" height="52" rx="6.5" fill="#fff"/><circle cx="158" cy="106" r="10" fill="${c}"/></g>
      <g transform="rotate(12 240 110)"><ellipse cx="240" cy="108" rx="26" ry="34" fill="#fff"/><rect x="219" y="122" width="13" height="52" rx="6.5" fill="#fff"/><circle cx="242" cy="106" r="10" fill="${c}"/></g>`,
    Headphones: c => `
      <ellipse cx="200" cy="262" rx="112" ry="9" fill="#000" opacity=".12"/>
      <path d="M112 170C104 58 296 58 288 170" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/>
      <path d="M128 132C146 86 254 86 272 132" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      <rect x="82" y="148" width="60" height="104" rx="28" fill="${c}"/><rect x="94" y="162" width="38" height="76" rx="19" fill="${INK}" opacity=".88"/>
      <rect x="258" y="148" width="60" height="104" rx="28" fill="${c}"/><rect x="268" y="162" width="38" height="76" rx="19" fill="${INK}" opacity=".88"/>`,
    Smartwatch: c => `
      <ellipse cx="200" cy="284" rx="70" ry="8" fill="#000" opacity=".12"/>
      <rect x="166" y="22" width="68" height="80" rx="16" fill="${INK}"/><rect x="166" y="198" width="68" height="80" rx="16" fill="${INK}"/>
      <rect x="264" y="126" width="9" height="30" rx="4.5" fill="${INK}"/>
      <rect x="136" y="82" width="128" height="136" rx="36" fill="${c}"/><rect x="147" y="93" width="106" height="114" rx="28" fill="#0b0d13"/>
      <text x="200" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" font-weight="800" fill="#fff">10:09</text>
      <rect x="170" y="182" width="60" height="6" rx="3" fill="#fff" opacity=".2"/><rect x="170" y="182" width="38" height="6" rx="3" fill="${c}"/>`,
    Speakers: c => {
      let dots = "";
      for (let y = 0; y < 5; y++) for (let x = 0; x < 8; x++) dots += `<circle cx="${144 + x * 16}" cy="${112 + y * 16}" r="3.2"/>`;
      return `
      <ellipse cx="200" cy="252" rx="108" ry="10" fill="#000" opacity=".12"/>
      <path d="M152 92C152 46 248 46 248 92" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>
      <rect x="106" y="88" width="188" height="160" rx="46" fill="${INK}"/>
      <g fill="#fff" opacity=".28">${dots}</g><rect x="150" y="212" width="100" height="9" rx="4.5" fill="${c}"/>`;
    }
  };

  /* view: 0 = front, 1 = close-up, 2 = dark studio */
  function render(p, ci = 0, view = 0) {
    const id = "g" + ++uid, base = p.colors[ci % p.colors.length], accent = shade(base, .3);
    const a = view === 2 ? "#171a2b" : mix(base, .6), b = view === 2 ? shade(base, .55) : base;
    const s = view === 1 ? 1.45 : 1;
    return `<svg class="art" viewBox="0 0 400 300" role="img" aria-label="${p.name}" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#${id})"/>
      <circle cx="335" cy="48" r="115" fill="#fff" opacity=".16"/><circle cx="55" cy="275" r="90" fill="#fff" opacity=".12"/>
      <g transform="translate(200 150) scale(${s}) translate(-200 -150)">${shapes[p.cat](accent)}</g></svg>`;
  }

  /* photo if available, SVG art as fallback */
  function media(p, ci = 0, view = 0) {
    if (!USE_PHOTOS) return render(p, ci, view);
    return `<img class="art photo" src="images/${p.id}-${view + 1}.jpg" alt="${p.name}" data-p="${p.id}" data-c="${ci}" data-v="${view}" onerror="Art.fallback(this)">`;
  }
  function fallback(img) {
    const p = PRODUCTS.find(x => x.id === +img.dataset.p);
    img.onerror = null;
    img.outerHTML = render(p, +img.dataset.c, +img.dataset.v);
  }
  return { render, media, fallback };
})();