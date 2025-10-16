# Pesapal Integration Documentation

## Overview
This document outlines the complete Pesapal payment integration alongside existing Stripe and Paystack payment providers. The integration maintains all existing functionality while adding Pesapal as a third payment option.

## 🚀 Features Implemented

### 1. **Pesapal Service Functions** (`lib/payments.ts`)
- ✅ `initializePesapal()` - Creates Pesapal orders
- ✅ `verifyPesapalTransaction()` - Verifies payment status
- ✅ `validatePesapalWebhook()` - Validates webhook signatures
- ✅ Updated `SubscriptionPlan` interface with `pesapalPlanCode`
- ✅ Added Pesapal plan codes for all subscription tiers

### 2. **API Routes**
- ✅ `/api/payments/create-pesapal` - Initialize Pesapal payments
- ✅ `/api/payments/verify-session` - Updated to handle Pesapal verification
- ✅ `/api/payments/pesapal-webhook` - Handle Pesapal webhook notifications

### 3. **UI Integration**
- ✅ **Signals Page** - Added Pesapal option to payment provider selection
- ✅ **Subscription Page** - Added Pesapal option to payment provider selection  
- ✅ **Credit Purchase Component** - Added Pesapal option to payment provider selection
- ✅ Updated all TypeScript types to include "pesapal" provider

### 4. **Payment Flow**
- ✅ **Order Creation** - Creates Pesapal orders with proper billing information
- ✅ **Payment Verification** - Verifies payments through Pesapal API
- ✅ **Webhook Handling** - Processes payment status updates
- ✅ **User Subscription Updates** - Activates subscriptions on successful payment

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```bash
# Pesapal Configuration
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_NOTIFICATION_ID=your_pesapal_notification_id
PESAPAL_WEBHOOK_SECRET=your_pesapal_webhook_secret

# Existing variables (keep these)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_APP_URL=your_app_url
```

## 📋 Pesapal Setup Steps

### 1. **Pesapal Account Setup**
1. Register at [Pesapal Developer Portal](https://developer.pesapal.com/)
2. Create a new application
3. Get your Consumer Key and Consumer Secret
4. Set up webhook notifications
5. Configure your notification URL: `https://yourdomain.com/api/payments/pesapal-webhook`

### 2. **Environment Configuration**
1. Add the environment variables listed above
2. Restart your development server
3. Test the integration in sandbox mode first

### 3. **Webhook Configuration**
1. In your Pesapal dashboard, set the webhook URL to:
   ```
   https://yourdomain.com/api/payments/pesapal-webhook
   ```
2. Enable the following events:
   - Payment completed
   - Payment failed
   - Payment pending

## 💰 Pricing & Currency

### Current Pricing Structure
- **Weekly**: $13 USD (≈ 1,690 KES)
- **Monthly**: $29 USD (≈ 3,770 KES)  
- **Annually**: $129 USD (≈ 16,770 KES)

### Currency Conversion
- Pesapal processes payments in **Kenyan Shillings (KES)**
- Conversion rate: 1 USD = 130 KES (configurable)
- Amounts are converted automatically in the API

## 🔄 Payment Flow

### 1. **User Selects Pesapal**
```typescript
// User clicks Pesapal option in UI
setSelectedProvider("pesapal")
```

### 2. **Order Creation**
```typescript
// API call to create Pesapal order
POST /api/payments/create-pesapal
{
  "plan": "monthly",
  "successUrl": "https://app.com/signals/success",
  "cancelUrl": "https://app.com/signals"
}
```

### 3. **Pesapal Redirect**
```typescript
// User redirected to Pesapal payment page
{
  "url": "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
  "order_tracking_id": "abc123..."
}
```

### 4. **Payment Verification**
```typescript
// After payment, verify transaction
POST /api/payments/verify-session
{
  "sessionId": "abc123...",
  "provider": "pesapal"
}
```

### 5. **Webhook Notification**
```typescript
// Pesapal sends webhook notification
POST /api/payments/pesapal-webhook
{
  "order_tracking_id": "abc123...",
  "payment_status": "COMPLETED",
  "merchant_reference": "ref_123..."
}
```

## 🎨 UI Components Updated

### Payment Provider Selection
All payment selection components now show three options:
- **Stripe** (Blue) - International payments
- **Paystack** (Green) - African payments  
- **Pesapal** (Orange) - Kenyan payments

### Responsive Design
- Mobile: Single column layout
- Desktop: Three-column grid layout
- Consistent styling across all components

## 🧪 Testing

### Sandbox Testing
1. Use Pesapal sandbox environment
2. Test with sandbox credentials
3. Verify webhook notifications
4. Test payment success/failure scenarios

### Production Testing
1. Switch to production credentials
2. Test with small amounts first
3. Verify all payment flows
4. Monitor webhook delivery

## 🔒 Security Features

### Webhook Validation
- HMAC-SHA256 signature verification
- Request payload validation
- Replay attack prevention

### Data Protection
- Sensitive data encrypted in transit
- Payment data stored securely
- User information protected

## 📊 Monitoring & Logging

### Logging Points
- Order creation attempts
- Payment verification results
- Webhook processing status
- User subscription updates

### Error Handling
- Graceful fallback to other providers
- Detailed error logging
- User-friendly error messages

## 🚨 Troubleshooting

### Common Issues

1. **"Pesapal credentials not configured"**
   - Check environment variables
   - Verify Consumer Key/Secret

2. **"Invalid signature" in webhooks**
   - Verify webhook secret
   - Check signature generation

3. **Payment verification fails**
   - Check Pesapal API status
   - Verify order tracking ID

4. **User subscription not activated**
   - Check webhook delivery
   - Verify payment status

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

## 📈 Future Enhancements

### Potential Improvements
- [ ] Real-time currency conversion
- [ ] Multiple currency support
- [ ] Advanced webhook retry logic
- [ ] Payment analytics dashboard
- [ ] Automated testing suite

### Integration Opportunities
- [ ] Mobile money integration
- [ ] Bank transfer support
- [ ] Cryptocurrency payments
- [ ] Subscription management

## 📞 Support

### Pesapal Support
- Documentation: https://developer.pesapal.com/
- Support: support@pesapal.com
- Status Page: https://status.pesapal.com/

### Technical Support
- Check logs in `/api/payments/pesapal-webhook`
- Monitor payment records in MongoDB
- Verify webhook delivery in Pesapal dashboard

---

## ✅ Integration Complete

The Pesapal integration is now fully implemented and ready for testing. All existing Stripe and Paystack functionality remains intact, with Pesapal added as a third payment option for Kenyan users.

**Next Steps:**
1. Configure environment variables
2. Set up Pesapal webhook URL
3. Test in sandbox environment
4. Deploy to production
5. Monitor payment flows
