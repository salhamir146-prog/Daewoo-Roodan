let currentProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  fetchProducts();
  updateCartBadge();
});

// دریافت محصولات از بک‌اند Cloudflare Worker
async function fetchProducts() {
  const grid = document.getElementById("products-grid");
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    currentProducts = data;

    if (!data || data.length === 0) {
      grid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-12">هیچ محصولی یافت نشد.</p>`;
      return;
    }

    grid.innerHTML = data.map(product => `
      <div class="product-card bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-between group">
        <div>
          <div class="relative overflow-hidden rounded-xl mb-4 bg-gray-50 h-48 flex items-center justify-center cursor-pointer" onclick="openProductModal('${product.id}')">
            <img src="${product.image}" alt="${product.title}" class="object-cover w-full h-full group-hover:scale-105 transition duration-500">
            <span class="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">اصلی</span>
          </div>
          <h3 onclick="openProductModal('${product.id}')" class="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-blue-600 transition cursor-pointer mb-2">
            ${product.title}
          </h3>
          <p class="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">${product.description || ''}</p>
        </div>

        <div>
          <div class="flex items-center justify-between mb-4 border-t border-gray-50 pt-3">
            <span class="text-xs text-gray-400">قیمت:</span>
            <span class="text-base font-extrabold text-blue-600">
              ${Number(product.price).toLocaleString('fa-IR')} <span class="text-xs font-normal text-gray-500">تومان</span>
            </span>
          </div>

          <div class="flex gap-2">
            <button onclick="addToCart('${product.id}')" class="flex-1 bg-gray-900 hover:bg-blue-600 text-white text-xs font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
              <span>افزودن به سبد</span>
            </button>
            <button onclick="openProductModal('${product.id}')" class="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  } catch (err) {
    grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-12">خطا در دریافت لیست محصولات.</p>`;
  }
}

// نمایش پاپ‌آپ جزییات محصول دیجی‌کالایی
function openProductModal(id) {
  const product = currentProducts.find(p => p.id === id);
  if (!product) return;

  const modal = document.getElementById("product-modal");
  const modalContainer = document.getElementById("modal-card");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <div class="rounded-2xl overflow-hidden bg-gray-50 h-64 sm:h-80 flex items-center justify-center">
      <img src="${product.image}" alt="${product.title}" class="object-cover w-full h-full">
    </div>
    <div class="flex flex-col justify-between h-full">
      <div>
        <span class="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md mb-2">فروشگاه دوو رودان</span>
        <h2 class="text-lg font-bold text-gray-900 mb-3">${product.title}</h2>
        <p class="text-xs text-gray-500 leading-relaxed mb-6">${product.description || 'مشخصات اختصاصی محصول دوو با گارانتی معتبر شرکتی.'}</p>
      </div>
      <div>
        <div class="bg-gray-50 p-3 rounded-xl flex justify-between items-center mb-4">
          <span class="text-xs text-gray-500">قیمت نهایی:</span>
          <span class="text-lg font-black text-blue-600">${Number(product.price).toLocaleString('fa-IR')} تومان</span>
        </div>
        <button onclick="addToCart('${product.id}'); closeProductModal();" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          <span>افزودن مستقیم به سبد خرید</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("opacity-0", "pointer-events-none");
  modalContainer.classList.remove("scale-95");
  modalContainer.classList.add("scale-100");
  lucide.createIcons();
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  const modalContainer = document.getElementById("modal-card");

  modalContainer.classList.remove("scale-100");
  modalContainer.classList.add("scale-95");
  modal.classList.add("opacity-0", "pointer-events-none");
}

// مدیریت سبد خرید
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("daewoo_cart") || "[]");
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  localStorage.setItem("daewoo_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("daewoo_cart") || "[]");
  const total = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const badge = document.getElementById("cart-badge");

  if (badge) {
    if (total > 0) {
      badge.innerText = total.toLocaleString('fa-IR');
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }
}
