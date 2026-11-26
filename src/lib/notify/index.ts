/**
 * Toasts load `sonner` on demand: importing it from a component on first paint
 * (the contact form, the copy button) would ship it on every page load, and
 * nothing a toast reports can happen before the visitor acts.
 */

// Dispatched before the import so the toaster is mounted first; sonner replays
// toasts that predate its subscription, so a late mount is safe.

export const TOAST_REQUESTED_EVENT = 'sonner:toast-requested';

const loadToast = () => import('sonner').then(module => module.toast);

export const notifyError = (message: string): void => {
  window.dispatchEvent(new Event(TOAST_REQUESTED_EVENT));
  void loadToast().then(toast => toast.error(message));
};

export const notifySuccess = (message: string): void => {
  window.dispatchEvent(new Event(TOAST_REQUESTED_EVENT));
  void loadToast().then(toast => toast.success(message));
};
