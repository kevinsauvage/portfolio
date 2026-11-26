/**
 * Contact-field helpers that do not need zod, so the form (rendered on first
 * paint) can import its limits and error helpers without pulling zod (~33 KB
 * gzip) into every page's bundle; the schema is loaded lazily. Free of
 * `server-only` because the client form uses it too.
 */

/** Field length caps shared by the schema, the form, and abuse protection. */
export const CONTACT_FIELD_LIMITS = {
  fullName: 100,
  email: 254,
  message: 5000,
} as const;

/** reCAPTCHA v3 action name; the server rejects tokens minted for any other action. */
export const CONTACT_CAPTCHA_ACTION = 'contactMessage';

export const CONTACT_FIELDS = ['fullName', 'email', 'message'] as const;

export type ContactFieldName = (typeof CONTACT_FIELDS)[number];

export type ContactFieldValues = Record<ContactFieldName, string>;

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export const isContactField = (key: unknown): key is ContactFieldName =>
  CONTACT_FIELDS.some(field => field === key);

/** A `FormData` value as a string; `''` for absent or non-string entries. */
export const formDataString = (formData: FormData, field: string): string => {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
};

export const readContactFields = (formData: FormData): ContactFieldValues =>
  Object.fromEntries(
    CONTACT_FIELDS.map(field => [field, formDataString(formData, field)])
  ) as ContactFieldValues;

export const collectFieldErrors = (
  issues: ReadonlyArray<{ message: string; path: PropertyKey[] }>
): ContactFieldErrors => {
  const errors: ContactFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    // eslint-disable-next-line security/detect-object-injection -- key narrowed to ContactFieldName
    if (isContactField(key) && !errors[key]) errors[key] = issue.message;
  }
  return errors;
};
