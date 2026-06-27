
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
