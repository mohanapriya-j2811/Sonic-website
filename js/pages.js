document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  /* ---------- HOME ---------- */
  if (page === "home") {
    const g = $("#featured");
    g.innerHTML = '<div class="skel"></div>'.repeat(4);
    setTimeout(() => { g.innerHTML = PRODUCTS.slice(0, 4).map(card).join(""); observe(); }, 700);
  }

  /* ---------- PRODUCTS: search + filter + sort ---------- */
  if (page === "products") {
    const grid = $("#grid"), q = $("#q"), cat = $("#cat"), sort = $("#sort");
    cat.innerHTML = ["All", ...new Set(PRODUCTS.map(p => p.cat))].map(c => `<option>${c}</option>`).join("");

    const render = () => {
      let list = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q.value.toLowerCase()) &&
        (cat.value === "All" || p.cat === cat.value));
      if (sort.value === "low") list.sort((a, b) => a.price - b.price);
      if (sort.value === "high") list.sort((a, b) => b.price - a.price);
      if (sort.value === "rating") list.sort((a, b) => b.rating - a.rating);
      grid.innerHTML = list.length ? list.map(card).join("") : '<p class="muted">No products found 😕</p>';
      observe();
    };
    grid.innerHTML = '<div class="skel"></div>'.repeat(6);
    setTimeout(render, 700);
    [q, cat, sort].forEach(el => el.addEventListener("input", render));
  }

  /* ---------- PRODUCT DETAILS + SLIDER ---------- */
  if (page === "product") {
    const p = PRODUCTS.find(x => x.id === +new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
    document.title = p.name + " | Sonic";
    $("#detail").innerHTML = `
      <div>
        <div class="slider"><div class="track" id="track">
                    ${p.colors.map((c, i) => `<div class="slide">${Art.media(p, i, i)}</div>`).join("")}</div>
          <button class="arrow l" id="prev">‹</button><button class="arrow r" id="next">›</button></div>
        <div class="dots" id="dots">${p.colors.map((_, i) => `<span class="dot" data-i="${i}"></span>`).join("")}</div>
      </div>
      <div>
        <p class="muted">${p.cat}</p><h1>${p.name}</h1>
        <p>★ ${p.rating} rating</p>
        <p class="price">${price(p.price)} <s class="muted" style="font-size:1rem">${price(p.old)}</s></p>
        <p class="muted">${p.desc}</p>
        <div class="actions">
          <button class="btn" data-cart="${p.id}">Add to Cart</button>
          <button class="btn alt" data-wish="${p.id}">♥ Wishlist</button>
        </div>
      </div>`;
    let i = 0; const n = p.colors.length;
    const go = k => {
      i = (k + n) % n;
      $("#track").style.transform = `translateX(-${i * 100}%)`;
      $$(".dot").forEach((d, x) => d.classList.toggle("on", x === i));
    };
    $("#prev").onclick = () => go(i - 1);
    $("#next").onclick = () => go(i + 1);
    $$(".dot").forEach(d => d.onclick = () => go(+d.dataset.i));
    go(0);
    setInterval(() => go(i + 1), 4000);
  }

  /* ---------- FORM VALIDATION (login, signup, contact) ---------- */
  const rules = {
    name: v => v.trim().length >= 3 || "Minimum 3 characters",
    email: v => /^\S+@\S+\.\S+$/.test(v) || "Enter a valid email",
    password: v => /^(?=.*\d)(?=.*[A-Za-z]).{8,}$/.test(v) || "Min 8 chars with a letter and a number",
    confirm: (v, f) => v === f.password.value || "Passwords do not match",
    message: v => v.trim().length >= 10 || "Minimum 10 characters"
  };
  $$("form[data-form]").forEach(f => {
    f.noValidate = true;
    const fields = $$("input,textarea", f);
    const check = i => {
      const r = rules[i.name](i.value, f), ok = r === true;
      i.classList.toggle("bad", !ok);
      i.nextElementSibling.textContent = ok ? "" : r;
      return ok;
    };
    fields.forEach(i => i.addEventListener("input", () => check(i)));
    f.addEventListener("submit", e => {
      e.preventDefault();
      if (!fields.map(check).every(Boolean)) return toast("Please fix the errors", "error");
      toast(f.dataset.msg);
      f.reset();
      if (f.dataset.go) setTimeout(() => (location.href = f.dataset.go), 1200);
    });
  });
});