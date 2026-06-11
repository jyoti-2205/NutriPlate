export const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const calcTotal = (price, quantity) =>
  Number(price || 0) * Number(quantity || 1);
