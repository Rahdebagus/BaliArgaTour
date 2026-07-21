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
 *   - Bali Swing: $25 x 4 guest(s) = $100 (≈ Rp 1.630.000)
 *   - 8 Hours — Full Day: $65 (≈ Rp 1.059.500)
 *
 * Per-tour lines print the bare amount: "x 1 tour = $65" is arithmetic the
 * guest did not ask to see, and it invites the reading that a second one could
 * be added.
 */
function formatLine(line, t) {
  if (line.unpriced) {
    return `- ${line.label}: ${t('booking.contactForPrice')}`;
  }
  if (line.unitPrice === 0) {
    return `- ${line.label}: ${t('booking.included')}`;
  }
  if (line.per === 'tour') {
    return `- ${line.label}: ${money(line.subtotal)}`;
  }
  return `- ${line.label}: ${money(line.unitPrice)} x ${line.quantity} ${t('booking.wa.guestsUnit')} = ${money(line.subtotal)}`;
}

/**
 * Compose the full booking message.
 *
 * @param {object}   params
 * @param {object}   params.destination
 * @param {object}   params.duration
 * @param {object[]} params.activities  selected activity objects
 * @param {object}   params.quote       result of calculateQuote()
 * @param {object}   params.form        { name, phone, date, pickup, message }
 * @param {number}   params.guests
 * @param {function} params.t           i18next translator
 * @param {function} params.loc         { id, en } localizer
 * @returns {string} plain (un-encoded) message text
 */
export function buildBookingMessage({
  destination,
  duration,
  activities = [],
  quote,
  form,
  guests,
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
    `${t('booking.wa.places')}: ${places || '-'}`,
    `${t('booking.wa.activities')}: ${activityText}`,
    '',
    `${t('booking.wa.breakdown')}:`,
    breakdown,
    '',
    `${t('booking.wa.total')}: ${totalText}`,
    // Restated in the message itself, not only on the page: the guest keeps the
    // WhatsApp thread, and it should answer "is the car extra?" on its own.
    t('booking.vehicleIncluded'),
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
