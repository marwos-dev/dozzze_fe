export interface CouponValidation {
  type: 'coupon';
  applicable: boolean;
  name: string;
  discount_percent: number;
}

export interface VoucherValidation {
  type: 'voucher';
  applicable: boolean;
  redemptions: number;
  remaining_amount: number;
}

export type VoucherValidationResponse =
  | CouponValidation
  | VoucherValidation;
