# Deployment Guide

This guide explains how to deploy your portfolio website to GitHub Pages with automated CI/CD.

## 🚀 Quick Start

1. **Update Configuration**: Edit the GitHub username in `index.html`:
   ```javascript
   window.GITHUB_CONFIG = {
       username: 'your-github-username', // Replace with your actual username
       maxRepos: 6,
       excludeRepos: ['your-github-username', '.github.io'],
       includePrivate: false
   };
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"
   - The CI/CD pipeline will automatically deploy your site

3. **Push Changes**:
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

## 🔧 Manual Setup

### Prerequisites

- Node.js 18+ installed
- Git configured
- GitHub repository created

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Tests**:
   ```bash
   npm test
   npm run test:coverage
   ```

3. **Start Local Server**:
   ```bash
   npm run serve
   ```
   Your site will be available at `http://localhost:8000`

4. **Lint Code**:
   ```bash
   npm run lint
   npm run lint:fix
   ```

### GitHub Pages Setup

#### Option 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically:
- Runs tests and linting
- Performs security scans
- Runs accessibility tests
- Deploys to GitHub Pages on successful builds

#### Option 2: Manual Deployment

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## 🔄 CI/CD Pipeline

The automated pipeline includes:

### Continuous Integration
- **Code Quality**: ESLint linting
- **Testing**: Jest unit tests with coverage reporting
- **Security**: CodeQL analysis
- **Accessibility**: Lighthouse CI testing
- **Performance**: Core Web Vitals monitoring

### Continuous Deployment
- **Automatic Deployment**: Deploys to GitHub Pages on main branch pushes
- **Preview Deployments**: Creates preview deployments for pull requests
- **Rollback Support**: Easy rollback to previous versions

### Pipeline Stages

1. **Code Quality Checks**
   ```
   ├── Linting (ESLint)
   ├── Unit Tests (Jest)
   ├── Coverage Reports
   └── Build Verification
   ```

2. **Security & Performance**
   ```
   ├── CodeQL Security Scan
   ├── Dependency Vulnerability Check
   └── Lighthouse Performance Audit
   ```

3. **Deployment**
   ```
   ├── Production Build
   ├── GitHub Pages Deploy
   └── Success Notifications
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
The project maintains high test coverage for:
- GitHub API integration
- DOM manipulation functions
- Form validation
- Error handling
- Mobile navigation

### Accessibility Testing
```bash
# Run Lighthouse CI
npx lhci autorun
```

## 📊 Monitoring

### Performance Metrics
- **Core Web Vitals**: Monitored via Lighthouse CI
- **Bundle Size**: Tracked in CI pipeline
- **API Response Times**: GitHub API caching implemented

### Error Monitoring
- **Console Errors**: Tracked in browser
- **API Failures**: Graceful error handling with retry logic
- **Build Failures**: Automated notifications

## 🔒 Security

### Security Measures
- **CodeQL Analysis**: Automated vulnerability scanning
- **Dependency Scanning**: Regular security updates
- **Content Security Policy**: XSS protection
- **HTTPS Enforcement**: Secure connections only

### API Security
- **Rate Limiting**: GitHub API rate limit handling
- **Error Boundaries**: Graceful failure modes
- **No Secrets**: No API keys required for public repositories

## 🐛 Troubleshooting

### Common Issues

1. **GitHub API Rate Limiting**
   ```javascript
   // Check rate limit status
   console.log('Rate limit status:', response.headers.get('X-RateLimit-Remaining'));
   ```

2. **Deployment Failures**
   ```bash
   # Check GitHub Actions logs
   # Verify GitHub Pages settings
   # Ensure branch protection rules allow deployments
   ```

3. **Test Failures**
   ```bash
   # Run tests with verbose output
   npm test -- --verbose

   # Run specific test file
   npm test -- tests/github-portfolio.test.js
   ```

### Performance Issues

1. **Slow API Responses**
   - Check GitHub API status
   - Verify caching is working
   - Consider reducing `maxRepos` limit

2. **Large Bundle Size**
   - Review dependencies
   - Optimize images
   - Consider code splitting

## 📈 Optimization

### Performance Optimizations
- **Lazy Loading**: Images and content loaded on demand
- **Caching**: GitHub API responses cached for 5 minutes
- **Compression**: Gzip compression enabled
- **Minification**: CSS and JS minified in production

### SEO Optimizations
- **Meta Tags**: Proper meta descriptions and titles
- **Structured Data**: Schema.org markup
- **Sitemap**: XML sitemap generation
- **Open Graph**: Social media sharing optimization

## 🔄 Updates

### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update major versions (carefully)
npx npm-check-updates -u
npm install
```

### Content Updates
- **Projects**: Automatically synced from GitHub
- **Skills**: Update manually in `index.html`
- **Contact Info**: Update in `index.html`
- **Styling**: Modify `styles.css`

## 📞 Support

### Getting Help
- **Documentation**: Check README.md for basic setup
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

---

For more detailed information, see the [README.md](README.md) file.