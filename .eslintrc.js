module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    globals: {
        GitHubPortfolio: 'readonly',
        loadGitHubProjects: 'readonly',
        showProjectsError: 'readonly',
        highlightNavLink: 'readonly',
        isValidEmail: 'readonly',
        typeWriter: 'readonly',
        gtag: 'readonly'
    },
    rules: {
        // Error Prevention
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-alert': 'warn',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-undef': 'error',

        // Best Practices
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'default-case': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-loop-func': 'error',
        'no-new-wrappers': 'error',
        'no-throw-literal': 'error',
        'prefer-const': 'error',
        'no-var': 'error',

        // Style
        'indent': ['error', 4, { SwitchCase: 1 }],
        'quotes': ['error', 'single', { avoidEscape: true }],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'keyword-spacing': 'error',
        'space-infix-ops': 'error',
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],

        // ES6+
        'arrow-spacing': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-template': 'error',
        'template-curly-spacing': 'error'
    },
    overrides: [
        {
            files: ['tests/**/*.js'],
            env: {
                jest: true
            },
            rules: {
                'no-console': 'off'
            }
        }
    ]
};