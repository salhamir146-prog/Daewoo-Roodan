// ============================================
// MAIN JAVASCRIPT - Daewoo Roodan
// ============================================

// ============================================
// MOBILE MENU TOGGLE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    function startCountdown() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!daysEl) return;
        
        // Set target date (3 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(23, 59, 59, 0);
        
        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;
            
            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    startCountdown();
    
    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            if (input && input.value) {
                alert('✅ با موفقیت در خبرنامه عضویت یافتید!');
                input.value = '';
            }
        });
    }
    
    // ============================================
    // PRODUCT WISHLIST BUTTONS
    // ============================================
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            this.style.color = this.classList.contains('active') ? '#e74c3c' : '';
        });
    });
    
    // ============================================
    // ADD TO CART BUTTONS
    // ============================================
    document.querySelectorAll('.product-add-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const name = card ? card.querySelector('.product-name')?.textContent || 'محصول' : 'محصول';
            
            // Update cart count
            const cartCount = document.getElementById('cartCount');
            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                count++;
                cartCount.textContent = count;
            }
            
            // Show feedback
            const originalText = this.textContent;
            this.textContent = '✅ اضافه شد!';
            this.style.background = '#27ae60';
            this.style.color = 'white';
            this.style.borderColor = '#27ae60';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = 'transparent';
                this.style.color = '';
                this.style.borderColor = '';
            }, 2000);
        });
    });
    
    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // STICKY HEADER SHADOW
    // ============================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
            }
        });
    }
});

// ============================================
// LOAD PRODUCTS (Demo Data)
// ============================================
function loadProducts() {
    const products = [
        {
            id: 1,
            name: 'یخچال ساید بای ساید دوو رودان DR-700',
            price: 45000000,
            discountPrice: 38250000,
            badge: '🔥 تخفیف ویژه',
            image: 'images/products/refrigerator.jpg',
            rating: 4.5,
            reviews: 128
        },
        {
            id: 2,
            name: 'ماشین لباسشویی دوو رودان DW-10',
            price: 28000000,
            discountPrice: 23800000,
            badge: '🏆 پرفروش',
            image: 'images/products/washing-machine.jpg',
            rating: 4.7,
            reviews: 95
        },
        {
            id: 3,
            name: 'ماشین ظرفشویی دوو رودان DD-12',
            price: 32000000,
            discountPrice: null,
            badge: '✨ جدید',
            image: 'images/products/dishwasher.jpg',
            rating: 4.3,
            reviews: 67
        },
        {
            id: 4,
            name: 'تلویزیون ۵۵ اینچ دوو رودان DT-55',
            price: 35000000,
            discountPrice: 30000000,
            badge: '⭐ ویژه',
            image: 'images/products/tv.jpg',
            rating: 4.8,
            reviews: 203
        }
    ];
    
    // Feature products container
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        featuredContainer.innerHTML = products.map(p => createProductCard(p)).join('');
    }
    
    // Bestseller products container
    const bestsellerContainer = document.getElementById('bestsellerProducts');
    if (bestsellerContainer) {
        const bestsellers = products.slice(1, 3);
        bestsellerContainer.innerHTML = bestsellers.map(p => createProductCard(p)).join('');
    }
    
    // New products container
    const newContainer = document.getElementById('newProducts');
    if (newContainer) {
        const newProducts = products.slice(2, 4);
        newContainer.innerHTML = newProducts.map(p => createProductCard(p)).join('');
    }
}

function createProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="product-wishlist" aria-label="افزودن به علاقه‌مندی">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    ${product.discountPrice ? 
                        `<span class="price-old">${product.price.toLocaleString()} تومان</span>
                         <span class="price-new">${product.discountPrice.toLocaleString()} تومان</span>` :
                        `<span class="price-new">${product.price.toLocaleString()} تومان</span>`
                    }
                </div>
                <button class="product-add-btn">🛒 افزودن به سبد خرید</button>
            </div>
        </div>
    `;
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);
