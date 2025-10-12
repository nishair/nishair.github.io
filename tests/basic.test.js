/**
 * @jest-environment jsdom
 */

describe('Portfolio Basic Tests', () => {
    // Simple function tests
    describe('Email Validation', () => {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

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

    describe('GitHubPortfolio Class', () => {
        class GitHubPortfolio {
            constructor(config) {
                this.config = config;
                this.apiBase = 'https://api.github.com';
                this.cache = new Map();
                this.cacheTimeout = 5 * 60 * 1000;
            }

            getLanguageIcon(language) {
                const icons = {
                    'JavaScript': 'fab fa-js-square',
                    'TypeScript': 'fab fa-js-square',
                    'Python': 'fab fa-python',
                    'Java': 'fab fa-java',
                    'HTML': 'fab fa-html5',
                    'CSS': 'fab fa-css3-alt'
                };
                return icons[language] || 'fas fa-code';
            }

            formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                });
            }
        }

        let githubPortfolio;

        beforeEach(() => {
            const mockConfig = {
                username: 'testuser',
                maxRepos: 6,
                excludeRepos: ['testuser', '.github.io'],
                includePrivate: false
            };
            githubPortfolio = new GitHubPortfolio(mockConfig);
        });

        test('should initialize with correct config', () => {
            expect(githubPortfolio.config.username).toBe('testuser');
            expect(githubPortfolio.apiBase).toBe('https://api.github.com');
            expect(githubPortfolio.cache).toBeInstanceOf(Map);
        });

        test('should return correct icons for known languages', () => {
            expect(githubPortfolio.getLanguageIcon('JavaScript')).toBe('fab fa-js-square');
            expect(githubPortfolio.getLanguageIcon('Python')).toBe('fab fa-python');
            expect(githubPortfolio.getLanguageIcon('HTML')).toBe('fab fa-html5');
        });

        test('should return default icon for unknown languages', () => {
            expect(githubPortfolio.getLanguageIcon('UnknownLanguage')).toBe('fas fa-code');
            expect(githubPortfolio.getLanguageIcon('')).toBe('fas fa-code');
            expect(githubPortfolio.getLanguageIcon(null)).toBe('fas fa-code');
        });

        test('should format date correctly', () => {
            const result = githubPortfolio.formatDate('2024-01-15T10:30:00Z');
            expect(result).toBe('Jan 2024');
        });
    });

    describe('DOM Utilities', () => {
        test('should handle missing DOM elements gracefully', () => {
            document.body.innerHTML = '';

            // These should not throw errors
            expect(() => {
                const element = document.querySelector('.non-existent');
                if (element) {
                    element.style.display = 'none';
                }
            }).not.toThrow();
        });

        test('should create and manipulate DOM elements', () => {
            document.body.innerHTML = '<div id="test" style="display: block;"></div>';

            const element = document.getElementById('test');
            expect(element).not.toBeNull();
            expect(element.style.display).toBe('block');

            element.style.display = 'none';
            expect(element.style.display).toBe('none');
        });
    });

    describe('Array Filtering', () => {
        test('should filter repositories correctly', () => {
            const mockRepos = [
                { name: 'repo1', fork: false, private: false },
                { name: 'repo2', fork: true, private: false }, // Should be filtered out
                { name: 'testuser', fork: false, private: false }, // Should be filtered out
                { name: 'repo3', fork: false, private: true }, // Should be filtered out
                { name: 'repo4', fork: false, private: false }
            ];

            const config = {
                excludeRepos: ['testuser'],
                includePrivate: false,
                maxRepos: 10
            };

            const filtered = mockRepos
                .filter(repo => !repo.fork)
                .filter(repo => !config.excludeRepos.some(excluded => repo.name.includes(excluded)))
                .filter(repo => config.includePrivate || !repo.private)
                .slice(0, config.maxRepos);

            expect(filtered).toHaveLength(2);
            expect(filtered.map(r => r.name)).toEqual(['repo1', 'repo4']);
        });
    });

    describe('String Utilities', () => {
        test('should format repository names correctly', () => {
            const formatRepoName = (name) => {
                return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            };

            expect(formatRepoName('test-repo')).toBe('Test Repo');
            expect(formatRepoName('my-awesome-project')).toBe('My Awesome Project');
            expect(formatRepoName('simple')).toBe('Simple');
        });
    });
});