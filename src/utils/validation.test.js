import { validateBooking, OCCASIONS } from "./validation";

const TODAY = "2026-05-10";
const TIMES = ["17:00", "18:30"];
const validValues = {
  date: "2026-05-12",
  time: "17:00",
  guests: "4",
  occasion: OCCASIONS[0],
};

const validate = (overrides = {}, times = TIMES) =>
  validateBooking({ ...validValues, ...overrides }, times, TODAY);

test("accepts a complete, valid reservation", () => {
  expect(validate()).toEqual({});
});

test("accepts today as the reservation date", () => {
  expect(validate({ date: TODAY }).date).toBeUndefined();
});

describe("date", () => {
  test("is required", () => {
    expect(validate({ date: "" }).date).toMatch(/choose a date/i);
  });

  test("must be a real calendar date", () => {
    expect(validate({ date: "2026-02-31" }).date).toMatch(/valid date/i);
  });

  test("cannot be in the past", () => {
    expect(validate({ date: "2026-05-09" }).date).toMatch(/future date/i);
  });
});

describe("time", () => {
  test("reports when the date has no available tables", () => {
    expect(validate({}, []).time).toMatch(/no tables/i);
  });

  test("must be one of the available times", () => {
    expect(validate({ time: "" }).time).toMatch(/available time/i);
    expect(validate({ time: "21:00" }).time).toMatch(/available time/i);
  });

  test("is not checked while the date is invalid", () => {
    expect(validate({ date: "" }, []).time).toBeUndefined();
  });
});

describe("guests", () => {
  test.each(["", "abc"])("rejects the empty or non-numeric value %p", (value) => {
    expect(validate({ guests: value }).guests).toMatch(/number of guests/i);
  });

  test.each(["0", "11", "2.5", "-1"])("rejects the out-of-range value %p", (value) => {
    expect(validate({ guests: value }).guests).toMatch(/between 1 and 10/i);
  });

  test.each(["1", "10"])("accepts the boundary value %p", (value) => {
    expect(validate({ guests: value }).guests).toBeUndefined();
  });
});

test("occasion must be one of the listed options", () => {
  expect(validate({ occasion: "" }).occasion).toMatch(/choose an occasion/i);
  expect(validate({ occasion: "Unknown" }).occasion).toBeDefined();
});
