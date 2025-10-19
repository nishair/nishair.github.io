// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Active navigation link highlighting
function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) {
        return;
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// GitHub API Integration
class GitHubPortfolio {
    constructor(config) {
        this.config = config;
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async fetchWithCache(url) {
        const cacheKey = url;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getUserData() {
        const url = `${this.apiBase}/users/${this.config.username}`;
        return await this.fetchWithCache(url);
    }

    async getRepositories() {
        const url = `${this.apiBase}/users/${this.config.username}/repos?sort=updated&per_page=50`;
        const repos = await this.fetchWithCache(url);

        return repos
            .filter(repo => !repo.fork) // Exclude forked repositories
            .filter(repo => !this.config.excludeRepos.some(excluded => repo.name.includes(excluded)))
            .filter(repo => this.config.includePrivate || !repo.private)
            .slice(0, this.config.maxRepos);
    }

    async getForkedRepositories() {
        const url = `${this.apiBase}/users/${this.config.username}/repos?sort=updated&per_page=50`;
        const repos = await this.fetchWithCache(url);

        // eslint-disable-next-line no-console
        console.log('All repositories:', repos.length);

        const forkedRepos = repos.filter(repo => repo.fork);
        // eslint-disable-next-line no-console
        console.log('Forked repositories before filtering:', forkedRepos.length, forkedRepos.map(r => r.name));

        const filteredRepos = forkedRepos
            .filter(repo => !this.config.excludeRepos.some(excluded => repo.name.includes(excluded)))
            .filter(repo => this.config.includePrivate || !repo.private)
            .slice(0, this.config.maxRepos);

        // eslint-disable-next-line no-console
        console.log('Final filtered forked repositories:', filteredRepos.length, filteredRepos.map(r => r.name));

        return filteredRepos;
    }

    async getLanguages(repoName) {
        const url = `${this.apiBase}/repos/${this.config.username}/${repoName}/languages`;
        try {
            return await this.fetchWithCache(url);
        } catch {
            return {};
        }
    }

    getLanguageIcon(language) {
        const icons = {
            'JavaScript': 'fab fa-js-square',
            'TypeScript': 'fab fa-js-square',
            'Python': 'fab fa-python',
            'Java': 'fab fa-java',
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'React': 'fab fa-react',
            'Vue': 'fab fa-vuejs',
            'Angular': 'fab fa-angular',
            'Node.js': 'fab fa-node-js',
            'PHP': 'fab fa-php',
            'Ruby': 'fas fa-gem',
            'Go': 'fas fa-code',
            'Rust': 'fas fa-cog',
            'C++': 'fas fa-code',
            'C#': 'fas fa-code',
            'Swift': 'fab fa-swift',
            'Kotlin': 'fas fa-mobile-alt',
            'Dart': 'fas fa-code',
            'Shell': 'fas fa-terminal'
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

    createProjectCard(repo, languages) {
        const primaryLanguage = Object.keys(languages)[0] || 'Code';
        const languageIcon = this.getLanguageIcon(primaryLanguage);
        const topLanguages = Object.keys(languages).slice(0, 3);

        const description = repo.description || 'No description available.';
        const lastUpdated = this.formatDate(repo.updated_at);

        // Create live demo link if homepage exists
        const demoLink = repo.homepage ?
            `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : '';

        return `
            <div class="project-card">
                <div class="project-image">
                    <i class="${languageIcon}"></i>
                </div>
                <div class="project-content">
                    <h3>${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p>${description}</p>
                    <div class="project-meta">
                        <span class="project-stars">
                            <i class="fas fa-star"></i> ${repo.stargazers_count}
                        </span>
                        <span class="project-forks">
                            <i class="fas fa-code-branch"></i> ${repo.forks_count}
                        </span>
                        <span class="project-updated">
                            <i class="fas fa-clock"></i> ${lastUpdated}
                        </span>
                    </div>
                    <div class="project-tech">
                        ${topLanguages.map(lang => `<span class="skill-item">${lang}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${demoLink}
                    </div>
                </div>
            </div>
        `;
    }

    createOpenSourceCard(repo, languages) {
        const primaryLanguage = Object.keys(languages)[0] || 'Code';
        const languageIcon = this.getLanguageIcon(primaryLanguage);
        const topLanguages = Object.keys(languages).slice(0, 3);

        const description = repo.description || 'No description available.';
        const lastUpdated = this.formatDate(repo.updated_at);
        const originalRepo = repo.parent || repo;

        // Create live demo link if homepage exists
        const demoLink = repo.homepage ?
            `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : '';

        return `
            <div class="project-card opensource-card">
                <div class="project-image">
                    <i class="${languageIcon}"></i>
                    <div class="fork-badge">
                        <i class="fas fa-code-branch"></i> Fork
                    </div>
                </div>
                <div class="project-content">
                    <h3>${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p>${description}</p>
                    <div class="original-repo">
                        <i class="fas fa-arrow-up"></i>
                        <span>Forked from <a href="${originalRepo.html_url}" target="_blank" rel="noopener">${originalRepo.full_name}</a></span>
                    </div>
                    <div class="project-meta">
                        <span class="project-stars">
                            <i class="fas fa-star"></i> ${originalRepo.stargazers_count || repo.stargazers_count}
                        </span>
                        <span class="project-forks">
                            <i class="fas fa-code-branch"></i> ${originalRepo.forks_count || repo.forks_count}
                        </span>
                        <span class="project-updated">
                            <i class="fas fa-clock"></i> ${lastUpdated}
                        </span>
                    </div>
                    <div class="project-tech">
                        ${topLanguages.map(lang => `<span class="skill-item">${lang}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i> My Fork
                        </a>
                        <a href="${originalRepo.html_url}" class="project-link" target="_blank" rel="noopener">
                            <i class="fas fa-external-link-alt"></i> Original
                        </a>
                        ${demoLink}
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize GitHub integration
let githubPortfolio;

async function loadGitHubProjects() {
    if (!window.GITHUB_CONFIG || !window.GITHUB_CONFIG.username) {
        // eslint-disable-next-line no-console
        console.error('GitHub configuration not found');
        showProjectsError();
        return;
    }

    // eslint-disable-next-line no-console
    console.log('Loading GitHub projects for username:', window.GITHUB_CONFIG.username);

    githubPortfolio = new GitHubPortfolio(window.GITHUB_CONFIG);

    const loadingElement = document.getElementById('projects-loading');
    const errorElement = document.getElementById('projects-error');
    const gridElement = document.getElementById('projects-grid');

    if (!loadingElement || !errorElement || !gridElement) {
        return;
    }

    try {
        // Show loading state
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        gridElement.innerHTML = '';

        // Fetch repositories
        const repos = await githubPortfolio.getRepositories();
        // eslint-disable-next-line no-console
        console.log('Repositories fetched:', repos.length, repos);

        if (repos.length === 0) {
            // eslint-disable-next-line no-console
            console.log('No repositories found after filtering');
            throw new Error('No repositories found');
        }

        // Get languages for each repository
        const projectsWithLanguages = await Promise.all(
            repos.map(async(repo) => {
                try {
                    const languages = await githubPortfolio.getLanguages(repo.name);
                    return { repo, languages };
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.warn(`Failed to fetch languages for ${repo.name}:`, error);
                    return { repo, languages: {} };
                }
            })
        );

        // Create project cards
        const projectCards = projectsWithLanguages
            .map(({ repo, languages }) => githubPortfolio.createProjectCard(repo, languages))
            .join('');

        // Update the grid
        gridElement.innerHTML = projectCards;

        // Update GitHub link
        const githubLink = document.querySelector('.projects-footer a');
        if (githubLink) {
            githubLink.href = `https://github.com/${window.GITHUB_CONFIG.username}`;
        }

        // Hide loading state
        loadingElement.style.display = 'none';

        // Trigger animations
        setTimeout(() => {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading GitHub projects:', error);
        showProjectsError();
    }
}

function showProjectsError() {
    const loadingElement = document.getElementById('projects-loading');
    const errorElement = document.getElementById('projects-error');

    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

async function loadOpenSourceProjects() {
    if (!window.GITHUB_CONFIG || !window.GITHUB_CONFIG.username) {
        // eslint-disable-next-line no-console
        console.error('GitHub configuration not found');
        showOpenSourceError();
        return;
    }

    // eslint-disable-next-line no-console
    console.log('Loading open source contributions for username:', window.GITHUB_CONFIG.username);

    if (!githubPortfolio) {
        githubPortfolio = new GitHubPortfolio(window.GITHUB_CONFIG);
    }

    const loadingElement = document.getElementById('opensource-loading');
    const errorElement = document.getElementById('opensource-error');
    const gridElement = document.getElementById('opensource-grid');

    if (!loadingElement || !errorElement || !gridElement) {
        return;
    }

    try {
        // Show loading state
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        gridElement.innerHTML = '';

        // Fetch forked repositories
        const repos = await githubPortfolio.getForkedRepositories();
        // eslint-disable-next-line no-console
        console.log('Forked repositories fetched:', repos.length, repos);

        if (repos.length === 0) {
            // eslint-disable-next-line no-console
            console.log('No forked repositories found after filtering');
            gridElement.innerHTML = '<div class="no-contributions"><i class="fas fa-code-branch"></i><p>No open source contributions found yet. This could be because:</p><ul><li>No forked repositories in your GitHub account</li><li>All forked repositories are private</li><li>Repositories are filtered out by configuration</li></ul><p>Check back later!</p></div>';
            loadingElement.style.display = 'none';
            return;
        }

        // Get languages for each repository
        const projectsWithLanguages = await Promise.all(
            repos.map(async(repo) => {
                try {
                    const languages = await githubPortfolio.getLanguages(repo.name);
                    return { repo, languages };
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.warn(`Failed to fetch languages for ${repo.name}:`, error);
                    return { repo, languages: {} };
                }
            })
        );

        // Create project cards
        const projectCards = projectsWithLanguages
            .map(({ repo, languages }) => githubPortfolio.createOpenSourceCard(repo, languages))
            .join('');

        // Update the grid
        gridElement.innerHTML = projectCards;

        // Hide loading state
        loadingElement.style.display = 'none';

        // Trigger animations
        setTimeout(() => {
            const cards = document.querySelectorAll('.opensource-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading open source projects:', error);
        showOpenSourceError();
    }
}

function showOpenSourceError() {
    const loadingElement = document.getElementById('opensource-loading');
    const errorElement = document.getElementById('opensource-error');

    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

// Initialize DOM-dependent code only when DOM is ready
function initializeDOMHandlers() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', highlightNavLink);
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Basic validation
            if (!name || !email || !message) {
                // eslint-disable-next-line no-alert
                alert('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                // eslint-disable-next-line no-alert
                alert('Please enter a valid email address');
                return;
            }

            // Simulate form submission (replace with actual form handling)
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                // eslint-disable-next-line no-alert
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Initialize typing effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }

    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .opensource-card, .skill-category, .stat');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Load GitHub projects and open source contributions
    setTimeout(loadGitHubProjects, 500);
    setTimeout(loadOpenSourceProjects, 1000);

    // Initialize new features
    initializeThemeToggle();
    animateSkillBars();
    initializeScrollToTop();
    initializeProjectFilters();
    initializeAnalyticsTracking();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDOMHandlers);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeThemeToggle,
        animateSkillBars,
        initializeScrollToTop,
        initializeProjectFilters,
        initializeAnalyticsTracking,
        GitHubPortfolio
    };
} else if (typeof window !== 'undefined') {
    // Make functions available globally for testing
    window.initializeThemeToggle = initializeThemeToggle;
    window.animateSkillBars = animateSkillBars;
    window.initializeScrollToTop = initializeScrollToTop;
    window.initializeProjectFilters = initializeProjectFilters;
    window.initializeAnalyticsTracking = initializeAnalyticsTracking;
    window.loadOpenSourceProjects = loadOpenSourceProjects;
}

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background-color: white;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-menu li {
            margin: 1rem 0;
        }

        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        .nav-link.active {
            color: var(--primary-color);
        }
    }

    .no-contributions {
        text-align: center;
        padding: 3rem 2rem;
        color: #666;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 2rem 0;
    }

    .no-contributions i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #999;
    }

    .no-contributions ul {
        text-align: left;
        max-width: 400px;
        margin: 1rem auto;
    }

    .no-contributions li {
        margin: 0.5rem 0;
    }
`;
document.head.appendChild(style);

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Skill Progress Bar Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute('data-percentage');
                progressBar.style.width = `${percentage}%`;
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');

    if (scrollButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Project Filters Functionality
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0) {
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Analytics Event Tracking
function initializeAnalyticsTracking() {
    // Track resume downloads
    const resumeButtons = document.querySelectorAll('.download-btn, [href*="resume"], [href*=".pdf"]');
    resumeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'file_download', {
                    file_name: 'resume.pdf',
                    event_category: 'Resume',
                    event_label: 'Download'
                });
            }
        });
    });

    // Track external project links
    const projectLinks = document.querySelectorAll('.project-link, [href*="github.com"], [href*="linkedin.com"]');
    projectLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                const linkText = link.textContent.trim();
                const linkHref = link.href;
                gtag('event', 'click', {
                    event_category: 'External Link',
                    event_label: linkText,
                    event_value: linkHref
                });
            }
        });
    });

    // Track contact form submissions
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Contact',
                    event_label: 'Contact Form'
                });
            }
        });
    }

    // Track section visits via scroll
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && typeof gtag !== 'undefined') {
                gtag('event', 'scroll', {
                    event_category: 'Navigation',
                    event_label: `Section: ${entry.target.id}`
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}