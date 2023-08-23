export const formatCurrency = (amount) => {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
  return amount < 0 ? `(${formatted})` : formatted;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }
  );
};