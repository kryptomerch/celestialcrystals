/**
 * NextGen Jewelry Theme - Global JavaScript
 * Handles theme functionality and interactions
 */

// Theme namespace
window.NextGenTheme = window.NextGenTheme || {};

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  NextGenTheme.init();
});

NextGenTheme = {
  // Initialize all theme functionality
  init: function() {
    this.initStars();
    this.initProductModals();
    this.initWishlist();
    this.initNewsletterPopup();
    this.initSmoothScrolling();
    this.initLazyLoading();
    this.initCartFunctionality();
    this.initSearchFunctionality();
  },

  // Create animated stars background
  initStars: function() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const numberOfStars = window.innerWidth < 768 ? 50 : 100;
    
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (Math.random() * 2 + 2) + 's';
      starsContainer.appendChild(star);
    }
  },

  // Initialize product modal functionality
  initProductModals: function() {
    // Modal open/close functionality is handled in product-card.liquid
    // This handles global modal behaviors
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    // Close modals on background click
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  },

  // Initialize wishlist functionality
  initWishlist: function() {
    this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.updateWishlistUI();
  },

  // Add item to wishlist
  addToWishlist: function(productId) {
    if (!this.wishlist.includes(productId)) {
      this.wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
      this.updateWishlistUI();
      this.showNotification('Added to wishlist!', 'success');
    } else {
      this.showNotification('Already in wishlist!', 'info');
    }
  },

  // Remove item from wishlist
  removeFromWishlist: function(productId) {
    this.wishlist = this.wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistUI();
    this.showNotification('Removed from wishlist!', 'success');
  },

  // Update wishlist UI elements
  updateWishlistUI: function() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
      wishlistCount.textContent = this.wishlist.length;
      wishlistCount.style.display = this.wishlist.length > 0 ? 'block' : 'none';
    }

    // Update wishlist buttons
    document.querySelectorAll('[data-product-id]').forEach(element => {
      const productId = element.dataset.productId;
      const isInWishlist = this.wishlist.includes(productId);
      const wishlistBtn = element.querySelector('.wishlist-btn');
      
      if (wishlistBtn) {
        wishlistBtn.classList.toggle('active', isInWishlist);
        wishlistBtn.innerHTML = isInWishlist ? '♥' : '♡';
      }
    });
  },

  // Initialize newsletter popup
  initNewsletterPopup: function() {
    const popup = document.querySelector('.newsletter-popup');
    if (!popup) return;

    const delay = parseInt(popup.dataset.delay || '15') * 1000;
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');

    if (!hasSeenPopup) {
      setTimeout(() => {
        popup.classList.add('active');
      }, delay);
    }

    // Close popup functionality
    popup.addEventListener('click', function(e) {
      if (e.target === popup || e.target.classList.contains('popup-close')) {
        popup.classList.remove('active');
        localStorage.setItem('newsletter-popup-seen', 'true');
      }
    });
  },

  // Initialize smooth scrolling for anchor links
  initSmoothScrolling: function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  },

  // Initialize lazy loading for images
  initLazyLoading: function() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  },

  // Initialize cart functionality
  initCartFunctionality: function() {
    // Add to cart form handling
    document.addEventListener('submit', function(e) {
      if (e.target.matches('[data-type="add-to-cart-form"]')) {
        e.preventDefault();
        NextGenTheme.addToCart(e.target);
      }
    });

    // Cart drawer functionality
    this.initCartDrawer();
  },

  // Add product to cart
  addToCart: function(form) {
    const formData = new FormData(form);
    const button = form.querySelector('[type="submit"]');
    const originalText = button.textContent;

    // Show loading state
    button.textContent = 'Adding...';
    button.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      this.updateCartCount();
      this.showNotification('Added to cart!', 'success');
      
      // Show cart drawer if available
      const cartDrawer = document.querySelector('.cart-drawer');
      if (cartDrawer) {
        this.openCartDrawer();
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      this.showNotification('Error adding to cart', 'error');
    })
    .finally(() => {
      button.textContent = originalText;
      button.disabled = false;
    });
  },

  // Initialize cart drawer
  initCartDrawer: function() {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (!cartDrawer) return;

    // Close drawer functionality
    cartDrawer.addEventListener('click', function(e) {
      if (e.target === cartDrawer || e.target.classList.contains('cart-drawer-close')) {
        NextGenTheme.closeCartDrawer();
      }
    });
  },

  // Open cart drawer
  openCartDrawer: function() {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.updateCartDrawer();
    }
  },

  // Close cart drawer
  closeCartDrawer: function() {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Update cart drawer content
  updateCartDrawer: function() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartContent = document.querySelector('.cart-drawer-content');
        if (cartContent) {
          // Update cart content (implementation depends on cart drawer structure)
          this.renderCartItems(cart);
        }
      });
  },

  // Update cart count in header
  updateCartCount: function() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
          cartCount.textContent = cart.item_count;
          cartCount.style.display = cart.item_count > 0 ? 'block' : 'none';
        }
      });
  },

  // Initialize search functionality
  initSearchFunctionality: function() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput || !searchResults) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();

      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(() => {
        NextGenTheme.performSearch(query);
      }, 300);
    });

    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-container')) {
        searchResults.style.display = 'none';
      }
    });
  },

  // Perform search and show results
  performSearch: function(query) {
    const searchResults = document.querySelector('.search-results');
    
    fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`)
      .then(response => response.json())
      .then(data => {
        this.renderSearchResults(data.resources.results.products);
        searchResults.style.display = 'block';
      })
      .catch(error => {
        console.error('Search error:', error);
      });
  },

  // Render search results
  renderSearchResults: function(products) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (products.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No products found</div>';
      return;
    }

    const resultsHTML = products.map(product => `
      <a href="${product.url}" class="search-result-item">
        <img src="${product.featured_image}" alt="${product.title}" width="50" height="50">
        <div class="search-result-info">
          <div class="search-result-title">${product.title}</div>
          <div class="search-result-price">${this.formatMoney(product.price)}</div>
        </div>
      </a>
    `).join('');

    searchResults.innerHTML = resultsHTML;
  },

  // Show notification message
  showNotification: function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('active'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Format money using Shopify's money format
  formatMoney: function(cents) {
    const money = (cents / 100).toFixed(2);
    return `$${money}`;
  },

  // Utility function to debounce function calls
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Global functions for template use
window.openProductModal = function(productId) {
  const modal = document.getElementById(`product-modal-${productId}`);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeProductModal = function(productId) {
  const modal = document.getElementById(`product-modal-${productId}`);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.addToWishlist = function(productId) {
  NextGenTheme.addToWishlist(productId);
};

window.openCart = function() {
  NextGenTheme.openCartDrawer();
};
