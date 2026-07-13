export function formatPKR(amount: number): string {
  if (amount >= 10_000_000) {
    const crore = amount / 10_000_000;
    return `Rs. ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`;
  }
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    return `Rs. ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
  }
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatRent(amount: number): string {
  const base = formatPKR(amount);
  return `${base} / month`;
}

export function formatPriceShort(amount: number): string {
  if (amount >= 10_000_000) return `${(amount / 10_000_000).toFixed(1)} Cr`;
  if (amount >= 100_000)    return `${(amount / 100_000).toFixed(0)} Lakh`;
  return amount.toLocaleString('en-PK');
}
