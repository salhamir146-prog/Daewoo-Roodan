document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadProducts();
  updateCartBadge();
});

async function loadProducts() {
  const grid = document.getElementById("products-grid");
  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    if (!products || products.length === 0) {
      grid.innerHTML = `<p class="col-span-2 text-center text-gray-400 py-8 text-xs">محصولی ثبت نشده است.</p>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <div>
          <!-- تصویر با آیکون عکس و تگ اصلی -->
          <div class="product-img-wrapper">
            <img src="${p.image}" alt="${p.title}" class="object-cover w-full h-full">
            <span class="badge-ad">اصلی</span>
            <span class="badge-camera">
              <i data-lucide="camera" class="w-3 h-3"></i> 1
            </span>
          </div>

          <!-- عنوان محصول -->
          <h2 class="text-xs font-bold text-gray-800 line-clamp-2 mt-2 leading-5 h-10">
            ${p.title}
          </h2>
        </div>

        <div>
          <!-- قیمت -->
          <div class="text-left mt-2">
            <span class="text-xs text-gray-400 font-normal">از</span>
            <span class="text-sm font-black text-gray-900 mr-1">${Number(p.price).toLocaleString('fa-IR')}</span>
            <span class="text-[10px] text-gray-500">تومان</span>
          </div>

          <!-- گارانتی و اکشن‌ها -->
          <div class="flex items-center justify-between border-t border-gray-100 pt-2 mt-2 text-gray-400">
            <span class="text-[10px] text-gray-500 truncate max-w-[90px]">گارانتی دوو</span>
            <div class="flex items-center gap-1.5">
              <button class="hover:text-red-500 transition"><i data-lucide="heart" class="w-3.5 h-3.5"></i></button>
              <button onclick="addToCart('${p.id}')" class="hover:text-blue-600 transition"><i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  } catch (err) {
    grid.innerHTML = `<p class="col-span-2 text-center text-red-500 py-8 text-xs">خطا در بارگذاری اطلاعات</p>`;
  }
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("daewoo_cart") || "[]");
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  localStorage.setItem("daewoo_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("daewoo_cart") || "[]");
  const total = cart.reduce((a, b) => a + b.qty, 0);
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
