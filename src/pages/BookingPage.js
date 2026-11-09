import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { submitBooking } from "../api/bookingApi";
import useDocumentTitle from "../utils/useDocumentTitle";

const GENERIC_ERROR =
  "Something went wrong while sending your reservation. Please try again in a moment.";

function BookingPage() {
  useDocumentTitle("Reservations");
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = (booking) => {
    setSubmitError("");
    try {
      const result = submitBooking(booking);
      if (result.ok) {
        navigate("/confirmation", { state: { reservation: result.reservation } });
      } else {
        setSubmitError(result.message);
      }
    } catch {
      setSubmitError(GENERIC_ERROR);
    }
  };

  return (
    <section className="page page--narrow" aria-labelledby="booking-title">
      <h1 id="booking-title">Reserve a table</h1>
      <p className="page__intro">
        Tell us when you would like to visit and we will hold your table.
      </p>
      <BookingForm onSubmit={handleSubmit} submitError={submitError} />
    </section>
  );
}

export default BookingPage;
