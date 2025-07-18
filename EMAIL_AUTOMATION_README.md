# 📧 Email Automation System - Celestial Crystals

## Overview

Complete email automation system with beautiful templates, automated scheduling, and comprehensive campaign management for the Celestial Crystals e-commerce platform.

## ✨ Features

### 📬 Email Templates
- **Welcome Email** - New subscriber onboarding with 15% discount
- **Order Confirmation** - Professional order receipts with tracking info
- **Weekly Newsletter** - Crystal wisdom, moon phases, and featured products
- **Discount Vouchers** - Birthday, loyalty, winback, and seasonal promotions

### 🤖 Automation
- **Weekly Newsletters** - Every Monday at 9 AM UTC
- **Birthday Discounts** - Daily check for user birthdays
- **Winback Campaigns** - Re-engage inactive customers
- **Seasonal Promotions** - Quarterly seasonal campaigns

### 🎨 Design
- **Responsive Templates** - Mobile-optimized email designs
- **Brand Consistent** - Matches Celestial Crystals aesthetic
- **Professional Layout** - Clean, minimalist design
- **Interactive Elements** - Call-to-action buttons and links

## 🚀 Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=noreply@celestialcrystals.com
ADMIN_EMAIL=admin@celestialcrystals.com

# Automation
CRON_SECRET=your-secure-cron-secret-key-here
ADMIN_API_KEY=your-admin-api-key-here
```

### 2. Email Service Setup

#### Option A: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `RESEND_API_KEY` environment variable

#### Option B: SMTP (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate an app password
3. Add credentials to SMTP environment variables

### 3. Automation Setup

#### GitHub Actions (Recommended)
1. Add secrets to your GitHub repository:
   - `SITE_URL`: Your deployed site URL
   - `CRON_SECRET`: Your cron secret key

#### Vercel Cron
1. Deploy to Vercel
2. Cron jobs will run automatically based on `vercel.json`

#### External Cron Service
Use any cron service to call:
```bash
curl -X POST "https://yoursite.com/api/cron/email-automation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"action": "weekly-newsletter"}'
```

## 📋 API Endpoints

### Email Sending
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/order-confirmation` - Send order confirmation
- `POST /api/email/newsletter` - Send newsletter
- `POST /api/email/discount-voucher` - Send discount voucher

### Automation
- `POST /api/cron/email-automation` - Automated email campaigns

## 🎯 Campaign Types

### 1. Weekly Newsletter
**Schedule**: Every Monday at 9 AM UTC
**Content**:
- Featured crystal of the week
- Current moon phase guidance
- Crystal tip of the week
- Special weekly offer (10% discount)

### 2. Birthday Discounts
**Schedule**: Daily at 8 AM UTC
**Content**:
- Personalized birthday greeting
- 20% discount code (valid 14 days)
- Birthday crystal recommendations

### 3. Winback Campaign
**Schedule**: Every Sunday at 10 AM UTC
**Content**:
- "We miss you" message
- 25% discount code (valid 30 days)
- Minimum order requirement: $50

### 4. Seasonal Promotions
**Schedule**: First day of each season at 9 AM UTC
**Content**:
- Seasonal crystal recommendations
- 15% discount code (valid 7 days)
- Season-specific crystal tips

## 🛠 Usage Examples

### Send Welcome Email
```javascript
const response = await fetch('/api/email/welcome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    email: 'john@example.com'
  })
});
```

### Send Order Confirmation
```javascript
const response = await fetch('/api/email/order-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderNumber: 'CC12345678',
    customerName: 'John Doe',
    email: 'john@example.com',
    items: [...],
    total: 89.99,
    // ... other order details
  })
});
```

## 🎨 Template Customization

### Email Template Structure
```typescript
export function createEmailTemplate(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Responsive, mobile-first CSS */
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">✨ CELESTIAL CRYSTALS</div>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <!-- Social links and unsubscribe -->
          </div>
        </div>
      </body>
    </html>
  `;
}
```

### Adding New Templates
1. Create template in `src/lib/email-templates/`
2. Add to `EmailAutomationService`
3. Create API endpoint if needed
4. Add to admin dashboard

## 📊 Admin Dashboard

Access the admin dashboard at `/admin/email-campaigns` to:
- Send campaigns manually
- View campaign results
- Preview email templates
- Monitor email statistics

## 🔧 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check environment variables
   - Verify API keys
   - Check email service status

2. **Cron jobs not running**
   - Verify cron secret
   - Check GitHub Actions logs
   - Ensure proper scheduling

3. **Template rendering issues**
   - Test with email clients
   - Validate HTML structure
   - Check CSS compatibility

### Debug Mode
Set `NODE_ENV=development` to log email content instead of sending.

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Set up email service (Resend/SMTP)
- [ ] Configure environment variables
- [ ] Test all email templates
- [ ] Set up cron automation
- [ ] Configure domain authentication
- [ ] Test unsubscribe links

### Monitoring
- Monitor email delivery rates
- Track open/click rates
- Watch for bounce rates
- Monitor automation logs

## 📈 Analytics & Metrics

Track these key metrics:
- **Delivery Rate**: Emails successfully delivered
- **Open Rate**: Emails opened by recipients
- **Click Rate**: Links clicked in emails
- **Conversion Rate**: Purchases from email campaigns
- **Unsubscribe Rate**: Users opting out

## 🔒 Security & Compliance

- **GDPR Compliance**: Unsubscribe links in all emails
- **CAN-SPAM Act**: Proper sender identification
- **Data Protection**: Secure handling of email addresses
- **Rate Limiting**: Prevent email spam/abuse

## 🎯 Future Enhancements

- A/B testing for email templates
- Advanced segmentation
- Behavioral triggers
- Email analytics dashboard
- Integration with marketing tools
- Personalized product recommendations

## 📞 Support

For issues or questions about the email automation system:
1. Check this documentation
2. Review API logs
3. Test in development environment
4. Contact development team

---

**Built with ❤️ for Celestial Crystals**
