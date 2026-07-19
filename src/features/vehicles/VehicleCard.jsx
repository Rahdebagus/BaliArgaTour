import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiBriefcase, FiCheck } from 'react-icons/fi';
import { TbManualGearbox, TbAirConditioning } from 'react-icons/tb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { formatCurrency } from '@/utils/format';
import { whatsappLink } from '@/data/company';
import { useLoc } from '@/i18n/useLoc';

const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw';

function VehicleCard({ vehicle }) {
  const { t } = useTranslation();
  const loc = useLoc();
  const message = t('contact.waEnquiry');

  return (
    <Card>
      <div className="relative h-48 overflow-hidden bg-primary-50">
        <OptimizedImage
          src={vehicle.image}
          alt={vehicle.name}
          sizes={CARD_SIZES}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {vehicle.popular && (
          <span className="absolute left-4 top-4 rounded-full bg-gradient-accent px-3 py-1 text-xs font-bold text-primary-900">
            {t('common.popular')}
          </span>
        )}
      </div>

      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary-700/60">
          {vehicle.type}
        </span>
        <h3 className="mb-3 font-display text-lg font-bold text-primary-900">
          {vehicle.name}
        </h3>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-primary-700/80">
          <span className="flex items-center gap-1">
            <FiUsers /> {vehicle.seats} {t('common.seats')}
          </span>
          <span className="flex items-center gap-1">
            <FiBriefcase /> {vehicle.luggage} {t('common.luggage')}
          </span>
          <span className="flex items-center gap-1">
            <TbManualGearbox /> {vehicle.transmission}
          </span>
          {vehicle.ac && (
            <span className="flex items-center gap-1">
              <TbAirConditioning /> AC
            </span>
          )}
        </div>

        <ul className="mb-4 space-y-1 text-xs text-primary-700/80">
          {loc(vehicle.features).map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <FiCheck className="text-primary" /> {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-primary-100 pt-4">
          <div>
            <span className="block text-xs text-primary-700/60">{t('common.perDay')}</span>
            <span className="font-display text-lg font-bold text-primary">
              {formatCurrency(vehicle.pricePerDay, vehicle.currency)}
            </span>
          </div>
          <Button size="sm" variant="secondary" href={whatsappLink(message)}>
            {t('common.rent')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default memo(VehicleCard);
