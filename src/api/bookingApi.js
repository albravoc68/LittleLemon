import { parseISODate, toISODate } from "../utils/dates";
import { validateBooking } from "../utils/validation";

const FIRST_SLOT_HOUR = 17;
const LAST_SLOT_HOUR = 22;
const SLOT_PROBABILITY = 0.6;

// In-memory store of confirmed reservations (a real backend would persist these).
let reservations = [];

// Hashes a string into a numeric seed so every date always yields the same slots.
const seedFromString = (text) =>
  [...text].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);

// Small deterministic pseudo-random generator (Lehmer / Park-Miller).
const createRandom = (seed) => {
  let state = seed % 2147483647 || 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const allSlots = () =>
  Array.from(
    { length: (LAST_SLOT_HOUR - FIRST_SLOT_HOUR + 1) * 2 },
    (_, index) => {
      const hour = FIRST_SLOT_HOUR + Math.floor(index / 2);
      return `${hour}:${index % 2 === 0 ? "00" : "30"}`;
    }
  );

const isPastSlot = (slot, now) => {
  const [hours, minutes] = slot.split(":").map(Number);
  return hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes();
};

// Returns the free time slots for a YYYY-MM-DD date; invalid dates have none.
export const fetchAvailableTimes = (isoDate, now = new Date()) => {
  const date = parseISODate(isoDate);
  if (!date || isoDate < toISODate(now)) return [];
  const random = createRandom(seedFromString(isoDate));
  const isToday = isoDate === toISODate(now);
  return allSlots().filter((slot) => {
    const offered = random() < SLOT_PROBABILITY;
    const taken = reservations.some(
      (reservation) => reservation.date === isoDate && reservation.time === slot
    );
    return offered && !taken && !(isToday && isPastSlot(slot, now));
  });
};

// Simulates sending a reservation; fails when the slot is no longer free.
export const submitBooking = (booking, now = new Date()) => {
  if (!booking) {
    return {
      ok: false,
      message: "Please provide the reservation details and try again.",
    };
  }
  const availableTimes = fetchAvailableTimes(booking.date, now);
  const errors = validateBooking(booking, availableTimes, toISODate(now));
  const detailsError = Object.entries(errors).find(([field]) => field !== "time");
  if (detailsError) {
    return { ok: false, message: detailsError[1] };
  }
  if (!availableTimes.includes(booking.time)) {
    return {
      ok: false,
      message:
        "That time is no longer available. Please choose another time and try again.",
    };
  }
  const reservation = {
    ...booking,
    id: `LL-${String(reservations.length + 1).padStart(4, "0")}`,
  };
  reservations = [...reservations, reservation];
  return { ok: true, reservation };
};

// Clears stored reservations; used by tests to start from a clean state.
export const resetReservations = () => {
  reservations = [];
};
