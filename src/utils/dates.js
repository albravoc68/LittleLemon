const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value) => String(value).padStart(2, "0");

// Formats a Date as YYYY-MM-DD using the local calendar day (not UTC).
export const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = () => toISODate(new Date());

// Parses YYYY-MM-DD into a local Date; returns null for malformed or impossible dates (e.g. 2026-02-31).
export const parseISODate = (value) => {
  const match = ISO_DATE_PATTERN.exec(value || "");
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return isRealDate ? date : null;
};

export const formatLongDate = (value) => {
  const date = parseISODate(value);
  if (!date) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Converts a 24-hour time such as "17:30" to "5:30 PM" for display.
export const formatTime = (value) => {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 || 12;
  return `${twelveHour}:${pad(minutes)} ${suffix}`;
};
