import { formatLongDate, formatTime, parseISODate, toISODate } from "./dates";

test("toISODate uses the local calendar day", () => {
  expect(toISODate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
});

test("parseISODate rejects malformed and impossible dates", () => {
  expect(parseISODate("2026-04-30")).toBeInstanceOf(Date);
  expect(parseISODate("2026-04-31")).toBeNull();
  expect(parseISODate("04/30/2026")).toBeNull();
  expect(parseISODate(undefined)).toBeNull();
});

test("formatLongDate writes the full date and tolerates bad input", () => {
  expect(formatLongDate("2026-11-13")).toBe("Friday, November 13, 2026");
  expect(formatLongDate("oops")).toBe("oops");
});

test("formatTime converts 24-hour times to 12-hour times", () => {
  expect(formatTime("17:00")).toBe("5:00 PM");
  expect(formatTime("22:30")).toBe("10:30 PM");
  expect(formatTime("12:00")).toBe("12:00 PM");
  expect(formatTime("00:15")).toBe("12:15 AM");
});
