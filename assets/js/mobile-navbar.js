/**
 * UNIVERSAL MOBILE NAVBAR FRAMEWORK
 * Mex Taco House - Modern Mobile Navigation
 * 
 * Features:
 * - Touch-friendly interactions
 * - Accessibility compliant
 * - Smooth animations
 * - Cross-browser compatibility
 * - Performance optimized
 */

class MobileNavbar {
  constructor(options = {}) {
    this.options = {
      navbarSelector: '.mobile-navbar-container',
      toggleSelector: '.mobile-navbar-toggle',
      menuSelector: '.mobile-menu-panel',
      overlaySelector: '.mobile-menu-overlay',
      dropdownSelector: '.mobile-dropdown',
      orderDropdownSelector: '.mobile-order-dropdown',
      breakpoint: 992,
      scrollThreshold: 100,
      animationDuration: 300,
      ...options
    };

    this.isOpen = false;
    this.isScrolled = false;
    this.activeDropdown = null;
    this.touchStartY = 0;
    this.touchStartX = 0;

    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
    this.setupIntersectionObserver();
    this.setupResizeHandler();
    this.setupAccessibility();
  }

  createElements() {
    // Create mobile navbar container
    this.navbarContainer = document.createElement('div');
    this.navbarContainer.className = 'mobile-navbar-container';
    this.navbarContainer.innerHTML = `
      <img src="assets/max-taco-logo.png" alt="Mex Taco House" class="mobile-navbar-logo">
      <button class="mobile-navbar-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    `;

    // Create mobile menu overlay
    this.menuOverlay = document.createElement('div');
    this.menuOverlay.className = 'mobile-menu-overlay';

    // Create mobile menu panel
    this.menuPanel = document.createElement('div');
    this.menuPanel.className = 'mobile-menu-panel';
    this.menuPanel.innerHTML = this.generateMenuContent();

    // Insert elements into DOM
    document.body.appendChild(this.navbarContainer);
    document.body.appendChild(this.menuOverlay);
    document.body.appendChild(this.menuPanel);

    // Cache DOM elements
    this.toggleButton = this.navbarContainer.querySelector(this.options.toggleSelector);
    this.menuPanel = document.querySelector(this.options.menuSelector);
    this.menuOverlay = document.querySelector(this.options.overlaySelector);
  }

  generateMenuContent() {
    return `
      <div class="mobile-menu-content">
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <a href="index.html" class="mobile-nav-link">Home</a>
          </li>
          <li class="mobile-nav-item">
            <a href="index.html#about" class="mobile-nav-link">About</a>
          </li>
          <li class="mobile-nav-item">
            <a href="menu.html" class="mobile-nav-link">Menu</a>
          </li>
          <li class="mobile-nav-item">
            <a href="index.html#gallery" class="mobile-nav-link">Gallery</a>
          </li>
          <li class="mobile-nav-item">
            <a href="news.html" class="mobile-nav-link">News</a>
          </li>
          <li class="mobile-nav-item">
            <a href="contact.html" class="mobile-nav-link">Contact</a>
          </li>
        </ul>

        <div class="mobile-actions">
          <div class="mobile-order-dropdown">
            <button class="mobile-dropdown-toggle" aria-expanded="false">
              Order Now
            </button>
            <div class="mobile-order-dropdown-menu">
              <div class="mobile-order-dropdown-item">
                <a href="https://www.grubhub.com/restaurant/mex-taco-house-25410-northwest-fwy-cypress/5807624" 
                   target="_blank" rel="noopener noreferrer" class="mobile-order-dropdown-link">
                  <div class="mobile-order-dropdown-icon grubhub">GH</div>
                  <span class="mobile-order-dropdown-text">Grubhub</span>
                </a>
              </div>
              <div class="mobile-order-dropdown-item">
                <a href="https://www.ubereats.com/store/mex-taco-house/zlftufBFXgm9JhQGyOfpvw?srsltid=AfmBOoqivy_I4JNqrygE9zN80BMQ_FV4BwOt5K2ErLL7PPXNNJVsIAgy" 
                   target="_blank" rel="noopener noreferrer" class="mobile-order-dropdown-link">
                  <div class="mobile-order-dropdown-icon ubereats">UE</div>
                  <span class="mobile-order-dropdown-text">Uber Eats</span>
                </a>
              </div>
            </div>
          </div>

          <div class="mobile-social-icons">
            <a href="https://www.instagram.com/mextacohouse/reels/?hl=en" 
               target="_blank" rel="noopener noreferrer" class="mobile-social-link" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/mextacohouse" 
               target="_blank" rel="noopener noreferrer" class="mobile-social-link" aria-label="Facebook">
              <i class="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Toggle button click
    this.toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Overlay click to close
    this.menuOverlay.addEventListener('click', () => {
      this.closeMenu();
    });

    // Order dropdown toggle
    const orderDropdownToggle = this.menuPanel.querySelector('.mobile-dropdown-toggle');
    if (orderDropdownToggle) {
      orderDropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleOrderDropdown();
      });
    }

    // Touch events for better mobile experience
    this.bindTouchEvents();

    // Keyboard navigation
    this.bindKeyboardEvents();

    // Close menu on navigation link click
    this.bindNavigationEvents();
  }

  bindTouchEvents() {
    // Prevent body scroll when menu is open
    this.menuPanel.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartX = e.touches[0].clientX;
    });

    this.menuPanel.addEventListener('touchmove', (e) => {
      if (!this.isOpen) return;

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = touchY - this.touchStartY;
      const deltaX = touchX - this.touchStartX;

      // Close menu on swipe down
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 50) {
        this.closeMenu();
      }
    });
  }

  bindKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      switch (e.key) {
        case 'Escape':
          this.closeMenu();
          break;
        case 'Tab':
          this.handleTabNavigation(e);
          break;
      }
    });
  }

  bindNavigationEvents() {
    const navLinks = this.menuPanel.querySelectorAll('.mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu after a short delay to allow navigation
        setTimeout(() => {
          this.closeMenu();
        }, 100);
      });
    });
  }

  handleTabNavigation(e) {
    const focusableElements = this.menuPanel.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    
    // Update ARIA attributes
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.toggleButton.classList.add('active');
    
    // Show overlay and menu
    this.menuOverlay.classList.add('active');
    this.menuPanel.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstLink = this.menuPanel.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Update active page link
    this.updateActiveLink();

    // Emit custom event
    this.emit('menuOpened');
  }

  closeMenu() {
    this.isOpen = false;
    
    // Update ARIA attributes
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleButton.classList.remove('active');
    
    // Hide overlay and menu
    this.menuOverlay.classList.remove('active');
    this.menuPanel.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Close any open dropdowns
    this.closeOrderDropdown();

    // Emit custom event
    this.emit('menuClosed');
  }

  toggleOrderDropdown() {
    const dropdown = this.menuPanel.querySelector('.mobile-order-dropdown');
    const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
    const menu = dropdown.querySelector('.mobile-order-dropdown-menu');

    if (this.activeDropdown === dropdown) {
      this.closeOrderDropdown();
    } else {
      this.closeOrderDropdown();
      this.activeDropdown = dropdown;
      toggle.classList.add('active');
      menu.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  closeOrderDropdown() {
    if (this.activeDropdown) {
      const toggle = this.activeDropdown.querySelector('.mobile-dropdown-toggle');
      const menu = this.activeDropdown.querySelector('.mobile-order-dropdown-menu');
      
      toggle.classList.remove('active');
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      
      this.activeDropdown = null;
    }
  }

  updateActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = this.menuPanel.querySelectorAll('.mobile-nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === currentPath || 
          (currentPath === '/' && href === 'index.html') ||
          (currentPath.includes('news') && href === 'news.html') ||
          (currentPath.includes('menu') && href === 'menu.html') ||
          (currentPath.includes('contact') && href === 'contact.html')) {
        link.classList.add('active');
      }
    });
  }

  setupIntersectionObserver() {
    // Handle navbar scroll behavior
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.navbarContainer.classList.remove('scrolled');
          this.isScrolled = false;
        } else {
          this.navbarContainer.classList.add('scrolled');
          this.isScrolled = true;
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-50px 0px 0px 0px'
    });

    // Observe a sentinel element at the top of the page
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    document.body.appendChild(sentinel);
    
    observer.observe(sentinel);
  }

  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= this.options.breakpoint) {
          this.closeMenu();
        }
      }, 100);
    });
  }

  setupAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'mobile-sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.zIndex = '10000';
    skipLink.style.padding = '8px 16px';
    skipLink.style.background = '#000';
    skipLink.style.color = '#fff';
    skipLink.style.textDecoration = 'none';
    skipLink.style.borderRadius = '4px';
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  emit(eventName, data = {}) {
    const event = new CustomEvent(`mobileNavbar:${eventName}`, {
      detail: { ...data, instance: this }
    });
    document.dispatchEvent(event);
  }

  destroy() {
    // Remove event listeners and DOM elements
    if (this.navbarContainer && this.navbarContainer.parentNode) {
      this.navbarContainer.parentNode.removeChild(this.navbarContainer);
    }
    if (this.menuOverlay && this.menuOverlay.parentNode) {
      this.menuOverlay.parentNode.removeChild(this.menuOverlay);
    }
    if (this.menuPanel && this.menuPanel.parentNode) {
      this.menuPanel.parentNode.removeChild(this.menuPanel);
    }
    
    document.body.style.overflow = '';
  }
}

// Auto-initialize on mobile devices
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 992) {
    window.mobileNavbar = new MobileNavbar();
  }
});

// Re-initialize on resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth < 992 && !window.mobileNavbar) {
      window.mobileNavbar = new MobileNavbar();
    } else if (window.innerWidth >= 992 && window.mobileNavbar) {
      window.mobileNavbar.destroy();
      window.mobileNavbar = null;
    }
  }, 100);
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileNavbar;
} else if (typeof window !== 'undefined') {
  window.MobileNavbar = MobileNavbar;
}

