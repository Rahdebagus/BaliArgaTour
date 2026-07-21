// Booking feature — public API (docs/02_ARCHITECTURE.md).
//
// Everything price- or WhatsApp-related for TOUR bookings lives behind this
// barrel so a page never reaches into the internals and re-implements the
// formula. `calculateQuote` is the only place tour arithmetic happens.
//
// Vehicle hire is not part of this feature and must not be added to it. The
// tour price already covers the private vehicle and driver; standalone rental
// is a separate product with its own form, price and WhatsApp message, in
// features/vehicles.
export { calculateQuote, startingPrice } from './pricing';
export { buildBookingMessage, bookingWhatsappLink } from './whatsappMessage';
export { useBooking, todayIso } from './useBooking';
export { default as DurationPicker } from './DurationPicker';
export { default as ActivityPicker } from './ActivityPicker';
export { default as BookingForm } from './BookingForm';
export { default as BookingSummary } from './BookingSummary';
