'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { RootState } from '@/store';
import { postReservation } from '@/services/reservationApi';
import { showToast } from '@/store/toastSlice';
import {
  setRedsysData,
  updateReservation,
  updateReservations,
} from '@/store/reserveSlice';
import { useLanguage } from '@/i18n/LanguageContext';
import { selectLastAvailabilityParams } from '@/store/selectors/propertiesSelectors';

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
  const lastAvailabilityParams = useSelector(selectLastAvailabilityParams);

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

  const displayCurrency = data?.currency ?? 'EUR';

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    [lang]
  );

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      const parsed = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        0,
        0,
        0,
        0
      );
      return parsed;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const formatDate = (isoDate?: string | null) => {
    const parsedDate = parseDate(isoDate);
    if (!parsedDate) return null;
    return dateFormatter.format(parsedDate);
  };

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

  useEffect(() => {
    if (
      !data ||
      reservationIndex < 0 ||
      !lastAvailabilityParams?.check_in ||
      !lastAvailabilityParams?.check_out
    ) {
      return;
    }

    if (
      data.check_in === lastAvailabilityParams.check_in &&
      data.check_out === lastAvailabilityParams.check_out
    ) {
      return;
    }

    dispatch(
      updateReservation({
        index: reservationIndex,
        data: {
          check_in: lastAvailabilityParams.check_in,
          check_out: lastAvailabilityParams.check_out,
        },
      })
    );
  }, [
    data,
    dispatch,
    lastAvailabilityParams?.check_in,
    lastAvailabilityParams?.check_out,
    reservationIndex,
  ]);

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
  const reservationsToDisplay = useMemo(() => {
    const validReservations = allReservations.filter(Boolean);
    if (validReservations.length > 0) {
      return validReservations;
    }
    return data ? [data] : [];
  }, [allReservations, data]);
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
      'w-full rounded-xl border border-dozeblue/20 bg-white/95 px-4 py-3 text-sm text-dozeblue shadow-sm shadow-dozeblue/10 transition placeholder:text-dozeblue/40 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-dozeblue/40 dark:border-white/15 dark:bg-dozegray/30 dark:placeholder:text-white/40 dark:shadow-black/20';
    if (errors[field]) {
      return `${base} border-red-500 focus:ring-red-500`;
    }
    if (touched[field] && value) {
      return `${base} border-emerald-500 focus:ring-emerald-500`;
    }
    return `${base} focus:ring-dozeblue/55`;
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
  const subtitle =
    lang === 'en'
      ? 'Fill in the details we use to confirm your reservation and keep you informed.'
      : 'Completa los datos que utilizaremos para confirmar tu reserva y mantenerte informado.';
  const summaryTitle =
    lang === 'en' ? 'Reservation summary' : 'Resumen de la reserva';
  const stayLabel = lang === 'en' ? 'Stay' : 'Estancia';
  const roomLabel = lang === 'en' ? 'Room' : 'Habitación';
  const totalLabel = lang === 'en' ? 'Total' : 'Total';
  const tipsTitle = lang === 'en' ? 'Quick tips' : 'Consejos rápidos';
  const supportTitle = lang === 'en' ? 'Need assistance?' : '¿Necesitas ayuda?';
  const supportDescription =
    lang === 'en'
      ? 'Our team reviews every request. Write to reservas@dozzze.com and we will assist you right away.'
      : 'Nuestro equipo revisa cada solicitud. Escríbenos a reservas@dozzze.com y te ayudaremos enseguida.';
  const emailHelper =
    lang === 'en'
      ? 'We will send the confirmation and updates to this email address.'
      : 'Enviaremos la confirmación y novedades a este correo electrónico.';
  const phoneHelper =
    lang === 'en'
      ? 'Include country code so we can contact you if needed.'
      : 'Incluye el prefijo internacional para contactarte si es necesario.';
  const remarksMaxLength = 200;
  const remainingRemarks = Math.max(0, remarksMaxLength - guestRemarks.length);
  const charactersLeftLabel =
    lang === 'en' ? 'characters left' : 'caracteres restantes';
  const nightSingular = lang === 'en' ? 'night' : 'noche';
  const nightPlural = lang === 'en' ? 'nights' : 'noches';
  const guestPlural = lang === 'en' ? 'guests' : 'huéspedes';
  const guestSingular = lang === 'en' ? 'guest' : 'huésped';
  const roomSingular = lang === 'en' ? 'room' : 'habitación';
  const roomPlural = lang === 'en' ? 'rooms' : 'habitaciones';
  const helpTips = useMemo(
    () =>
      lang === 'en'
        ? [
            'Ensure the main guest name matches the identification document to avoid delays at check-in.',
            'Add a phone number with country prefix so we can reach you if we need extra details.',
            'Use the comments box to share arrival time or special requests so the team can prepare everything.',
          ]
        : [
            'Verifica que el nombre principal coincida con el documento de identidad para evitar demoras en el check-in.',
            'Añade un teléfono con prefijo internacional para contactarte en caso de necesitar más información.',
            'Usa los comentarios para indicar hora de llegada o peticiones especiales y así preparar tu estancia.',
          ],
    [lang]
  );
  const getReservationDates = (
    reservation: typeof data,
    index: number
  ) => {
    const shouldUseSearchDates =
      index === reservationIndex &&
      lastAvailabilityParams?.check_in &&
      lastAvailabilityParams?.check_out;
    const checkIn = shouldUseSearchDates
      ? lastAvailabilityParams.check_in
      : reservation?.check_in ?? null;
    const checkOut = shouldUseSearchDates
      ? lastAvailabilityParams.check_out
      : reservation?.check_out ?? null;
    return { checkIn, checkOut };
  };
  const getReservationNights = (reservation: typeof data, index: number) => {
    const { checkIn, checkOut } = getReservationDates(reservation, index);
    if (!checkIn || !checkOut) {
      return null;
    }
    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);
    if (
      !checkInDate ||
      !checkOutDate ||
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return null;
    }
    return Math.max(
      1,
      Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
  };
  const formatReservationPrice = (reservation: typeof data) => {
    const total = reservation?.total_price;
    if (typeof total !== 'number') {
      return null;
    }
    const currency = reservation?.currency ?? displayCurrency ?? 'EUR';
    const formatter = new Intl.NumberFormat(
      lang === 'en' ? 'en-US' : 'es-ES',
      {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }
    );
    return formatter.format(total);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dozeblue/20 bg-white px-6 py-5 shadow-sm dark:border-white/10 dark:bg-dozegray/20">
        <h2 className="text-2xl font-bold text-dozeblue">
          {t('reserve.form.title')}
        </h2>
        <p className="mt-1 text-sm text-dozeblue/70">{subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-dozegray/20">
          <div className="space-y-8">
            <fieldset className="space-y-5">
              <legend className="text-base font-semibold text-dozeblue">
                {primaryInfoLegend}
              </legend>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dozeblue">
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
                  <p
                    id="guestName-error"
                    className="text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.guestName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dozeblue">
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
                    errors.guestEmail ? 'guestEmail-error' : 'guestEmail-helper'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setGuestEmail(value);
                    if (touched.guestEmail) validateField('guestEmail', value);
                  }}
                  onBlur={(e) => handleBlur('guestEmail', e.target.value)}
                  className={inputClass('guestEmail', guestEmail)}
                />
                {errors.guestEmail ? (
                  <p
                    id="guestEmail-error"
                    className="text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.guestEmail}
                  </p>
                ) : (
                  <p
                    id="guestEmail-helper"
                    className="text-xs text-dozeblue/60"
                  >
                    {emailHelper}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dozeblue">
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
                    errors.guestPhone ? 'guestPhone-error' : 'guestPhone-helper'
                  }
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(
                      /[^\d\s()+-]/g,
                      ''
                    );
                    setGuestPhone(sanitized);
                    if (touched.guestPhone)
                      validateField('guestPhone', sanitized);
                  }}
                  onBlur={(e) => handleBlur('guestPhone', e.target.value)}
                  className={inputClass('guestPhone', guestPhone)}
                />
                {errors.guestPhone ? (
                  <p
                    id="guestPhone-error"
                    className="text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.guestPhone}
                  </p>
                ) : (
                  <p
                    id="guestPhone-helper"
                    className="text-xs text-dozeblue/60"
                  >
                    {phoneHelper}
                  </p>
                )}
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="flex items-center gap-3 text-base font-semibold text-dozeblue">
                {addressLegend}
                <span className="rounded-full bg-dozeblue/10 px-2.5 py-0.5 text-xs font-medium text-dozeblue dark:bg-white/10">
                  {optionalBadgeLabel}
                </span>
              </legend>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dozeblue">
                  {t('reserve.form.addressLabel')}{' '}
                  <span className="text-xs font-medium text-dozeblue/60">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dozeblue">
                    {t('reserve.form.cityLabel')}{' '}
                    <span className="text-xs font-medium text-dozeblue/60">
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

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dozeblue">
                    {t('reserve.form.countryLabel')}{' '}
                    <span className="text-xs font-medium text-dozeblue/60">
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dozeblue">
                  {t('reserve.form.cpLabel')}{' '}
                  <span className="text-xs font-medium text-dozeblue/60">
                    {optionalBadgeLabel}
                  </span>
                </label>
                <input
                  type="text"
                  value={guestCp}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.guestCp)}
                  aria-describedby={
                    errors.guestCp ? 'guestCp-error' : undefined
                  }
                  onChange={(e) => {
                    const numeric = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 10);
                    setGuestCp(numeric);
                    if (touched.guestCp) validateField('guestCp', numeric);
                  }}
                  onBlur={(e) => handleBlur('guestCp', e.target.value)}
                  className={inputClass('guestCp', guestCp)}
                />
                {errors.guestCp && (
                  <p
                    id="guestCp-error"
                    className="text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.guestCp}
                  </p>
                )}
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="text-base font-semibold text-dozeblue">
                {remarksLegend}
              </legend>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-dozeblue">
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
                    if (touched.guestRemarks)
                      validateField('guestRemarks', value);
                  }}
                  onBlur={(e) => handleBlur('guestRemarks', e.target.value)}
                  className={`${inputClass(
                    'guestRemarks',
                    guestRemarks
                  )} resize-none`}
                />
                <div
                  id="guestRemarks-counter"
                  className="flex justify-between text-xs text-dozeblue/60"
                  aria-live="polite"
                >
                  {errors.guestRemarks ? (
                    <span className="text-red-600 dark:text-red-400">
                      {errors.guestRemarks}
                    </span>
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
                className="flex w-full items-center justify-between rounded-2xl border border-dozeblue/25 bg-white px-4 py-3 text-sm font-semibold text-dozeblue shadow-sm transition hover:border-dozeblue/40 hover:bg-dozeblue/10 dark:border-white/15 dark:bg-dozegray/30"
                aria-expanded={showOptional}
                aria-controls="optional-details"
              >
                <span>{optionalToggleActionLabel}</span>
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-dozeblue/10 text-base transition-transform ${
                    showOptional ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {showOptional && (
                <div
                  id="optional-details"
                  className="mt-4 space-y-4 rounded-2xl border border-dozeblue/20 bg-white p-4 dark:border-white/15 dark:bg-white/5"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-dozeblue">
                      {t('reserve.form.corporateLabel')}{' '}
                      <span className="text-xs font-medium text-dozeblue/60">
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-dozeblue">
                        {t('reserve.form.regionLabel')}{' '}
                        <span className="text-xs font-medium text-dozeblue/60">
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

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-dozeblue">
                        {t('reserve.form.countryIsoLabel')}{' '}
                        <span className="text-xs font-medium text-dozeblue/60">
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
                        className={inputClass(
                          'guestCountryIso',
                          guestCountryIso
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-dozegray/20">
            <h3 className="text-base font-semibold text-dozeblue">
              {summaryTitle}
            </h3>
            <div className="mt-4 space-y-4">
              <div className="max-h-[460px] space-y-4 overflow-y-auto pr-2 sm:max-h-[500px]">
                {reservationsToDisplay.map((reservation, index) => {
                  const roomType =
                    reservation?.roomType ?? reservation?.room_type ?? '';
                  const roomsCount =
                    typeof reservation?.rooms === 'number'
                      ? reservation.rooms
                      : null;
                  const guestsCount = reservation?.pax_count ?? undefined;
                  const { checkIn, checkOut } = getReservationDates(
                    reservation,
                    index
                  );
                  const checkInDisplay = formatDate(checkIn);
                  const checkOutDisplay = formatDate(checkOut);
                  const nights = getReservationNights(reservation, index);
                  const formattedPrice = formatReservationPrice(reservation);
                  const key =
                    reservation?.reservation_id ??
                    reservation?.id ??
                    `${roomType || 'reservation'}-${index}`;
                  const isActive = index === reservationIndex;

                  return (
                    <div
                      key={key}
                      className={`rounded-2xl border bg-dozeblue/5 px-4 py-4 text-dozeblue shadow-sm dark:border-white/15 dark:bg-white/10 ${
                        isActive
                          ? 'border-dozeblue/40 ring-1 ring-dozeblue/30'
                          : 'border-dozeblue/20'
                      }`}
                    >
                      {checkInDisplay && checkOutDisplay && (
                        <div className="flex items-center justify-between rounded-2xl border border-dozeblue/15 bg-white/80 px-4 py-3 text-dozeblue dark:border-white/20 dark:bg-white/10">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-dozeblue/60">
                              {stayLabel}
                            </p>
                            <p className="font-semibold">
                              {checkInDisplay} · {checkOutDisplay}
                            </p>
                          </div>
                          {nights && (
                            <span className="rounded-full bg-dozeblue/10 px-3 py-1 text-xs font-semibold text-dozeblue">
                              {`${nights} ${
                                nights === 1 ? nightSingular : nightPlural
                              }`}
                            </span>
                          )}
                        </div>
                      )}

                      {(roomType ||
                        typeof guestsCount === 'number' ||
                        roomsCount !== null) && (
                        <div className="mt-4 rounded-2xl border border-dozeblue/15 bg-white/70 px-4 py-3 text-sm dark:border-white/20 dark:bg-white/10">
                          {roomType && (
                            <p className="font-medium">
                              {roomLabel}:{' '}
                              <span className="font-normal">{roomType}</span>
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-dozeblue/70">
                            {roomsCount !== null && (
                              <span className="rounded-full border border-dozeblue/20 bg-white px-3 py-1 font-medium">
                                {`${roomsCount} ${
                                  roomsCount === 1 ? roomSingular : roomPlural
                                }`}
                              </span>
                            )}
                            {typeof guestsCount === 'number' && (
                              <span className="rounded-full border border-dozeblue/20 bg-white px-3 py-1 font-medium">
                                {`${guestsCount} ${
                                  guestsCount === 1
                                    ? guestSingular
                                    : guestPlural
                                }`}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {formattedPrice && (
                        <div className="mt-4 rounded-2xl border border-dozeblue/15 bg-white px-4 py-3 text-dozeblue shadow-sm dark:border-white/20 dark:bg-white/10">
                          <span className="text-sm font-semibold uppercase tracking-wide">
                            {totalLabel}
                          </span>
                          <span className="mt-1 block text-lg font-semibold">
                            {formattedPrice}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-dozegray/20">
            <h3 className="text-base font-semibold text-dozeblue">
              {tipsTitle}
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-dozeblue/70">
              {helpTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-1 text-dozeblue">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-dozeblue/10 px-4 py-3 text-sm text-dozeblue dark:bg-white/10">
              <p className="font-medium">{supportTitle}</p>
              <p className="mt-1 leading-relaxed text-dozeblue/70">
                {supportDescription}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-dozeblue px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(2,31,89,0.35)] transition hover:-translate-y-0.5 hover:bg-dozeblue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dozeblue disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-dozeblue"
        >
          <span aria-hidden="true">←</span>
          {t('reserve.buttons.back')}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-dozeblue px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(2,31,89,0.35)] transition hover:-translate-y-0.5 hover:bg-dozeblue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dozeblue disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-dozeblue"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin"
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
