# 🐐 GoatCounter Setup (2 Minutes)

## Step 1: Create Account
1. Go to [goatcounter.com](https://www.goatcounter.com)
2. Click "Sign up"
3. Choose subdomain: `anishnair.goatcounter.com`
4. Enter your email

## Step 2: Activate Analytics
In your `index.html`, uncomment and update line 483-485:

```html
<!-- Change this line -->
<!--
<script data-goatcounter="https://anishnair.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
-->

<!-- To this (replace 'anishnair' with your chosen subdomain) -->
<script data-goatcounter="https://YOURNAME.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

## Step 3: Deploy
```bash
git add index.html
git commit -m "Add GoatCounter analytics"
git push origin main
```

## Step 4: View Analytics
- Visit: `https://YOURNAME.goatcounter.com`
- See real-time visitor data
- No signup required for visitors
- Privacy-first tracking

## What You'll See
- 📊 Page views over time
- 🌍 Visitor countries
- 📱 Browser/OS breakdown
- 🔗 Referrer websites
- 📄 Most popular pages

## Features
✅ Free forever
✅ No cookies
✅ GDPR compliant
✅ Real-time data
✅ No ads
✅ Open source
✅ 1-second setup

Perfect for personal portfolios!