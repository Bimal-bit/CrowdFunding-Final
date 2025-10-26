# 🚨 CRITICAL - Complete Setup Guide for Data Updates

## ⚠️ IMPORTANT: Why Data Isn't Updating

If data isn't updating after payment, it's because **webhooks aren't working**. Here's how to fix it:

---

## 🔧 STEP-BY-STEP FIX

### Step 1: Install Stripe CLI (If Not Already Installed)

**Windows (using Scoop):**
```bash
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Or download from:** https://stripe.com/docs/stripe-cli

---

### Step 2: Login to Stripe

```bash
stripe login
```

This will open your browser to authenticate.

---

### Step 3: Start Webhook Forwarding

**CRITICAL: You MUST run this command and KEEP IT RUNNING:**

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

**You'll see output like:**
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

**COPY THIS SECRET!** You'll need it in the next step.

---

### Step 4: Add Webhook Secret to .env

1. Open `server/.env`
2. Add or update this line:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_from_step_3
```

**Example:**
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef1234567890abcdef1234567890abcdef
```

---

### Step 5: Restart Backend Server

**Stop the server** (Ctrl+C in the terminal)

**Start it again:**
```bash
cd server
npm run dev
```

**You should see:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
🔑 Stripe Key: ✅ Loaded
```

---

### Step 6: Keep All 3 Terminals Running

**YOU NEED 3 TERMINALS RUNNING AT ALL TIMES:**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Stripe CLI (CRITICAL!):**
```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

**If Terminal 3 is not running, data WILL NOT update!**

---

## 🧪 Test It Now

### Make a Test Payment:

1. Go to `http://localhost:5173`
2. Click on any project
3. Click "Back This Project"
4. Enter amount (e.g., ₹500)
5. Click "Continue to Secure Payment"
6. Use test card: `4242 4242 4242 4242`
7. Complete payment

### Watch Terminal 3 (Stripe CLI):

**You MUST see this:**
```
2025-10-26 20:30:00   --> checkout.session.completed [evt_abc123]
2025-10-26 20:30:00   <-- [200] POST http://localhost:5000/api/webhooks/stripe
```

**If you DON'T see this, webhooks aren't working!**

### Watch Terminal 1 (Backend):

**You MUST see this:**
```
📨 Webhook received: checkout.session.completed
💳 Checkout session completed: cs_test_abc123
✅ Payment record created: 67123abc...
✅ Project updated. New raised amount: 5500
✅ Donation update added to project
🎉 Webhook processing completed successfully!
```

**If you DON'T see this, check webhook secret in .env**

### Check Browser:

After redirect to project page:
- ✅ Raised amount should increase
- ✅ Backers count should increase
- ✅ Progress bar should update
- ✅ Updates tab should show new donation

---

## 🔍 Troubleshooting

### Problem: "Terminal 3 shows nothing after payment"

**Solution:**
1. Make sure Stripe CLI is running
2. Check the command is correct:
   ```bash
   stripe listen --forward-to localhost:5000/api/webhooks/stripe
   ```
3. Make sure backend is on port 5000
4. Restart Stripe CLI

---

### Problem: "Terminal 3 shows [500] error"

**Solution:**
1. Check webhook secret in `server/.env`
2. Make sure it matches the secret from Stripe CLI
3. Restart backend server
4. Try payment again

---

### Problem: "Terminal 1 shows 'Webhook signature verification failed'"

**Solution:**
1. Copy the webhook secret from Terminal 3
2. Update `server/.env` with the correct secret
3. Restart backend server
4. Try payment again

---

### Problem: "Data still not updating"

**Checklist:**
- [ ] Terminal 3 (Stripe CLI) is running?
- [ ] Terminal 3 shows webhook events?
- [ ] Terminal 1 shows "Project updated"?
- [ ] Webhook secret in .env is correct?
- [ ] Backend server restarted after adding secret?
- [ ] All 3 terminals are running?

**If all checked and still not working:**
```bash
# Stop everything
# Ctrl+C in all terminals

# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend  
cd frontend
npm run dev

# Terminal 3 - Start Stripe CLI
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Copy webhook secret from Terminal 3
# Add to server/.env
# Restart Terminal 1 (backend)
# Try payment again
```

---

## 📋 Quick Checklist

Before making a payment, verify:

- [ ] **Terminal 1** - Backend running on port 5000
- [ ] **Terminal 2** - Frontend running on port 5173
- [ ] **Terminal 3** - Stripe CLI running and showing "Ready!"
- [ ] **server/.env** - Has STRIPE_WEBHOOK_SECRET
- [ ] **server/.env** - Secret matches Terminal 3 output
- [ ] **Backend** - Restarted after adding secret

**If ALL checked, payment data WILL update!**

---

## 🎯 Expected Flow

```
1. User makes payment
         ↓
2. Stripe processes payment
         ↓
3. Stripe sends webhook to Terminal 3
         ↓
4. Terminal 3 forwards to localhost:5000
         ↓
5. Backend receives webhook
         ↓
6. Backend verifies signature (using secret)
         ↓
7. Backend updates database:
   - Raised amount ✅
   - Backers count ✅
   - Creates payment record ✅
   - Adds donation update ✅
         ↓
8. User redirected to success page
         ↓
9. Auto-redirect to project page
         ↓
10. Page refreshes data
         ↓
11. ALL DATA UPDATED! ✅
```

---

## 🚨 MOST COMMON MISTAKE

**NOT running Stripe CLI (Terminal 3)**

Without Stripe CLI:
- ❌ Webhooks don't reach your server
- ❌ Database doesn't update
- ❌ Data stays the same
- ❌ Updates don't appear

With Stripe CLI:
- ✅ Webhooks reach your server
- ✅ Database updates
- ✅ Data updates automatically
- ✅ Updates appear

**YOU MUST KEEP TERMINAL 3 RUNNING!**

---

## 📝 Environment Variables

**Your `server/.env` should have:**

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_stripe_cli

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🎉 Success Indicators

### When everything is working:

**Terminal 3 (Stripe CLI):**
```
✅ Ready! Your webhook signing secret is whsec_...
✅ --> checkout.session.completed [evt_abc123]
✅ <-- [200] POST http://localhost:5000/api/webhooks/stripe
```

**Terminal 1 (Backend):**
```
✅ MongoDB Connected
✅ Server running on port 5000
✅ Webhook received: checkout.session.completed
✅ Project updated. New raised amount: 5500
✅ Webhook processing completed successfully!
```

**Browser:**
```
✅ Payment successful page appears
✅ Redirects to project page
✅ Raised amount increased
✅ Backers count increased
✅ Progress bar updated
✅ Updates tab shows donation
```

---

## 💡 Pro Tips

### Tip 1: Keep Terminals Organized

Use a terminal multiplexer or separate windows:
- **Window 1:** Backend (server)
- **Window 2:** Frontend
- **Window 3:** Stripe CLI (CRITICAL!)

### Tip 2: Check Stripe CLI First

Before making a payment, check Terminal 3 shows:
```
Ready! Your webhook signing secret is whsec_...
```

If not, restart it.

### Tip 3: Watch All Terminals

When making a test payment:
- Watch Terminal 3 for webhook events
- Watch Terminal 1 for processing logs
- Watch Browser for updates

### Tip 4: Save Webhook Secret

Save the webhook secret somewhere safe:
- You'll need it every time you restart
- Or keep Terminal 3 running always

---

## 🔄 Daily Development Workflow

**Every time you start working:**

1. Open 3 terminals
2. Terminal 1: `cd server && npm run dev`
3. Terminal 2: `cd frontend && npm run dev`
4. Terminal 3: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
5. Copy webhook secret from Terminal 3
6. Verify it's in `server/.env`
7. If not, add it and restart Terminal 1
8. Start developing!

**Keep all 3 terminals running while working!**

---

## 🆘 Still Not Working?

### Last Resort Checklist:

1. **Completely restart everything:**
   ```bash
   # Stop all terminals (Ctrl+C)
   # Close all terminal windows
   # Open fresh terminals
   # Start from Step 1 above
   ```

2. **Verify Stripe account:**
   - Go to https://dashboard.stripe.com
   - Make sure you're in Test mode
   - Check API keys are correct

3. **Check MongoDB:**
   - Make sure MongoDB is running
   - Check connection string in .env
   - Test connection with MongoDB Compass

4. **Check ports:**
   - Backend should be on 5000
   - Frontend should be on 5173
   - No other apps using these ports

5. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R
   - Or clear all cache
   - Restart browser

---

## 📞 Need Help?

If you've followed ALL steps and it still doesn't work:

1. Check Terminal 3 output - Copy and review
2. Check Terminal 1 output - Copy and review
3. Check browser console - Copy any errors
4. Verify all 3 terminals are running
5. Verify webhook secret matches

**99% of the time, the issue is Terminal 3 not running!**

---

## ✅ Summary

**To make data update after payment:**

1. ✅ Install Stripe CLI
2. ✅ Run `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
3. ✅ Copy webhook secret
4. ✅ Add to `server/.env`
5. ✅ Restart backend
6. ✅ Keep all 3 terminals running
7. ✅ Make test payment
8. ✅ Data updates automatically!

**THE KEY: Keep Terminal 3 (Stripe CLI) running at all times!**

Without it, webhooks don't work, and data won't update. It's that simple!

🚀 **Now go make a test payment and watch the magic happen!**
