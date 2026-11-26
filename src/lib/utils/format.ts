// `1` → `"01"`, as the numbered badges, FAQ rows and carousel counters show it.
export const padIndex = (value: number): string => String(value).padStart(2, '0');
