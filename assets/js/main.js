/**
 * Crystal & Healing Stone E-commerce Store
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Check Local Storage for Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      
      // Update local storage
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // --- RTL Toggle ---
  const rtlToggleBtn = document.getElementById('rtl-toggle');
  const html = document.documentElement;

  // Check Local Storage for Direction
  const savedDir = localStorage.getItem('direction');
  if (savedDir === 'rtl') {
    html.setAttribute('dir', 'rtl');
  }

  if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', () => {
      const currentDir = html.getAttribute('dir');
      if (currentDir === 'rtl') {
        html.removeAttribute('dir');
        localStorage.setItem('direction', 'ltr');
      } else {
        html.setAttribute('dir', 'rtl');
        localStorage.setItem('direction', 'rtl');
      }
    });
  }

  // --- Mobile Menu Toggle ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const offcanvasMenu = document.getElementById('offcanvas-menu');
  const overlay = document.getElementById('menu-overlay');

  const openMenu = () => {
    if(offcanvasMenu) offcanvasMenu.classList.add('active');
    if(overlay) overlay.classList.add('active');
  };

  const closeMenu = () => {
    if(offcanvasMenu) offcanvasMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
  };

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // --- Scroll Animations (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    observer.observe(el);
  });

  // Set active state in navbar
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.menu-links a, .offcanvas-links a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // --- Back to Top Button Logic ---
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Shop Filter Mobile Drawer Logic
const filterBtn = document.getElementById('mobile-filter-btn');
const closeFilterBtn = document.getElementById('close-filter-btn');
const shopSidebar = document.getElementById('shop-sidebar');

if (filterBtn && shopSidebar && closeFilterBtn) {
  filterBtn.addEventListener('click', () => {
    shopSidebar.classList.add('active');
  });

  closeFilterBtn.addEventListener('click', () => {
    shopSidebar.classList.remove('active');
  });
}



// Simulated Sorting Logic for "Featured" dropdown
const sortSelects = document.querySelectorAll('.premium-select');
const shopGrid = document.querySelector('.premium-shop-grid');

if (sortSelects.length > 0 && shopGrid) {
  sortSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      // Fake loading animation for sorting
      shopGrid.style.opacity = '0.3';
      shopGrid.style.transition = 'opacity 0.4s ease';
      
      setTimeout(() => {
        // Reverse children to simulate sorting
        const cards = Array.from(shopGrid.children);
        cards.reverse().forEach(card => shopGrid.appendChild(card));
        
        // Restore opacity
        shopGrid.style.opacity = '1';
      }, 500);
    });
  });
}



// Gifting Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.accordion-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.parentElement;
      const content = item.querySelector('.accordion-content');
      
      // Close other open items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
      
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 40 + 'px'; // + padding
      } else {
        content.style.maxHeight = null;
      }
    });
  });
});



// Cart Quantity Selector Logic
document.addEventListener('DOMContentLoaded', () => {
  const cartSection = document.querySelector('.cart-items');
  if (cartSection) {
    cartSection.addEventListener('click', (e) => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;
      
      const qtyContainer = btn.closest('.quantity-selector');
      const qtyValueSpan = qtyContainer.querySelector('.qty-value');
      let currentValue = parseInt(qtyValueSpan.textContent);
      
      if (btn.querySelector('.ph-plus')) {
        currentValue++;
      } else if (btn.querySelector('.ph-minus')) {
        if (currentValue > 1) {
          currentValue--;
        }
      }
      
      qtyValueSpan.textContent = currentValue;
    });
  }
});


// Advanced Cart Quantity & Price Logic
document.addEventListener('DOMContentLoaded', () => {
  const cartSection = document.querySelector('.cart-items');
  if (cartSection) {
    
    function updateCartTotals() {
      const rows = document.querySelectorAll('.cart-item-row');
      let subtotal = 0;
      
      rows.forEach(row => {
        const unitPrice = parseFloat(row.getAttribute('data-unit-price'));
        const qty = parseInt(row.querySelector('.qty-value').textContent);
        const itemTotal = unitPrice * qty;
        
        row.querySelector('.item-total').textContent = '$' + itemTotal.toFixed(2);
        subtotal += itemTotal;
      });
      
      const subtotalEl = document.getElementById('cart-subtotal');
      const totalEl = document.getElementById('cart-total');
      
      if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
      if (totalEl) totalEl.textContent = '$' + subtotal.toFixed(2);
    }
    
    cartSection.addEventListener('click', (e) => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;
      
      const qtyContainer = btn.closest('.quantity-selector');
      const qtyValueSpan = qtyContainer.querySelector('.qty-value');
      let currentValue = parseInt(qtyValueSpan.textContent);
      
      if (btn.querySelector('.ph-plus')) {
        currentValue++;
      } else if (btn.querySelector('.ph-minus')) {
        if (currentValue > 1) {
          currentValue--;
        }
      }
      
      qtyValueSpan.textContent = currentValue;
      updateCartTotals();
    });
  }
});


// Password Visibility Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ph-eye');
        icon.classList.add('ph-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('ph-eye-slash');
        icon.classList.add('ph-eye');
      }
    });
  });
});

