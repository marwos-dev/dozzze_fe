'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RootState, AppDispatch } from '@/store';
import { validateVoucher } from '@/services/voucherApi';
import { applyCoupon, applyVoucher } from '@/store/reserveSlice';
import { showToast } from '@/store/toastSlice';
import { useLanguage } from '@/i18n/LanguageContext';

export default function VoucherOrLoginPrompt() {
  const profile = useSelector((state: RootState) => state.customer.profile);
  const discount = useSelector((state: RootState) => state.reserve.discount);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [voucher, setVoucher] = useState('');
  const { t } = useLanguage();

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await validateVoucher(voucher);
      if (data.type === 'coupon' && data.applicable) {
        dispatch(
          applyCoupon({
            code: voucher,
            name: data.name,
            percent: data.discount_percent,
          })
        );
        dispatch(
          showToast({
            message: String(t('reserve.toasts.couponApplied')),
            color: 'green',
          })
        );
      } else if (data.type === 'voucher' && data.applicable) {
        dispatch(applyVoucher({ code: voucher, amount: data.remaining_amount }));
        dispatch(
          showToast({
            message: String(t('reserve.toasts.voucherApplied')),
            color: 'green',
          })
        );
      } else {
        dispatch(
          showToast({
            message: String(t('reserve.toasts.codeNotApplicable')),
            color: 'red',
          })
        );
      }
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          message: String(t('reserve.toasts.codeInvalid')),
          color: 'red',
        })
      );
    }
  };

  const containerStyles =
    'rounded-[26px] border border-white/60 bg-white/90 p-6 shadow-[0_16px_32px_rgba(64,93,230,0.09)] backdrop-blur dark:border-white/10 dark:bg-dozebg1 dark:shadow-[0_22px_48px_rgba(5,16,45,0.38)]';
  const buttonStyles =
    'inline-flex items-center justify-center gap-2 rounded-full bg-dozeblue px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(64,93,230,0.35)] transition-all hover:-translate-y-0.5 hover:bg-dozeblue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dozeblue dark:shadow-[0_18px_35px_rgba(14,116,244,0.32)]';

  if (!profile) {
    return (
      <div className={`${containerStyles} text-center`}>
        <p className="mb-4 text-sm text-[var(--foreground)] dark:text-slate-200">
          {t('reserve.loginPrompt.message')}
        </p>
        <button
          onClick={() => router.push('/login')}
          className={buttonStyles}
        >
          {t('reserve.buttons.login')}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleVoucherSubmit}
      className={`${containerStyles} flex flex-col gap-4`}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/70 dark:text-slate-500">
          Voucher
        </p>
        <label className="block text-base font-semibold text-[var(--foreground)] dark:text-dozeblue">
          {t('reserve.voucher.label')}
        </label>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder={String(t('reserve.voucher.placeholder'))}
          className="flex-1 rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-slate-700 shadow-inner shadow-white/40 transition focus:border-dozeblue/60 focus:outline-none focus:ring-2 focus:ring-dozeblue/40 dark:border-white/10 dark:bg-dozebg2 dark:text-slate-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:focus:border-dozeblue dark:focus:ring-dozeblue/40 dark:placeholder:text-slate-500"
        />
        <button type="submit" className={buttonStyles}>
          {t('reserve.buttons.apply')}
        </button>
      </div>

      {discount && (
        <p className="text-sm font-medium text-dozeblue dark:text-dozeblue">
          {discount.type === 'coupon'
            ? t('reserve.voucher.usingCoupon')
            : t('reserve.voucher.usingVoucher')}
        </p>
      )}
    </form>
  );
}
