/**
 * @jest-environment jsdom
 */

// Import the script file to test
require('../script.js');

describe('GitHubPortfolio', () => {
    let githubPortfolio;
    let mockConfig;

    beforeEach(() => {
        mockConfig = {
            username: 'testuser',
            maxRepos: 6,
            excludeRepos: ['testuser', '.github.io'],
            includePrivate: false
        };
        githubPortfolio = new GitHubPortfolio(mockConfig);

        // Clear fetch mock
        fetch.mockClear();
    });

    describe('constructor', () => {
        test('should initialize with correct config', () => {
            expect(githubPortfolio.config).toEqual(mockConfig);
            expect(githubPortfolio.apiBase).toBe('https://api.github.com');
            expect(githubPortfolio.cache).toBeInstanceOf(Map);
            expect(githubPortfolio.cacheTimeout).toBe(5 * 60 * 1000);
        });
    });

    describe('fetchWithCache', () => {
        test('should fetch data successfully', async () => {
            const mockData = { id: 1, name: 'test-repo' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData
            });

            const result = await githubPortfolio.fetchWithCache('https://api.github.com/test');

            expect(fetch).toHaveBeenCalledWith('https://api.github.com/test');
            expect(result).toEqual(mockData);
        });

        test('should return cached data if available and not expired', async () => {
            const mockData = { id: 1, name: 'cached-repo' };
            const url = 'https://api.github.com/test';

            // Set cache manually
            githubPortfolio.cache.set(url, {
                data: mockData,
                timestamp: Date.now()
            });

            const result = await githubPortfolio.fetchWithCache(url);

            expect(fetch).not.toHaveBeenCalled();
            expect(result).toEqual(mockData);
        });

        test('should throw error on failed fetch', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            });

            await expect(githubPortfolio.fetchWithCache('https://api.github.com/test'))
                .rejects.toThrow('HTTP 404: Not Found');
        });

        test('should throw error on network failure', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(githubPortfolio.fetchWithCache('https://api.github.com/test'))
                .rejects.toThrow('Network error');
        });
    });

    describe('getUserData', () => {
        test('should fetch user data', async () => {
            const mockUserData = {
                login: 'testuser',
                name: 'Test User',
                bio: 'Test bio'
            };

            jest.spyOn(githubPortfolio, 'fetchWithCache').mockResolvedValue(mockUserData);

            const result = await githubPortfolio.getUserData();

            expect(githubPortfolio.fetchWithCache).toHaveBeenCalledWith(
                'https://api.github.com/users/testuser'
            );
            expect(result).toEqual(mockUserData);
        });
    });

    describe('getRepositories', () => {
        test('should fetch and filter repositories correctly', async () => {
            const mockRepos = [
                { name: 'repo1', fork: false, private: false, updated_at: '2024-01-01' },
                { name: 'repo2', fork: true, private: false, updated_at: '2024-01-02' }, // Should be filtered out (fork)
                { name: 'testuser', fork: false, private: false, updated_at: '2024-01-03' }, // Should be filtered out (excluded)
                { name: 'repo3', fork: false, private: true, updated_at: '2024-01-04' }, // Should be filtered out (private)
                { name: 'repo4', fork: false, private: false, updated_at: '2024-01-05' },
                { name: 'repo5', fork: false, private: false, updated_at: '2024-01-06' }
            ];

            jest.spyOn(githubPortfolio, 'fetchWithCache').mockResolvedValue(mockRepos);

            const result = await githubPortfolio.getRepositories();

            expect(githubPortfolio.fetchWithCache).toHaveBeenCalledWith(
                'https://api.github.com/users/testuser/repos?sort=updated&per_page=50'
            );

            // Should return only non-fork, non-excluded, non-private repos
            expect(result).toHaveLength(3);
            expect(result.map(r => r.name)).toEqual(['repo1', 'repo4', 'repo5']);
        });

        test('should respect maxRepos limit', async () => {
            const mockRepos = Array.from({ length: 10 }, (_, i) => ({
                name: `repo${i}`,
                fork: false,
                private: false,
                updated_at: `2024-01-${String(i + 1).padStart(2, '0')}`
            }));

            jest.spyOn(githubPortfolio, 'fetchWithCache').mockResolvedValue(mockRepos);

            const result = await githubPortfolio.getRepositories();

            expect(result).toHaveLength(6); // maxRepos = 6
        });
    });

    describe('getLanguages', () => {
        test('should fetch languages for a repository', async () => {
            const mockLanguages = {
                'JavaScript': 75000,
                'CSS': 25000,
                'HTML': 10000
            };

            jest.spyOn(githubPortfolio, 'fetchWithCache').mockResolvedValue(mockLanguages);

            const result = await githubPortfolio.getLanguages('test-repo');

            expect(githubPortfolio.fetchWithCache).toHaveBeenCalledWith(
                'https://api.github.com/repos/testuser/test-repo/languages'
            );
            expect(result).toEqual(mockLanguages);
        });

        test('should return empty object on error', async () => {
            jest.spyOn(githubPortfolio, 'fetchWithCache').mockRejectedValue(new Error('Not found'));

            const result = await githubPortfolio.getLanguages('test-repo');

            expect(result).toEqual({});
        });
    });

    describe('getLanguageIcon', () => {
        test('should return correct icons for known languages', () => {
            expect(githubPortfolio.getLanguageIcon('JavaScript')).toBe('fab fa-js-square');
            expect(githubPortfolio.getLanguageIcon('Python')).toBe('fab fa-python');
            expect(githubPortfolio.getLanguageIcon('React')).toBe('fab fa-react');
            expect(githubPortfolio.getLanguageIcon('HTML')).toBe('fab fa-html5');
        });

        test('should return default icon for unknown languages', () => {
            expect(githubPortfolio.getLanguageIcon('UnknownLanguage')).toBe('fas fa-code');
            expect(githubPortfolio.getLanguageIcon('')).toBe('fas fa-code');
            expect(githubPortfolio.getLanguageIcon(null)).toBe('fas fa-code');
        });
    });

    describe('formatDate', () => {
        test('should format date correctly', () => {
            const result = githubPortfolio.formatDate('2024-01-15T10:30:00Z');
            expect(result).toBe('Jan 2024');
        });

        test('should handle different date formats', () => {
            expect(githubPortfolio.formatDate('2023-12-01')).toBe('Dec 2023');
            expect(githubPortfolio.formatDate('2023-06-15T00:00:00.000Z')).toBe('Jun 2023');
        });
    });

    describe('createProjectCard', () => {
        test('should create project card HTML correctly', () => {
            const mockRepo = {
                name: 'test-repo',
                description: 'A test repository',
                html_url: 'https://github.com/testuser/test-repo',
                homepage: 'https://testuser.github.io/test-repo',
                stargazers_count: 5,
                forks_count: 2,
                updated_at: '2024-01-15T10:30:00Z'
            };

            const mockLanguages = {
                'JavaScript': 75000,
                'CSS': 25000,
                'HTML': 10000
            };

            const result = githubPortfolio.createProjectCard(mockRepo, mockLanguages);

            expect(result).toContain('Test Repo'); // Name formatting
            expect(result).toContain('A test repository'); // Description
            expect(result).toContain('fas fa-star'); // Stars icon
            expect(result).toContain('5'); // Star count
            expect(result).toContain('fas fa-code-branch'); // Forks icon
            expect(result).toContain('2'); // Fork count
            expect(result).toContain('Jan 2024'); // Formatted date
            expect(result).toContain('JavaScript'); // Languages
            expect(result).toContain('CSS');
            expect(result).toContain('HTML');
            expect(result).toContain('https://github.com/testuser/test-repo'); // GitHub link
            expect(result).toContain('https://testuser.github.io/test-repo'); // Homepage link
        });

        test('should handle missing description and homepage', () => {
            const mockRepo = {
                name: 'test-repo',
                description: null,
                html_url: 'https://github.com/testuser/test-repo',
                homepage: null,
                stargazers_count: 0,
                forks_count: 0,
                updated_at: '2024-01-15T10:30:00Z'
            };

            const result = githubPortfolio.createProjectCard(mockRepo, {});

            expect(result).toContain('No description available.'); // Default description
            expect(result).not.toContain('Live Demo'); // No homepage link
        });
    });
});

describe('loadGitHubProjects', () => {
    beforeEach(() => {
        // Set up DOM elements
        document.body.innerHTML = `
            <div id="projects-loading" style="display: none;"></div>
            <div id="projects-error" style="display: none;"></div>
            <div id="projects-grid"></div>
            <div class="projects-footer">
                <a href="#" target="_blank"></a>
            </div>
        `;

        // Mock window.GITHUB_CONFIG
        window.GITHUB_CONFIG = {
            username: 'testuser',
            maxRepos: 3,
            excludeRepos: [],
            includePrivate: false
        };
    });

    test('should load projects successfully', async () => {
        const mockRepos = [
            {
                name: 'repo1',
                description: 'Test repo 1',
                html_url: 'https://github.com/testuser/repo1',
                homepage: null,
                stargazers_count: 1,
                forks_count: 0,
                updated_at: '2024-01-01T00:00:00Z',
                fork: false,
                private: false
            }
        ];

        const mockLanguages = { 'JavaScript': 100 };

        // Mock GitHubPortfolio methods
        const mockGitHubPortfolio = {
            getRepositories: jest.fn().mockResolvedValue(mockRepos),
            getLanguages: jest.fn().mockResolvedValue(mockLanguages),
            createProjectCard: jest.fn().mockReturnValue('<div class="project-card">Test Card</div>')
        };

        // Mock the GitHubPortfolio constructor
        global.GitHubPortfolio = jest.fn().mockReturnValue(mockGitHubPortfolio);

        await loadGitHubProjects();

        expect(document.getElementById('projects-loading').style.display).toBe('none');
        expect(document.getElementById('projects-error').style.display).toBe('none');
        expect(document.getElementById('projects-grid').innerHTML).toContain('Test Card');
    });

    test('should show error when no config is available', async () => {
        window.GITHUB_CONFIG = null;

        await loadGitHubProjects();

        expect(document.getElementById('projects-loading').style.display).toBe('none');
        expect(document.getElementById('projects-error').style.display).toBe('block');
    });

    test('should show error when API call fails', async () => {
        const mockGitHubPortfolio = {
            getRepositories: jest.fn().mockRejectedValue(new Error('API Error'))
        };

        global.GitHubPortfolio = jest.fn().mockReturnValue(mockGitHubPortfolio);

        await loadGitHubProjects();

        expect(document.getElementById('projects-loading').style.display).toBe('none');
        expect(document.getElementById('projects-error').style.display).toBe('block');
    });
});