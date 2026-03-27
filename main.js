/* ============================================
   SIKARWAR GROUP - Main JavaScript (Fully Functional)
   ============================================ */

// ---------- PRODUCT DATA ----------
const products = {
  1: {
    id: 1,
    name: "Navy Linen Slim Shirt",
    price: 849,
    originalPrice: 1699,
    category: "shirt",
    colors: {
      "Navy Blue": "#1a3a5c",
      "Forest Green": "#2d5a3d",
      "Burgundy": "#5c1a1a",
      "Olive": "#3d3d1a"
    },
    images: {
      "Navy Blue": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      "Forest Green": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
      "Burgundy": "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",
      "Olive": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
    },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "100% Premium Linen Fabric, Slim Fit Cut, Spread Collar, Full Button Placket, Machine Washable.",
    rating: 4.2,
    reviews: 1248
  },
  2: {
    id: 2,
    name: "Olive Cargo Trousers",
    price: 999,
    originalPrice: 1999,
    category: "trousers",
    colors: { "Olive": "#2d4a22" },
    images: { "Olive": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
    sizes: ["28", "30", "32", "34", "36"],
    description: "Relaxed fit cargo trousers with multiple pockets. Cotton blend, durable and comfortable.",
    rating: 4.5,
    reviews: 876
  },
  3: {
    id: 3,
    name: "White Cotton Polo",
    price: 699,
    originalPrice: 1399,
    category: "polo",
    colors: { "White": "#f8f8f8" },
    images: { "White": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80" },
    sizes: ["S", "M", "L", "XL"],
    description: "Premium cotton polo with ribbed collar, moisture-wicking fabric, perfect for daily wear.",
    rating: 4.3,
    reviews: 532
  },
  4: {
    id: 4,
    name: "Black Slim Fit Jeans",
    price: 1149,
    originalPrice: 2299,
    category: "jeans",
    colors: { "Black": "#1a1a1a" },
    images: { "Black": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
    sizes: ["28", "30", "32", "34", "36", "38"],
    description: "Stretch denim, slim fit, classic black wash, comfortable for all-day wear.",
    rating: 4.4,
    reviews: 2103
  },
  5: {
    id: 5,
    name: "Mustard Graphic Tee",
    price: 549,
    originalPrice: 1099,
    category: "tshirt",
    colors: { "Mustard": "#c8a020" },
    images: { "Mustard": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
    sizes: ["S", "M", "L", "XL"],
    description: "Soft cotton graphic t-shirt with bold print, perfect for street style.",
    rating: 4.1,
    reviews: 432
  },
  6: {
    id: 6,
    name: "Grey Zip Sweatshirt",
    price: 1299,
    originalPrice: 2599,
    category: "sweatshirt",
    colors: { "Grey": "#606060" },
    images: { "Grey": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" },
    sizes: ["S", "M", "L", "XL"],
    description: "Cozy fleece sweatshirt with full zip, ribbed cuffs, kangaroo pocket.",
    rating: 4.6,
    reviews: 745
  }
};

// ---------- CART MANAGEMENT ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = totalItems;
  });
}

function addToCart(productId, size, color) {
  const product = products[productId];
  if (!product) return false;

  const existing = cart.find(item => item.id === productId && item.size === size && item.color === color);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: size,
      color: color,
      quantity: 1,
      image: product.images[color] || Object.values(product.images)[0]
    });
  }
  saveCart();
  showToast("Item added to cart! 🛒");
  return true;
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  if (window.location.pathname.includes("cart.html")) renderCartPage();
}

function updateCartQuantity(index, delta) {
  const newQty = cart[index].quantity + delta;
  if (newQty < 1) return;
  cart[index].quantity = newQty;
  saveCart();
  if (window.location.pathname.includes("cart.html")) renderCartPage();
}

function renderCartPage() {
  const cartContainer = document.querySelector(".cart-items");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart" style="text-align:center;padding:40px;">Your cart is empty. <a href="index.html" style="color:#82a31a;">Shop now</a></div>`;
    const summary = document.querySelector(".order-summary");
    const checkoutBtn = document.querySelector(".btn-checkout");
    const couponBox = document.querySelector(".coupon-box");
    if (summary) summary.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    if (couponBox) couponBox.style.display = "none";
    return;
  }

  const summary = document.querySelector(".order-summary");
  const checkoutBtn = document.querySelector(".btn-checkout");
  const couponBox = document.querySelector(".coupon-box");
  if (summary) summary.style.display = "block";
  if (checkoutBtn) checkoutBtn.style.display = "block";
  if (couponBox) couponBox.style.display = "block";

  let html = "";
  cart.forEach((item, idx) => {
    html += `
      <div class="cart-item" data-index="${idx}">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
        </div>
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-meta">Color: ${item.color} &nbsp;|&nbsp; Size: ${item.size}</p>
          <div class="cart-item-price">
            <span class="cart-price-sale">₹${item.price}</span>
            <span class="cart-price-orig">₹${item.originalPrice}</span>
          </div>
          <div class="cart-qty-row">
            <div class="qty-control">
              <button onclick="updateCartQuantity(${idx}, -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="updateCartQuantity(${idx}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${idx})">Remove</button>
          </div>
        </div>
      </div>
    `;
  });
  cartContainer.innerHTML = html;
  updateCartSummary();
}

function updateCartSummary() {
  let mrpTotal = 0;
  let finalTotal = 0;
  cart.forEach(item => {
    mrpTotal += item.originalPrice * item.quantity;
    finalTotal += item.price * item.quantity;
  });
  const discount = mrpTotal - finalTotal;
  let couponDiscount = 0;
  if (window.appliedCoupon && window.appliedCoupon === "STYLE10") {
    couponDiscount = Math.round(finalTotal * 0.1);
  }
  const grandTotal = finalTotal - couponDiscount;

  const mrpEl = document.getElementById("mrpTotal");
  const discountEl = document.getElementById("discountAmt");
  const totalEl = document.getElementById("totalAmt");
  const savingsEl = document.getElementById("savingsLine");
  
  if (mrpEl) mrpEl.textContent = `₹${mrpTotal.toLocaleString()}`;
  if (discountEl) discountEl.textContent = `− ₹${discount.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `₹${grandTotal.toLocaleString()}`;
  if (savingsEl) savingsEl.textContent = `🎉 You are saving ₹${(discount + couponDiscount).toLocaleString()} on this order!`;
  
  if (couponDiscount > 0) {
    const couponRow = document.getElementById("couponRow");
    const couponDiscountEl = document.getElementById("couponDiscount");
    if (couponRow) couponRow.style.display = "flex";
    if (couponDiscountEl) couponDiscountEl.textContent = `− ₹${couponDiscount}`;
  } else {
    const couponRow = document.getElementById("couponRow");
    if (couponRow) couponRow.style.display = "none";
  }
}

// ---------- COUPON ----------
window.appliedCoupon = false;
function applyCoupon() {
  const input = document.getElementById("couponInput");
  const msg = document.getElementById("couponMsg");
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();

  if (code === "STYLE10") {
    window.appliedCoupon = "STYLE10";
    msg.textContent = "✅ Coupon applied! Extra 10% OFF";
    msg.className = "coupon-msg success";
    updateCartSummary();
  } else if (code === "") {
    msg.textContent = "Please enter a coupon code";
    msg.className = "coupon-msg error";
  } else {
    msg.textContent = "❌ Invalid coupon code. Try STYLE10";
    msg.className = "coupon-msg error";
  }
}

// ---------- CHECKOUT ----------
function placeOrder() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const pincode = document.getElementById("pincode");

  const fields = [firstName, lastName, email, phone, address, city, pincode];
  let valid = true;
  fields.forEach(f => {
    if (f && !f.value.trim()) {
      f.style.borderColor = "#e53e3e";
      valid = false;
    } else if (f) {
      f.style.borderColor = "";
    }
  });

  if (!valid) {
    alert("Please fill in all required fields.");
    return;
  }

  cart = [];
  saveCart();
  document.getElementById("successModal").style.display = "flex";
  document.getElementById("modalOverlay").style.display = "block";
}

function closeModal() {
  document.getElementById("successModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  window.location.href = "index.html";
}

function showTab(tab) {
  const cartView = document.getElementById("cartView");
  const checkoutView = document.getElementById("checkoutView");
  const tabCart = document.getElementById("tabCart");
  const tabCheckout = document.getElementById("tabCheckout");
  if (!cartView || !checkoutView) return;

  if (tab === "cart") {
    cartView.style.display = "";
    checkoutView.style.display = "none";
    if (tabCart) tabCart.classList.add("active");
    if (tabCheckout) tabCheckout.classList.remove("active");
    renderCartPage();
  } else {
    cartView.style.display = "none";
    checkoutView.style.display = "";
    if (tabCart) tabCart.classList.remove("active");
    if (tabCheckout) tabCheckout.classList.add("active");
    updateMiniSummary();
  }
}

function updateMiniSummary() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  const miniTotal = document.querySelector(".mini-total span:last-child");
  if (miniTotal) miniTotal.textContent = `₹${total}`;
  const subtotal = document.querySelector(".mini-row:first-child span:last-child");
  if (subtotal) subtotal.textContent = `₹${total}`;
}

function selectPayment(type) {
  const payOnline = document.getElementById("payOnline");
  const payCOD = document.getElementById("payCOD");
  const upiSection = document.getElementById("upiSection");

  if (payOnline) payOnline.classList.remove("active");
  if (payCOD) payCOD.classList.remove("active");

  if (type === "online") {
    if (payOnline) payOnline.classList.add("active");
    if (upiSection) upiSection.style.display = "";
  } else {
    if (payCOD) payCOD.classList.add("active");
    if (upiSection) upiSection.style.display = "none";
  }
}

// ---------- PRODUCT PAGE LOADER ----------
function loadProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id")) || 1;
  const product = products[productId];
  if (!product) return;

  document.title = `${product.name} - Sikarwar Group`;
  const brandTag = document.querySelector(".product-brand-tag");
  const title = document.querySelector(".product-title");
  const stars = document.querySelector(".rating-row .stars");
  const ratingCount = document.querySelector(".rating-count");
  const priceBig = document.querySelector(".price-big");
  const priceStruck = document.querySelector(".price-struck");
  const saveTag = document.querySelector(".save-tag");
  
  if (brandTag) brandTag.textContent = "Sikarwar Group Premium";
  if (title) title.textContent = product.name;
  if (stars) stars.innerHTML = "★".repeat(Math.floor(product.rating)) + "☆".repeat(5 - Math.floor(product.rating));
  if (ratingCount) ratingCount.textContent = `${product.rating} (${product.reviews} reviews)`;
  if (priceBig) priceBig.textContent = `₹${product.price}`;
  if (priceStruck) priceStruck.textContent = `₹${product.originalPrice}`;
  if (saveTag) saveTag.textContent = `Save ₹${product.originalPrice - product.price}`;

  const colorSwatches = document.querySelector(".color-swatches");
  if (colorSwatches) {
    colorSwatches.innerHTML = "";
    for (let [colorName, colorCode] of Object.entries(product.colors)) {
      const swatch = document.createElement("button");
      swatch.className = "swatch";
      swatch.style.background = colorCode;
      swatch.setAttribute("data-name", colorName);
      swatch.setAttribute("data-color", colorCode);
      swatch.onclick = () => selectColor(swatch, colorName, product.images[colorName]);
      colorSwatches.appendChild(swatch);
    }
  }

  const sizeContainer = document.getElementById("sizeButtons");
  if (sizeContainer) {
    sizeContainer.innerHTML = "";
    product.sizes.forEach(size => {
      const btn = document.createElement("button");
      btn.className = "size-btn";
      btn.textContent = size;
      btn.onclick = () => selectSize(btn, size);
      sizeContainer.appendChild(btn);
    });
  }

  const thumbList = document.getElementById("thumbList");
  if (thumbList) {
    thumbList.innerHTML = "";
    for (let [colorName, imgUrl] of Object.entries(product.images)) {
      const thumb = document.createElement("button");
      thumb.className = "thumb";
      thumb.innerHTML = `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" alt="${colorName}">`;
      thumb.onclick = () => {
        document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        const mainImg = document.getElementById("mainProductImg");
        if (mainImg) mainImg.src = imgUrl;
        const colorLabel = document.getElementById("colorLabel");
        if (colorLabel) colorLabel.textContent = colorName;
      };
      thumbList.appendChild(thumb);
    }
    if (thumbList.firstChild) thumbList.firstChild.classList.add("active");
  }
  
  const mainImg = document.getElementById("mainProductImg");
  if (mainImg) mainImg.src = Object.values(product.images)[0];
  const colorLabel = document.getElementById("colorLabel");
  if (colorLabel) colorLabel.textContent = Object.keys(product.colors)[0];
  
  const productIdInput = document.getElementById("productId");
  if (productIdInput) productIdInput.value = productId;

  const accBody = document.querySelector(".acc-body ul");
  if (accBody) accBody.innerHTML = product.description.split(",").map(p => `<li>${p.trim()}</li>`).join("");

  const stickyPrice = document.querySelector(".sticky-price span");
  const stickyDel = document.querySelector(".sticky-price del");
  if (stickyPrice) stickyPrice.textContent = `₹${product.price}`;
  if (stickyDel) stickyDel.textContent = `₹${product.originalPrice}`;
}

function selectColor(el, colorName, imageUrl) {
  document.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
  el.classList.add("active");
  const colorLabel = document.getElementById("colorLabel");
  if (colorLabel) colorLabel.textContent = colorName;
  const mainImg = document.getElementById("mainProductImg");
  if (mainImg) mainImg.src = imageUrl;
  document.querySelectorAll(".thumb").forEach((thumb, i) => {
    if (thumb.querySelector("img") && thumb.querySelector("img").src === imageUrl) {
      document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    }
  });
}

function selectSize(el, size) {
  document.querySelectorAll(".size-btn").forEach(s => s.classList.remove("active"));
  el.classList.add("active");
  const sizeLabel = document.getElementById("sizeLabel");
  if (sizeLabel) sizeLabel.textContent = size;
}

function addToCartFromProduct() {
  const productId = parseInt(document.getElementById("productId").value);
  const size = document.getElementById("sizeLabel").textContent;
  const color = document.getElementById("colorLabel").textContent;
  if (size === "Select Size") {
    alert("Please select a size!");
    return;
  }
  addToCart(productId, size, color);
}

// ---------- TOAST NOTIFICATION ----------
function showToast(message) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    background: #0a0a0a; color: white; padding: 12px 24px;
    border-radius: 50px; font-size: 14px; font-weight: 600;
    z-index: 999; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---------- SLIDESHOW ----------
const slides = document.querySelectorAll(".slide");
const dotBtns = document.querySelectorAll(".dot-btn");
let currentSlide = 0;
let slideInterval;

function goToSlide(n) {
  slides.forEach(s => s.classList.remove("active"));
  dotBtns.forEach(d => d.classList.remove("active"));
  currentSlide = (n + slides.length) % slides.length;
  if (slides[currentSlide]) slides[currentSlide].classList.add("active");
  if (dotBtns[currentSlide]) dotBtns[currentSlide].classList.add("active");
}

if (slides.length > 0) {
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);
  dotBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(btn.dataset.index));
      slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);
    });
  });
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  if (prevBtn) prevBtn.addEventListener("click", () => { clearInterval(slideInterval); goToSlide(currentSlide - 1); slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000); });
  if (nextBtn) nextBtn.addEventListener("click", () => { clearInterval(slideInterval); goToSlide(currentSlide + 1); slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000); });
}

// ---------- MENU DRAWER ----------
const menuToggle = document.getElementById("menuToggle");
const menuDrawer = document.getElementById("menuDrawer");
const drawerClose = document.getElementById("drawerClose");
const drawerOverlay = document.getElementById("drawerOverlay");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuDrawer.classList.add("open");
    drawerOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  });
}
if (drawerClose) {
  drawerClose.addEventListener("click", closeDrawer);
}
if (drawerOverlay) {
  drawerOverlay.addEventListener("click", closeDrawer);
}
function closeDrawer() {
  if (menuDrawer) menuDrawer.classList.remove("open");
  if (drawerOverlay) drawerOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

// ---------- CATEGORY PILLS ----------
document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    this.classList.add("active");
  });
});

// ---------- WISHLIST ----------
document.querySelectorAll(".wishlist-btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    this.textContent = this.textContent === "♡" ? "♥" : "♡";
    this.style.color = this.textContent === "♥" ? "#e53e3e" : "";
  });
});

// ---------- ACCORDION ----------
function toggleAcc(el) {
  const body = el.nextElementSibling;
  const isOpen = body.classList.contains("open");
  document.querySelectorAll(".acc-body").forEach(b => b.classList.remove("open"));
  document.querySelectorAll(".acc-header").forEach(h => h.classList.remove("open"));
  if (!isOpen) {
    body.classList.add("open");
    el.classList.add("open");
  }
}

// ---------- INITIALIZE ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (window.location.pathname.includes("cart.html")) {
    renderCartPage();
  }
  if (window.location.pathname.includes("product.html")) {
    loadProductPage();
  }
});

// Add animation style
const style = document.createElement('style');
style.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
document.head.appendChild(style);