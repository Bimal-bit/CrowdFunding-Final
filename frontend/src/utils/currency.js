// Currency utility functions

// Format amount in INR (Indian Rupees)
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format amount with compact notation (e.g., ₹1.5L, ₹2.3Cr)
export const formatCurrencyCompact = (amount) => {
  if (amount >= 10000000) { // 1 Crore or more
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh or more
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 Thousand or more
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Currency symbol
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_NAME = 'INR';
