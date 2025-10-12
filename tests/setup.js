// Jest setup file
// Global test setup and configuration

// Mock fetch for API testing
global.fetch = jest.fn();

// Mock window.GITHUB_CONFIG
window.GITHUB_CONFIG = {
    username: 'testuser',
    maxRepos: 6,
    excludeRepos: ['testuser', '.github.io'],
    includePrivate: false
};

// Mock DOM elements that might not exist during testing
Object.defineProperty(window, 'location', {
    value: {
        href: 'http://localhost',
        origin: 'http://localhost'
    },
    writable: true
});

// Mock window properties
Object.defineProperty(window, 'pageYOffset', {
    value: 0,
    writable: true
});

Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true
});

// Mock alert and other browser APIs
global.alert = jest.fn();
global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Console error suppression for expected errors during testing
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning:') || args[0].includes('Error:'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };

    console.warn = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning:')
        ) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';

    // Reset window properties
    window.pageYOffset = 0;
    window.scrollY = 0;
});