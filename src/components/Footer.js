import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <h2>Little Lemon</h2>
          <p>Mediterranean cooking in the heart of Chicago.</p>
        </div>
        <nav aria-label="Footer navigation">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to={{ pathname: "/", hash: "#about" }}>About</Link></li>
            <li><Link to={{ pathname: "/", hash: "#specials" }}>Specials</Link></li>
            <li><Link to="/booking">Reservations</Link></li>
          </ul>
        </nav>
        <div>
          <h3>Visit us</h3>
          <address>
            742 Lakeshore Avenue<br />
            Chicago, IL 60611
          </address>
          <p>Phone: <a href="tel:+13125550148">(312) 555-0148</a></p>
          <p>Open Tuesday to Sunday, 5:00 PM to 11:00 PM</p>
        </div>
      </div>
      <p className="site-footer__credit">
        &copy; {new Date().getFullYear()} Little Lemon. Designed and built by Alejandro Bravo.
      </p>
    </footer>
  );
}

export default Footer;
