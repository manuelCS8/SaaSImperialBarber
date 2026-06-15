export function calculateCommissionAmount(
  serviceAmount: number,
  commissionRate: number
): number {
  const amount = serviceAmount * (commissionRate / 100);
  return Math.round(amount * 100) / 100;
}
