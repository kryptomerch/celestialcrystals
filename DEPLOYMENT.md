# 🚀 Deployment Checklist for Celestial Crystals

## Pre-Deployment Setup

### 1. Environment Variables
Ensure all environment variables are configured:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/celestial_crystals"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key"
JWT_SECRET="your-jwt-secret"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="live"

# Email
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@celestialcrystals.com"
ADMIN_EMAIL="admin@celestialcrystals.com"

# Automation
CRON_SECRET="your-secure-cron-secret"
ADMIN_API_KEY="your-admin-api-key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Deploy database schema
npx prisma db push

# Seed with initial data
npx prisma db seed
```

### 3. Build and Test

```bash
# Type checking
npm run type-check

# Run tests
npm run test:ci

# Build application
npm run build

# Test production build locally
npm start
```

## Deployment Steps

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure build settings (Next.js preset)

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure production values are used

3. **Domain Configuration**
   - Set up custom domain
   - Configure SSL certificates
   - Update NEXTAUTH_URL to production domain

4. **Database**
   - Set up production PostgreSQL database
   - Update DATABASE_URL environment variable
   - Run migrations: `npx prisma db push`

### Manual Deployment

1. **Server Setup**
   ```bash
   # Install dependencies
   npm ci --production

   # Build application
   npm run build

   # Start with PM2 (recommended)
   pm2 start npm --name "celestial-crystals" -- start
   ```

2. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name celestialcrystals.com;
       
       location / {
           proxy_pass http://localhost:3002;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment Configuration

### 1. Payment Webhooks

**Stripe Webhooks:**
- Endpoint: `https://your-domain.com/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

**PayPal IPN:**
- Endpoint: `https://your-domain.com/api/webhooks/paypal`
- Enable IPN in PayPal dashboard

### 2. Cron Jobs

Set up automated tasks:

```bash
# Daily inventory check (9 AM)
0 9 * * * curl -X POST https://your-domain.com/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"job": "inventory-check"}'

# Daily abandoned cart recovery (6 PM)
0 18 * * * curl -X POST https://your-domain.com/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"job": "abandoned-cart"}'

# Weekly newsletter (Monday 10 AM)
0 10 * * 1 curl -X POST https://your-domain.com/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"job": "weekly-newsletter"}'

# Monthly cleanup (1st day, 2 AM)
0 2 1 * * curl -X POST https://your-domain.com/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"job": "cleanup-old-data"}'
```

### 3. SEO Setup

1. **Google Search Console**
   - Verify domain ownership
   - Submit sitemap: `https://your-domain.com/sitemap.xml`

2. **Google Analytics**
   - Set up GA4 tracking
   - Configure e-commerce events

3. **Social Media**
   - Update Open Graph images
   - Configure Twitter cards

### 4. Email Configuration

1. **Domain Authentication**
   - Set up SPF, DKIM, and DMARC records
   - Verify domain in Resend dashboard

2. **Email Templates**
   - Test all email templates
   - Verify deliverability

### 5. Security

1. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Configure security headers

2. **Rate Limiting**
   - Implement API rate limiting
   - Configure DDoS protection

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure uptime monitoring

## Testing Checklist

### Functionality Tests
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add to cart and checkout
- [ ] Payment processing (Stripe & PayPal)
- [ ] Order confirmation emails
- [ ] Admin dashboard access
- [ ] Inventory management
- [ ] Review system

### Performance Tests
- [ ] Page load speeds < 3 seconds
- [ ] Core Web Vitals scores
- [ ] Mobile responsiveness
- [ ] Image optimization

### Security Tests
- [ ] Authentication flows
- [ ] API endpoint security
- [ ] Payment data handling
- [ ] Admin access controls

## Monitoring and Maintenance

### Daily Checks
- [ ] Error logs review
- [ ] Payment processing status
- [ ] Email delivery rates
- [ ] Site uptime

### Weekly Reviews
- [ ] Sales analytics
- [ ] Inventory levels
- [ ] Customer feedback
- [ ] Performance metrics

### Monthly Tasks
- [ ] Security updates
- [ ] Database optimization
- [ ] Backup verification
- [ ] Analytics reporting

## Rollback Plan

In case of deployment issues:

1. **Immediate Rollback**
   ```bash
   # Vercel
   vercel rollback

   # Manual
   git revert <commit-hash>
   npm run build
   pm2 restart celestial-crystals
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   pg_restore -d celestial_crystals backup.sql
   ```

3. **Communication**
   - Notify customers of any issues
   - Update status page
   - Provide estimated resolution time

## Support Contacts

- **Technical Issues**: tech@celestialcrystals.com
- **Payment Issues**: payments@celestialcrystals.com
- **General Support**: support@celestialcrystals.com

---

✅ **Deployment Complete!** Your Celestial Crystals e-commerce platform is now live and ready to serve customers.
