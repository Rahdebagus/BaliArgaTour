import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiSearch,
  FiMapPin,
  FiTag,
  FiUsers,
  FiClock,
  FiCreditCard,
} from 'react-icons/fi';
import { packages } from '@/features/packages';
import { destinations } from '@/features/destinations';

const selectClass =
  'w-full appearance-none rounded-xl border border-primary-100 bg-paper-50 px-4 py-3 text-sm text-primary-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20';

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block min-w-[9rem] flex-1">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700/70">
        <Icon className="text-primary-400" aria-hidden /> {label}
      </span>
      {children}
    </label>
  );
}

/**
 * Floating glass tour-search card below the hero. Filters route to
 * /packages?category=… — the Packages page reads the param.
 */
export default function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('2');

  const categories = [...new Set(packages.map((p) => p.category))];

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (destination) params.set('destination', destination);
    if (duration) params.set('duration', duration);
    if (price) params.set('price', price);
    if (guests) params.set('guests', guests);
    navigate(`/packages${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <div className="container-page relative z-20 -mt-10 lg:-mt-14">
      <form
        onSubmit={submit}
        className="glass rounded-3xl p-6 sm:p-8"
        aria-label={t('search.title')}
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-editorial text-3xl font-bold uppercase tracking-tight text-primary-900">
            {t('search.title')}
          </h2>
          <p className="text-sm text-primary-700/70">{t('search.subtitle')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field icon={FiMapPin} label={t('search.destination')}>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={selectClass}
            >
              <option value="">{t('search.anyDestination')}</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <Field icon={FiTag} label={t('search.category')}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              <option value="">{t('search.anyCategory')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field icon={FiClock} label={t('search.duration')}>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={selectClass}
            >
              <option value="">{t('search.anyDuration')}</option>
              <option value="half">{t('search.halfDay')}</option>
              <option value="full">{t('search.fullDay')}</option>
            </select>
          </Field>

          <Field icon={FiCreditCard} label={t('search.price')}>
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={selectClass}
            >
              <option value="">{t('search.anyPrice')}</option>
              <option value="low">{t('search.priceLow')}</option>
              <option value="mid">{t('search.priceMid')}</option>
              <option value="high">{t('search.priceHigh')}</option>
            </select>
          </Field>

          <Field icon={FiUsers} label={t('search.guests')}>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={selectClass}
            >
              {[1, 2, 4, 6, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {t('search.guestsOption', { count: n })}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-10 py-3.5 font-semibold text-white shadow-glass transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            <FiSearch aria-hidden /> {t('search.button')}
          </button>
        </div>
      </form>
    </div>
  );
}
