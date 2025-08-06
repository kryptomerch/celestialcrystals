/* Maya Magic Theme JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize Maya Magic Theme
  initMayaMagic();
  
  function initMayaMagic() {
    // Filter functionality
    initProductFilter();
    
    // Search functionality
    initSearch();
    
    // Cart functionality
    initCart();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Header scroll effects
    initHeaderEffects();
  }
  
  // Product Filter Functionality
  function initProductFilter() {
    const filterBtns = document.querySelectorAll('.maya-filter-btn');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filter = this.dataset.filter || this.textContent.toLowerCase();
        
        // Filter products (you would implement actual filtering here)
        filterProducts(filter);
        
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
  }
  
  // Filter products function
  function filterProducts(filter) {
    console.log('Filtering products by:', filter);
    
    // Here you would implement actual product filtering
    // For now, we'll just log the filter
    
    // Example: Hide/show products based on filter
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
      if (filter === 'all' || product.dataset.category === filter) {
        product.style.display = 'block';
        product.style.opacity = '0';
        setTimeout(() => {
          product.style.opacity = '1';
        }, 100);
      } else {
        product.style.opacity = '0';
        setTimeout(() => {
          product.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // Search functionality
  function initSearch() {
    const searchInput = document.querySelector('.maya-search-input');
    
    if (searchInput) {
      searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });
      
      searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
      });
      
      searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        // Implement search functionality here
        console.log('Searching for:', query);
      });
    }
  }
  
  // Cart functionality
  function initCart() {
    const cartBtn = document.querySelector('.maya-cart');
    
    if (cartBtn) {
      cartBtn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // Open cart (implement your cart logic here)
        console.log('Opening cart...');
      });
    }
  }
  
  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // Header scroll effects
  function initHeaderEffects() {
    const header = document.querySelector('.maya-header');
    let lastScrollY = window.scrollY;
    
    if (header) {
      window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
      });
    }
  }
  
  // Add scrolled class styles
  const style = document.createElement('style');
  style.textContent = `
    .maya-header.scrolled {
      background: rgba(10, 10, 10, 0.98);
      backdrop-filter: blur(30px);
      border-bottom-color: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(style);
  
  // Add some interactive star effects
  function createInteractiveStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'interactive-stars';
    starsContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `;
    
    // Create random stars
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: white;
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.8 + 0.2};
        animation: twinkle ${Math.random() * 4 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
  }
  
  // Initialize interactive stars
  createInteractiveStars();
  
  // Add twinkle animation
  const twinkleStyle = document.createElement('style');
  twinkleStyle.textContent = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
  `;
  document.head.appendChild(twinkleStyle);
  
});

// Utility functions
function debounce(func, wait) {
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

// Export for use in other scripts
window.MayaMagic = {
  filterProducts: function(filter) {
    // Public API for filtering products
    console.log('Public API: Filtering by', filter);
  }
};
