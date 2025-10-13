# 🆓 Open Source Analytics Options

## 1. Plausible Analytics (Recommended)

### Self-Hosted (Free)
```bash
# Using Docker
docker run -d \
  --name plausible \
  -p 8000:8000 \
  -e SECRET_KEY_BASE=your-secret-key \
  plausible/analytics:latest
```

### Add to Your Website
```html
<script defer data-domain="yourdomain.com" src="https://your-plausible-instance.com/js/script.js"></script>
```

**What it tracks:**
- Unique visitors
- Page views
- Bounce rate
- Visit duration
- Top pages
- Referrer sources
- Country/device data

## 2. Umami Analytics (100% Free)

### Self-Hosted Setup
```bash
# Using Vercel (free hosting)
git clone https://github.com/umami-software/umami.git
cd umami
npm install
npm run build
# Deploy to Vercel
```

### Add to Website
```html
<script async src="https://your-umami-instance.com/script.js" data-website-id="your-website-id"></script>
```

**Features:**
- Real-time analytics
- Custom events tracking
- No personal data collection
- Beautiful dashboard
- API access

## 3. GoatCounter (Completely Free)

### Hosted Version (Free Forever)
1. Sign up at [goatcounter.com](https://goatcounter.com)
2. Add tracking code to your site
3. No payment required, ever

### Add to Website
```html
<script data-goatcounter="https://YOURCODE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
```

**Perfect for:**
- Personal websites
- Open source projects
- Privacy-focused tracking
- Simple, no-frills analytics

## 4. Matomo (Open Source Google Analytics Alternative)

### Self-Hosted
```bash
# Download and extract
wget https://builds.matomo.org/matomo.zip
unzip matomo.zip
# Upload to your web server
```

### Features
- Full Google Analytics replacement
- Heat maps and session recordings
- E-commerce tracking
- A/B testing
- Custom dimensions

## 5. Cloudflare Analytics (Free)

### Setup
1. Add your domain to Cloudflare (free tier)
2. Change your DNS to Cloudflare
3. Analytics automatically enabled

### What You Get
- Page views and unique visitors
- Bandwidth usage
- Security threats blocked
- Performance metrics
- Geographic data

## 6. Simple Analytics (Open Source Core)

### GitHub Repository
```bash
git clone https://github.com/simpleanalytics/simple-analytics.git
```

### Self-Host Option
- Core features are open source
- Can run on your own infrastructure
- Privacy-first design

## Quick Comparison

| Tool | Cost | Privacy | Setup Difficulty | Features |
|------|------|---------|------------------|----------|
| Plausible | Free (self-host) | Excellent | Medium | Simple, clean |
| Umami | Free | Excellent | Medium | Modern, customizable |
| GoatCounter | Free | Excellent | Easy | Minimal, reliable |
| Matomo | Free | Good | Hard | Full-featured |
| Cloudflare | Free | Good | Easy | Infrastructure-level |

## Recommended Setup for Your Portfolio

### Option 1: GoatCounter (Easiest)
1. Sign up at goatcounter.com
2. Add one line of code
3. Start tracking immediately

### Option 2: Umami (Most Features)
1. Deploy to Vercel (free)
2. Configure your domain
3. Comprehensive tracking

### Option 3: Plausible (Best Balance)
1. Use Railway/Heroku free tier
2. Self-host Plausible
3. Privacy-first analytics

## Implementation for Your Portfolio

I can help you set up any of these. Which one interests you most?

### For GoatCounter (Quickest):
```html
<!-- Add this before closing </body> tag -->
<script data-goatcounter="https://anishnair.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

### For Umami:
```html
<!-- Add this before closing </body> tag -->
<script async src="https://analytics.anishnair.com/script.js"
        data-website-id="your-website-id"></script>
```

All of these are:
✅ Privacy-focused
✅ No cookies required
✅ GDPR compliant
✅ Lightweight
✅ Open source