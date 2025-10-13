# 🚀 Quick Google Analytics Setup

## Step 1: Create Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Account name: "Anish Nair Portfolio"
4. Property name: "anish.nair.github.io"
5. Choose your timezone and currency

## Step 2: Set up Data Stream
1. Choose "Web"
2. Website URL: `https://nishair.github.io/anish.nair.github.io`
3. Stream name: "Portfolio Website"
4. Enhanced measurement: ✅ (recommended)

## Step 3: Get Your Measurement ID
1. Copy the Measurement ID (starts with G-)
2. Example: `G-ABC123DEF456`

## Step 4: Update Your Website
Replace BOTH instances of `GA_MEASUREMENT_ID` in index.html with your actual ID:

```html
<!-- Line 468 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID-HERE"></script>

<!-- Line 473 -->
gtag('config', 'G-YOUR-ID-HERE');
```

## Step 5: Test It Works
1. Push changes to GitHub
2. Wait 5 minutes for deployment
3. Visit your live website
4. Check Google Analytics "Realtime" tab
5. You should see yourself as a visitor!

## What You'll See in Analytics

### Real-time Dashboard:
- Current active users
- Pages being viewed right now
- Geographic locations
- Traffic sources

### Audience Reports:
- New vs returning visitors
- Demographics (if enabled)
- Technology (browsers, devices)
- Geographic data

### Acquisition Reports:
- How people find your site
- Social media referrals
- Search engine traffic
- Direct visits

### Behavior Reports:
- Most popular pages
- Time spent on site
- Bounce rate
- User journey through your site

## Pro Tips

1. **Set up Goals:**
   - Resume downloads
   - Contact form submissions
   - Time spent on projects page

2. **Custom Events:**
   ```javascript
   // Track resume downloads
   gtag('event', 'file_download', {
     file_name: 'resume.pdf'
   });

   // Track project link clicks
   gtag('event', 'click', {
     event_category: 'Project',
     event_label: 'GitHub Link'
   });
   ```

3. **Monthly Review:**
   - Check visitor growth
   - Identify popular content
   - Optimize based on data
   - Update resume/projects based on interest

## Privacy Considerations

- Add privacy policy if tracking EU visitors
- Consider cookie consent for GDPR compliance
- Google Analytics is free but uses visitor data
- Alternative: Use privacy-focused analytics (Plausible, Simple Analytics)

Your analytics will be live once you add your Measurement ID!