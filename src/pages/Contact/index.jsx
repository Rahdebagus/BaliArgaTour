import { useState } from 'react';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { PageHeader, Button } from '@/components/ui';
import { company, whatsappLink } from '@/data/company';
import { Seo } from '@/components/common';
import { breadcrumbSchema } from '@/utils/seo';
import { slideInLeft, slideInRight, viewport } from '@/utils/animations';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const contactItems = [
    { icon: FiMapPin, label: t('contact.address'), value: company.address },
    { icon: FiPhone, label: t('contact.phone'), value: company.phone, href: `tel:${company.phone}` },
    { icon: FiMail, label: t('contact.email'), value: company.email, href: `mailto:${company.email}` },
  ];

  const crumb = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 1: no backend — funnel the enquiry to WhatsApp (docs/12).
    const intro = t('contact.waIntro', { name: company.name });
    const nameLabel = t('contact.waName');
    const text = `${intro}\n\n${nameLabel}: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(
      `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <>
      <Seo
        title={t('contact.title')}
        description={t('contact.subtitle')}
        schema={[breadcrumbSchema(crumb)]}
      />
      <PageHeader
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        breadcrumb={crumb}
        bgImage="/images/contact-header.webp"
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Info */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <h2 className="mb-6 font-display text-2xl font-bold text-primary-900">
            {t('contact.infoTitle')}
          </h2>
          <ul className="space-y-5">
            {contactItems.map((item) => (
              <li key={item.label} className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-xl text-white">
                  <item.icon />
                </span>
                <div>
                  <span className="block text-sm font-semibold text-primary-900">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-primary-700/80 hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-primary-700/80">{item.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href={whatsappLink()} icon={FaWhatsapp} size="lg">
              {t('contact.chatDirect')}
            </Button>
          </div>

          {/* Map */}
          <div className="mt-8 overflow-hidden rounded-2xl shadow-glass">
            <iframe
              title={t('contact.mapTitle')}
              src="https://www.google.com/maps?q=Ubud+Bali&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="rounded-3xl bg-white p-8 shadow-glass-lg"
        >
          <h2 className="mb-6 font-display text-2xl font-bold text-primary-900">
            {t('contact.formTitle')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-primary-800">
                {t('contact.nameLabel')}
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={t('contact.namePlaceholder')}
                className="w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary-800">
                {t('contact.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={t('contact.emailPlaceholder')}
                className="w-full rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-primary-800">
                {t('contact.messageLabel')}
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder={t('contact.messagePlaceholder')}
                className="w-full resize-none rounded-xl border border-primary-100 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" icon={FiSend} className="w-full" size="lg">
              {t('contact.send')}
            </Button>
          </form>
        </motion.div>
      </section>
    </>
  );
}
