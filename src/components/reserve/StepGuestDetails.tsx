'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '@/store';
import { postReservation } from '@/services/reservationApi';
import { showToast } from '@/store/toastSlice';
import { setRedsysData, updateReservations } from '@/store/reserveSlice';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  reservationIndex: number;
  onNext: () => void;
  onBack: () => void;
}

export default function StepGuestDetails({
  reservationIndex,
  onBack,
  onNext,
}: Props) {
  const dispatch = useDispatch();
  const data = useSelector(
    (state: RootState) => state.reserve.data[reservationIndex]
  );
  const { t, lang } = useLanguage();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [guestCountry, setGuestCountry] = useState('');
  const [guestCp, setGuestCp] = useState('');
  const [guestRemarks, setGuestRemarks] = useState('');

  const [loading, setLoading] = useState(false);

  const [guestCorporate, setGuestCorporate] = useState('');
  const [guestRegion, setGuestRegion] = useState('');
  const [guestCountryIso, setGuestCountryIso] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showOptional, setShowOptional] = useState(false);

  useEffect(() => {
    if (data) {
      setGuestName(data.guest_name || '');
      setGuestEmail(data.guest_email || '');
      setGuestPhone(data.guest_phone || '');
      setGuestAddress(data.guest_address || '');
      setGuestCity(data.guest_city || '');
      setGuestCountry(data.guest_country || '');
      setGuestCp(data.guest_cp || '');
      setGuestRemarks(data.guest_remarks || '');
      setGuestCorporate(data.guest_corporate || '');
      setGuestRegion(data.guest_region || '');
      setGuestCountryIso(data.guest_country_iso || '');
    }
  }, [data]);

  const validators = {
    name: (value: string) =>
      /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(value)
        ? ''
        : String(t('reserve.validation.name')),
    email: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ''
        : String(t('reserve.validation.email')),
    phone: (value: string) =>
      /^[\d\s()+-]{8,}$/.test(value)
        ? ''
        : String(t('reserve.validation.phone')),
    cp: (value: string) =>
      value === '' || /^\d{1,10}$/.test(value)
        ? ''
        : String(t('reserve.validation.cp')),
    remarks: (value: string) =>
      value.length <= 200 ? '' : String(t('reserve.validation.remarks')),
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'guestName':
        error = validators.name(value);
        break;
      case 'guestEmail':
        error = validators.email(value);
        break;
      case 'guestPhone':
        error = validators.phone(value);
        break;
      case 'guestCp':
        error = validators.cp(value);
        break;
      case 'guestRemarks':
        error = validators.remarks(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    return validateField(field, value);
  };

  const allReservations = useSelector((state: RootState) => state.reserve.data);
  const discountCode = useSelector(
    (state: RootState) => state.reserve.discount?.code
  );

  const handleContinue = async () => {
    const fieldsToValidate = [
      'guestName',
      'guestEmail',
      'guestPhone',
      'guestCp',
      'guestRemarks',
    ] as const;
    setTouched((prev) => ({
      ...prev,
      ...fieldsToValidate.reduce<Record<string, boolean>>(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      ),
    }));

    const newErrors = {
      guestName: validateField('guestName', guestName),
      guestEmail: validateField('guestEmail', guestEmail),
      guestPhone: validateField('guestPhone', guestPhone),
      guestCp: validateField('guestCp', guestCp),
      guestRemarks: validateField('guestRemarks', guestRemarks),
    };

    if (Object.values(newErrors).some((e) => e !== '')) return;

    const fullReservations = allReservations.map((res) => ({
      ...res,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_address: guestAddress,
      guest_city: guestCity,
      guest_country: guestCountry,
      guest_cp: guestCp,
      guest_remarks: guestRemarks,
      guest_corporate: guestCorporate,
      guest_region: guestRegion,
      guest_country_iso: guestCountryIso,
    }));

    setLoading(true);

    try {
      const res = await postReservation(fullReservations, discountCode);
      dispatch(updateReservations(fullReservations));
      dispatch(
        showToast({
          message: String(t('reserve.toasts.reservationConfirmed')),
          color: 'green',
        })
      );
      if (res.redsys_args) {
        dispatch(setRedsysData(res.redsys_args));
      } else {
        dispatch(
          showToast({
            message: String(t('reserve.toasts.noPaymentInfo')),
            color: 'red',
          })
        );
      }
      onNext();
    } catch (err) {
      console.error('Error al confirmar reservas:', err);
      dispatch(
        showToast({
          message: String(t('reserve.toasts.confirmError')),
          color: 'red',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string, value: string) => {
    const base =
      'w-full px-4 py-3 text-sm rounded-md border bg-white dark:bg-dozegray/10 dark:border-white/10 focus:outline-none focus:ring-2';
    if (errors[field]) {
      return `${base} border-red-500 focus:ring-red-500`;
    }
    if (touched[field] && value) {
      return `${base} border-emerald-500 focus:ring-emerald-500`;
    }
    return `${base} border-dozeblue focus:ring-dozeblue`;
  };

  const optionalToggleLabel =
    lang === 'en' ? 'Optional details' : 'Detalles opcionales';
  const optionalToggleActionLabel = showOptional
    ? lang === 'en'
      ? 'Hide optional details'
      : 'Ocultar detalles opcionales'
    : optionalToggleLabel;
  const optionalBadgeLabel = lang === 'en' ? 'Optional' : 'Opcional';
  const primaryInfoLegend =
    lang === 'en' ? 'Guest information' : 'Información del huésped';
  const addressLegend = lang === 'en' ? 'Address' : 'Dirección';
  const remarksLegend = lang === 'en' ? 'Comments' : 'Comentarios adicionales';
  const remarksMaxLength = 200;
  const remainingRemarks = Math.max(0, remarksMaxLength - guestRemarks.length);
  const charactersLeftLabel =
    lang === 'en' ? 'characters left' : 'caracteres restantes';

  return (
    <div>
      <h2 className="text-2xl font-bold text-dozeblue mb-4">
        {t('reserve.form.title')}
      </h2>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/5 shadow-sm p-6 space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-dozeblue">
            {primaryInfoLegend}
          </legend>

          {/* Nombre */}
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              {t('reserve.form.nameLabel')}
            </label>
            <input
              type="text"
              required
              placeholder={String(t('reserve.form.namePlaceholder'))}
              value={guestName}
              autoComplete="name"
              inputMode="text"
              aria-invalid={Boolean(errors.guestName)}
              aria-describedby={
                errors.guestName ? 'guestName-error' : undefined
              }
              onChange={(e) => {
                const value = e.target.value;
                setGuestName(value);
                if (touched.guestName) validateField('guestName', value);
              }}
              onBlur={(e) => handleBlur('guestName', e.target.value)}
              className={inputClass('guestName', guestName)}
            />
            {errors.guestName && (
              <p id="guestName-error" className="text-sm text-red-600 mt-1">
                {errors.guestName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              {t('reserve.form.emailLabel')}
            </label>
            <input
              type="email"
              required
              placeholder={String(t('reserve.form.emailPlaceholder'))}
              value={guestEmail}
              autoComplete="email"
              aria-invalid={Boolean(errors.guestEmail)}
              aria-describedby={
                errors.guestEmail ? 'guestEmail-error' : undefined
              }
              onChange={(e) => {
                const value = e.target.value;
                setGuestEmail(value);
                if (touched.guestEmail) validateField('guestEmail', value);
              }}
              onBlur={(e) => handleBlur('guestEmail', e.target.value)}
              className={inputClass('guestEmail', guestEmail)}
            />
            {errors.guestEmail && (
              <p id="guestEmail-error" className="text-sm text-red-600 mt-1">
                {errors.guestEmail}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              {t('reserve.form.phoneLabel')}
            </label>
            <input
              type="tel"
              required
              placeholder={String(t('reserve.form.phonePlaceholder'))}
              value={guestPhone}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(errors.guestPhone)}
              aria-describedby={
                errors.guestPhone ? 'guestPhone-error' : undefined
              }
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^\d\s()+-]/g, '');
                setGuestPhone(sanitized);
                if (touched.guestPhone) validateField('guestPhone', sanitized);
              }}
              onBlur={(e) => handleBlur('guestPhone', e.target.value)}
              className={inputClass('guestPhone', guestPhone)}
            />
            {errors.guestPhone && (
              <p id="guestPhone-error" className="text-sm text-red-600 mt-1">
                {errors.guestPhone}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-dozeblue">
            {addressLegend}{' '}
            <span className="ml-2 text-xs font-medium text-gray-500">
              {optionalBadgeLabel}
            </span>
          </legend>

          {/* Dirección */}
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              {t('reserve.form.addressLabel')}{' '}
              <span className="text-xs font-medium text-gray-500">
                {optionalBadgeLabel}
              </span>
            </label>
            <input
              type="text"
              placeholder={String(t('reserve.form.addressPlaceholder'))}
              value={guestAddress}
              autoComplete="street-address"
              inputMode="text"
              aria-invalid={false}
              onChange={(e) => setGuestAddress(e.target.value)}
              className={inputClass('guestAddress', guestAddress)}
            />
          </div>

          {/* Ciudad y País */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1 text-dozeblue">
                {t('reserve.form.cityLabel')}{' '}
                <span className="text-xs font-medium text-gray-500">
                  {optionalBadgeLabel}
                </span>
              </label>
              <input
                type="text"
                value={guestCity}
                autoComplete="address-level2"
                inputMode="text"
                aria-invalid={false}
                onChange={(e) => setGuestCity(e.target.value)}
                className={inputClass('guestCity', guestCity)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1 text-dozeblue">
                {t('reserve.form.countryLabel')}{' '}
                <span className="text-xs font-medium text-gray-500">
                  {optionalBadgeLabel}
                </span>
              </label>
              <input
                type="text"
                value={guestCountry}
                autoComplete="country"
                inputMode="text"
                aria-invalid={false}
                onChange={(e) => setGuestCountry(e.target.value)}
                className={inputClass('guestCountry', guestCountry)}
              />
            </div>
          </div>

          {/* Código postal */}
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              {t('reserve.form.cpLabel')}{' '}
              <span className="text-xs font-medium text-gray-500">
                {optionalBadgeLabel}
              </span>
            </label>
            <input
              type="text"
              value={guestCp}
              autoComplete="postal-code"
              inputMode="numeric"
              aria-invalid={Boolean(errors.guestCp)}
              aria-describedby={errors.guestCp ? 'guestCp-error' : undefined}
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, '').slice(0, 10);
                setGuestCp(numeric);
                if (touched.guestCp) validateField('guestCp', numeric);
              }}
              onBlur={(e) => handleBlur('guestCp', e.target.value)}
              className={inputClass('guestCp', guestCp)}
            />
            {errors.guestCp && (
              <p id="guestCp-error" className="text-sm text-red-600 mt-1">
                {errors.guestCp}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-dozeblue">
            {remarksLegend}
          </legend>

          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              {t('reserve.form.remarksLabel')}
            </label>
            <textarea
              placeholder={String(t('reserve.form.remarksPlaceholder'))}
              value={guestRemarks}
              maxLength={remarksMaxLength}
              autoComplete="off"
              rows={3}
              aria-invalid={Boolean(errors.guestRemarks)}
              aria-describedby="guestRemarks-counter"
              onChange={(e) => {
                const value = e.target.value;
                setGuestRemarks(value);
                if (touched.guestRemarks) validateField('guestRemarks', value);
              }}
              onBlur={(e) => handleBlur('guestRemarks', e.target.value)}
              className={`${inputClass(
                'guestRemarks',
                guestRemarks
              )} resize-none`}
            />
            <div
              id="guestRemarks-counter"
              className="flex justify-between text-xs text-gray-500 mt-1"
              aria-live="polite"
            >
              {errors.guestRemarks ? (
                <span className="text-red-600">{errors.guestRemarks}</span>
              ) : (
                <span>
                  {remainingRemarks} {charactersLeftLabel}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        <div>
          <button
            type="button"
            onClick={() => setShowOptional((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-medium text-dozeblue hover:bg-dozeblue/5 transition-colors"
            aria-expanded={showOptional}
          >
            <span>{optionalToggleActionLabel}</span>
            <span
              className={`transform transition-transform ${
                showOptional ? 'rotate-180' : ''
              }`}
            >
              ▾
            </span>
          </button>

          {showOptional && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1 text-dozeblue">
                  {t('reserve.form.corporateLabel')}{' '}
                  <span className="text-xs font-medium text-gray-500">
                    {optionalBadgeLabel}
                  </span>
                </label>
                <input
                  type="text"
                  value={guestCorporate}
                  autoComplete="organization"
                  inputMode="text"
                  aria-invalid={false}
                  onChange={(e) => setGuestCorporate(e.target.value)}
                  className={inputClass('guestCorporate', guestCorporate)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1 text-dozeblue">
                    {t('reserve.form.regionLabel')}{' '}
                    <span className="text-xs font-medium text-gray-500">
                      {optionalBadgeLabel}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={guestRegion}
                    autoComplete="address-level1"
                    inputMode="text"
                    aria-invalid={false}
                    onChange={(e) => setGuestRegion(e.target.value)}
                    className={inputClass('guestRegion', guestRegion)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-dozeblue">
                    {t('reserve.form.countryIsoLabel')}{' '}
                    <span className="text-xs font-medium text-gray-500">
                      {optionalBadgeLabel}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={guestCountryIso}
                    autoComplete="off"
                    inputMode="text"
                    aria-invalid={false}
                    onChange={(e) => setGuestCountryIso(e.target.value)}
                    className={inputClass('guestCountryIso', guestCountryIso)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-dozeblue to-[#142b87] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(30,58,138,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(30,58,138,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dozeblue disabled:translate-y-0 disabled:shadow-none dark:from-[#4471d8] dark:to-[#2b4ba8] dark:shadow-[0_18px_40px_rgba(14,116,244,0.35)] dark:hover:shadow-[0_22px_46px_rgba(14,116,244,0.4)]"
        >
          <span aria-hidden="true">←</span>
          {t('reserve.buttons.back')}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-dozeblue to-[#142b87] px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(2,31,89,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(2,31,89,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dozeblue disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0 dark:from-[#4471d8] dark:to-[#2b4ba8] dark:shadow-[0_28px_50px_rgba(14,116,244,0.42)] dark:hover:shadow-[0_32px_56px_rgba(14,116,244,0.48)]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin"
                aria-hidden="true"
              />
              {t('reserve.form.processing')}
            </span>
          ) : (
            <>
              {t('reserve.form.continue')}
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
