import { parseISODate, todayISO } from "./dates";

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Date night",
  "Business meal",
  "Other",
];

// Validates the reservation fields and returns an object of error messages keyed by field.
// An empty object means the form is valid.
export const validateBooking = (values, availableTimes, today = todayISO()) => {
  const errors = {};
  const date = parseISODate(values.date);

  if (!values.date) {
    errors.date = "Please choose a date.";
  } else if (!date) {
    errors.date = "Please enter a valid date.";
  } else if (values.date < today) {
    errors.date = "Please choose today or a future date.";
  }

  if (!errors.date) {
    if (availableTimes.length === 0) {
      errors.time =
        "No tables are available on this date. Please choose another day.";
    } else if (!availableTimes.includes(values.time)) {
      errors.time = "Please choose an available time.";
    }
  }

  const guests = Number(values.guests);
  if (values.guests === "" || Number.isNaN(guests)) {
    errors.guests = "Please enter the number of guests.";
  } else if (!Number.isInteger(guests) || guests < MIN_GUESTS || guests > MAX_GUESTS) {
    errors.guests = `We seat between ${MIN_GUESTS} and ${MAX_GUESTS} guests per reservation.`;
  }

  if (!OCCASIONS.includes(values.occasion)) {
    errors.occasion = "Please choose an occasion.";
  }

  return errors;
};
