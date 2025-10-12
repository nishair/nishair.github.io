module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:8000'],
            startServerCommand: 'npm run serve',
            startServerReadyPattern: 'Serving HTTP',
            numberOfRuns: 3
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.8 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['warn', { minScore: 0.8 }],
                'categories:seo': ['warn', { minScore: 0.8 }],
                'categories:pwa': 'off'
            }
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};