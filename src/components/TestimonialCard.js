const MAX_RATING = 5;

function TestimonialCard({ name, rating, review }) {
  return (
    <article className="testimonial-card">
      <p className="testimonial-card__rating" role="img" aria-label={`Rated ${rating} out of ${MAX_RATING} stars`}>
        {"★".repeat(rating)}
        {"☆".repeat(MAX_RATING - rating)}
      </p>
      <p>{review}</p>
      <h3>{name}</h3>
    </article>
  );
}

export default TestimonialCard;
