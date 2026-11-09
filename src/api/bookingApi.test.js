import {
  fetchAvailableTimes,
  submitBooking,
  resetReservations,
} from "./bookingApi";

const NOW = new Date(2026, 0, 10, 12, 0);
const FUTURE_DATE = "2026-03-20";

beforeEach(() => resetReservations());

describe("fetchAvailableTimes", () => {
  test("returns the same slots for the same date", () => {
    expect(fetchAvailableTimes(FUTURE_DATE, NOW)).toEqual(
      fetchAvailableTimes(FUTURE_DATE, NOW)
    );
  });

  test("only offers evening slots in HH:MM format", () => {
    const times = fetchAvailableTimes(FUTURE_DATE, NOW);
    expect(times.length).toBeGreaterThan(0);
    times.forEach((time) => expect(time).toMatch(/^(1[7-9]|2[0-2]):(00|30)$/));
  });

  test.each(["", "not-a-date", "2026-02-31"])(
    "returns no slots for the invalid date %p",
    (value) => {
      expect(fetchAvailableTimes(value, NOW)).toEqual([]);
    }
  );

  test("hides slots that have already passed today", () => {
    const evening = new Date(2026, 0, 10, 23, 0);
    expect(fetchAvailableTimes("2026-01-10", evening)).toEqual([]);
  });

  test("does not offer slots for a past date", () => {
    expect(fetchAvailableTimes("2026-01-09", NOW)).toEqual([]);
  });
});

describe("submitBooking", () => {
  const buildBooking = (time) => ({
    date: FUTURE_DATE,
    time,
    guests: 2,
    occasion: "Birthday",
  });

  test("confirms a free slot and returns a reservation id", () => {
    const [time] = fetchAvailableTimes(FUTURE_DATE, NOW);
    const result = submitBooking(buildBooking(time), NOW);
    expect(result.ok).toBe(true);
    expect(result.reservation).toMatchObject({ time, id: "LL-0001" });
  });

  test("removes a booked slot from the availability list", () => {
    const [time] = fetchAvailableTimes(FUTURE_DATE, NOW);
    submitBooking(buildBooking(time), NOW);
    expect(fetchAvailableTimes(FUTURE_DATE, NOW)).not.toContain(time);
  });

  test("rejects a slot that was already taken", () => {
    const [time] = fetchAvailableTimes(FUTURE_DATE, NOW);
    submitBooking(buildBooking(time), NOW);
    const result = submitBooking(buildBooking(time), NOW);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/no longer available/i);
  });

  test("rejects missing booking data", () => {
    expect(submitBooking(undefined, NOW)).toEqual({
      ok: false,
      message: "Please provide the reservation details and try again.",
    });
  });

  test("rejects invalid reservation details even when called outside the form", () => {
    const [time] = fetchAvailableTimes(FUTURE_DATE, NOW);
    expect(submitBooking({ ...buildBooking(time), guests: 12 }, NOW)).toEqual({
      ok: false,
      message: "We seat between 1 and 10 guests per reservation.",
    });
    expect(
      submitBooking(
        { ...buildBooking(time), date: "2026-01-09", occasion: "Unknown" },
        NOW
      )
    ).toEqual({
      ok: false,
      message: "Please choose today or a future date.",
    });
  });
});
