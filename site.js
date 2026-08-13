(function () {
  var WA = "8801832461573";
  var SHIP = 140;
  var PAY_NUMBER = "01832461573";

  function user() {
    try { return JSON.parse(localStorage.getItem("inkora_user") || "null"); }
    catch (e) { return null; }
  }
  function saveUser(u) { localStorage.setItem("inkora_user", JSON.stringify(u)); }
  function logout() { localStorage.removeItem("inkora_user"); }

  function cart() {
    try { return JSON.parse(localStorage.getItem("inkora_cart") || "[]"); }
    catch (e) { return []; }
  }
  function setCart(c) { localStorage.setItem("inkora_cart", JSON.stringify(c)); }
  function cartCount() {
    return cart().reduce(function (n, i) { return n + (i.qty || 0); }, 0);
  }
  function addToCart(slug, qty) {
    qty = qty || 1;
    var c = cart();
    var f = c.find(function (x) { return x.slug === slug; });
    if (f) f.qty += qty;
    else c.push({ slug: slug, qty: qty });
    setCart(c);
    return c;
  }
  function setQty(slug, qty) {
    var c = cart().filter(function (x) {
      if (x.slug !== slug) return true;
      x.qty = qty;
      return qty > 0;
    });
    setCart(c);
  }
  function findProduct(slug) {
    var list = window.INKORA_PRODUCTS || [];
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }
  function cartLines() {
    return cart().map(function (i) {
      var p = findProduct(i.slug);
      return p ? { product: p, qty: i.qty, line: p.price * i.qty } : null;
    }).filter(Boolean);
  }
  function subtotal() {
    return cartLines().reduce(function (n, l) { return n + l.line; }, 0);
  }

  function waLink(text) {
    var u = user();
    if (u && u.name) text += "\nName: " + u.name;
    if (u && u.phone) text += "\nPhone: " + u.phone;
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  }

  function nav(active) {
    var u = user();
    var acc = u && u.name ? u.name.split(" ")[0] : "Account";
    var n = cartCount();
    var el = document.getElementById("site-nav");
    if (!el) return;
    el.innerHTML =
      '<div class="announce">Handmade in Dhaka · Made to order · Inside Dhaka ৳80 · Outside ৳140</div>' +
      '<nav class="nav">' +
        '<a class="mark" href="index.html">INKORA</a>' +
        "<ul>" +
          '<li><a href="index.html"' + (active === "home" ? ' class="on"' : "") + ">Home</a></li>" +
          '<li><a href="shop.html"' + (active === "shop" ? ' class="on"' : "") + ">Shop All</a></li>" +
          '<li><a href="custom.html"' + (active === "custom" ? ' class="on"' : "") + ">Custom</a></li>" +
          '<li><a href="terms.html"' + (active === "terms" ? ' class="on"' : "") + ">Terms</a></li>" +
        "</ul>" +
        '<div class="nav-right">' +
          '<a class="ghost" href="account.html">' + acc + "</a>" +
          '<a class="ghost cart-link" href="cart.html">Bag <span class="bag-n">' + n + "</span></a>" +
        "</div>" +
      "</nav>";
  }

  function money(n) { return "৳" + n.toLocaleString("en-BD"); }

  function toast(msg) {
    var t = document.getElementById("inkora-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "inkora-toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  window.Inkora = {
    user: user, saveUser: saveUser, logout: logout,
    cart: cart, addToCart: addToCart, setQty: setQty, cartCount: cartCount,
    cartLines: cartLines, subtotal: subtotal, findProduct: findProduct,
    waLink: waLink, nav: nav, money: money, toast: toast,
    SHIP: SHIP, PAY_NUMBER: PAY_NUMBER
  };
})();
