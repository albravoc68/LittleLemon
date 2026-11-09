import { useState } from "react";
import { fetchAvailableTimes } from "../api/bookingApi";
import { formatTime, todayISO } from "../utils/dates";
import {
  MAX_GUESTS,
  MIN_GUESTS,
  OCCASIONS,
  validateBooking,
} from "../utils/validation";

const INITIAL_VALUES = { date: "", time: "", guests: "2", occasion: "" };
const FIELD_ORDER = ["date", "time", "guests", "occasion"];
const fieldId = (name) => `res-${name}`;

function BookingForm({ onSubmit, submitError }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});

  const availableTimes = fetchAvailableTimes(values.date);
  const errors = validateBooking(values, availableTimes);
  const hasValidDate = Boolean(values.date) && !errors.date;
  const hasNoTables = hasValidDate && availableTimes.length === 0;

  // Errors stay hidden until the user leaves a field or tries to submit.
  const visibleError = (name) =>
    touched[name] && !(name === "time" && hasNoTables) ? errors[name] : undefined;

  let timeHint = "Choose a date to see available times.";
  if (hasNoTables) {
    timeHint = errors.time;
  } else if (hasValidDate) {
    timeHint = `${availableTimes.length} times available.`;
  }

  const hints = {
    time: timeHint,
    guests: `Choose between ${MIN_GUESTS} and ${MAX_GUESTS} guests.`,
  };

  const markTouched = (name) =>
    setTouched((current) => ({ ...current, [name]: true }));

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    setValues((current) => {
      const next = { ...current, [name]: value };
      // A new date offers different slots, so drop a time that is no longer valid.
      if (name === "date" && !fetchAvailableTimes(value).includes(current.time)) {
        next.time = "";
      }
      return next;
    });
  };

  // Shared accessibility attributes: link each control to its hint and error text.
  const controlProps = (name) => {
    const describedBy = [
      hints[name] && `${fieldId(name)}-hint`,
      visibleError(name) && `${fieldId(name)}-error`,
    ].filter(Boolean);
    return {
      id: fieldId(name),
      name,
      value: values[name],
      required: true,
      onChange: handleChange(name),
      onBlur: () => markTouched(name),
      "aria-invalid": Boolean(visibleError(name)),
      "aria-describedby": describedBy.join(" ") || undefined,
    };
  };

  const renderField = (name, label, control) => (
    <div className="form-field">
      <label htmlFor={fieldId(name)}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {control}
      {hints[name] && (
        <p
          id={`${fieldId(name)}-hint`}
          className="field-hint"
          aria-live={name === "time" ? "polite" : undefined}
        >
          {hints[name]}
        </p>
      )}
      {visibleError(name) && (
        <p id={`${fieldId(name)}-error`} className="field-error">
          {visibleError(name)}
        </p>
      )}
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ date: true, time: true, guests: true, occasion: true });
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      const target = document.getElementById(fieldId(firstInvalid));
      // A disabled time list cannot take focus, so fall back to the date field.
      (target.disabled ? document.getElementById(fieldId("date")) : target).focus();
      return;
    }
    onSubmit({ ...values, guests: Number(values.guests) });
  };

  return (
    <form
      className="booking-form"
      aria-label="Table reservation"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="form-note">Fields marked with * are required.</p>
      {renderField(
        "date",
        "Date",
        <input type="date" min={todayISO()} {...controlProps("date")} />
      )}
      {renderField(
        "time",
        "Time",
        <select disabled={availableTimes.length === 0} {...controlProps("time")}>
          <option value="">Select a time</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {formatTime(time)}
            </option>
          ))}
        </select>
      )}
      {renderField(
        "guests",
        "Number of guests",
        <input
          type="number"
          inputMode="numeric"
          min={MIN_GUESTS}
          max={MAX_GUESTS}
          {...controlProps("guests")}
        />
      )}
      {renderField(
        "occasion",
        "Occasion",
        <select {...controlProps("occasion")}>
          <option value="">Select an occasion</option>
          {OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
      )}
      {submitError && (
        <p role="alert" className="form-alert">
          {submitError}
        </p>
      )}
      <button type="submit" className="button">
        Reserve table
      </button>
    </form>
  );
}

export default BookingForm;
