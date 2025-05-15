import React from "react";
import { Link } from "react-router-dom";
import Button from "./UI/Button";

const HeroBanner = ({ banner }) => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg shadow-lg my-4">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-[400px] object-cover"
            style={{ backgroundColor: banner.backgroundColor }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-12 bg-gradient-to-r from-black/60 to-transparent">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {banner.title}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-6">
              {banner.subtitle}
            </p>
            <Button
              variant="primary"
              fullWidth={false}
              className="bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              {banner.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
