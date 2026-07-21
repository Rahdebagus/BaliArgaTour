import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiBriefcase, FiCheck } from 'react-icons/fi';
import { TbManualGearbox, TbAirConditioning } from 'react-icons/tb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Price from '@/components/ui/Price';
import { whatsappLink } from '@/data/company';
import { useLoc } from '@/i18n/useLoc';

const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw';

/**
 * Fleet card for the /vehicles page and the homepage fleet row.
 *
 * `onSelect` switches it into booking mode: the CTA opens the standalone hire
 * form and the selected card is outlined. Without it the card is informational
 * and the CTA opens a WhatsApp enquiry.
 *
 * The price shown is the standalone daily hire rate — see the pricing contract
 * in vehicles.data.js. It is not a tour price and is never added to one.
 */
function VehicleCard({ vehicle, onSelect, selected = false }) {
  const { t } = useTranslation();
  const loc = useLoc();

  return (
    // flex column + h-full so the CTA row is pinned to the bottom and every
    // card in a grid row ends at the same line despite differing text lengths.
    <Card
      className={`flex h-full flex-col ${
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div className="relative h-48 overflow-hidden bg-primary-50">
        <OptimizedImage
          src={vehicle.image}
          alt={`${vehicle.name} ${vehicle.year}`}
          sizes={CARD_SIZES}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {vehicle.popular && (
          <span className="absolute left-4 top-4 rounded-full bg-gradient-accent px-3 py-1 text-xs font-bold text-white">
            {t('common.popular')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary-700/60">
          {vehicle.type}
        </span>
        <h3 className="mb-2 font-display text-lg font-bold text-primary-900">
          {vehicle.name} {vehicle.year}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-primary-700/75">
          {loc(vehicle.description)}
        </p>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-primary-700/80">
          <span className="flex items-center gap-1">
            <FiUsers aria-hidden /> {vehicle.seats} {t('common.seats')}
          </span>
          <span className="flex items-center gap-1">
            <FiBriefcase aria-hidden /> {vehicle.luggage} {t('common.luggage')}
          </span>
          <span className="flex items-center gap-1">
            <TbManualGearbox aria-hidden /> {vehicle.transmission}
          </span>
          {vehicle.ac && (
            <span className="flex items-center gap-1">
              <TbAirConditioning aria-hidden /> AC
            </span>
          )}
        </div>

        <ul className="mb-4 space-y-1 text-xs text-primary-700/80">
          {loc(vehicle.features).map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <FiCheck className="shrink-0 text-primary" aria-hidden /> {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-primary-100 pt-4">
          <div>
            <span className="block text-xs text-primary-700/60">
              {t('vehicleBooking.rateLabel')}
            </span>
            <Price usd={vehicle.dailyRate} size="md" showIdr={false} />
          </div>

          {onSelect ? (
            <Button
              size="sm"
              variant={selected ? 'primary' : 'outline'}
              onClick={() => onSelect(vehicle)}
            >
              {selected ? t('booking.selected') : t('vehicleBooking.bookVehicle')}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              href={whatsappLink(
                t('vehicleBooking.enquiry', {
                  name: `${vehicle.name} ${vehicle.year}`,
                })
              )}
            >
              {t('common.chatWhatsapp')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default memo(VehicleCard);
