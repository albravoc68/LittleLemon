import { Link } from "react-router-dom";
import Navigation from "./Navigation";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__name">Little Lemon</span>
          <span className="brand__city">Chicago</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
