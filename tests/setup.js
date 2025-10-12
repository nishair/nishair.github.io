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

// Console error suppression for expected errors during testing
const originalError = console.error;
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
});

afterAll(() => {
    console.error = originalError;
});

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
});