# Website Analytics Setup Guide

## Google Analytics 4 Setup

### Step 1: Create Google Analytics Account
1. Visit [analytics.google.com](https://analytics.google.com)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create account name (e.g., "Anish Nair Portfolio")

### Step 2: Set up Property
1. Property name: "anish.nair.github.io"
2. Select reporting time zone
3. Select currency
4. Click "Next"

### Step 3: Business Information
1. Choose "Other" for industry category
2. Select appropriate business size
3. Choose "Get baseline reports" for how you'll use Analytics
4. Click "Create"

### Step 4: Set up Data Stream
1. Choose "Web"
2. Website URL: `https://nishair.github.io/anish.nair.github.io`
3. Stream name: "Portfolio Website"
4. Click "Create stream"

### Step 5: Get Measurement ID
1. Copy the Measurement ID (starts with G-)
2. Example: `G-ABC123DEF456`

### Step 6: Update Your Website
Replace `GA_MEASUREMENT_ID` in these two places in `index.html`:

```html
Line 365: <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"></script>
Line 370: gtag('config', 'YOUR_MEASUREMENT_ID');
```

### Step 7: Test Installation
1. Deploy your changes to GitHub Pages
2. Visit your website
3. Check Google Analytics Real-time reports (may take 15-30 minutes)

## What You'll Be Able to Track

### Real-time Data
- Current active users
- Page views in last 30 minutes
- Traffic sources
- Geographic location

### Audience Reports
- New vs returning visitors
- Demographics (age, gender if enabled)
- Interests
- Geographic data
- Technology (browser, OS, device)

### Acquisition Reports
- How visitors find your site
- Search engines
- Social media referrals
- Direct traffic

### Behavior Reports
- Most popular pages
- Time spent on site
- Bounce rate
- User flow through your site

## Privacy Considerations

### GDPR Compliance
If you have EU visitors, consider:
- Adding a privacy policy
- Cookie consent banner
- Data retention settings in GA4

### Privacy-First Alternatives
- **Plausible Analytics**: Cookie-free, GDPR compliant
- **Simple Analytics**: No personal data collection
- **Cloudflare Analytics**: Privacy-focused, free

## Advanced Tracking

### Custom Events
Track specific interactions:
```javascript
// Track resume downloads
gtag('event', 'file_download', {
  file_name: 'resume.pdf'
});

// Track contact form submissions
gtag('event', 'form_submit', {
  form_name: 'contact'
});
```

### Goals and Conversions
Set up goals for:
- Resume downloads
- Contact form submissions
- Time spent on projects section
- External link clicks (GitHub, LinkedIn)

## Monthly Analytics Review

Check these metrics monthly:
1. **Unique visitors**: Growth trend
2. **Popular pages**: What content resonates
3. **Traffic sources**: Where visitors come from
4. **Geographic data**: Global reach
5. **Device types**: Mobile vs desktop usage

This data helps you:
- Understand your audience
- Improve popular content
- Optimize for mobile if needed
- Focus on effective marketing channels