# 💳 Stripe Test Cards

Use these test card numbers to test different payment scenarios in the application.

---

## 🧪 Test Card Numbers

### ✅ **Successful Payment**
```
Card Number: 4242 4242 4242 4242
Result: Always succeeds
Use Case: Testing successful payments
```

**Details:**
- Any future expiry date (e.g., 12/25)
- Any 3-digit CVC
- Any billing postal code

---

### ❌ **Card Declined**
```
Card Number: 4000 0000 0000 0002
Result: Always fails
Use Case: Testing declined payments
```

**Details:**
- Card will be declined with a generic decline code
- Use to test error handling

---

### ⚠️ **Insufficient Funds**
```
Card Number: 4000 0000 0000 9995
Result: Declined (insufficient funds)
Use Case: Testing insufficient funds scenario
```

**Details:**
- Simulates a card with insufficient balance
- Returns specific "insufficient_funds" error

---

### 🕒 **Requires Authentication (3D Secure)**
```
Card Number: 4000 0025 0000 3155
Result: Requires OTP simulation
Use Case: Testing 3D Secure authentication flow
```

**Details:**
- Triggers 3D Secure authentication
- Simulates additional verification step
- Use to test authentication handling

---

### 🌍 **International Card**
```
Card Number: 4000 0039 6000 0004
Result: Succeeds (non-INR currency)
Use Case: Testing international payments
```

**Details:**
- Simulates a card from Romania
- Works with non-INR currencies
- Use to test international transactions

---

## 📋 How to Use

### Step 1: Go to Payment Page
1. Select any project
2. Click "Back This Project"
3. Enter contribution amount

### Step 2: Enter Test Card
1. Use one of the card numbers above
2. Enter any future expiry date (e.g., `12/25`)
3. Enter any 3-digit CVC (e.g., `123`)
4. Enter any postal code (e.g., `12345`)

### Step 3: Complete Payment
1. Click "Pay" button
2. Observe the result based on card used

---

## 🎯 Testing Scenarios

### Test Successful Payment:
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
ZIP: 12345

Expected: ✅ Payment successful, receipt generated
```

### Test Declined Payment:
```
Card: 4000 0000 0000 0002
Expiry: 12/25
CVC: 123
ZIP: 12345

Expected: ❌ Payment declined error message
```

### Test Insufficient Funds:
```
Card: 4000 0000 0000 9995
Expiry: 12/25
CVC: 123
ZIP: 12345

Expected: ⚠️ Insufficient funds error
```

### Test 3D Secure:
```
Card: 4000 0025 0000 3155
Expiry: 12/25
CVC: 123
ZIP: 12345

Expected: 🕒 Authentication popup appears
```

### Test International Card:
```
Card: 4000 0039 6000 0004
Expiry: 12/25
CVC: 123
ZIP: 12345

Expected: 🌍 Payment succeeds with international card
```

---

## 💡 Additional Test Cards

### More Decline Scenarios:

| Card Number | Decline Code | Description |
|-------------|--------------|-------------|
| 4000 0000 0000 0069 | expired_card | Card has expired |
| 4000 0000 0000 0127 | incorrect_cvc | CVC check fails |
| 4000 0000 0000 0119 | processing_error | Processing error |
| 4000 0000 0000 0101 | card_declined | Generic decline |

### Currency-Specific Cards:

| Card Number | Currency | Country |
|-------------|----------|---------|
| 4000 0003 5600 0008 | USD | United States |
| 4000 0008 2600 0000 | GBP | United Kingdom |
| 4000 0003 9200 0003 | EUR | France |
| 4000 0035 6000 0008 | INR | India |

---

## 🔒 Security Notes

### Important:
- ⚠️ **NEVER** use real card numbers in test mode
- ⚠️ These cards only work in Stripe test mode
- ⚠️ Real cards will be declined in test mode
- ✅ Always use test API keys for development

### Test Mode Indicators:
- Test API key starts with `pk_test_`
- Test secret key starts with `sk_test_`
- Dashboard shows "TEST MODE" banner

---

## 📚 More Information

### Stripe Documentation:
- [Testing Cards](https://stripe.com/docs/testing)
- [Test Mode](https://stripe.com/docs/test-mode)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)

### Common Issues:

**Issue:** Card is declined even with test card
**Solution:** Make sure you're using test API keys

**Issue:** 3D Secure not appearing
**Solution:** Use card `4000 0025 0000 3155` specifically

**Issue:** International card fails
**Solution:** Check currency settings in Stripe dashboard

---

## 🧪 Quick Reference

### Most Used Test Cards:

```
✅ Success:        4242 4242 4242 4242
❌ Decline:        4000 0000 0000 0002
⚠️ Insufficient:   4000 0000 0000 9995
🕒 3D Secure:      4000 0025 0000 3155
```

### Standard Test Data:
```
Expiry: Any future date (12/25, 01/26, etc.)
CVC: Any 3 digits (123, 456, 789, etc.)
ZIP: Any postal code (12345, 10001, etc.)
```

---

## ✅ Testing Checklist

- [ ] Test successful payment with 4242 card
- [ ] Test declined payment with 0002 card
- [ ] Test insufficient funds with 9995 card
- [ ] Test 3D Secure with 3155 card
- [ ] Test international card with 0004 card
- [ ] Verify receipt generation
- [ ] Check error messages
- [ ] Test on mobile device
- [ ] Test with different amounts
- [ ] Verify payment confirmation

---

**Use these test cards to thoroughly test your payment integration! 💳✨**
