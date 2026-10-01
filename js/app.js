const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const price = n => "₹" + n.toLocaleString("en-IN");
const store = {
  get: (k, d = []) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

/* Theme */
document.documentElement.dataset.theme = localStorage.getItem("theme") || "light";

/* Toast */
function toast(msg, type = "success") {
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  $("#toasts").append(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 2500);
}

/* Header & footer (reusable components) */
function renderLayout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const link = (h, t) => `<a href="${h}" class="${page === h ? "active" : ""}">${t}</a>`;
  $("#header").innerHTML = `
  <header><div class="wrap"><nav>
    <a href="index.html" class="logo">Sonic</a>
    <div class="links" id="links">
      ${link("index.html", "Home")}${link("products.html", "Products")}
      ${link("about.html", "About")}${link("contact.html", "Contact")}
      ${link("login.html", "Login")}${link("signup.html", "Sign Up")}
    </div>
    <div class="icons">
      <button class="ibtn" id="themeBtn" aria-label="Toggle theme"></button>
      <button class="ibtn" aria-label="Wishlist">♡<span class="badge" id="wCount">0</span></button>
      <button class="ibtn" aria-label="Cart">🛒<span class="badge" id="cCount">0</span></button>
      <button class="ibtn burger" id="burger" aria-label="Menu">☰</button>
    </div>
  </nav></div></header>`;
  $("#footer").innerHTML = `<footer><div class="wrap"><b class="logo">Sonic</b>
    <p class="muted">© ${new Date().getFullYear()} Sonic Audio. Frontend demo project.</p></div></footer>`;

  const setIcon = () => $("#themeBtn").textContent = document.documentElement.dataset.theme === "dark" ? "☀️" : "🌙";
  setIcon();
  $("#themeBtn").onclick = () => {
    const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    localStorage.setItem("theme", n);
    setIcon();
    toast(`${n[0].toUpperCase() + n.slice(1)} mode on`, "info");
  };
  $("#burger").onclick = () => $("#links").classList.toggle("open");
  updateBadges();
}

function updateBadges() {
  $("#wCount").textContent = store.get("wish").length;
  $("#cCount").textContent = store.get("cart").length;
}

/* Wishlist / Cart */
function toggleWish(id) {
  let l = store.get("wish");
  const has = l.includes(id);
  l = has ? l.filter(x => x !== id) : [...l, id];
  store.set("wish", l);
  updateBadges();
  toast(has ? "Removed from wishlist" : "Added to wishlist ❤️", has ? "info" : "success");
  return !has;
}
function addToCart(id) {
  store.set("cart", [...store.get("cart"), id]);
  updateBadges();
  toast("Added to cart 🛒");
}

/* Product card template */
function card(p) {
  const w = store.get("wish").includes(p.id);
  return `<article class="card reveal">
    <button class="wish ${w ? "on" : ""}" data-wish="${p.id}" aria-label="Wishlist">♥</button>
    <a href="product.html?id=${p.id}">
            <div class="thumb">${Art.media(p)}</div><h3>${p.name}</h3></a>
    <p class="muted">★ ${p.rating} · ${p.cat}</p>
    <p><b>${price(p.price)}</b> <s class="muted">${price(p.old)}</s></p>
    <button class="btn" data-cart="${p.id}">Add to Cart</button></article>`;
}

/* Scroll reveal */
function observe() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  }), { threshold: .1 });
  $$(".reveal:not(.show)").forEach(el => io.observe(el));
}

/* Global click handling (wishlist, cart, page transition) */
document.addEventListener("click", e => {
  const w = e.target.closest("[data-wish]");
  if (w) { w.classList.toggle("on", toggleWish(+w.dataset.wish)); }
  const c = e.target.closest("[data-cart]");
  if (c) addToCart(+c.dataset.cart);

  const a = e.target.closest("a[href]");
  if (a && a.origin === location.origin && !a.hash && a.target !== "_blank") {
    e.preventDefault();
    document.body.classList.add("leave");
    setTimeout(() => (location.href = a.href), 250);
  }
});
window.addEventListener("pageshow", () => document.body.classList.remove("leave"));

document.addEventListener("DOMContentLoaded", () => { renderLayout(); observe(); });