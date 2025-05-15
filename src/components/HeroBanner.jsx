import Button from "./UI/Button";

const HeroBanner = ({ banner }) => {
  return (
    <section className="relative py-4">
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-xl my-4 transform transition-transform hover:scale-[1.01] duration-300"
          style={{
            boxShadow: "var(--shadow-large)",
            borderRadius: "var(--rounded-xl)",
          }}
        >
          {" "}
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover object-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundColor: banner.backgroundColor }}
            loading="eager"
          />
          {/* Gradient overlay with animation */}
          <div
            className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 animate-[fadeIn_0.5s_ease-in-out]"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
            }}
          >
            <div className="max-w-lg">
              {" "}
              <span
                className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium animate-pulse"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                {banner.tag || "Special Offer"}
              </span>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight"
                style={{ color: "var(--text-on-brand)" }}
              >
                {banner.title}
              </h1>
              <p
                className="text-lg sm:text-xl mb-6 opacity-90"
                style={{ color: "var(--text-on-brand-muted)" }}
              >
                {banner.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                {" "}
                <Button
                  variant="primary"
                  fullWidth={false}
                  size="lg"
                  className="transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--text-on-brand)",
                    boxShadow: "var(--shadow-medium)",
                    borderRadius: "var(--rounded-md)",
                  }}
                >
                  {banner.cta || "Shop Now"}
                </Button>{" "}
                <Button
                  variant="outline"
                  fullWidth={false}
                  size="lg"
                  className="transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(4px)",
                    borderColor: "var(--text-on-brand-muted)",
                    color: "var(--text-on-brand)",
                    borderRadius: "var(--rounded-md)",
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-20 rotate-45 translate-x-24 -translate-y-12">
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: "var(--brand-primary)" }}
            />
          </div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 opacity-10">
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: "var(--brand-secondary)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
