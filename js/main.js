/**
 * Portfolio Website JavaScript
 * Handles navigation, animations, form submission, and interactive features
 * 
 * @author Your Name
 * @version 1.0.0
 */

(function() {
    'use strict';

    // =========================================================================
    // Global Variables and Configuration
    // =========================================================================

    const config = {
        // Scroll threshold for header background
        scrollThreshold: 100,
        // Animation delays and durations
        animationDelay: 100,
        animationDuration: 600,
        // Back to top button show threshold
        backToTopThreshold: 300,
        // Smooth scroll offset for fixed header
        scrollOffset: 80
    };

    // DOM Elements - cached for performance
    const elements = {
        header: null,
        navToggle: null,
        navMenu: null,
        navLinks: null,
        backToTop: null,
        contactForm: null,
        sections: null,
        animatedElements: null
    };

    // State management
    const state = {
        isMenuOpen: false,
        currentSection: 'home',
        isScrolling: false,
        animatedElementsObserver: null
    };

    // =========================================================================
    // Utility Functions
    // =========================================================================

    /**
     * Debounce function to limit the rate of function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute immediately
     * @returns {Function} Debounced function
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Throttle function to limit function execution frequency
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Get element offset top relative to document
     * @param {Element} element - DOM element
     * @returns {number} Offset top value
     */
    function getOffsetTop(element) {
        let offsetTop = 0;
        while (element) {
            offsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return offsetTop;
    }

    /**
     * Smooth scroll to target element or position
     * @param {Element|number} target - Target element or scroll position
     * @param {number} offset - Additional offset (default: scrollOffset)
     */
    function smoothScrollTo(target, offset = config.scrollOffset) {
        const targetPosition = typeof target === 'number' 
            ? target 
            : getOffsetTop(target) - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Add class with animation delay
     * @param {Element} element - DOM element
     * @param {string} className - Class name to add
     * @param {number} delay - Delay in milliseconds
     */
    function addClassWithDelay(element, className, delay = 0) {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    }

    // =========================================================================
    // DOM Initialization
    // =========================================================================

    /**
     * Cache DOM elements for performance
     */
    function cacheDOMElements() {
        elements.header = document.querySelector('.header');
        elements.navToggle = document.querySelector('.nav-toggle');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.navLinks = document.querySelectorAll('.nav-link');
        elements.backToTop = document.querySelector('.back-to-top');
        elements.contactForm = document.querySelector('.contact-form');
        elements.sections = document.querySelectorAll('section[id]');
        elements.animatedElements = document.querySelectorAll('.project-card, .skill-category, .stat-item');
    }

    /**
     * Initialize all event listeners
     */
    function initializeEventListeners() {
        // Navigation toggle for mobile
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links smooth scrolling
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Back to top button
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', scrollToTop);
        }

        // Contact form submission
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleContactFormSubmit);
        }

        // Scroll events (throttled for performance)
        window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps

        // Resize events (debounced)
        window.addEventListener('resize', debounce(handleResize, 250));

        // Close mobile menu when clicking outside
        document.addEventListener('click', handleOutsideClick);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }

    // =========================================================================
    // Navigation Functions
    // =========================================================================

    /**
     * Toggle mobile navigation menu
     */
    function toggleMobileMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        
        elements.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
        elements.navMenu.classList.toggle('active', state.isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        
        // Focus management for accessibility
        if (state.isMenuOpen) {
            elements.navMenu.querySelector('.nav-link').focus();
        }
    }

    /**
     * Close mobile navigation menu
     */
    function closeMobileMenu() {
        if (state.isMenuOpen) {
            state.isMenuOpen = false;
            elements.navToggle.setAttribute('aria-expanded', 'false');
            elements.navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle navigation link clicks
     * @param {Event} event - Click event
     */
    function handleNavLinkClick(event) {
        event.preventDefault();
        
        const href = event.target.getAttribute('href');
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            closeMobileMenu();
            
            // Update active link
            updateActiveNavLink(href);
            
            // Smooth scroll to target
            smoothScrollTo(targetElement);
            
            // Update URL without triggering scroll
            history.pushState(null, null, href);
        }
    }

    /**
     * Update active navigation link
     * @param {string} activeHref - Active link href
     */
    function updateActiveNavLink(activeHref) {
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle clicks outside navigation menu
     * @param {Event} event - Click event
     */
    function handleOutsideClick(event) {
        if (state.isMenuOpen && 
            !elements.navMenu.contains(event.target) && 
            !elements.navToggle.contains(event.target)) {
            closeMobileMenu();
        }
    }

    /**
     * Handle keyboard navigation
     * @param {Event} event - Keydown event
     */
    function handleKeyDown(event) {
        // Close mobile menu on Escape key
        if (event.key === 'Escape' && state.isMenuOpen) {
            closeMobileMenu();
            elements.navToggle.focus();
        }
    }

    // =========================================================================
    // Scroll Functions
    // =========================================================================

    /**
     * Handle scroll events
     */
    function handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update header background
        updateHeaderBackground(scrollY);
        
        // Update back to top button visibility
        updateBackToTopVisibility(scrollY);
        
        // Update active section in navigation
        updateActiveSection(scrollY);
    }

    /**
     * Update header background based on scroll position
     * @param {number} scrollY - Current scroll position
     */
    function updateHeaderBackground(scrollY) {
        if (!elements.header) return;
        
        const isScrolled = scrollY > config.scrollThreshold;
        elements.header.classList.toggle('scrolled', isScrolled);
    }

    /**
     * Update back to top button visibility
     * @param {number} scrollY - Current scroll position
     */
    function updateBackToTopVisibility(scrollY) {
        if (!elements.backToTop) return;
        
        const shouldShow = scrollY > config.backToTopThreshold;
        elements.backToTop.classList.toggle('visible', shouldShow);
    }

    /**
     * Update active section based on scroll position
     * @param {number} scrollY - Current scroll position
     */
    function updateActiveSection(scrollY) {
        if (state.isScrolling) return;
        
        let currentSection = '';
        const offset = config.scrollOffset + 50;
        
        elements.sections.forEach(section => {
            const sectionTop = getOffsetTop(section) - offset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection && currentSection !== state.currentSection) {
            state.currentSection = currentSection;
            updateActiveNavLink(`#${currentSection}`);
        }
    }

    /**
     * Scroll to top of page
     */
    function scrollToTop() {
        smoothScrollTo(0, 0);
    }

    // =========================================================================
    // Animation Functions
    // =========================================================================

    /**
     * Initialize scroll-based animations using Intersection Observer
     */
    function initializeScrollAnimations() {
        // Check if browser supports Intersection Observer
        if (!('IntersectionObserver' in window)) {
            // Fallback: just add animation classes immediately
            elements.animatedElements.forEach(element => {
                element.classList.add('fade-in');
            });
            return;
        }

        // Create intersection observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        state.animatedElementsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add animation class with staggered delay
                    const delay = index * config.animationDelay;
                    addClassWithDelay(entry.target, 'fade-in', delay);
                    
                    // Stop observing this element
                    state.animatedElementsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Start observing elements
        elements.animatedElements.forEach(element => {
            state.animatedElementsObserver.observe(element);
        });
    }

    /**
     * Initialize hero section animations
     */
    function initializeHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroContent) {
            addClassWithDelay(heroContent, 'slide-in-left', 200);
        }
        
        if (heroVisual) {
            addClassWithDelay(heroVisual, 'slide-in-right', 400);
        }
    }

    // =========================================================================
    // Form Functions
    // =========================================================================

    /**
     * Handle contact form submission with EmailJS
     * @param {Event} event - Submit event
     */
    function handleContactFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.querySelector('.btn-text').textContent;
        
        // Get form values
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject') || 'Portfolio Contact Form',
            message: formData.get('message'),
            to_name: 'Portfolio Owner', // You can customize this
        };
        
        // Validate required fields
        if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.querySelector('.btn-text').textContent = 'Sending...';
        submitButton.classList.add('loading');
        
        // Try to send email using EmailJS
        if (typeof emailjs !== 'undefined') {
            // Initialize EmailJS with your public key
            emailjs.init('BK-GZ78Hg7xAlSaNn'); // Replace with your EmailJS public key
            
            // Send email using EmailJS
            emailjs.send('service_licubcj', 'template_ottw5st', templateParams)
                .then(() => {
                    showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                    form.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    showFormMessage('Sorry, there was an error sending your message. Please try again or contact me directly via email.', 'error');
                })
                .finally(() => {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.querySelector('.btn-text').textContent = originalButtonText;
                    submitButton.classList.remove('loading');
                });
        } else {
            // Fallback: show instructions to contact directly
            showFormMessage('Please contact me directly at your.email@example.com or set up EmailJS service for this form to work.', 'info');
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.querySelector('.btn-text').textContent = originalButtonText;
            submitButton.classList.remove('loading');
        }
    }

    /**
     * Show form submission message
     * @param {string} message - Message to display
     * @param {string} type - Message type ('success', 'error', or 'info')
     */
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        
        // Define colors based on type
        let backgroundColor, textColor, borderColor;
        switch (type) {
            case 'success':
                backgroundColor = '#dcfce7';
                textColor = '#166534';
                borderColor = '#bbf7d0';
                break;
            case 'error':
                backgroundColor = '#fee2e2';
                textColor = '#dc2626';
                borderColor = '#fecaca';
                break;
            case 'info':
            default:
                backgroundColor = '#dbeafe';
                textColor = '#1e40af';
                borderColor = '#bfdbfe';
                break;
        }
        
        // Add styles
        Object.assign(messageElement.style, {
            padding: '1rem',
            marginTop: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            backgroundColor: backgroundColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease-in-out'
        });
        
        // Insert message
        elements.contactForm.appendChild(messageElement);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // =========================================================================
    // Responsive Functions
    // =========================================================================

    /**
     * Handle window resize events
     */
    function handleResize() {
        // Close mobile menu on desktop resize
        if (window.innerWidth > 1023 && state.isMenuOpen) {
            closeMobileMenu();
        }
        
        // Recalculate scroll positions if needed
        if (state.currentSection) {
            updateActiveSection(window.pageYOffset);
        }
    }

    // =========================================================================
    // Performance Optimizations
    // =========================================================================

    /**
     * Preload critical resources
     */
    function preloadResources() {
        // Preload Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() { this.rel = 'stylesheet'; };
        document.head.appendChild(fontLink);
    }

    /**
     * Initialize performance monitoring
     */
    function initializePerformanceMonitoring() {
        // Mark navigation timing
        if ('performance' in window && 'mark' in performance) {
            performance.mark('portfolio-js-start');
        }
        
        // Log performance metrics after page load
        window.addEventListener('load', () => {
            if ('performance' in window && 'measure' in performance) {
                performance.mark('portfolio-js-end');
                performance.measure('portfolio-js-duration', 'portfolio-js-start', 'portfolio-js-end');
                
                // Optional: Send performance data to analytics
                const measure = performance.getEntriesByName('portfolio-js-duration')[0];
                console.log(`Portfolio JS initialization took ${measure.duration.toFixed(2)}ms`);
            }
        });
    }

    // =========================================================================
    // Accessibility Enhancements
    // =========================================================================

    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            z-index: 1001;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Announce page changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        
        // Store reference for later use
        window.announceToScreenReader = function(message) {
            announcer.textContent = message;
            setTimeout(() => { announcer.textContent = ''; }, 1000);
        };
    }

    // =========================================================================
    // Main Initialization
    // =========================================================================

    /**
     * Initialize the portfolio website
     */
    function init() {
        console.log('🚀 Initializing Portfolio Website...');
        
        // Check if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        try {
            // Initialize performance monitoring
            initializePerformanceMonitoring();
            
            // Cache DOM elements
            cacheDOMElements();
            
            // Initialize event listeners
            initializeEventListeners();
            
            // Initialize animations
            initializeScrollAnimations();
            initializeHeroAnimations();
            
            // Initialize accessibility features
            initializeAccessibility();
            
            // Preload resources
            preloadResources();
            
            // Handle initial URL hash
            const hash = window.location.hash;
            if (hash) {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    setTimeout(() => {
                        smoothScrollTo(targetElement);
                        updateActiveNavLink(hash);
                    }, 100);
                }
            }
            
            console.log('✅ Portfolio Website initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing portfolio website:', error);
        }
    }

    /**
     * Cleanup function for when the page is unloaded
     */
    function cleanup() {
        // Disconnect intersection observer
        if (state.animatedElementsObserver) {
            state.animatedElementsObserver.disconnect();
        }
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        console.log('🧹 Portfolio Website cleaned up');
    }

    // =========================================================================
    // Public API
    // =========================================================================

    // Expose useful functions globally for debugging/external use
    window.Portfolio = {
        init,
        cleanup,
        smoothScrollTo,
        toggleMobileMenu,
        closeMobileMenu,
        state: () => ({ ...state }), // Return copy of state
        elements: () => ({ ...elements }) // Return copy of elements
    };

    // =========================================================================
    // Auto-initialize
    // =========================================================================

    // Initialize when DOM is ready
    init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

})();
