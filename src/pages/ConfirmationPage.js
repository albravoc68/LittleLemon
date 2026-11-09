import { Link, useLocation } from "react-router-dom";
import { formatLongDate, formatTime } from "../utils/dates";
import useDocumentTitle from "../utils/useDocumentTitle";

function ConfirmationPage() {
  useDocumentTitle("Reservation confirmed");
  const { state } = useLocation();
  // The reservation arrives through router state, so it is missing if the page is opened directly.
  const reservation = state?.reservation;

  if (!reservation) {
    return (
      <section className="page page--narrow" aria-labelledby="confirmation-title">
        <h1 id="confirmation-title">No reservation found</h1>
        <p>We could not find a recent reservation. You can make a new one below.</p>
        <Link to="/booking" className="button">Reserve a table</Link>
      </section>
    );
  }

  return (
    <section className="page page--narrow" aria-labelledby="confirmation-title">
      <h1 id="confirmation-title">Reservation confirmed</h1>
      <p>Thank you! Your table is booked. Please keep your reservation number.</p>
      <dl className="summary">
        <div>
          <dt>Reservation number</dt>
          <dd>{reservation.id}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatLongDate(reservation.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatTime(reservation.time)}</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{reservation.guests}</dd>
        </div>
        <div>
          <dt>Occasion</dt>
          <dd>{reservation.occasion}</dd>
        </div>
      </dl>
      <Link to="/" className="button">Back to home</Link>
    </section>
  );
}

export default ConfirmationPage;
