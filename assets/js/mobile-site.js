/**
 * MEX TACO HOUSE - Mobile Site JavaScript
 * Clean, lightweight mobile interactions
 */

(function() {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const elements = {
    navbar: null,
    menuToggle: null,
    menuPanel: null,
    menuOverlay: null,
    bottomNav: null,
    orderDropdown: null,
    callPopup: null,
    holidayPopup: null
  };

  // ========================================
  // State
  // ========================================
  const state = {
    menuOpen: false,
    orderDropdownOpen: false,
    callPopupOpen: false
  };

  // ========================================
  // Initialize
  // ========================================
  function init() {
    cacheElements();
    bindEvents();
    checkHolidayPopup();
    setActiveNavLink();
  }

  function cacheElements() {
    elements.navbar = document.querySelector('.mobile-navbar');
    elements.menuToggle = document.querySelector('.mobile-navbar-toggle');
    elements.menuPanel = document.querySelector('.mobile-menu-panel');
    elements.menuOverlay = document.querySelector('.mobile-menu-overlay');
    elements.bottomNav = document.querySelector('.bottom-nav');
    elements.orderDropdown = document.querySelector('.order-dropdown');
    elements.callPopup = document.querySelector('.call-popup');
    elements.holidayPopup = document.querySelector('.holiday-popup');
  }

  // ========================================
  // Event Bindings
  // ========================================
  function bindEvents() {
    // Menu toggle
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', toggleMenu);
    }

    // Menu overlay click to close
    if (elements.menuOverlay) {
      elements.menuOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on link click
    if (elements.menuPanel) {
      elements.menuPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }

    // Bottom nav order button
    const orderBtn = document.querySelector('[data-action="order"]');
    if (orderBtn) {
      orderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleOrderDropdown();
      });
    }

    // Order dropdown close button
    const orderCloseBtn = document.querySelector('.order-dropdown-close');
    if (orderCloseBtn) {
      orderCloseBtn.addEventListener('click', closeOrderDropdown);
    }

    // Close order dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (state.orderDropdownOpen &&
          !e.target.closest('.order-dropdown') &&
          !e.target.closest('[data-action="order"]')) {
        closeOrderDropdown();
      }
    });

    // Bottom nav call button
    const callBtn = document.querySelector('[data-action="call"]');
    if (callBtn) {
      callBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCallPopup();
      });
    }

    // Call popup close
    const callCloseBtn = document.querySelector('.call-popup-cancel');
    if (callCloseBtn) {
      callCloseBtn.addEventListener('click', closeCallPopup);
    }

    // Call popup overlay click
    if (elements.callPopup) {
      elements.callPopup.addEventListener('click', (e) => {
        if (e.target === elements.callPopup) {
          closeCallPopup();
        }
      });
    }

    // Holiday popup close (both X button and Got it button)
    const holidayCloseBtn = document.querySelector('.holiday-popup-close');
    const holidayCloseX = document.querySelector('.holiday-popup-x');
    if (holidayCloseBtn) {
      holidayCloseBtn.addEventListener('click', closeHolidayPopup);
    }
    if (holidayCloseX) {
      holidayCloseX.addEventListener('click', closeHolidayPopup);
    }

    // Menu accordions
    document.querySelectorAll('.menu-category-header').forEach(header => {
      header.addEventListener('click', () => {
        const category = header.closest('.menu-category');
        category.classList.toggle('open');
      });
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.menuOpen) closeMenu();
        if (state.orderDropdownOpen) closeOrderDropdown();
        if (state.callPopupOpen) closeCallPopup();
        if (elements.holidayPopup?.classList.contains('active')) {
          closeHolidayPopup();
        }
      }
    });
  }

  // ========================================
  // Menu Functions
  // ========================================
  function toggleMenu() {
    state.menuOpen ? closeMenu() : openMenu();
  }

  function openMenu() {
    state.menuOpen = true;
    elements.menuToggle?.classList.add('active');
    elements.menuPanel?.classList.add('active');
    elements.menuOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    state.menuOpen = false;
    elements.menuToggle?.classList.remove('active');
    elements.menuPanel?.classList.remove('active');
    elements.menuOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================
  // Order Dropdown Functions
  // ========================================
  function toggleOrderDropdown() {
    state.orderDropdownOpen ? closeOrderDropdown() : openOrderDropdown();
  }

  function openOrderDropdown() {
    state.orderDropdownOpen = true;
    elements.orderDropdown?.classList.add('active');
  }

  function closeOrderDropdown() {
    state.orderDropdownOpen = false;
    elements.orderDropdown?.classList.remove('active');
  }

  // ========================================
  // Call Popup Functions
  // ========================================
  function openCallPopup() {
    state.callPopupOpen = true;
    elements.callPopup?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCallPopup() {
    state.callPopupOpen = false;
    elements.callPopup?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================
  // Holiday Popup Functions
  // ========================================
  function checkHolidayPopup() {
    // Only show once per session
    if (elements.holidayPopup && !sessionStorage.getItem('holidayPopupShown')) {
      setTimeout(() => {
        elements.holidayPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 2000);
    }
  }

  function closeHolidayPopup() {
    elements.holidayPopup?.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('holidayPopupShown', 'true');
  }

  // ========================================
  // Navigation Helpers
  // ========================================
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'm-index.html';

    document.querySelectorAll('.mobile-menu-link, .bottom-nav-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage ||
          (currentPage === '' && href === 'm-index.html') ||
          (currentPage === 'm-index.html' && href === 'm-index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ========================================
  // Initialize on DOM Ready
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.MobileSite = {
    state,
    openMenu,
    closeMenu,
    openOrderDropdown,
    closeOrderDropdown,
    openCallPopup,
    closeCallPopup
  };

})();
