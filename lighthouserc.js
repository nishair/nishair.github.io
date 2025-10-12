module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000'],
            startServerCommand: 'npx http-server . -p 3000',
            startServerReadyPattern: 'Available on',
            numberOfRuns: 1
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.7 }],
                'categories:accessibility': ['warn', { minScore: 0.8 }],
                'categories:best-practices': ['warn', { minScore: 0.7 }],
                'categories:seo': ['warn', { minScore: 0.7 }],
                'categories:pwa': 'off'
            }
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};