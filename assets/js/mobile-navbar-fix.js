/**
 * MOBILE NAVBAR FIX - DIRECT OVERRIDE
 * Mex Taco House - Fix Existing Navbar Issues
 */

(function() {
  'use strict';
  
  // Only run on mobile devices
  if (window.innerWidth >= 992) return;
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    
    // Function to apply mobile navbar fixes
    function applyMobileNavbarFixes() {
      console.log('Applying mobile navbar fixes...');
      
      // Fix navbar background
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.style.background = 'white';
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }
      
      // Fix header background
      const header = document.querySelector('.header');
      if (header) {
        header.style.background = 'white';
        header.style.backgroundColor = 'white';
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '9999';
      }
      
      // Fix navbar toggler lines color
      const togglerLines = document.querySelectorAll('.navbar-toggler .menu-lines, .navbar-toggler .menu-lines span, .navbar-toggler .menu-lines:before, .navbar-toggler .menu-lines:after');
      togglerLines.forEach(line => {
        line.style.background = '#333';
        line.style.backgroundColor = '#333';
      });
      
      // Fix navigation links
      const navLinks = document.querySelectorAll('.nav__item-link');
      navLinks.forEach(link => {
        link.style.color = '#333';
        link.style.background = 'white';
        link.style.backgroundColor = 'white';
        link.style.fontWeight = '500';
        link.style.padding = '12px 15px';
        link.style.borderRadius = '8px';
        link.style.display = 'block';
        link.style.textDecoration = 'none';
        link.style.minHeight = '44px';
        link.style.display = 'flex';
        link.style.alignItems = 'center';
      });
      
      // Fix navbar collapse background
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse) {
        navbarCollapse.style.background = 'white';
        navbarCollapse.style.backgroundColor = 'white';
        navbarCollapse.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        navbarCollapse.style.borderRadius = '0 0 15px 15px';
        navbarCollapse.style.padding = '20px 15px';
        navbarCollapse.style.position = 'absolute';
        navbarCollapse.style.top = '100%';
        navbarCollapse.style.left = '0';
        navbarCollapse.style.right = '0';
        navbarCollapse.style.zIndex = '10000';
      }
      
      // Fix order button
      const orderButton = document.querySelector('.btn__primary, .navbar__action-btn-reserve');
      if (orderButton) {
        orderButton.style.background = '#dc2626';
        orderButton.style.backgroundColor = '#dc2626';
        orderButton.style.color = 'white';
        orderButton.style.border = 'none';
        orderButton.style.padding = '15px 20px';
        orderButton.style.fontSize = '16px';
        orderButton.style.fontWeight = '600';
        orderButton.style.borderRadius = '8px';
        orderButton.style.textAlign = 'center';
        orderButton.style.textDecoration = 'none';
        orderButton.style.display = 'flex';
        orderButton.style.alignItems = 'center';
        orderButton.style.justifyContent = 'center';
        orderButton.style.minHeight = '44px';
        orderButton.style.width = '100%';
      }
      
      // Fix dropdown menu
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.background = 'white';
        dropdownMenu.style.backgroundColor = 'white';
        dropdownMenu.style.border = '1px solid #e5e5e5';
        dropdownMenu.style.borderRadius = '8px';
        dropdownMenu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        dropdownMenu.style.marginTop = '10px';
        dropdownMenu.style.padding = '10px 0';
        dropdownMenu.style.position = 'static';
        dropdownMenu.style.width = '100%';
        
        // Fix dropdown links
        const dropdownLinks = dropdownMenu.querySelectorAll('a');
        dropdownLinks.forEach(link => {
          link.style.color = '#333';
          link.style.background = 'white';
          link.style.backgroundColor = 'white';
          link.style.display = 'block';
          link.style.padding = '12px 20px';
          link.style.textDecoration = 'none';
          link.style.fontWeight = '600';
          link.style.minHeight = '44px';
          link.style.display = 'flex';
          link.style.alignItems = 'center';
          link.style.gap = '12px';
        });
      }
      
      // Fix social icons
      const socialLinks = document.querySelectorAll('.social__icons li a');
      socialLinks.forEach(link => {
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.width = '45px';
        link.style.height = '45px';
        link.style.background = '#dc2626';
        link.style.backgroundColor = '#dc2626';
        link.style.color = 'white';
        link.style.borderRadius = '50%';
        link.style.textDecoration = 'none';
        link.style.fontSize = '18px';
      });
      
      // Add body padding for fixed navbar
      document.body.style.paddingTop = '70px';
      
      console.log('Mobile navbar fixes applied successfully!');
    }
    
    // Apply fixes immediately
    applyMobileNavbarFixes();
    
    // Apply fixes when menu is toggled
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
      navbarToggler.addEventListener('click', function() {
        setTimeout(applyMobileNavbarFixes, 100);
      });
    }
    
    // Apply fixes periodically to ensure they stick
    setInterval(applyMobileNavbarFixes, 2000);
    
    // Apply fixes on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        if (window.innerWidth < 992) {
          applyMobileNavbarFixes();
        }
      }, 100);
    });
    
    // Fix dropdown toggle functionality
    const orderDropdown = document.querySelector('.dropdown');
    if (orderDropdown) {
      const dropdownToggle = orderDropdown.querySelector('button');
      const dropdownMenu = orderDropdown.querySelector('.dropdown-menu');
      
      if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const isVisible = dropdownMenu.style.display === 'block';
          dropdownMenu.style.display = isVisible ? 'none' : 'block';
          
          // Apply styles when showing
          if (!isVisible) {
            setTimeout(applyMobileNavbarFixes, 50);
          }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
          if (!orderDropdown.contains(e.target)) {
            dropdownMenu.style.display = 'none';
          }
        });
      }
    }
    
  });
  
})();

