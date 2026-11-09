import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "./BookingForm";
import { fetchAvailableTimes } from "../api/bookingApi";

jest.mock("../api/bookingApi");

const DATE_WITH_TIMES = "2099-12-30";
const DATE_WITH_OTHER_TIMES = "2099-12-31";
const DATE_WITHOUT_TIMES = "2099-12-29";

beforeEach(() => {
  fetchAvailableTimes.mockImplementation((date) => {
    if (date === DATE_WITH_TIMES) return ["17:00", "18:30"];
    if (date === DATE_WITH_OTHER_TIMES) return ["20:00"];
    return [];
  });
});

const chooseDate = (value) =>
  fireEvent.change(screen.getByLabelText(/^date/i), { target: { value } });

const fillValidForm = async (user) => {
  chooseDate(DATE_WITH_TIMES);
  await user.selectOptions(screen.getByLabelText(/^time/i), "17:00");
  await user.selectOptions(screen.getByLabelText(/occasion/i), "Birthday");
};

test("asks for a date before offering times", () => {
  render(<BookingForm onSubmit={jest.fn()} />);
  expect(screen.getByLabelText(/^time/i)).toBeDisabled();
  expect(screen.getByText(/choose a date to see available times/i)).toBeInTheDocument();
});

test("lists the available times in 12-hour format after choosing a date", () => {
  render(<BookingForm onSubmit={jest.fn()} />);
  chooseDate(DATE_WITH_TIMES);
  expect(screen.getByLabelText(/^time/i)).toBeEnabled();
  expect(screen.getByRole("option", { name: "5:00 PM" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "6:30 PM" })).toBeInTheDocument();
});

test("explains when a date has no tables available", () => {
  render(<BookingForm onSubmit={jest.fn()} />);
  chooseDate(DATE_WITHOUT_TIMES);
  expect(screen.getByText(/no tables are available/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^time/i)).toBeDisabled();
});

test("clears the selected time when it is not offered on the new date", async () => {
  const user = userEvent.setup();
  render(<BookingForm onSubmit={jest.fn()} />);
  chooseDate(DATE_WITH_TIMES);
  await user.selectOptions(screen.getByLabelText(/^time/i), "17:00");
  chooseDate(DATE_WITH_OTHER_TIMES);
  expect(screen.getByLabelText(/^time/i)).toHaveValue("");
});

test("submitting an empty form shows errors, focuses the first invalid field and does not submit", async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<BookingForm onSubmit={onSubmit} />);
  await user.click(screen.getByRole("button", { name: /reserve table/i }));
  expect(screen.getByText(/please choose a date/i)).toBeInTheDocument();
  expect(screen.getByText(/please choose an occasion/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^date/i)).toHaveFocus();
  expect(screen.getByLabelText(/^date/i)).toHaveAttribute("aria-invalid", "true");
  expect(onSubmit).not.toHaveBeenCalled();
});

test("links the error message to its field for assistive technology", async () => {
  const user = userEvent.setup();
  render(<BookingForm onSubmit={jest.fn()} />);
  await user.click(screen.getByRole("button", { name: /reserve table/i }));
  const dateField = screen.getByLabelText(/^date/i);
  expect(dateField).toHaveAccessibleDescription(/please choose a date/i);
});

test("rejects a past date after the field loses focus", async () => {
  const user = userEvent.setup();
  render(<BookingForm onSubmit={jest.fn()} />);
  await user.click(screen.getByLabelText(/^date/i));
  chooseDate("2000-01-01");
  await user.tab();
  expect(await screen.findByText(/today or a future date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^time/i)).toBeDisabled();
});

test("rejects a guest count outside the allowed range", async () => {
  const user = userEvent.setup();
  render(<BookingForm onSubmit={jest.fn()} />);
  const guests = screen.getByLabelText(/number of guests/i);
  await user.clear(guests);
  await user.type(guests, "12");
  await user.tab();
  expect(screen.getByText(/between 1 and 10 guests per reservation/i)).toBeInTheDocument();
});

test("submits the reservation with a numeric guest count when valid", async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<BookingForm onSubmit={onSubmit} />);
  await fillValidForm(user);
  await user.click(screen.getByRole("button", { name: /reserve table/i }));
  expect(onSubmit).toHaveBeenCalledWith({
    date: DATE_WITH_TIMES,
    time: "17:00",
    guests: 2,
    occasion: "Birthday",
  });
});

test("announces a submission error", () => {
  render(<BookingForm onSubmit={jest.fn()} submitError="Please try again." />);
  expect(screen.getByRole("alert")).toHaveTextContent("Please try again.");
});
