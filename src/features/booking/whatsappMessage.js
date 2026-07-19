// Builds the WhatsApp booking message and its wa.me link.
//
// The message is assembled here rather than inside a component so the exact
// text is testable and can never drift between the button and the summary. The
// price breakdown is rendered from the same QuoteLine[] the summary panel
// displays, so what the guest reads on the page is literally what we send.
//
// The site never takes payment: this link hands the request to a human, and the
// closing sentence makes the "not yet confirmed" status explicit in writing.
import { company } from '@/data/company';
import { formatCurrency } from '@/utils/format';
import { usdToIdr } from '@/config/pricing';

/** Rupiah shown in parentheses, so the guest sees the currency they'll pay in. */
const money = (usd) =>
  `${formatCurrency(usd, 'USD', 'en-US')} (≈ ${formatCurrency(usdToIdr(usd), 'IDR', 'id-ID')})`;

/**
 * One breakdown row, e.g.
 *   - 8 Hours — Full Day: $65 x 2 vehicles = $130 (≈ Rp 2.119.000)
 */
function formatLine(line, t) {
  const unit = line.per === 'guest' ? t('booking.wa.guestsUnit') : t('booking.wa.vehiclesUnit');

  if (line.unpriced) {
    return `- ${line.label}: ${t('booking.contactForPrice')}`;
  }
  if (line.unitPrice === 0) {
    return `- ${line.label}: ${t('booking.included')}`;
  }
  return `- ${line.label}: ${money(line.unitPrice)} x ${line.quantity} ${unit} = ${money(line.subtotal)}`;
}

/**
 * Compose the full booking message.
 *
 * @param {object}   params
 * @param {object}   params.destination
 * @param {object}   params.duration
 * @param {object}   params.vehicle
 * @param {object[]} params.activities  selected activity objects
 * @param {object}   params.quote       result of calculateQuote()
 * @param {object}   params.form        { name, phone, date, pickup, message }
 * @param {number}   params.guests
 * @param {number}   params.vehicleCount
 * @param {function} params.t           i18next translator
 * @param {function} params.loc         { id, en } localizer
 * @returns {string} plain (un-encoded) message text
 */
export function buildBookingMessage({
  destination,
  duration,
  vehicle,
  activities = [],
  quote,
  form,
  guests,
  vehicleCount,
  t,
  loc,
}) {
  const places = (loc(destination?.places) ?? [])
    .map((p) => p.name)
    .join(', ');

  const activityText = activities.length
    ? activities.map((a) => loc(a.name)).join(', ')
    : t('booking.wa.none');

  const breakdown = quote.lines.length
    ? quote.lines.map((line) => formatLine(line, t)).join('\n')
    : t('booking.wa.none');

  const totalText = quote.requiresQuote
    ? `${money(quote.total)} — ${t('booking.quoteOnRequestShort')}`
    : money(quote.total);

  // Blank-line-separated blocks keep the message readable in the WhatsApp
  // bubble, where long unbroken paragraphs are hard to scan on a phone.
  return [
    t('booking.wa.greeting'),
    '',
    t('booking.wa.intro'),
    '',
    `${t('booking.wa.destination')}: ${destination?.name ?? '-'}`,
    `${t('booking.wa.duration')}: ${loc(duration?.label) ?? '-'}`,
    `${t('booking.wa.date')}: ${form.date || '-'}`,
    `${t('booking.wa.pickup')}: ${form.pickup || '-'}`,
    `${t('booking.wa.guests')}: ${guests}`,
    `${t('booking.wa.vehicleCount')}: ${vehicleCount}`,
    `${t('booking.wa.vehicle')}: ${vehicle ? `${vehicle.name} ${vehicle.year}` : '-'}`,
    `${t('booking.wa.places')}: ${places || '-'}`,
    `${t('booking.wa.activities')}: ${activityText}`,
    '',
    `${t('booking.wa.breakdown')}:`,
    breakdown,
    '',
    `${t('booking.wa.total')}: ${totalText}`,
    '',
    `${t('booking.wa.name')}: ${form.name}`,
    `${t('booking.wa.phone')}: ${form.phone}`,
    `${t('booking.wa.note')}: ${form.message?.trim() || '-'}`,
    '',
    t('booking.wa.disclaimer'),
  ].join('\n');
}

/**
 * wa.me link for a composed message. The number comes from company.whatsapp —
 * the one place it is defined — so it is never hardcoded at a call site.
 */
export function bookingWhatsappLink(message) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
