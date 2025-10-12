/**
 * @jest-environment jsdom
 */

// Import the script file to test
require('../script.js');

describe('DOM Functionality', () => {
    beforeEach(() => {
        document.body.innerHTML = '';

        // Reset any global state
        window.scrollY = 0;

        // Clear all timers
        jest.clearAllTimers();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    describe('Mobile Navigation', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul class="nav-menu">
                    <li><a href="#home" class="nav-link">Home</a></li>
                    <li><a href="#about" class="nav-link">About</a></li>
                </ul>
            `;
        });

        test('should toggle mobile menu on hamburger click', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');

            // Simulate click
            hamburger.click();

            expect(navMenu.classList.contains('active')).toBe(true);
            expect(hamburger.classList.contains('active')).toBe(true);

            // Click again to close
            hamburger.click();

            expect(navMenu.classList.contains('active')).toBe(false);
            expect(hamburger.classList.contains('active')).toBe(false);
        });

        test('should close mobile menu when nav link is clicked', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            const navLink = document.querySelector('.nav-link');

            // Open menu first
            hamburger.click();
            expect(navMenu.classList.contains('active')).toBe(true);

            // Click nav link
            navLink.click();

            expect(navMenu.classList.contains('active')).toBe(false);
            expect(hamburger.classList.contains('active')).toBe(false);
        });
    });

    describe('Smooth Scrolling', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <a href="#section1">Link to Section 1</a>
                <section id="section1">Section 1 Content</section>
            `;

            // Mock scrollIntoView
            Element.prototype.scrollIntoView = jest.fn();
        });

        test('should enable smooth scrolling for anchor links', () => {
            const link = document.querySelector('a[href="#section1"]');
            const section = document.querySelector('#section1');

            // Create and dispatch click event
            const clickEvent = new Event('click', { bubbles: true });
            link.dispatchEvent(clickEvent);

            expect(section.scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    describe('Header Background on Scroll', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <header class="header"></header>
            `;
        });

        test('should change header background when scrolled down', () => {
            const header = document.querySelector('.header');

            // Mock scrollY
            Object.defineProperty(window, 'scrollY', {
                writable: true,
                value: 150
            });

            // Trigger scroll event
            window.dispatchEvent(new Event('scroll'));

            expect(header.style.background).toBe('rgba(255, 255, 255, 0.98)');
            expect(header.style.boxShadow).toBe('0 2px 20px rgba(0, 0, 0, 0.1)');
        });

        test('should reset header background when at top', () => {
            const header = document.querySelector('.header');

            // Mock scrollY
            Object.defineProperty(window, 'scrollY', {
                writable: true,
                value: 50
            });

            // Trigger scroll event
            window.dispatchEvent(new Event('scroll'));

            expect(header.style.background).toBe('rgba(255, 255, 255, 0.95)');
            expect(header.style.boxShadow).toBe('none');
        });
    });

    describe('Contact Form', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            `;

            // Mock alert
            global.alert = jest.fn();
        });

        test('should validate required fields', () => {
            const form = document.querySelector('.contact-form');
            const submitEvent = new Event('submit', { bubbles: true });

            form.dispatchEvent(submitEvent);

            expect(global.alert).toHaveBeenCalledWith('Please fill in all fields');
        });

        test('should validate email format', () => {
            const form = document.querySelector('.contact-form');
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const messageInput = form.querySelector('textarea');

            nameInput.value = 'John Doe';
            emailInput.value = 'invalid-email';
            messageInput.value = 'Test message';

            const submitEvent = new Event('submit', { bubbles: true });
            form.dispatchEvent(submitEvent);

            expect(global.alert).toHaveBeenCalledWith('Please enter a valid email address');
        });

        test('should submit form with valid data', () => {
            const form = document.querySelector('.contact-form');
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const messageInput = form.querySelector('textarea');
            const submitBtn = form.querySelector('button[type="submit"]');

            nameInput.value = 'John Doe';
            emailInput.value = 'john@example.com';
            messageInput.value = 'Test message';

            const submitEvent = new Event('submit', { bubbles: true });
            form.dispatchEvent(submitEvent);

            expect(submitBtn.textContent).toBe('Sending...');
            expect(submitBtn.disabled).toBe(true);

            // Fast-forward time
            jest.advanceTimersByTime(1500);

            expect(global.alert).toHaveBeenCalledWith('Thank you for your message! I\'ll get back to you soon.');
        });
    });

    describe('Email Validation', () => {
        test('should validate correct email formats', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
            expect(isValidEmail('user+tag@example.org')).toBe(true);
        });

        test('should reject invalid email formats', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
            expect(isValidEmail('user@domain')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });

    describe('Active Navigation Link Highlighting', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <nav>
                    <a href="#home" class="nav-link">Home</a>
                    <a href="#about" class="nav-link">About</a>
                    <a href="#projects" class="nav-link">Projects</a>
                </nav>
                <section id="home" style="height: 800px;"></section>
                <section id="about" style="height: 800px;"></section>
                <section id="projects" style="height: 800px;"></section>
            `;

            // Mock element properties
            const sections = document.querySelectorAll('section[id]');
            sections.forEach((section, index) => {
                Object.defineProperty(section, 'offsetTop', {
                    value: index * 800
                });
                Object.defineProperty(section, 'clientHeight', {
                    value: 800
                });
            });
        });

        test('should highlight correct navigation link based on scroll position', () => {
            // Mock pageYOffset for 'about' section
            Object.defineProperty(window, 'pageYOffset', {
                writable: true,
                value: 800
            });

            // Trigger the highlighting function
            highlightNavLink();

            const homeLink = document.querySelector('a[href="#home"]');
            const aboutLink = document.querySelector('a[href="#about"]');

            expect(homeLink.classList.contains('active')).toBe(false);
            expect(aboutLink.classList.contains('active')).toBe(true);
        });
    });

    describe('Intersection Observer', () => {
        let mockObserver;

        beforeEach(() => {
            mockObserver = {
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn()
            };

            global.IntersectionObserver = jest.fn((callback) => {
                mockObserver.callback = callback;
                return mockObserver;
            });

            document.body.innerHTML = `
                <div class="project-card" style="opacity: 0; transform: translateY(30px);"></div>
                <div class="skill-category" style="opacity: 0; transform: translateY(30px);"></div>
                <div class="stat" style="opacity: 0; transform: translateY(30px);"></div>
            `;
        });

        test('should set up intersection observer for animation elements', () => {
            // Trigger DOMContentLoaded
            document.dispatchEvent(new Event('DOMContentLoaded'));

            expect(global.IntersectionObserver).toHaveBeenCalled();
            expect(mockObserver.observe).toHaveBeenCalledTimes(3);
        });

        test('should animate elements when they become visible', () => {
            document.dispatchEvent(new Event('DOMContentLoaded'));

            const element = document.querySelector('.project-card');

            // Simulate intersection
            mockObserver.callback([{
                target: element,
                isIntersecting: true
            }]);

            expect(element.style.opacity).toBe('1');
            expect(element.style.transform).toBe('translateY(0)');
        });
    });
});

describe('Utility Functions', () => {
    describe('typeWriter effect', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            document.body.innerHTML = '<h1 class="hero-title"></h1>';
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should type text character by character', () => {
            const element = document.querySelector('.hero-title');
            const text = 'Hello World';

            typeWriter(element, text, 50);

            // Initially empty
            expect(element.innerHTML).toBe('');

            // After first character
            jest.advanceTimersByTime(50);
            expect(element.innerHTML).toBe('H');

            // After a few more characters
            jest.advanceTimersByTime(200);
            expect(element.innerHTML).toBe('Hello');

            // Complete the animation
            jest.advanceTimersByTime(500);
            expect(element.innerHTML).toBe(text);
        });
    });
});