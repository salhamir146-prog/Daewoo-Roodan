// src/worker.js

const ADMIN_PHONE = "09981064505";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // تنظیمات CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json; charset=UTF-8"
    };

    // ===== سرو کردن فایل‌های استاتیک (HTML) =====
    if (method === "GET") {
      // اگر مسیر اصلی بود، index.html را نشان بده
      if (path === "/" || path === "/index.html") {
        const html = await env.ASSETS.fetch(request);
        return html;
      }
      
      // اگر مسیر admin بود، admin.html را نشان بده
      if (path === "/admin.html" || path === "/admin") {
        const html = await env.ASSETS.fetch(new Request("https://daewoo-roodan.salhamir146.workers.dev/admin.html", request));
        return html;
      }
      
      // سایر فایل‌های استاتیک
      if (path.startsWith("/images/") || path.startsWith("/css/") || path.startsWith("/js/")) {
        return await env.ASSETS.fetch(request);
      }
    }

    // ===== پاسخ به درخواست‌های OPTIONS =====
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ===== API ها =====
    try {
      // 1. دریافت لیست محصولات
      if (path === "/api/products" && method === "GET") {
        const productsRaw = await env.DAEWOO_STORE.get("products");
        const products = productsRaw ? JSON.parse(productsRaw) : getInitialProducts();
        return new Response(JSON.stringify(products), { headers: corsHeaders });
      }

      // 2. افزودن محصول جدید
      if (path === "/api/products" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (authHeader !== `Bearer ${ADMIN_PHONE}`) {
          return new Response(JSON.stringify({ error: "عدم دسترسی!" }), { status: 403, headers: corsHeaders });
        }

        const body = await request.json();
        const { title, price, description, image } = body;

        if (!title || !price || !image) {
          return new Response(JSON.stringify({ error: "نام، قیمت و تصویر محصول الزامی است." }), { status: 400, headers: corsHeaders });
        }

        const productsRaw = await env.DAEWOO_STORE.get("products");
        let products = productsRaw ? JSON.parse(productsRaw) : getInitialProducts();

        const newProduct = {
          id: "prod_" + Date.now(),
          title,
          price: Number(price),
          description: description || "",
          image,
          createdAt: new Date().toISOString()
        };

        products.unshift(newProduct);
        await env.DAEWOO_STORE.put("products", JSON.stringify(products));

        return new Response(JSON.stringify({ success: true, product: newProduct }), { headers: corsHeaders });
      }

      // 3. حذف محصول
      if (path.startsWith("/api/products/") && method === "DELETE") {
        const authHeader = request.headers.get("Authorization");
        if (authHeader !== `Bearer ${ADMIN_PHONE}`) {
          return new Response(JSON.stringify({ error: "عدم دسترسی!" }), { status: 403, headers: corsHeaders });
        }

        const productId = path.split("/").pop();
        const productsRaw = await env.DAEWOO_STORE.get("products");
        let products = productsRaw ? JSON.parse(productsRaw) : [];

        products = products.filter(p => p.id !== productId);
        await env.DAEWOO_STORE.put("products", JSON.stringify(products));

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 4. دریافت و بروزرسانی سوالات متداول
      if (path === "/api/faqs" && method === "GET") {
        const faqsRaw = await env.DAEWOO_STORE.get("faqs");
        const faqs = faqsRaw ? JSON.parse(faqsRaw) : getInitialFAQs();
        return new Response(JSON.stringify(faqs), { headers: corsHeaders });
      }

      if (path === "/api/faqs" && method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (authHeader !== `Bearer ${ADMIN_PHONE}`) {
          return new Response(JSON.stringify({ error: "عدم دسترسی!" }), { status: 403, headers: corsHeaders });
        }

        const faqsList = await request.json();
        await env.DAEWOO_STORE.put("faqs", JSON.stringify(faqsList));
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 5. ورود مدیر
      if (path === "/api/admin/login" && method === "POST") {
        const { phone } = await request.json();
        if (phone === ADMIN_PHONE) {
          return new Response(JSON.stringify({ 
            success: true, 
            token: ADMIN_PHONE,
            user: { name: "مدیر فروشگاه دوو رودان", phone: ADMIN_PHONE, role: "admin" } 
          }), { headers: corsHeaders });
        } else {
          return new Response(JSON.stringify({ success: false, error: "شماره تلفن وارد شده دسترسی ندارد" }), { status: 401, headers: corsHeaders });
        }
      }

      return new Response(JSON.stringify({ message: "API فروشگاه دوو رودان فعال است." }), { headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};

// داده‌های اولیه
function getInitialProducts() {
  return [
    {
      id: "prod_1",
      title: "یخچال و فریزر دوو مدل D4S-0029SS",
      price: 45000000,
      description: "یخچال ساید بای ساید دوو با موتور اینورتر دیجیتال، گرید انرژی +A و سیستم سرمایش هوشمند.",
      image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: "prod_2",
      title: "ماشین لباسشویی دوو ۸ کیلویی مدل DWK-8540",
      price: 24500000,
      description: "لباسشویی ۸ کیلویی دوو مجهز به موتور دایرکت درایو و ۱۴ برنامه شستشوی پیشرفته.",
      image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80",
      createdAt: new Date().toISOString()
    }
  ];
}

function getInitialFAQs() {
  return [
    { id: 1, question: "آیا محصولات دوو رودان دارای گارانتی رسمی هستند?", answer: "بله، تمامی محصولات فروشگاه دوو رودان با ضمانت‌نامه معتبر شرکتی عرضه می‌شوند." },
    { id: 2, question: "شرایط ارسال به سراسر کشور به چه صورت است?", answer: "ارسال در شهر رودان به صورت سریع و برای سایر شهرها از طریق باربری اختصاصی انجام می‌گیرد." }
  ];
}
