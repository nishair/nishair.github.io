/**
 * Basic tests for new website features
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

// Mock scrollTo
global.scrollTo = jest.fn();

// Import the script functions
const {
    initializeThemeToggle,
    animateSkillBars,
    initializeScrollToTop
} = require('../script.js');

describe('New Features', () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '';
        // Reset mocks
        jest.clearAllMocks();
    });

    describe('Theme Toggle', () => {
        test('should be a function', () => {
            expect(typeof initializeThemeToggle).toBe('function');
        });

        test('should not throw when called', () => {
            expect(() => initializeThemeToggle()).not.toThrow();
        });

        test('should handle DOM with theme toggle button', () => {
            document.body.innerHTML = '<button id="theme-toggle"></button>';
            expect(() => initializeThemeToggle()).not.toThrow();
        });
    });

    describe('Skill Progress Bars', () => {
        test('should be a function', () => {
            expect(typeof animateSkillBars).toBe('function');
        });

        test('should not throw when called', () => {
            expect(() => animateSkillBars()).not.toThrow();
        });

        test('should handle DOM with skill bars', () => {
            document.body.innerHTML = '<div class="skill-progress-bar" data-percentage="90"></div>';
            expect(() => animateSkillBars()).not.toThrow();
        });
    });

    describe('Scroll to Top', () => {
        test('should be a function', () => {
            expect(typeof initializeScrollToTop).toBe('function');
        });

        test('should not throw when called', () => {
            expect(() => initializeScrollToTop()).not.toThrow();
        });

        test('should handle DOM with scroll button', () => {
            document.body.innerHTML = '<button id="scroll-to-top"></button>';
            expect(() => initializeScrollToTop()).not.toThrow();
        });
    });

    describe('Integration', () => {
        test('all functions should handle empty DOM gracefully', () => {
            document.body.innerHTML = '';

            expect(() => {
                initializeThemeToggle();
                animateSkillBars();
                initializeScrollToTop();
            }).not.toThrow();
        });

        test('all functions should be exported', () => {
            expect(initializeThemeToggle).toBeDefined();
            expect(animateSkillBars).toBeDefined();
            expect(initializeScrollToTop).toBeDefined();
        });
    });
});