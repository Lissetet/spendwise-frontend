export const formatCurrency = (amount) => {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
  return amount < 0 ? `(${formatted})` : formatted;
};
