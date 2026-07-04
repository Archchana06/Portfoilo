// script.js - Creative 3D Interactive Scripting for Archchana Vijayanathan Portfolio

// ========================
// 1. DYNAMIC PRELOADER
// ========================
const preloader = document.querySelector('.preloader') || (() => {
  const pl = document.createElement('div');
  pl.className = 'preloader';
  pl.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: #050508; z-index: 999999;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 60px; height: 60px;
    border: 1px solid rgba(255,255,255,0.08);
    border-top: 2px solid #7a22ff;
    border-radius: 50%;
    animation: preloader-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes preloader-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  pl.appendChild(spinner);
  document.body.appendChild(pl);
  return pl;
})();

function hidePreloader() {
  setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 800);
    }
  }, 450);
}

if (document.readyState === 'complete') {
  hidePreloader();
} else {
  window.addEventListener('load', hidePreloader);
}

// ========================
// 2. LENIS SMOOTH SCROLLING (Safe Initialization)
// ========================
let lenis;
if (typeof Lenis !== 'undefined') {
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      normalizeWheel: true,
      wheelMultiplier: 1.0
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (e) {
    console.warn("Lenis smooth scroll failed to initialize:", e);
  }
} else {
  console.log("Lenis library not detected. Running native scroll.");
}

// ========================
// 3. CUSTOM ELASTIC JELLY CURSOR & AMBIENT SPOTLIGHT
// ========================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorGlow = document.querySelector('.cursor-glow');
const cursorText = document.querySelector('.cursor-text');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let dotX = mouseX;
let dotY = mouseY;
let outlineX = mouseX;
let outlineY = mouseY;
let glowX = mouseX;
let glowY = mouseY;

let lastX = mouseX;
let lastY = mouseY;
let speedX = 0;
let speedY = 0;
let speed = 0;
let angle = 0;

// Three.js 3D background scale / color variables
let target3dScale = 1.0;
let targetColor = { r: 122, g: 34, b: 255 }; // Violet

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Spawn Click Ripples
window.addEventListener('mousedown', () => {
  const ripple = document.createElement('div');
  ripple.className = 'cursor-ripple';
  ripple.style.left = `${mouseX}px`;
  ripple.style.top = `${mouseY}px`;
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
});

function animateCursor() {
  // Speed-based Jelly stretching math
  speedX = mouseX - lastX;
  speedY = mouseY - lastY;
  
  lastX = mouseX;
  lastY = mouseY;
  
  speed = Math.sqrt(speedX * speedX + speedY * speedY);
  angle = Math.atan2(speedY, speedX);
  
  // Interpolation for smoother, faster lag feel
  dotX += (mouseX - dotX) * 0.6; // increased from 0.35 for quicker dot response
  dotY += (mouseY - dotY) * 0.6;
  if (cursorDot) {
    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
  }

  outlineX += (mouseX - outlineX) * 0.25; // increased from 0.12 for quicker outline response
  outlineY += (mouseY - outlineY) * 0.25;
  
  if (cursorOutline) {
    // Squish values: stretch proportional to speed, squeeze inversely
    const stretch = 1 + Math.min(speed * 0.02, 0.4);
    const squeeze = 1 - Math.min(speed * 0.012, 0.25);
    
    // Check if snapped/active: don't stretch text capsules or spotlight lens
    if (cursorOutline.classList.contains('cursor-hover-active') || cursorOutline.classList.contains('cursor-hover-name-spotlight')) {
      cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%) rotate(0rad) scale(1, 1)`;
    } else {
      cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squeeze})`;
    }
  }

  // Smoothly sync the text reveal spotlight center coordinate with the custom cursor outline
  if (spotlightName && cursorOutline && cursorOutline.classList.contains('cursor-hover-name-spotlight')) {
    const rect = spotlightName.getBoundingClientRect();
    const x = outlineX - rect.left;
    const y = outlineY - rect.top;
    
    spotlightName.style.setProperty('--spotlight-x', `${x}px`);
    spotlightName.style.setProperty('--spotlight-y', `${y}px`);
  }

  glowX += (mouseX - glowX) * 0.05;
  glowY += (mouseY - glowY) * 0.05;
  if (cursorGlow) {
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
  }

  requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// Setup Snapping Cursor Hover Configurations
function bindCursorHover(elements, activeClass, textLabel = '', scaleAmt = 1.0, isPink = false) {
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorOutline) {
        cursorOutline.classList.add(activeClass);
        if (textLabel && cursorText) {
          cursorText.textContent = textLabel;
        }
      }
      if (cursorDot) {
        cursorDot.style.opacity = '0';
      }
      
      // Update Three.js 3D backdrop crystal variables
      target3dScale = scaleAmt;
      if (isPink) {
        targetColor = { r: 255, g: 42, b: 133 };
      }
    });
    
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) {
        cursorOutline.classList.remove(activeClass);
        if (cursorText) {
          cursorText.textContent = '';
        }
      }
      if (cursorDot) {
        cursorDot.style.opacity = '1';
      }
      
      // Reset Three.js variables
      target3dScale = 1.0;
      targetColor = { r: 122, g: 34, b: 255 };
    });
  });
}

// Bind custom hover templates across elements
const navLinksSelectors = document.querySelectorAll('a, button, .menu-btn, .skills-tab, .btn');
bindCursorHover(navLinksSelectors, 'cursor-hover-link', '', 1.25, true);

const projectCardsSelectors = document.querySelectorAll('.project-card');
bindCursorHover(projectCardsSelectors, 'cursor-hover-active', 'VIEW', 1.45, true);

const achievementCardsSelectors = document.querySelectorAll('.achievement-card');
bindCursorHover(achievementCardsSelectors, 'cursor-hover-active', 'DETAIL', 1.4, true);

const certCardsSelectors = document.querySelectorAll('.cert-card');
bindCursorHover(certCardsSelectors, 'cursor-hover-active', 'ZOOM', 1.35, true);

const nameSelectors = document.querySelectorAll('#hero-spotlight-name');
bindCursorHover(nameSelectors, 'cursor-hover-name-spotlight', '', 1.35, true);

// ========================
// 4. THREE.JS 3D BACKGROUND (WebGL Crystal & Particle Waves)
// ========================
const canvas = document.getElementById('canvas-bg');
if (canvas && typeof THREE !== 'undefined') {
  try {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Morphing Icosahedron Crystal Wireframe
    const crystalGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0x7a22ff,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    scene.add(crystalMesh);

    // 2. Outer Node Particles
    const nodeGeo = new THREE.IcosahedronGeometry(2.25, 1);
    const nodeMat = new THREE.PointsMaterial({
      color: 0xff2a85,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // 3. Floating Background Starfield Particles
    const starCount = 400;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 16;     // X
      starPositions[i+1] = (Math.random() - 0.5) * 12;   // Y
      starPositions[i+2] = (Math.random() - 0.5) * 10;   // Z
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.25
    });
    
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Mouse Tracking values (ease factors)
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.0015;
      targetY = (e.clientY - window.innerHeight / 2) * 0.0015;
    });

    let activeColor = new THREE.Color(0x7a22ff);
    let scaleVal = 1.0;

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
    });

    function render3D() {
      requestAnimationFrame(render3D);

      // Damp scroll velocity
      scrollVelocity *= 0.94;

      // Rotate objects (accelerate slightly on scroll velocity)
      crystalMesh.rotation.y += 0.002 + (scrollVelocity * 0.0015);
      crystalMesh.rotation.x += 0.001;
      nodePoints.rotation.y += 0.002 + (scrollVelocity * 0.0015);
      nodePoints.rotation.x += 0.001;
      
      // Starfield warp: rotate stars faster and drift closer in Z
      starPoints.rotation.y -= 0.0003 + (scrollVelocity * 0.0006);
      starPoints.position.z = Math.min(2.8, scrollVelocity * 0.045);
      
      // Easing mouse rotation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      crystalMesh.rotation.y += currentX * 0.1;
      crystalMesh.rotation.x += currentY * 0.1;
      nodePoints.rotation.y += currentX * 0.1;
      nodePoints.rotation.x += currentY * 0.1;

      // Smooth color interpolation
      const hexTarget = (targetColor.r << 16) + (targetColor.g << 8) + targetColor.b;
      activeColor.lerp(new THREE.Color(hexTarget), 0.08);
      crystalMat.color.copy(activeColor);

      // Smooth scale interpolation
      scaleVal += (target3dScale - scaleVal) * 0.1;
      crystalMesh.scale.set(scaleVal, scaleVal, scaleVal);
      nodePoints.scale.set(scaleVal, scaleVal, scaleVal);

      // Subtle camera parallax
      camera.position.x += (targetX * 2.5 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 2.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    render3D();

    // Responsive sizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  } catch (err) {
    console.error("Three.js setup error:", err);
  }
}

// ========================
// 4b. CSS 3D PHOTO CARD PARALLAX (Offline & Local Safe)
// ========================
const photoCard = document.querySelector('.photo-3d-card');
const heroVisual = document.querySelector('.hero-visual');

if (photoCard && heroVisual) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    // Normalize mouse coordinates inside the hero visual container
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Scale rotation bounds (max 18 degrees rotation)
    targetX = Math.max(-1, Math.min(1, x)) * 18;
    targetY = Math.max(-1, Math.min(1, y)) * 18;
  });

  // Hover effect to scale and translate the card layers in 3D depth pop!
  heroVisual.addEventListener('mouseenter', () => {
    const img = photoCard.querySelector('.photo-3d-img');
    const glare = photoCard.querySelector('.photo-3d-glare');
    if (img) {
      img.style.transform = 'translateZ(30px) scale(1.05)';
      img.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
    if (glare) {
      glare.style.transform = 'translateZ(35px) translate(-10%, -10%)';
    }
  });

  // Reset layer positions on mouseleave
  heroVisual.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    const img = photoCard.querySelector('.photo-3d-img');
    const glare = photoCard.querySelector('.photo-3d-glare');
    if (img) {
      img.style.transform = 'translateZ(15px) scale(1)';
      img.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
    if (glare) {
      glare.style.transform = 'translateZ(20px) translate(-25%, -25%)';
    }
  });

  function updatePhoto3D() {
    requestAnimationFrame(updatePhoto3D);
    
    // Ease rotation transitions
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    
    // Set 3D rotation matrix
    photoCard.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
  }
  updatePhoto3D();
}

// ========================
// 5. 3D INTERACTIVE TILT EFFECT
// ========================
const tiltCards = document.querySelectorAll('.project-card, .service-card, .achievement-card, .about-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

// ========================
// 6. GSAP HERO REVEALS
// ========================
if (typeof gsap !== 'undefined') {
  try {
    gsap.to('.hero-title .title-line', {
      translateY: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 0.5
    });

    gsap.to('.hero-title .title-line-2', {
      translateY: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.7
    });

    gsap.to('.hero-tagline', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.9
    });

    gsap.to('.hero-buttons', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 1.1
    });

    gsap.to('.scroll-indicator', {
      opacity: 1,
      duration: 0.8,
      delay: 1.3
    });
  } catch (e) {
    console.warn("GSAP Hero reveals failed:", e);
  }
}

// ========================
// 7. NATIVE SCROLL REVEALS (Offline Safe & Extremely Robust)
// ========================
const revealSections = document.querySelectorAll('section');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;
        
        const titleText = sec.querySelector('.title-text');
        const lineDec = sec.querySelector('.title-line-decoration');
        if (titleText) {
          titleText.style.opacity = '1';
          titleText.style.transform = 'translateY(0)';
        }
        if (lineDec) {
          lineDec.style.width = '100px';
        }
        
        const cards = sec.querySelectorAll('.project-card, .service-card, .cert-card, .achievement-card, .skill-category, .timeline-content');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 80);
        });
        
        revealObserver.unobserve(sec);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealSections.forEach(sec => {
    const titleText = sec.querySelector('.title-text');
    const lineDec = sec.querySelector('.title-line-decoration');
    if (titleText) {
      titleText.style.opacity = '0';
      titleText.style.transform = 'translateY(30px)';
      titleText.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    if (lineDec) {
      lineDec.style.width = '0';
      lineDec.style.transition = 'width 0.5s ease 0.3s';
    }
    
    const cards = sec.querySelectorAll('.project-card, .service-card, .cert-card, .achievement-card, .skill-category, .timeline-content');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    revealObserver.observe(sec);
  });
}

// ========================
// 8. TOAST NOTIFICATION SYSTEM
// ========================
function showToast(message, color = '#7a22ff') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #0c0c12;
    color: #ffffff;
    padding: 14px 28px;
    border-radius: 0;
    border-left: 2px solid ${color};
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    animation: toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    font-family: var(--font-body);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

const toastStyleSheet = document.createElement('style');
toastStyleSheet.textContent = `
  @keyframes toastIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes toastOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }
`;
document.head.appendChild(toastStyleSheet);

// ========================
// 9. COPY EMAIL FUNCTIONALITY
// ========================
const emailSpan = document.querySelector('.contact-item:first-child span');
if (emailSpan) {
  emailSpan.addEventListener('click', async () => {
    const email = emailSpan.textContent;
    try {
      await navigator.clipboard.writeText(email);
      showToast('📧 Email copied to clipboard!', '#ff2a85');
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('📧 Email copied!', '#ff2a85');
    }
  });
}

// ========================
// 10. NAVBAR MOBILE TOGGLE
// ========================
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });
  
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });
}

// ========================
// 11. HIGHLIGHT ACTIVE NAV LINK & ATMOSPHERIC SCROLL COLOR-SHIFT
// ========================
const sectionsElements = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

const sectionBgColors = {
  home: '#050508',       // Matte Black
  about: '#07060e',      // Midnight Indigo
  skills: '#0b0816',     // Deep Violet
  experience: '#06050b',  // Soft Charcoal
  projects: '#0d0716',    // Dark Orchid
  services: '#06050a',    // Deep Charcoal
  contact: '#050508'     // Matte Black
};

window.addEventListener('scroll', () => {
  let currentActive = "";
  const scrollPos = window.scrollY + 200;

  sectionsElements.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      currentActive = sec.id;
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentActive}`) {
      item.classList.add('active');
    }
  });

  // Apply smooth background color change
  if (currentActive && sectionBgColors[currentActive]) {
    document.body.style.backgroundColor = sectionBgColors[currentActive];
  }
});

// ========================
// 12. CERTIFICATE MODAL
// ========================
const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalCaption = document.querySelector('.cert-modal-caption');
const certModalClose = document.querySelector('.cert-modal-close');

function openCertModal(imageSrc, title) {
  if (!certModal || !certModalImage) return;
  certModalImage.src = imageSrc;
  if (certModalCaption) certModalCaption.textContent = title;
  
  certModal.style.display = 'flex';
  if (lenis) lenis.stop();
  
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(certModal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.cert-modal-content img', { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'back.out(1.2)' });
  } else {
    certModal.style.opacity = '1';
  }
}

function closeCertModal() {
  if (!certModal) return;
  if (typeof gsap !== 'undefined') {
    gsap.to(certModal, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        certModal.style.display = 'none';
        if (lenis) lenis.start();
      }
    });
  } else {
    certModal.style.display = 'none';
    if (lenis) lenis.start();
  }
}

document.querySelectorAll('.cert-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.cert-card');
    const title = card ? card.querySelector('.cert-info span').textContent : 'Certificate';
    
    let imgPath = btn.getAttribute('data-cert');
    if (!imgPath) {
      const certName = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      imgPath = `certificates/${certName}.jpg`;
    }
    openCertModal(imgPath, title);
  });
});

if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCertModal();
});

// ========================
// 13. INTERACTIVE MOLECULAR PHYSICS SKILLS ENGINE
// ========================
const skillsData = {
  design: [
    { name: 'UI Designing', icon: 'fa-paintbrush' },
    { name: 'Wireframing', icon: 'fa-pencil' },
    { name: 'Prototyping', icon: 'fa-wand-magic-sparkles' },
    { name: 'UX Research', icon: 'fa-magnifying-glass' },
    { name: 'Design Systems', icon: 'fa-cubes' },
    { name: 'Usability Testing', icon: 'fa-user-check' },
    { name: 'Creativity', icon: 'fa-lightbulb' }
  ],
  tools: [
    { name: 'Figma', icon: 'fa-figma' },
    { name: 'Adobe Illustrator', icon: 'fa-pen-nib' },
    { name: 'Photoshop', icon: 'fa-image' },
    { name: 'Canva', icon: 'fa-compass-drafting' },
    { name: 'Adobe XD', icon: 'fa-object-group' },
    { name: 'Sketch', icon: 'fa-gem' },
    { name: 'Blender', icon: 'fa-cube' }
  ],
  dev: [
    { name: 'React', icon: 'fa-react' },
    { name: 'Flutter', icon: 'fa-feather' },
    { name: 'Android Studio', icon: 'fa-android' },
    { name: 'HTML, CSS, JS', icon: 'fa-code' },
    { name: 'Supabase', icon: 'fa-database' }
  ],
  soft: [
    { name: 'Leadership', icon: 'fa-user-tie' },
    { name: 'Communication', icon: 'fa-comments' },
    { name: 'Problem Solving', icon: 'fa-puzzle-piece' },
    { name: 'Multitasking', icon: 'fa-sliders' },
    { name: 'Team Collaboration', icon: 'fa-handshake' },
    { name: 'Adaptability', icon: 'fa-arrows-spin' },
    { name: 'Critical Thinking', icon: 'fa-brain' }
  ]
};

const floatingContainer = document.getElementById('skills-floating-container');
const skillsTabs = document.querySelectorAll('.skills-tab');
const skillsViewport = document.querySelector('.skills-viewport');

if (floatingContainer && skillsViewport) {
  let activeNodes = [];
  let mousePosition = { x: -1000, y: -1000 };
  let isMouseInside = false;

  // Track cursor position inside viewport
  skillsViewport.addEventListener('mousemove', (e) => {
    const rect = skillsViewport.getBoundingClientRect();
    mousePosition.x = e.clientX - rect.left;
    mousePosition.y = e.clientY - rect.top;
    isMouseInside = true;
  });

  skillsViewport.addEventListener('mouseleave', () => {
    isMouseInside = false;
    mousePosition.x = -1000;
    mousePosition.y = -1000;
  });

  // Physics loop constants
  const drag = 0.98;
  const floatSpeed = 0.15;
  const repulsionDist = 120;
  const repulsionForce = 0.5;
  const collisionDistPadding = 25;

  function spawnSkills(category) {
    floatingContainer.innerHTML = '';
    activeNodes = [];

    const data = skillsData[category] || [];
    const rect = skillsViewport.getBoundingClientRect();
    const vw = rect.width;
    const vh = rect.height;

    data.forEach((skill) => {
      const node = document.createElement('div');
      node.className = 'skill-node';
      node.innerHTML = `<i class="fa ${skill.icon}"></i> <span>${skill.name}</span>`;
      
      // Place node randomly in the middle area
      const x = vw / 4 + Math.random() * (vw / 2);
      const y = vh / 4 + Math.random() * (vh / 2);
      
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      floatingContainer.appendChild(node);

      // Get dimensions after appending
      const nodeRect = node.getBoundingClientRect();
      
      activeNodes.push({
        element: node,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        width: nodeRect.width,
        height: nodeRect.height
      });
    });
  }

  function updatePhysics() {
    requestAnimationFrame(updatePhysics);

    const rect = skillsViewport.getBoundingClientRect();
    const vw = rect.width;
    const vh = rect.height;

    for (let i = 0; i < activeNodes.length; i++) {
      const node = activeNodes[i];

      // 1. Constantly add a tiny drifting force so nodes float
      node.vx += (Math.random() - 0.5) * floatSpeed;
      node.vy += (Math.random() - 0.5) * floatSpeed;

      // 2. Repulsion from Mouse cursor
      if (isMouseInside) {
        const dx = node.x + node.width / 2 - mousePosition.x;
        const dy = node.y + node.height / 2 - mousePosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repulsionDist) {
          const force = (repulsionDist - dist) / repulsionDist * repulsionForce;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force;
          node.vy += Math.sin(angle) * force;
        }
      }

      // 3. Node-to-Node Repulsion Collision
      for (let j = i + 1; j < activeNodes.length; j++) {
        const otherNode = activeNodes[j];
        const dx = otherNode.x + otherNode.width / 2 - (node.x + node.width / 2);
        const dy = otherNode.y + otherNode.height / 2 - (node.y + node.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (node.width + otherNode.width) / 2.2 + collisionDistPadding;

        if (dist < minDist) {
          const force = (minDist - dist) / minDist * 0.12;
          const angle = Math.atan2(dy, dx);
          node.vx -= Math.cos(angle) * force;
          node.vy -= Math.sin(angle) * force;
          otherNode.vx += Math.cos(angle) * force;
          otherNode.vy += Math.sin(angle) * force;
        }
      }

      // 4. Drag friction
      node.vx *= drag;
      node.vy *= drag;

      // Cap maximum velocity
      const maxVel = 5;
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (speed > maxVel) {
        node.vx = (node.vx / speed) * maxVel;
        node.vy = (node.vy / speed) * maxVel;
      }

      // 5. Update positions
      node.x += node.vx;
      node.y += node.vy;

      // 6. Viewport Boundary Bouncing
      if (node.x < 10) {
        node.x = 10;
        node.vx = Math.abs(node.vx) * 0.8;
      } else if (node.x + node.width > vw - 10) {
        node.x = vw - node.width - 10;
        node.vx = -Math.abs(node.vx) * 0.8;
      }

      if (node.y < 10) {
        node.y = 10;
        node.vy = Math.abs(node.vy) * 0.8;
      } else if (node.y + node.height > vh - 10) {
        node.y = vh - node.height - 10;
        node.vy = -Math.abs(node.vy) * 0.8;
      }

      // Update node DOM styles using Translate3d (hardware accelerated!)
      node.element.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;
    }
  }

  // Handle Tab clicks
  skillsTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillsTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      
      floatingContainer.style.opacity = '0';
      floatingContainer.style.transform = 'scale(0.95)';
      floatingContainer.style.transition = 'opacity 0.25s, transform 0.25s';
      
      setTimeout(() => {
        spawnSkills(cat);
        floatingContainer.style.opacity = '1';
        floatingContainer.style.transform = 'scale(1)';
      }, 250);
    });
  });

  // Initial trigger
  spawnSkills('design');
  updatePhysics();
}

// ========================
// 14. INTERACTIVE WORKSTATION EXPERIENCE DASHBOARD
// ========================
const experiencesData = {
  bitwave: {
    role: "Junior UI/UX Designer",
    company: "BITWAVE (PVT) LTD",
    date: "May 2026 – Present",
    desc: "Designing modern, user centered interfaces for web and mobile applications.",
    details: [
      "Collaborate with development teams to deliver highly accessible layout components.",
      "Formulate interactive mockups and hi-fi wireframes matching branding principles.",
      "Iterated designs based on cross-team design review feedback sessions."
    ],
    metrics: [
      { label: "Interface Design", value: 92, color: "#7a22ff" },
      { label: "Interactive Mockups", value: 85, color: "#ff2a85" },
      { label: "Design Consistency", value: 90, color: "#eae5d9" }
    ]
  },
  vtn: {
    role: "UI/UX Design Intern",
    company: "VTN Multi Services (PVT) LTD",
    date: "Dec 2025 – Present",
    desc: "Designing user-friendly interfaces and improving user experience for enterprise applications.",
    details: [
      "Assisted in refining user journeys and wireframes for client-facing software portals.",
      "Conducted competitor analysis to map best-practice design paradigms.",
      "Maintained element style guides to ensure component library consistency."
    ],
    metrics: [
      { label: "User Journeys", value: 80, color: "#7a22ff" },
      { label: "UX Research", value: 85, color: "#ff2a85" },
      { label: "Style Guides", value: 75, color: "#eae5d9" }
    ]
  },
  freelance: {
    role: "Graphic Designer",
    company: "Freelance",
    date: "June 2024 – Present",
    desc: "Delivered customized graphics, social media posts, branding elements, and visual designs for diverse freelance clients.",
    details: [
      "Conceptualized logos and visual assets aligning with clients' brand identity.",
      "Produced marketing creatives and banners optimized for social media engagement.",
      "Managed client relationships and project timelines from intake to delivery."
    ],
    metrics: [
      { label: "Brand Identity", value: 90, color: "#7a22ff" },
      { label: "Visual Assets", value: 88, color: "#ff2a85" },
      { label: "Social Graphics", value: 95, color: "#eae5d9" }
    ]
  }
};

const expPanelBody = document.getElementById('exp-panel-body');
const expTabs = document.querySelectorAll('.exp-tab');
const expClock = document.getElementById('exp-panel-clock');

if (expPanelBody && expTabs) {
  // Live running workstation clock
  function updateWorkstationClock() {
    if (!expClock) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = `${hours}:${minutes} ${ampm}`;
    expClock.textContent = strTime;
  }
  setInterval(updateWorkstationClock, 1000);
  updateWorkstationClock();

  function loadExperience(companyId) {
    const data = experiencesData[companyId];
    if (!data) return;

    // Fade out panel body content
    expPanelBody.style.opacity = '0';
    expPanelBody.style.transform = 'translateY(8px)';
    expPanelBody.style.transition = 'opacity 0.25s, transform 0.25s';

    setTimeout(() => {
      // Build Details Column markup
      const detailsMarkup = `
        <div class="exp-details-col">
          <h3>${data.role}</h3>
          <h4>${data.company}</h4>
          <span class="exp-date"><i class="far fa-calendar-alt"></i> ${data.date}</span>
          <p>${data.desc}</p>
          <ul class="exp-bullets">
            ${data.details.map(bullet => `<li>${bullet}</li>`).join('')}
          </ul>
        </div>
      `;

      // Build Visual Column markup
      const visualMarkup = `
        <div class="exp-visual-col">
          ${data.metrics.map(metric => `
            <div class="exp-metric-item">
              <div class="metric-info">
                <span class="metric-label">${metric.label}</span>
                <span class="metric-val">${metric.value}%</span>
              </div>
              <div class="metric-bar-bg">
                <div class="metric-bar-fill" style="width: 0%; background-color: ${metric.color}; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);" data-target-width="${metric.value}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      expPanelBody.innerHTML = detailsMarkup + visualMarkup;

      // Fade in panel body
      expPanelBody.style.opacity = '1';
      expPanelBody.style.transform = 'translateY(0)';

      // Trigger metric progress bar liquid fill in next animation frame
      requestAnimationFrame(() => {
        const fillBars = expPanelBody.querySelectorAll('.metric-bar-fill');
        setTimeout(() => {
          fillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-target-width');
            bar.style.width = targetWidth;
          });
        }, 100);
      });

    }, 250);
  }

  // Handle click events on sidebar tabs
  expTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      expTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const companyId = tab.getAttribute('data-company');
      loadExperience(companyId);
    });
  });

  // Initial load
  loadExperience('bitwave');
}

// ========================
// 15. HERO NAME SPOTLIGHT REVEAL
// ========================
const spotlightName = document.getElementById('hero-spotlight-name');
if (spotlightName) {
  spotlightName.addEventListener('mousemove', (e) => {
    const rect = spotlightName.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    spotlightName.style.setProperty('--spotlight-x', `${x}px`);
    spotlightName.style.setProperty('--spotlight-y', `${y}px`);
    spotlightName.style.setProperty('--spotlight-radius', '85px');
  });
  
  spotlightName.addEventListener('mouseenter', () => {
    spotlightName.style.setProperty('--spotlight-radius', '85px');
  });
  
  spotlightName.addEventListener('mouseleave', () => {
    spotlightName.style.setProperty('--spotlight-radius', '0px');
  });
}

console.log('%c✨ 3D WebGL Scene & Interactive Reveals Active ✨', 'color: #ff2a85; font-size: 14px; font-weight: bold;');