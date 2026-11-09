function SpecialCard({ name, price, description, image, imageAlt }) {
  return (
    <article className="special-card">
      <img src={image} alt={imageAlt} loading="lazy" />
      <div className="special-card__body">
        <h3>{name}</h3>
        <p className="special-card__price">{price}</p>
        <p>{description}</p>
      </div>
    </article>
  );
}

export default SpecialCard;
