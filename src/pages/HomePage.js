import { Link } from "react-router-dom";
import SpecialCard from "../components/SpecialCard";
import TestimonialCard from "../components/TestimonialCard";
import useDocumentTitle from "../utils/useDocumentTitle";
import heroImage from "../assets/images/hero-dishes.jpg";
import saladImage from "../assets/images/salad-plate.jpg";
import toastsImage from "../assets/images/toasts-plate.jpg";
import dessertImage from "../assets/images/citrus-dessert.jpg";
import kitchenImageA from "../assets/images/kitchen-team-a.jpg";
import kitchenImageB from "../assets/images/kitchen-team-b.jpg";

const SPECIALS = [
  {
    name: "Garden Greek Salad",
    price: "$13.50",
    image: saladImage,
    imageAlt: "Greek salad with cucumber, tomato, olives and feta",
    description:
      "Crisp cucumber, ripe tomatoes, Kalamata olives and creamy feta tossed in an oregano vinaigrette.",
  },
  {
    name: "Tomato Basil Toasts",
    price: "$7.25",
    image: toastsImage,
    imageAlt: "Slices of rustic bread topped with soft cheese, diced tomatoes and basil",
    description:
      "Rustic bread layered with whipped cheese, marinated tomatoes and fresh basil leaves.",
  },
  {
    name: "Honey Lemon Cake",
    price: "$6.50",
    image: dessertImage,
    imageAlt: "A slice of layered lemon cake next to whole lemons",
    description:
      "Light sponge layers filled with lemon curd and finished with whipped cream and a citrus twist.",
  },
];

const TESTIMONIALS = [
  {
    name: "Elena R.",
    rating: 5,
    review: "Every dish tasted like it came from someone's home kitchen. We will be back soon.",
  },
  {
    name: "Marcus T.",
    rating: 5,
    review: "Warm staff, lovely lighting and the best lemon cake I have ever had.",
  },
  {
    name: "Priya S.",
    rating: 4,
    review: "Booking online was quick and our table was ready as soon as we arrived.",
  },
  {
    name: "Daniel K.",
    rating: 5,
    review: "A relaxed spot with generous portions. The tomato toasts are a must.",
  },
];

function HomePage() {
  useDocumentTitle("");

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <div className="hero__content">
            <h1 id="hero-title">Little Lemon</h1>
            <p className="hero__city">Chicago</p>
            <p>
              Sun-soaked Mediterranean cooking, prepared fresh every day from
              recipes passed down through our family kitchen.
            </p>
            <Link to="/booking" className="button">
              Reserve a table
            </Link>
          </div>
          <img
            className="hero__image"
            src={heroImage}
            width="900"
            height="1360"
            alt="A chef carrying a slate board of colorful small bites"
          />
        </div>
      </section>

      <section id="specials" tabIndex="-1" className="section section--light" aria-labelledby="specials-title">
        <div className="section__inner">
          <h2 id="specials-title">Chef&apos;s specials</h2>
          <div className="card-grid card-grid--three">
            {SPECIALS.map((special) => (
              <SpecialCard key={special.name} {...special} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="testimonials-title">
        <div className="section__inner">
          <h2 id="testimonials-title">What our guests say</h2>
          <div className="card-grid card-grid--four">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" tabIndex="-1" className="section" aria-labelledby="about-title">
        <div className="section__inner about">
          <div className="about__text">
            <h2 id="about-title">Our story</h2>
            <p>
              Lucía and Mateo Ferrer opened Little Lemon in 2012 with six tables,
              a wood-fired oven and their grandmother&apos;s handwritten recipe
              notebook.
            </p>
            <p>
              Today the kitchen still bakes bread every morning, buys produce
              from farms around Illinois and cooks most dishes over open flame.
              Lucía leads the kitchen while Mateo welcomes guests and chooses
              the wines.
            </p>
          </div>
          <div className="about__images">
            <img
              src={kitchenImageA}
              width="700"
              height="466"
              loading="lazy"
              alt="Two chefs talking as they prepare dishes in the restaurant kitchen"
            />
            <img
              src={kitchenImageB}
              width="700"
              height="466"
              loading="lazy"
              alt="Two chefs smiling together at the kitchen counter"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
