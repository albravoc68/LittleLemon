import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookingPage from "./BookingPage";
import ConfirmationPage from "./ConfirmationPage";
import { fetchAvailableTimes, submitBooking } from "../api/bookingApi";
import { ROUTER_FUTURE } from "../routerConfig";

jest.mock("../api/bookingApi");

const RESERVATION = {
  id: "LL-0001",
  date: "2099-12-30",
  time: "17:00",
  guests: 4,
  occasion: "Anniversary",
};

const renderBookingFlow = () =>
  render(
    <MemoryRouter initialEntries={["/booking"]} future={ROUTER_FUTURE}>
      <Routes>
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </MemoryRouter>
  );

const submitValidForm = async () => {
  const user = userEvent.setup();
  fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: RESERVATION.date } });
  await user.selectOptions(screen.getByLabelText(/^time/i), RESERVATION.time);
  await user.selectOptions(screen.getByLabelText(/occasion/i), RESERVATION.occasion);
  await user.click(screen.getByRole("button", { name: /reserve table/i }));
};

beforeEach(() => {
  fetchAvailableTimes.mockReturnValue(["17:00"]);
});

describe("BookingPage", () => {
  test("shows the confirmation page after a successful reservation", async () => {
    submitBooking.mockReturnValue({ ok: true, reservation: RESERVATION });
    renderBookingFlow();
    await submitValidForm();
    expect(
      await screen.findByRole("heading", { level: 1, name: /reservation confirmed/i })
    ).toBeInTheDocument();
    expect(screen.getByText("LL-0001")).toBeInTheDocument();
    expect(screen.getByText("Wednesday, December 30, 2099")).toBeInTheDocument();
    expect(screen.getByText("5:00 PM")).toBeInTheDocument();
  });

  test("shows the reason when the reservation is rejected", async () => {
    submitBooking.mockReturnValue({ ok: false, message: "That time is no longer available." });
    renderBookingFlow();
    await submitValidForm();
    expect(await screen.findByRole("alert")).toHaveTextContent("That time is no longer available.");
    expect(screen.queryByText(/reservation confirmed/i)).not.toBeInTheDocument();
  });

  test("shows a generic message when the reservation service throws", async () => {
    submitBooking.mockImplementation(() => {
      throw new Error("network down");
    });
    renderBookingFlow();
    await submitValidForm();
    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});

describe("ConfirmationPage", () => {
  test("explains what to do when opened without a reservation", () => {
    render(
      <MemoryRouter initialEntries={["/confirmation"]} future={ROUTER_FUTURE}>
        <ConfirmationPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1, name: /no reservation found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reserve a table/i })).toHaveAttribute("href", "/booking");
  });
});
