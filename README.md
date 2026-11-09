# Little Lemon

A responsive website for Little Lemon, a family-run Mediterranean restaurant in Chicago. Visitors can browse the chef's specials, read about the restaurant and reserve a table online.

Author: **Alejandro Bravo**

## Features

- Home page with hero, chef's specials, guest testimonials and the restaurant's story
- Online reservation form with date, time, number of guests and occasion
- Available times that change with the selected date, shown in 12-hour format
- Inline validation with clear messages per field, shown after the field is left or on submit
- Friendly handling of edge cases: dates without tables, past dates, out-of-range guest counts, slots taken in the meantime and unexpected errors
- Confirmation page with a reservation number and summary
- Not found page for unknown addresses
- Mobile-first responsive layout with a collapsible navigation menu

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page and ordered headings
- "Skip to main content" link and visible keyboard focus
- Labels on every field, required markers, `aria-invalid` and `aria-describedby` linking hints and errors to fields
- Focus moves to the first invalid field on submit and to the page content after navigation
- Submission errors are announced with `role="alert"`; available times are announced with `aria-live`
- Text alternatives for images and star ratings, `aria-current` on the active link
- Page titles update on every route; animations respect `prefers-reduced-motion`

## Technologies

- React 19 with hooks
- React Router 6
- Create React App (`react-scripts` 5)
- CSS with custom properties, no UI framework
- Jest and React Testing Library

## Getting started

Requirements: Node.js 18 or newer and npm.

```bash
cd Little-Lemon-Alejandro
npm install --legacy-peer-deps
npm start
```

The app opens at http://localhost:3000. The `--legacy-peer-deps` flag is needed because `react-scripts` 5 declares peer dependencies on React 18 or older.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the development server |
| `npm test` | Runs the unit tests in watch mode (`npm test -- --watchAll=false` runs them once) |
| `npm run build` | Creates an optimized production build in `build/` |

## Project structure

```
public/                  HTML template, manifest and icons
src/
  api/                   Simulated reservation service (available times and booking)
  assets/images/         Optimized photographs
  components/            Reusable UI: header, navigation, footer, cards, booking form
  pages/                 Route screens: home, booking, confirmation, not found
  styles/                Base, layout, home and booking stylesheets
  utils/                 Date helpers, form validation and the page title hook
  App.js                 Page layout and routes
  index.js               Application entry point
```

## Reservation service

There is no real backend. `src/api/bookingApi.js` simulates one in memory:

- `fetchAvailableTimes(date)` returns evening slots (5:00 PM to 10:30 PM). The slots are generated from the date, so a given day always offers the same times. Slots already booked, and slots that have passed today, are removed.
- `submitBooking(booking)` confirms the reservation and returns a reservation number, or returns an error message when the slot is no longer free.

Reservations live in memory and disappear when the page is reloaded.

## Making a reservation

1. Open **Reservations** from the navigation.
2. Choose a date today or later.
3. Pick one of the available times.
4. Enter between 1 and 10 guests and choose an occasion.
5. Select **Reserve table** to see the confirmation.

## Tests

```bash
npm test -- --watchAll=false
```

The suite covers the date helpers, form validation rules, the reservation service, the booking form (labels, errors, focus, submission), the booking and confirmation flow including failures, and the app shell (landmarks, skip link, navigation and not found page).
