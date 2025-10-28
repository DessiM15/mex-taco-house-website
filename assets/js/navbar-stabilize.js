/**
 * ===========================================
 * NAVBAR STABILIZE PACK - JavaScript
 * Mex Taco House Website
 * ===========================================
 * 
 * This file ensures consistent navbar behavior across all pages:
 * - Unified dropdown functionality
 * - Mobile menu behavior
 * - Scroll-based navbar state management
 * - Consistent event handling
 * - Cross-browser compatibility
 * 
 * ===========================================
 */

(function() {
    'use strict';

    // ===========================================
    // CONFIGURATION
    // ===========================================
    
    const CONFIG = {
        // Color scheme
        colors: {
            primary: '#CF3D2E',
            primaryHover: '#b91c1c',
            text: '#000000',
            background: '#ffffff',
            dropdownBackground: '#ffffff',
            dropdownText: '#333333',
            dropdownHover: '#f8f9fa'
        },
        
        // Animation settings
        animation: {
            duration: 300,
            easing: 'ease'
        },
        
        // Breakpoints
        breakpoints: {
            mobile: 768,
            tablet: 991,
            desktop: 1200
        },
        
        // Selectors
        selectors: {
            navbar: '.navbar',
            navbarToggler: '.navbar-toggler',
            navbarCollapse: '.navbar-collapse',
            navLinks: '.nav__item-link',
            dropdownToggle: '#orderDropdown',
            dropdownMenu: '.dropdown-menu',
            orderButton: '.btn__primary, .navbar__action-btn-reserve',
            socialIcons: '.social__icons a'
        }
    };

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    
    /**
     * Check if element exists
     */
    function elementExists(element) {
        return element && element.length > 0;
    }

    /**
     * Get element by selector
     */
    function getElement(selector) {
        return document.querySelector(selector);
    }

    /**
     * Get elements by selector
     */
    function getElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Add event listener with error handling
     */
    function addEventListenerSafe(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Remove event listener safely
     */
    function removeEventListenerSafe(element, event, handler) {
        if (element) {
            element.removeEventListener(event, handler);
        }
    }

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth <= CONFIG.breakpoints.mobile;
    }

    /**
     * Check if device is tablet
     */
    function isTablet() {
        return window.innerWidth > CONFIG.breakpoints.mobile && 
               window.innerWidth <= CONFIG.breakpoints.tablet;
    }

    /**
     * Check if device is desktop
     */
    function isDesktop() {
        return window.innerWidth > CONFIG.breakpoints.tablet;
    }

    // ===========================================
    // DROPDOWN FUNCTIONALITY
    // ===========================================
    
    class DropdownManager {
        constructor() {
            this.dropdownToggle = getElement(CONFIG.selectors.dropdownToggle);
            this.dropdownMenu = getElement(CONFIG.selectors.dropdownMenu);
            this.isOpen = false;
            this.init();
        }

        init() {
            if (!this.dropdownToggle || !this.dropdownMenu) {
                console.warn('Dropdown elements not found');
                return;
            }

            this.setupEventListeners();
            this.applyStyles();
        }

        setupEventListeners() {
            // Toggle dropdown on click
            addEventListenerSafe(this.dropdownToggle, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });

            // Close dropdown when clicking outside
            addEventListenerSafe(document, 'click', (e) => {
                if (!this.dropdownToggle.contains(e.target) && 
                    !this.dropdownMenu.contains(e.target)) {
                    this.close();
                }
            });

            // Close dropdown on escape key
            addEventListenerSafe(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle window resize
            addEventListenerSafe(window, 'resize', () => {
                this.handleResize();
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.dropdownMenu.style.display = 'block';
            this.applyStyles();
            
            // Add ARIA attributes for accessibility
            this.dropdownToggle.setAttribute('aria-expanded', 'true');
            this.dropdownMenu.setAttribute('aria-hidden', 'false');
            
            // Focus first link in dropdown
            const firstLink = this.dropdownMenu.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }

        close() {
            this.isOpen = false;
            this.dropdownMenu.style.display = 'none';
            
            // Remove ARIA attributes
            this.dropdownToggle.setAttribute('aria-expanded', 'false');
            this.dropdownMenu.setAttribute('aria-hidden', 'true');
        }

        applyStyles() {
            if (!this.dropdownMenu) return;

            // Apply consistent dropdown styles
            this.dropdownMenu.style.cssText = `
                background: ${CONFIG.colors.dropdownBackground} !important;
                background-color: ${CONFIG.colors.dropdownBackground} !important;
                border: 1px solid #ddd !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                min-width: 200px !important;
                z-index: 1000 !important;
                padding: 10px 0 !important;
                margin-top: 5px !important;
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
            `;

            // Style dropdown links
            const dropdownLinks = this.dropdownMenu.querySelectorAll('a');
            dropdownLinks.forEach((link, index) => {
                link.style.cssText = `
                    color: ${CONFIG.colors.dropdownText} !important;
                    background: ${CONFIG.colors.dropdownBackground} !important;
                    background-color: ${CONFIG.colors.dropdownBackground} !important;
                    display: block !important;
                    padding: 12px 20px !important;
                    text-decoration: none !important;
                    transition: all 0.3s ease !important;
                    font-weight: 600 !important;
                    ${index === 0 ? 'border-bottom: 1px solid #f0f0f0 !important;' : ''}
                `;

                // Add hover effect
                link.addEventListener('mouseenter', () => {
                    link.style.background = CONFIG.colors.dropdownHover;
                    link.style.backgroundColor = CONFIG.colors.dropdownHover;
                });

                link.addEventListener('mouseleave', () => {
                    link.style.background = CONFIG.colors.dropdownBackground;
                    link.style.backgroundColor = CONFIG.colors.dropdownBackground;
                });
            });

            // Style dropdown spans
            const dropdownSpans = this.dropdownMenu.querySelectorAll('span');
            dropdownSpans.forEach(span => {
                // Skip icon spans (GH, UE) which should stay white
                if (!span.textContent.includes('GH') && !span.textContent.includes('UE')) {
                    span.style.cssText = `
                        font-weight: 600 !important;
                        color: ${CONFIG.colors.dropdownText} !important;
                    `;
                }
            });
        }

        handleResize() {
            // Close dropdown on mobile when resizing
            if (isMobile() && this.isOpen) {
                this.close();
            }
        }
    }

    // ===========================================
    // MOBILE MENU FUNCTIONALITY
    // ===========================================
    
    class MobileMenuManager {
        constructor() {
            this.navbarToggler = getElement(CONFIG.selectors.navbarToggler);
            this.navbarCollapse = getElement(CONFIG.selectors.navbarCollapse);
            this.navLinks = getElements(CONFIG.selectors.navLinks);
            this.isOpen = false;
            this.init();
        }

        init() {
            if (!this.navbarToggler || !this.navbarCollapse) {
                console.warn('Mobile menu elements not found');
                return;
            }

            this.setupEventListeners();
            this.applyMobileStyles();
        }

        setupEventListeners() {
            // Toggle mobile menu
            addEventListenerSafe(this.navbarToggler, 'click', (e) => {
                e.preventDefault();
                this.toggle();
            });

            // Close mobile menu when clicking on nav links
            this.navLinks.forEach(link => {
                addEventListenerSafe(link, 'click', () => {
                    if (isMobile() && this.isOpen) {
                        this.close();
                    }
                });
            });

            // Close mobile menu when clicking outside
            addEventListenerSafe(document, 'click', (e) => {
                if (this.isOpen && 
                    !this.navbarToggler.contains(e.target) && 
                    !this.navbarCollapse.contains(e.target)) {
                    this.close();
                }
            });

            // Handle window resize
            addEventListenerSafe(window, 'resize', () => {
                this.handleResize();
            });

            // Handle escape key
            addEventListenerSafe(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.navbarCollapse.classList.add('show');
            this.navbarToggler.setAttribute('aria-expanded', 'true');
            
            // Prevent body scroll on mobile
            if (isMobile()) {
                document.body.style.overflow = 'hidden';
            }
        }

        close() {
            this.isOpen = false;
            this.navbarCollapse.classList.remove('show');
            this.navbarToggler.setAttribute('aria-expanded', 'false');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }

        applyMobileStyles() {
            if (!this.navbarCollapse) return;

            // Apply consistent mobile menu styles
            this.navbarCollapse.style.cssText = `
                background: ${CONFIG.colors.background} !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                border-radius: 8px !important;
                margin-top: 10px !important;
                padding: 15px !important;
            `;

            // Style mobile nav links
            this.navLinks.forEach(link => {
                link.style.cssText = `
                    color: ${CONFIG.colors.text} !important;
                    padding: 12px 15px !important;
                    border-bottom: 1px solid #f0f0f0 !important;
                    margin-bottom: 5px !important;
                    border-radius: 5px !important;
                    transition: all 0.3s ease !important;
                `;

                // Add hover effect
                link.addEventListener('mouseenter', () => {
                    if (isMobile()) {
                        link.style.color = CONFIG.colors.primary;
                        link.style.background = CONFIG.colors.dropdownHover;
                    }
                });

                link.addEventListener('mouseleave', () => {
                    if (isMobile()) {
                        link.style.color = CONFIG.colors.text;
                        link.style.background = 'transparent';
                    }
                });
            });
        }

        handleResize() {
            // Close mobile menu when switching to desktop
            if (isDesktop() && this.isOpen) {
                this.close();
            }
        }
    }

    // ===========================================
    // NAVBAR SCROLL MANAGEMENT
    // ===========================================
    
    class NavbarScrollManager {
        constructor() {
            this.navbar = getElement(CONFIG.selectors.navbar);
            this.lastScrollY = window.scrollY;
            this.isScrolled = false;
            this.init();
        }

        init() {
            if (!this.navbar) {
                console.warn('Navbar element not found');
                return;
            }

            this.setupEventListeners();
            this.updateNavbarState();
        }

        setupEventListeners() {
            // Throttled scroll handler for better performance
            let ticking = false;
            
            addEventListenerSafe(window, 'scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Handle window resize
            addEventListenerSafe(window, 'resize', () => {
                this.updateNavbarState();
            });
        }

        handleScroll() {
            const currentScrollY = window.scrollY;
            const scrollThreshold = 50;

            // Update navbar state based on scroll position
            if (currentScrollY > scrollThreshold && !this.isScrolled) {
                this.isScrolled = true;
                this.navbar.classList.add('navbar-scrolled');
                this.updateNavbarState();
            } else if (currentScrollY <= scrollThreshold && this.isScrolled) {
                this.isScrolled = false;
                this.navbar.classList.remove('navbar-scrolled');
                this.updateNavbarState();
            }

            this.lastScrollY = currentScrollY;
        }

        updateNavbarState() {
            if (!this.navbar) return;

            // Apply consistent navbar styles regardless of scroll state
            this.navbar.style.cssText = `
                background: ${CONFIG.colors.background} !important;
                background-color: ${CONFIG.colors.background} !important;
                border-bottom: 1px solid #e9ecef !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                padding: 15px 0 !important;
                transition: all 0.3s ease !important;
            `;

            // Update nav links color
            const navLinks = getElements(CONFIG.selectors.navLinks);
            navLinks.forEach(link => {
                link.style.color = CONFIG.colors.text + ' !important';
            });
        }
    }

    // ===========================================
    // NAVIGATION LINK MANAGEMENT
    // ===========================================
    
    class NavigationManager {
        constructor() {
            this.navLinks = getElements(CONFIG.selectors.navLinks);
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.applyNavigationStyles();
            this.setActiveLink();
        }

        setupEventListeners() {
            // Handle nav link clicks
            this.navLinks.forEach(link => {
                addEventListenerSafe(link, 'click', (e) => {
                    this.handleNavClick(e, link);
                });

                // Add hover effects
                addEventListenerSafe(link, 'mouseenter', () => {
                    this.handleNavHover(link, true);
                });

                addEventListenerSafe(link, 'mouseleave', () => {
                    this.handleNavHover(link, false);
                });
            });
        }

        handleNavClick(e, link) {
            // Remove active class from all links
            this.navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to clicked link
            link.classList.add('active');

            // Update URL if it's a hash link
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                this.scrollToSection(href);
            }
        }

        handleNavHover(link, isHovering) {
            if (isHovering) {
                link.style.color = CONFIG.colors.primary + ' !important';
                link.style.transform = 'translateY(-1px)';
            } else {
                link.style.color = CONFIG.colors.text + ' !important';
                link.style.transform = 'translateY(0)';
            }
        }

        applyNavigationStyles() {
            this.navLinks.forEach(link => {
                // Apply consistent navigation styles
                link.style.cssText = `
                    color: ${CONFIG.colors.text} !important;
                    font-weight: 500 !important;
                    text-decoration: none !important;
                    padding: 10px 15px !important;
                    transition: all 0.3s ease !important;
                    position: relative !important;
                    overflow: hidden !important;
                `;

                // Add underline animation
                this.addUnderlineAnimation(link);
            });
        }

        addUnderlineAnimation(link) {
            // Create underline element
            const underline = document.createElement('span');
            underline.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                background-color: ${CONFIG.colors.primary};
                transition: width 0.3s ease;
            `;

            link.appendChild(underline);

            // Add hover effects
            addEventListenerSafe(link, 'mouseenter', () => {
                underline.style.width = '100%';
            });

            addEventListenerSafe(link, 'mouseleave', () => {
                if (!link.classList.contains('active')) {
                    underline.style.width = '0';
                }
            });

            // Keep underline for active link
            if (link.classList.contains('active')) {
                underline.style.width = '100%';
            }
        }

        setActiveLink() {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';

            this.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage || 
                    (currentPage === '' && href === 'index.html') ||
                    (currentPage === 'index.html' && href === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }

        scrollToSection(hash) {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================
    
    /**
     * Initialize all navbar functionality
     */
    function initializeNavbarStabilize() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        function init() {
            try {
                // Initialize all managers
                new DropdownManager();
                new MobileMenuManager();
                new NavbarScrollManager();
                new NavigationManager();

                console.log('Navbar Stabilize Pack initialized successfully');
            } catch (error) {
                console.error('Error initializing Navbar Stabilize Pack:', error);
            }
        }
    }

    // ===========================================
    // PUBLIC API
    // ===========================================
    
    // Expose public methods
    window.NavbarStabilize = {
        init: initializeNavbarStabilize,
        config: CONFIG,
        version: '1.0.0'
    };

    // Auto-initialize
    initializeNavbarStabilize();

})();