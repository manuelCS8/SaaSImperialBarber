import { calculateCommissionAmount } from '../utils/commission';

describe('calculateCommissionAmount', () => {
  it('calcula comisión del 40% sobre 250', () => {
    expect(calculateCommissionAmount(250, 40)).toBe(100);
  });

  it('redondea a dos decimales', () => {
    expect(calculateCommissionAmount(199.99, 33.33)).toBe(66.66);
  });
});
