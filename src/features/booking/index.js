// Booking feature — public API (docs/02_ARCHITECTURE.md).
//
// Everything price- or WhatsApp-related for tour bookings lives behind this
// barrel so a page never reaches into the internals and re-implements the
// formula. `calculateQuote` is the only place tour arithmetic happens.
export { calculateQuote, startingPrice } from './pricing';
export { buildBookingMessage, bookingWhatsappLink } from './whatsappMessage';
export { useBooking, todayIso } from './useBooking';
export { default as DurationPicker } from './DurationPicker';
export { default as ActivityPicker } from './ActivityPicker';
export { default as VehiclePicker } from './VehiclePicker';
export { default as BookingForm } from './BookingForm';
export { default as BookingSummary } from './BookingSummary';
