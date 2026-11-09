import { Link } from "react-router-dom";
import useDocumentTitle from "../utils/useDocumentTitle";

function NotFoundPage() {
  useDocumentTitle("Page not found");

  return (
    <section className="page page--narrow" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>Sorry, the page you are looking for does not exist or has moved.</p>
      <Link to="/" className="button">Back to home</Link>
    </section>
  );
}

export default NotFoundPage;
