/**
 * Crystal & Healing Stone E-commerce Store
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('mobile-theme-toggle')];
  const body = document.body;

  // Check Local Storage for Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  themeToggles.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update local storage
        if (body.classList.contains('dark-mode')) {
          localStorage.setItem('theme', 'dark');
        } else {
          localStorage.setItem('theme', 'light');
        }
      });
    }
  });

  // --- RTL Toggle ---
  const rtlToggles = [document.getElementById('rtl-toggle'), document.getElementById('mobile-rtl-toggle')];
  const html = document.documentElement;

  // Check Local Storage for Direction
  const savedDir = localStorage.getItem('direction');
  if (savedDir === 'rtl') {
    html.setAttribute('dir', 'rtl');
  }

  rtlToggles.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
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
  });

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




// Cinematic Physics Engine & Sequence Controller
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('cinematic-overlay');
  const centralCrystal = document.getElementById('central-crystal');
  const shardsContainer = document.getElementById('shards-container');
  const h1 = document.getElementById('cinematic-h1');
  const heroSection = document.querySelector('.hero-home-1');
  
  if (!overlay || !centralCrystal) return;

  // Prevent scroll during cinematic
  
  
  // Configuration
  const SHARD_COUNT = 60;
  const CRYSTAL_WIDTH = 300;
  const CRYSTAL_HEIGHT = 400;
  const shards = [];

  // Generate random polygons for shards
  function generatePolygons(count) {
    const polys = [];
    for(let i=0; i<count; i++) {
      // Random triangle/quadrilateral coordinates
      const x1 = Math.random() * 100; const y1 = Math.random() * 100;
      const x2 = x1 + (Math.random() * 40 - 20); const y2 = y1 + (Math.random() * 40 - 20);
      const x3 = x1 + (Math.random() * 40 - 20); const y3 = y1 + (Math.random() * 40 - 20);
      polys.push(`polygon(${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%)`);
    }
    return polys;
  }

  // Execute shatter
  function shatterCrystal() {
    centralCrystal.classList.add('hidden');
    
    // Get viewport center
    const heroRect = heroSection.getBoundingClientRect();
    const centerX = heroRect.width / 2;
    const centerY = heroRect.height / 2;
    
    const polygons = generatePolygons(SHARD_COUNT);
    
    for(let i=0; i<SHARD_COUNT; i++) {
      const shard = document.createElement('div');
      shard.classList.add('crystal-shard');
      
      // Inherit dimensions of original crystal
      shard.style.width = `${CRYSTAL_WIDTH}px`;
      shard.style.height = `${CRYSTAL_HEIGHT}px`;
      
      // Position centrally
      shard.style.left = `${centerX - CRYSTAL_WIDTH/2}px`;
      shard.style.top = `${centerY - CRYSTAL_HEIGHT/2}px`;
      
      // Apply background and clip
      shard.style.backgroundSize = `${CRYSTAL_WIDTH}px ${CRYSTAL_HEIGHT}px`;
      shard.style.clipPath = polygons[i];
      
      // Random rotation and velocity
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 25 + 10; // explosive force
      
      // Physics properties attached to DOM element
      shard.physics = {
        x: 0,
        y: 0,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - 5, // slight upward bias
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 20,
        scale: Math.random() * 0.5 + 0.5,
        opacity: 1
      };
      
      shardsContainer.appendChild(shard);
      shards.push(shard);
    }
    
    // Start physics loop
    requestAnimationFrame(updatePhysics);
    
    // Trigger Reveal Transition after short delay
    setTimeout(revealHero, 200);
  }

  // Physics Loop
  function updatePhysics() {
    let active = false;
    
    shards.forEach(shard => {
      const p = shard.physics;
      
      // Apply friction/drag
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.vRot *= 0.96;
      
      // Apply gravity (very subtle, it's floating)
      p.vy += 0.1;
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      
      // Fade out slowly
      if (Math.abs(p.vx) < 0.5 && Math.abs(p.vy) < 0.5) {
        p.opacity -= 0.005;
      }
      
      // Apply transform
      shard.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${p.scale})`;
      shard.style.opacity = p.opacity;
      
      if (p.opacity > 0) active = true;
    });
    
    if (active) {
      requestAnimationFrame(updatePhysics);
    } else {
      // Clean up completely
      overlay.style.display = 'none';
       // Restore scrolling
      initParallax();
    }
  }

  // Reveal hero section
  function revealHero() {
    overlay.classList.add('fade-out');
    heroSection.classList.add('cinematic-active');
    
    // Trigger typography
    setTimeout(() => {
      h1.classList.remove('cinematic-hidden');
      h1.classList.add('cinematic-revealed');
    }, 200);
  }

  // Parallax interaction for surviving shards in hero section
  // Since overlay hides, we actually want to move surviving shards into the hero section
  function initParallax() {
    // Re-parent visible shards to hero wrapper to survive overlay destruction
    const heroWrapper = document.querySelector('.hero-bg-wrapper');
    shards.forEach(shard => {
      if (shard.physics.opacity > 0.1) {
        // adjust positioning relative to hero
        heroWrapper.appendChild(shard);
      }
    });
    
    window.addEventListener('mousemove', (e) => {
      const heroRect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - heroRect.left) / heroRect.width - 0.5) * 40;
      const y = ((e.clientY - heroRect.top) / heroRect.height - 0.5) * 40;
      
      shards.forEach((shard, index) => {
        const depth = (index % 5) + 1; // 1 to 5
        const p = shard.physics;
        shard.style.transform = `translate(${p.x + (x * depth)}px, ${p.y + (y * depth)}px) rotate(${p.rotation}deg) scale(${p.scale})`;
      });
      
      // also slightly shift hero bg
      const bgImg = document.querySelector('.hero-bg-img');
      if (bgImg) bgImg.style.transform = `translate(${-x/2}px, ${-y/2}px) scale(1.05)`;
    });
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shards.forEach((shard, index) => {
        const depth = ((index % 3) + 1) * 0.5;
        const p = shard.physics;
        shard.style.transform = `translate(${p.x}px, ${p.y - scrollY * depth}px) rotate(${p.rotation}deg) scale(${p.scale})`;
      });
    });
  }

  // Kickoff Sequence
  // Wait exactly 2.5s for CSS crystal forming animation to finish
  setTimeout(shatterCrystal, 400);
});
