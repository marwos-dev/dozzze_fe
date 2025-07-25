export interface Reservation {
  id: number;
  property_id: number;
  channel: string;
  pax_count: number;
  currency: string;
  room_type: string;
  room_type_id: number;
  total_price: number;
  check_in: string;
  check_out: string;
  guest_corporate: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_address: string;
  guest_city: string;
  guest_country: string;
  guest_region: string;
  guest_country_iso: string;
  guest_cp: string;
  guest_remarks: string;
  cancellation_date: string | null;
  modification_date: string | null;
  paid_online: number | null;
  pay_on_arrival: number | null;
}

export interface RedsysArgs {
  endpoint: string;
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
}

export interface ReservationRequest {
  success: boolean;
  redsys_args?: RedsysArgs;
}
