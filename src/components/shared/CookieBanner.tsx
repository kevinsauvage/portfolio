'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Button from '@/components/ui/Button/Button';
import { FOCUS_RING } from '@/components/ui/focusRing';
import { BodySmall, H4 } from '@/components/ui/Typography';
import {
  type CookieCategory,
  type CookieCategoryName,
  cookies as copy,
} from '@/config/content/cookies';
import {
  consentFromFormData,
  type ConsentSettings,
  DENIED_CONSENT,
  dispatchConsentUpdated,
  GRANTED_CONSENT,
  readStoredConsent,
  writeStoredConsent,
} from '@/lib/consent';

import clsx from 'clsx';
import {
  ChartColumn,
  Cookie,
  type LucideIcon,
  Megaphone,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';

/**
 * Pre-ticked boxes are not valid consent, so an optional category starts
 * unticked unless the visitor already chose it.
 */
const isCategoryChecked = (
  stored: ConsentSettings | null,
  name: CookieCategoryName,
  required: boolean | undefined
): boolean => {
  // eslint-disable-next-line security/detect-object-injection -- keyed by the static category list
  return Boolean(required) || stored?.[name] === true;
};

const CATEGORY_ICONS: Record<CookieCategoryName, LucideIcon> = {
  functionality_storage: ShieldCheck,
  analytics_storage: ChartColumn,
  personalization_storage: Palette,
  ad_storage: Megaphone,
};

const IconTile = ({
  icon: Icon,
  size = 18,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
}) => (
  <span
    aria-hidden='true'
    className={clsx(
      'hidden shrink-0 items-center justify-center rounded-xl border border-primary-500/25 bg-primary-500/10 text-primary-300 sm:flex',
      className
    )}
  >
    <Icon size={size} />
  </span>
);

type CategoryOptionProperties = {
  category: CookieCategory;
  stored: ConsentSettings | null;
};

const CategoryOption = ({ category, stored }: CategoryOptionProperties) => {
  const { name, title, description, required } = category;
  // eslint-disable-next-line security/detect-object-injection -- keyed by the static category list
  const CategoryIcon = CATEGORY_ICONS[name];

  return (
    <div
      className={clsx(
        'relative flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-colors has-[:checked]:border-primary-500/40 has-[:checked]:bg-primary-500/[0.04]',
        required
          ? 'cursor-not-allowed'
          : 'cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/70'
      )}
    >
      <span
        aria-hidden='true'
        className='mt-0.5 hidden size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 text-zinc-400 sm:flex'
      >
        <CategoryIcon size={15} />
      </span>

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-3'>
          {/* The label is the control's accessible name, and its pseudo-element
              stretches the hit area over the whole card. */}
          <label
            htmlFor={`cookie-${name}`}
            className={clsx(
              'block text-sm font-medium text-zinc-100 after:absolute after:inset-0 after:content-[""]',
              required ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            {title}
            {required ? (
              <span className='ml-2 text-xs font-normal text-zinc-400'>
                {copy.preferences.required}
              </span>
            ) : null}
          </label>

          {/* The real checkbox stays in the accessibility tree and keeps the
              native focus ring; the spans are only its switch skin (siblings,
              so `peer-*` can react to it). */}
          <span className='relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center'>
            <input
              id={`cookie-${name}`}
              type='checkbox'
              name={name}
              defaultChecked={isCategoryChecked(stored, name, required)}
              disabled={required}
              aria-describedby={`cookie-${name}-description`}
              className='peer absolute inset-0 z-10 size-full cursor-pointer appearance-none disabled:cursor-not-allowed'
            />
            <span
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 rounded-full border border-zinc-700 bg-zinc-800 transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-500 peer-disabled:opacity-60'
            />
            <span
              aria-hidden='true'
              className='pointer-events-none relative ml-0.5 size-3.5 rounded-full bg-zinc-400 transition-transform peer-checked:translate-x-4 peer-checked:bg-zinc-950'
            />
          </span>
        </div>

        <p id={`cookie-${name}-description`} className='mt-1 text-sm text-zinc-400'>
          {description}
        </p>
      </div>
    </div>
  );
};

type Properties = {
  openSettings?: boolean;
};

/**
 * Client-only (`ssr: false` through `CookieBannerLoader`). Shows the summary
 * first and expands in place to the category form — no modal, so focus
 * management stays with the page and the banner keeps working without JS-heavy
 * dialog APIs. Saving writes the cookie and lets the listeners react.
 */
const CookieBanner = ({ openSettings = false }: Properties) => {
  // Reopened from the footer, only the preferences panel shows.
  const [showBanner, setShowBanner] = useState(!openSettings);
  const [showPreferences, setShowPreferences] = useState(openSettings);
  // Current choice, so a reopened panel shows what was agreed to.
  const [stored] = useState(readStoredConsent);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Reopened from the footer: move focus into the panel, and hand it back to
  // the trigger once the panel closes.
  useEffect(() => {
    if (!openSettings) return;
    // `??=`: effects run twice in StrictMode, and the second pass would
    // otherwise record the already-focused panel as the trigger.
    triggerRef.current ??=
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();
  }, [openSettings]);

  const restoreFocus = useCallback(() => {
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const save = useCallback(
    (settings: ConsentSettings) => {
      writeStoredConsent(settings);
      setShowBanner(false);
      setShowPreferences(false);
      dispatchConsentUpdated();
      restoreFocus();
    },
    [restoreFocus]
  );

  const acceptAll = useCallback(() => save(GRANTED_CONSENT), [save]);
  const rejectAll = useCallback(() => save(DENIED_CONSENT), [save]);

  const closePreferences = useCallback(() => {
    setShowPreferences(false);
    // Never leave a visitor with neither banner nor panel.
    if (readStoredConsent() === null) setShowBanner(true);
    else restoreFocus();
  }, [restoreFocus]);

  const handleSave = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      save(consentFromFormData(new FormData(event.currentTarget)));
    },
    [save]
  );

  if (!showBanner && !showPreferences) return null;

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      className={clsx(
        // Phone: a sheet welded to the bottom edge. Desktop: a floating card.
        'card-enter fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)] outline-none',
        'border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl',
        'rounded-t-2xl',
        'md:inset-x-4 md:bottom-6 md:mx-auto md:max-w-5xl md:rounded-2xl md:border',
        'md:shadow-2xl md:shadow-black/60 lg:inset-x-6'
      )}
      aria-labelledby={showPreferences ? 'cookie-preferences-title' : 'cookie-banner-title'}
    >
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent md:hidden'
      />

      <div className='px-4 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6'>
        {showPreferences ? (
          <form onSubmit={handleSave}>
            <div className='flex items-start gap-4'>
              <IconTile icon={SlidersHorizontal} className='size-10' />
              <div className='min-w-0 flex-1'>
                <H4 id='cookie-preferences-title'>{copy.preferences.title}</H4>
                <BodySmall className='max-w-2xl mt-1.5 text-zinc-400'>
                  {copy.preferences.description}
                </BodySmall>
              </div>
              <button
                type='button'
                onClick={closePreferences}
                aria-label='Close cookie preferences'
                className={clsx(
                  '-m-2 shrink-0 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100',
                  FOCUS_RING
                )}
              >
                <X size={20} aria-hidden='true' />
              </button>
            </div>

            <div className='mt-5 grid gap-2.5 sm:grid-cols-2'>
              {copy.preferences.categories.map(category => (
                <CategoryOption key={category.name} category={category} stored={stored} />
              ))}
            </div>

            <div className='mt-5 flex justify-end border-t border-zinc-800/60 pt-4'>
              <Button type='submit' label={copy.preferences.save} size='sm' />
            </div>
          </form>
        ) : (
          <div className='flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex min-w-0 items-start gap-4'>
              <IconTile icon={Cookie} className='size-10' />
              <div>
                <H4 id='cookie-banner-title'>{copy.banner.title}</H4>
                <BodySmall className='max-w-2xl mt-1 sm:mt-1.5 text-zinc-400'>
                  {copy.banner.description}
                </BodySmall>
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end'>
              <button
                type='button'
                onClick={() => setShowPreferences(true)}
                className={clsx(
                  'order-3 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 sm:py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-zinc-50 sm:order-none sm:w-auto sm:justify-start',
                  FOCUS_RING
                )}
              >
                <SlidersHorizontal size={15} aria-hidden='true' />
                {copy.banner.customize}
              </button>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                label={copy.banner.rejectAll}
                onClick={rejectAll}
                className='order-1 flex-1 sm:order-none sm:flex-none'
              />
              <Button
                type='button'
                variant='primary'
                size='sm'
                label={copy.banner.acceptAll}
                onClick={acceptAll}
                className='order-2 flex-1 sm:order-none sm:flex-none'
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CookieBanner;
