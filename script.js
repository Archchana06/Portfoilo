// script.js - Complete JavaScript for Archchana Vijayanathan Portfolio

// ========================
// 1. CUSTOM CURSOR (with smooth follow)
// ========================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.transform = `translate(${posX - 4}px, ${posY - 4}px)`;
    
    setTimeout(() => {
      cursorOutline.style.transform = `translate(${posX - 16}px, ${posY - 16}px)`;
    }, 30);
  });
  
  // Hover effect for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .cert-card, .achievement-card, .skill-category, .cert-view-btn, .achievement-view-btn');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '50px';
      cursorOutline.style.height = '50px';
      cursorOutline.style.borderColor = '#ff6b9d';
      cursorDot.style.backgroundColor = '#ff6b9d';
      cursorDot.style.transform = `scale(1.5)`;
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '32px';
      cursorOutline.style.height = '32px';
      cursorOutline.style.borderColor = '#bf4bff';
      cursorDot.style.backgroundColor = '#bf4bff';
      cursorDot.style.transform = `scale(1)`;
    });
  });
}

// ========================
// 2. MOBILE MENU TOGGLE
// ========================
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    if (menuBtn) {
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });
});

// ========================
// 3. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#' || targetId === '') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      history.pushState(null, null, targetId);
    }
  });
});

// ========================
// 4. NAVBAR SCROLL EFFECT
// ========================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (navbar) {
    if (currentScroll > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.98)';
      navbar.style.backdropFilter = 'blur(15px)';
      navbar.style.borderBottom = '1px solid rgba(191, 75, 255, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.borderBottom = '1px solid rgba(191, 75, 255, 0.2)';
    }
  }
  
  // Active nav link highlighting
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');
  
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${section.id}`) {
          item.classList.add('active');
        }
      });
    }
  });
});

// ========================
// 5. SCROLL REVEAL ANIMATION
// ========================
const revealElements = document.querySelectorAll('.skill-category, .project-card, .service-card, .cert-card, .achievement-card, .timeline-item, .about-card, .stat');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ========================
// 6. TOAST NOTIFICATION SYSTEM
// ========================
function showToast(message, color) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #1a1a2e;
    color: ${color};
    padding: 12px 24px;
    border-radius: 50px;
    border-left: 4px solid ${color};
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease;
    font-family: 'Inter', sans-serif;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add keyframe animations dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

// ========================
// 7. CONTACT FORM HANDLING (Formspree - actual form submission)
// ========================
// Formspree handles the form submission automatically
// The form already has action="https://formspree.io/f/mwvypapq" method="POST"
// No additional JavaScript needed for submission

// ========================
// 8. COPY EMAIL FUNCTIONALITY
// ========================
const emailItem = document.querySelector('.contact-item:first-child span');
if (emailItem) {
  emailItem.style.cursor = 'pointer';
  emailItem.style.transition = 'color 0.3s';
  emailItem.addEventListener('mouseenter', () => {
    emailItem.style.color = '#bf4bff';
  });
  emailItem.addEventListener('mouseleave', () => {
    emailItem.style.color = 'white';
  });
  emailItem.addEventListener('click', async () => {
    const email = emailItem.textContent;
    try {
      await navigator.clipboard.writeText(email);
      showToast('📧 Email copied to clipboard!', '#bf4bff');
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('📧 Email copied!', '#bf4bff');
    }
  });
}

// ========================
// 9. LOADING ANIMATION
// ========================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('%c✨ Archchana Vijayanathan Portfolio Loaded ✨', 'color: #bf4bff; font-size: 16px; font-weight: bold;');
});

// ========================
// 10. SCROLL TO TOP BUTTON
// ========================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #bf4bff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 999;
  box-shadow: 0 0 20px rgba(191, 75, 255, 0.4);
  font-size: 1.2rem;
`;

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.visibility = 'visible';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.visibility = 'hidden';
  }
});

// ========================
// 11. PRELOADER
// ========================
const preloader = document.createElement('div');
preloader.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0a0a;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s;
`;

const spinner = document.createElement('div');
spinner.style.cssText = `
  width: 50px;
  height: 50px;
  border: 3px solid #333;
  border-top-color: #bf4bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

const spinKeyframes = document.createElement('style');
spinKeyframes.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinKeyframes);

preloader.appendChild(spinner);
document.body.appendChild(preloader);

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 500);
  }, 500);
});

// ========================
// 12. CERTIFICATE MODAL FUNCTIONALITY
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
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  if (certModal) {
    certModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

document.querySelectorAll('.cert-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const imageSrc = btn.getAttribute('data-cert');
    const title = btn.getAttribute('data-title');
    if (imageSrc && title) {
      openCertModal(imageSrc, title);
    }
  });
});

if (certModalClose) {
  certModalClose.addEventListener('click', closeCertModal);
}

if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
      closeCertModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal && certModal.style.display === 'flex') {
    closeCertModal();
  }
});

// ========================
// 13. ACHIEVEMENT MODAL FUNCTIONALITY
// ========================
const achievementImages = {
  'seusl-designathon': {
    src: 'achievements/seusl-designathon-winner.jpg',
    title: '🏆 1st Place Winner - SEUSL Designathon 2026'
  },
  'sliit-designathon': {
    src: 'achievements/sliit-designathon-top10.jpg',
    title: 'Top 10 - SLIIT Designathon'
  },
  'figma-workshop': {
    src: 'achievements/figma-workshop-instructor.jpg',
    title: 'Instructor - Figma Workshop'
  },
  'sahasak-nimavum': {
    src: 'achievements/sahasak-nimavum-2024.jpg',
    title: 'Participant - SAHASAK NIMAVUM 2024'
  },
  'english-oratory': {
    src: 'achievements/english-oratory-3rd-place.jpg',
    title: '🥉 3rd Place - Province Level'
  }
};

document.querySelectorAll('.achievement-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const achievementKey = btn.closest('a')?.getAttribute('href')?.split('=')[1];
    if (achievementKey && achievementImages[achievementKey]) {
      openCertModal(achievementImages[achievementKey].src, achievementImages[achievementKey].title);
    }
  });
});

// ========================
// 14. RESPONSIVE HANDLING
// ========================
const handleResponsive = () => {
  if (window.innerWidth <= 768) {
    document.body.classList.add('mobile-view');
  } else {
    document.body.classList.remove('mobile-view');
  }
};

window.addEventListener('resize', handleResponsive);
handleResponsive();

console.log('✅ Portfolio fully interactive and ready!');