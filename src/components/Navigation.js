import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// Primary navigation. On small screens the links collapse behind a toggle button.
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className="main-nav"
      aria-label="Main navigation"
      onKeyDown={(event) => event.key === "Escape" && closeMenu()}
    >
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={isOpen}
        aria-controls="main-nav-list"
        onClick={() => setIsOpen((open) => !open)}
      >
        Navigation
      </button>
      <ul id="main-nav-list" className={isOpen ? "nav-list is-open" : "nav-list"}>
        <li>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
        </li>
        <li>
          <Link to={{ pathname: "/", hash: "#about" }} onClick={closeMenu}>About</Link>
        </li>
        <li>
          <Link to={{ pathname: "/", hash: "#specials" }} onClick={closeMenu}>Specials</Link>
        </li>
        <li>
          <NavLink to="/booking" onClick={closeMenu}>Reservations</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
