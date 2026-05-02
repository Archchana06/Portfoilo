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
    
    cursorDot.style.transform = `translate(${posX - 3}px, ${posY - 3}px)`;
    
    // Smooth outline follow with delay
    setTimeout(() => {
      cursorOutline.style.transform = `translate(${posX - 15}px, ${posY - 15}px)`;
    }, 50);
  });
  
  // Hover effect for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .cert-card, .achievement-card, .skill-category');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '45px';
      cursorOutline.style.height = '45px';
      cursorOutline.style.borderColor = '#ff6b9d';
      cursorDot.style.backgroundColor = '#ff6b9d';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '30px';
      cursorOutline.style.height = '30px';
      cursorOutline.style.borderColor = '#bf4bff';
      cursorDot.style.backgroundColor = '#bf4bff';
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
      const offset = 80; // Navbar height offset
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, targetId);
    }
  });
});

// ========================
// 4. NAVBAR SCROLL EFFECT (change background on scroll)
// ========================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    navbar.style.backdropFilter = 'blur(15px)';
    navbar.style.borderBottom = '1px solid rgba(191, 75, 255, 0.3)';
  } else {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    navbar.style.backdropFilter = 'blur(10px)';
    navbar.style.borderBottom = '1px solid rgba(191, 75, 255, 0.2)';
  }
  
  // Active nav link highlighting
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');
  
  sections.forEach((section, index) => {
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
// 5. SCROLL REVEAL ANIMATION (Intersection Observer)
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

// Stagger children animations
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

// ========================
// 6. CONTACT FORM HANDLING
// ========================
// Update the contact form submission message
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      showToast('✅ Thank you! I will respond to your hiring opportunity soon!', '#bf4bff');
      contactForm.reset();
      
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}
// ========================
// 7. TOAST NOTIFICATION SYSTEM
// ========================
function showToast(message, color) {
  // Remove existing toast if any
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
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleSheet);

// ========================
// 8. PARALLAX EFFECT ON HERO SECTION
// ========================
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    const moveX = (mouseX - 0.5) * 20;
    const moveY = (mouseY - 0.5) * 20;
    
    const heroTitle = document.querySelector('.hero-title');
    const heroGlow = document.querySelector('.hero-glow');
    
    if (heroTitle) {
      heroTitle.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
    }
    if (heroGlow) {
      heroGlow.style.transform = `translate(calc(-50% + ${moveX * 0.3}px), calc(-50% + ${moveY * 0.3}px))`;
    }
  });
}

// ========================
// 9. TYPING ANIMATION FOR TAGLINE (optional enhancement)
// ========================
const tagline = document.querySelector('.hero-tagline');
if (tagline && !tagline.hasAttribute('data-typed')) {
  const originalText = tagline.textContent;
  tagline.setAttribute('data-typed', 'true');
  
  // Optional: Add a subtle typing effect on load
  tagline.style.opacity = '0';
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i <= originalText.length) {
      tagline.textContent = originalText.substring(0, i);
      tagline.style.opacity = '1';
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, 50);
}

// ========================
// 10. PROJECT CARD INTERACTIVE DETAILS (expand on click)
// ========================
const projectCardsDetailed = document.querySelectorAll('.project-card');
projectCardsDetailed.forEach(card => {
  let expanded = false;
  let extraDiv = null;
  
  card.addEventListener('click', (e) => {
    // Don't expand if clicking on tags
    if (e.target.closest('.project-tags')) return;
    
    if (!expanded) {
      extraDiv = document.createElement('div');
      extraDiv.className = 'project-extra';
      extraDiv.style.cssText = `
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(191, 75, 255, 0.3);
        font-size: 0.85rem;
        color: #bf4bff;
        animation: fadeIn 0.3s ease;
      `;
      
      const projectTitle = card.querySelector('h3').textContent;
    
      
      extraDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${extraInfo}`;
      card.appendChild(extraDiv);
      expanded = true;
    } else {
      if (extraDiv) extraDiv.remove();
      expanded = false;
    }
  });
});

// Add fadeIn animation
const fadeKeyframes = document.createElement('style');
fadeKeyframes.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(fadeKeyframes);

// ========================
// 11. COPY EMAIL FUNCTIONALITY
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
      // Fallback
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
// 12. LOADING ANIMATION (fade in body)
// ========================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('%c✨ Archchana Vijayanathan Portfolio Loaded ✨', 'color: #bf4bff; font-size: 16px; font-weight: bold;');
  console.log('%cUI/UX Designer | AI-Driven Product Designer', 'color: #888; font-size: 12px;');
});

// ========================
// 13. SCROLL TO TOP BUTTON (optional enhancement)
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
// 14. PRELOADER (simple fade effect)
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
// 15. RESPONSIVE VIDEO/IMAGE HANDLING
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

// ========================
// 16. SMOOTH NUMBER COUNTER FOR STATS
// ========================
const stats = document.querySelectorAll('.stat-number');
const animateNumbers = () => {
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = target / 50;
    const updateNumber = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current);
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target;
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateNumber();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  });
};

animateNumbers();

console.log('✅ Portfolio fully interactive and ready!');

// Certificate Modal Functionality - Shows Large Image

const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalCaption = document.querySelector('.cert-modal-caption');
const certModalClose = document.querySelector('.cert-modal-close');

// Function to open modal with certificate image
function openCertModal(imageSrc, title) {
  certModalImage.src = imageSrc;
  certModalCaption.textContent = title;
  certModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Function to close modal
function closeCertModal() {
  certModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Add click event to all view certificate buttons
document.querySelectorAll('.cert-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const imageSrc = btn.getAttribute('data-cert');
    const title = btn.getAttribute('data-title');
    openCertModal(imageSrc, title);
  });
});

// Close modal when clicking on X
if (certModalClose) {
  certModalClose.addEventListener('click', closeCertModal);
}

// Close modal when clicking outside the image
certModal.addEventListener('click', (e) => {
  if (e.target === certModal) {
    closeCertModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal.style.display === 'flex') {
    closeCertModal();
  }
});

// ========================
// ACHIEVEMENT MODAL FUNCTIONALITY
// ========================

// Achievement images mapping - Add your certificate/achievement images here
const achievementImages = {
  'seusl-designathon': {
    src: 'achievements/seusl-designathon-winner.jpg',
    title: '🏆 1st Place Winner - SEUSL Designathon 2026',
    details: 'First place winner at the South Eastern University Designathon competition'
  },
  'sliit-designathon': {
    src: 'achievements/sliit-designathon-top10.jpg',
    title: 'Top 10 - SLIIT Designathon',
    details: 'Ranked among top 10 participants at SLIIT Designathon'
  },
  'deckathon': {
    src: 'achievements/deckathon-top6-10.jpg',
    title: 'Top 6–10 - Deckathon Hackathon',
    details: 'Secured position in top 6-10 at Deckathon Hackathon'
  },
  'figma-workshop': {
    src: 'achievements/figma-workshop-instructor.jpg',
    title: 'Instructor - Figma Workshop',
    details: 'Conducted Figma workshop as an instructor'
  },
  'hack-like-girl': {
    src: 'achievements/hack-like-girl-top25.jpg',
    title: 'Top 25 - SLASSCOM Hack Like a Girl 3.0',
    details: 'Ranked among top 25 participants in Hack Like a Girl competition'
  },
  'sahasak-nimavum': {
    src: 'achievements/sahasak-nimavum-2024.jpg',
    title: 'Participant - SAHASAK NIMAVUM 2024',
    details: 'National Inventions Exhibition & Competition - IoT, Mobile & AI based Smart Cradle System'
  },
  'english-oratory': {
    src: 'achievements/english-oratory-3rd-place.jpg',
    title: '🥉 3rd Place - Province Level',
    details: 'English Day Oratory Competition (Prepared Speech) | School Representation'
  }
};

// Function to show achievement in modal
function showAchievement(achievementKey) {
  const achievement = achievementImages[achievementKey];
  
  if (!achievement) {
    showToast('Achievement certificate coming soon!', '#bf4bff');
    return;
  }
  
  if (!certModal || !certModalImage) {
    console.error('Modal elements not found');
    return;
  }
  
  // Show loading state
  certModalImage.style.opacity = '0.5';
  if (certModalCaption) {
    certModalCaption.innerHTML = `<strong>${achievement.title}</strong><br><small>${achievement.details}</small>`;
  }
  certModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Create a new image object to test loading
  const img = new Image();
  
  img.onload = function() {
    certModalImage.src = achievement.src;
    certModalImage.style.opacity = '1';
  };
  
  img.onerror = function() {
    console.warn(`Achievement image not found: ${achievement.src}`);
    certModalImage.src = `https://placehold.co/800x600/1a1a2e/bf4bff?text=${encodeURIComponent(achievement.title)}`;
    certModalImage.style.opacity = '1';
    showToast('📸 Upload achievement certificate to view', '#bf4bff');
  };
  
  img.src = achievement.src;
}

// Add click event to all achievement view buttons
document.querySelectorAll('.achievement-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const achievementKey = btn.getAttribute('data-achievement');
    showAchievement(achievementKey);
  });
});