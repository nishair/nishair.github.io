/**
 * Tests for new website features
 */

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Import the script functions
const {
    initializeThemeToggle,
    animateSkillBars,
    initializeScrollToTop
} = require('../script.js');

describe('Theme Toggle', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="theme-toggle" aria-label="Toggle dark mode">
                <i class="fas fa-moon"></i>
            </button>
        `;
        document.body.removeAttribute('data-theme');
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
    });

    test('should initialize theme from localStorage', () => {
        localStorageMock.getItem.mockReturnValue('dark');

        initializeThemeToggle();

        expect(document.body.getAttribute('data-theme')).toBe('dark');
    });

    test('should toggle theme on button click', () => {
        localStorageMock.getItem.mockReturnValue('light');

        initializeThemeToggle();

        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.click();

        expect(document.body.getAttribute('data-theme')).toBe('dark');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should default to light theme when no preference saved', () => {
        localStorageMock.getItem.mockReturnValue(null);

        initializeThemeToggle();

        expect(document.body.getAttribute('data-theme')).toBe('light');
    });
});

describe('Skill Progress Bars', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="skill-progress-bar" data-percentage="90"></div>
            <div class="skill-progress-bar" data-percentage="75"></div>
        `;
    });

    test('should animate skill bars when in view', () => {

        // Mock IntersectionObserver callback
        const mockObserver = {
            observe: jest.fn(),
            unobserve: jest.fn()
        };
        global.IntersectionObserver.mockImplementation((callback) => {
            // Call callback synchronously for testing
            const target = document.querySelector('[data-percentage="90"]');
            if (target) {
                callback([{
                    isIntersecting: true,
                    target: target
                }]);
            }
            return mockObserver;
        });

        animateSkillBars();

        const skillBar = document.querySelector('[data-percentage="90"]');
        expect(skillBar.style.width).toBe('90%');
    });
});

describe('Scroll to Top Button', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="scroll-to-top" aria-label="Scroll to top">
                <i class="fas fa-chevron-up"></i>
            </button>
        `;

        // Mock window.scrollTo
        global.scrollTo = jest.fn();

        // Mock pageYOffset
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            value: 0
        });
    });

    test('should show button when scrolled down', () => {
        initializeScrollToTop();

        // Simulate scroll
        window.pageYOffset = 400;
        window.dispatchEvent(new Event('scroll'));

        const scrollButton = document.getElementById('scroll-to-top');
        expect(scrollButton.classList.contains('visible')).toBe(true);
    });

    test('should hide button when at top', () => {
        initializeScrollToTop();

        // Simulate being at top
        window.pageYOffset = 100;
        window.dispatchEvent(new Event('scroll'));

        const scrollButton = document.getElementById('scroll-to-top');
        expect(scrollButton.classList.contains('visible')).toBe(false);
    });

    test('should scroll to top when clicked', () => {
        initializeScrollToTop();

        const scrollButton = document.getElementById('scroll-to-top');
        scrollButton.click();

        expect(global.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        });
    });
});

describe('Feature Integration', () => {
    test('should handle missing DOM elements gracefully', () => {
        document.body.innerHTML = ''; // Empty DOM

        const initializeScrollToTop = global.initializeScrollToTop;

        // Should not throw errors
        expect(() => {
            initializeThemeToggle();
            initializeScrollToTop();
        }).not.toThrow();
    });
});