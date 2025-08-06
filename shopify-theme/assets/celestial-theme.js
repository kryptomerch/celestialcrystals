/**
 * Celestial Crystals Theme - Advanced Features
 * NextGen Jewelry Shopify Theme
 */

class CelestialTheme {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupBackToTop();
    this.setupStarsAnimation();
    this.setupStickyHeader();
    this.setupQuickView();
    this.setupSlideOutCart();
    this.setupImageZoom();
    this.setupCountdownTimers();
    this.setupProductFilters();
    this.setupInfiniteScroll();
    this.setupAgeVerifier();
    this.setupStockCounter();
    this.setupTrustBadges();
    this.setupPromoPopups();
  }

  // Day/Night Mode Toggle
  setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (!toggle) return;

    // Check saved theme preference
    const savedTheme = localStorage.getItem('celestial-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    this.updateToggleIcon(savedTheme);

    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('celestial-theme', newTheme);
      this.updateToggleIcon(newTheme);
    });
  }

  updateToggleIcon(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    
    const icon = toggle.querySelector('.theme-toggle__icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Back to Top Button
  setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Animated Stars Background
  setupStarsAnimation() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    // Create 100 stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      starsContainer.appendChild(star);
    }
  }

  // Sticky Header
  setupStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('sticky');
        
        if (currentScrollY > lastScrollY) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('sticky', 'hidden');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // Quick View Modal
  setupQuickView() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quick-view-btn')) {
        e.preventDefault();
        const productHandle = e.target.dataset.productHandle;
        this.openQuickView(productHandle);
      }
    });
  }

  async openQuickView(productHandle) {
    try {
      const response = await fetch(`/products/${productHandle}.js`);
      const product = await response.json();
      this.renderQuickViewModal(product);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }

  renderQuickViewModal(product) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="quick-view-content">
        <button class="quick-view-close">&times;</button>
        <div class="quick-view-product">
          <div class="quick-view-images">
            <img src="${product.featured_image}" alt="${product.title}">
          </div>
          <div class="quick-view-details">
            <h2>${product.title}</h2>
            <p class="price">$${(product.price / 100).toFixed(2)}</p>
            <div class="description">${product.description}</div>
            <button class="btn btn-primary add-to-cart" data-variant-id="${product.variants[0].id}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.quick-view-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Slide-out Cart
  setupSlideOutCart() {
    const cartTriggers = document.querySelectorAll('[data-cart-trigger]');
    
    cartTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSlideOutCart();
      });
    });
  }

  openSlideOutCart() {
    const cartDrawer = document.createElement('div');
    cartDrawer.className = 'cart-drawer';
    cartDrawer.innerHTML = `
      <div class="cart-drawer-content">
        <div class="cart-drawer-header">
          <h3>Shopping Cart</h3>
          <button class="cart-drawer-close">&times;</button>
        </div>
        <div class="cart-drawer-items">
          <div class="loading">Loading cart...</div>
        </div>
        <div class="cart-drawer-footer">
          <div class="cart-total">
            <strong>Total: <span class="cart-total-price">$0.00</span></strong>
          </div>
          <button class="btn btn-primary checkout-btn">Checkout</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(cartDrawer);
    setTimeout(() => cartDrawer.classList.add('open'), 10);
    
    this.loadCartItems(cartDrawer);
    
    // Close events
    cartDrawer.querySelector('.cart-drawer-close').addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      setTimeout(() => cartDrawer.remove(), 300);
    });
  }

  async loadCartItems(cartDrawer) {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.renderCartItems(cartDrawer, cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  renderCartItems(cartDrawer, cart) {
    const itemsContainer = cartDrawer.querySelector('.cart-drawer-items');
    const totalContainer = cartDrawer.querySelector('.cart-total-price');
    
    if (cart.items.length === 0) {
      itemsContainer.innerHTML = '<p>Your cart is empty</p>';
      return;
    }
    
    itemsContainer.innerHTML = cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.featured_image.url}" alt="${item.product_title}">
        <div class="cart-item-details">
          <h4>${item.product_title}</h4>
          <p>Quantity: ${item.quantity}</p>
          <p>$${(item.line_price / 100).toFixed(2)}</p>
        </div>
      </div>
    `).join('');
    
    totalContainer.textContent = `$${(cart.total_price / 100).toFixed(2)}`;
  }

  // Image Zoom
  setupImageZoom() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(img => {
      img.addEventListener('mouseenter', () => {
        this.createZoomLens(img);
      });
      
      img.addEventListener('mouseleave', () => {
        this.removeZoomLens();
      });
    });
  }

  createZoomLens(img) {
    const lens = document.createElement('div');
    lens.className = 'zoom-lens';
    img.parentNode.appendChild(lens);
    
    const result = document.createElement('div');
    result.className = 'zoom-result';
    img.parentNode.appendChild(result);
    
    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;
    
    result.style.backgroundImage = `url('${img.src}')`;
    result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;
    
    img.addEventListener('mousemove', (e) => {
      this.moveLens(e, img, lens, result, cx, cy);
    });
  }

  moveLens(e, img, lens, result, cx, cy) {
    const pos = this.getCursorPos(e, img);
    let x = pos.x - (lens.offsetWidth / 2);
    let y = pos.y - (lens.offsetHeight / 2);
    
    if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
    if (x < 0) x = 0;
    if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;
    if (y < 0) y = 0;
    
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
  }

  getCursorPos(e, img) {
    const rect = img.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  removeZoomLens() {
    const lens = document.querySelector('.zoom-lens');
    const result = document.querySelector('.zoom-result');
    if (lens) lens.remove();
    if (result) result.remove();
  }

  // Countdown Timers
  setupCountdownTimers() {
    const countdowns = document.querySelectorAll('.countdown-timer');
    
    countdowns.forEach(countdown => {
      const endDate = new Date(countdown.dataset.endDate).getTime();
      
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
          clearInterval(timer);
          countdown.innerHTML = 'EXPIRED';
          return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    });
  }

  // Product Filters
  setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-item');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        products.forEach(product => {
          if (filter === 'all' || product.dataset.category === filter) {
            product.style.display = 'block';
          } else {
            product.style.display = 'none';
          }
        });
      });
    });
  }

  // Infinite Scroll
  setupInfiniteScroll() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    let page = 1;
    let loading = false;
    
    const loadMore = async () => {
      if (loading) return;
      loading = true;
      
      try {
        page++;
        const response = await fetch(`${window.location.pathname}?page=${page}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newProducts = doc.querySelectorAll('.product-item');
        
        const productGrid = document.querySelector('.product-grid');
        newProducts.forEach(product => {
          productGrid.appendChild(product);
        });
        
        if (newProducts.length === 0) {
          loadMoreBtn.style.display = 'none';
        }
      } catch (error) {
        console.error('Error loading more products:', error);
      } finally {
        loading = false;
      }
    };
    
    loadMoreBtn.addEventListener('click', loadMore);
    
    // Auto-load on scroll
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        loadMore();
      }
    });
  }

  // Age Verifier
  setupAgeVerifier() {
    const ageVerifier = localStorage.getItem('age-verified');
    if (ageVerifier) return;
    
    const modal = document.createElement('div');
    modal.className = 'age-verifier-modal';
    modal.innerHTML = `
      <div class="age-verifier-content">
        <h2>Age Verification</h2>
        <p>You must be 18 years or older to enter this site.</p>
        <div class="age-verifier-buttons">
          <button class="btn btn-primary" id="age-yes">I am 18 or older</button>
          <button class="btn btn-secondary" id="age-no">I am under 18</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('age-yes').addEventListener('click', () => {
      localStorage.setItem('age-verified', 'true');
      modal.remove();
    });
    
    document.getElementById('age-no').addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // Stock Counter
  setupStockCounter() {
    const stockCounters = document.querySelectorAll('.stock-counter');
    
    stockCounters.forEach(counter => {
      const stock = parseInt(counter.dataset.stock);
      const threshold = parseInt(counter.dataset.threshold) || 10;
      
      if (stock <= threshold) {
        counter.classList.add('low-stock');
        counter.innerHTML = `Only ${stock} left in stock!`;
      }
    });
  }

  // Trust Badges
  setupTrustBadges() {
    const trustBadges = document.querySelectorAll('.trust-badge');
    
    trustBadges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        badge.classList.add('pulse');
      });
      
      badge.addEventListener('mouseleave', () => {
        badge.classList.remove('pulse');
      });
    });
  }

  // Promo Popups
  setupPromoPopups() {
    const promoShown = sessionStorage.getItem('promo-shown');
    if (promoShown) return;
    
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'promo-popup';
      popup.innerHTML = `
        <div class="promo-popup-content">
          <button class="promo-popup-close">&times;</button>
          <h3>Special Offer!</h3>
          <p>Get 15% off your first order</p>
          <input type="email" placeholder="Enter your email" class="promo-email">
          <button class="btn btn-primary promo-submit">Get Discount</button>
        </div>
      `;
      
      document.body.appendChild(popup);
      sessionStorage.setItem('promo-shown', 'true');
      
      popup.querySelector('.promo-popup-close').addEventListener('click', () => {
        popup.remove();
      });
      
      popup.querySelector('.promo-submit').addEventListener('click', () => {
        const email = popup.querySelector('.promo-email').value;
        if (email) {
          // Handle email subscription
          popup.innerHTML = '<div class="promo-popup-content"><h3>Thank you!</h3><p>Check your email for the discount code.</p></div>';
          setTimeout(() => popup.remove(), 3000);
        }
      });
    }, 5000);
  }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CelestialTheme();
});

// Export for use in other scripts
window.CelestialTheme = CelestialTheme;
