import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const OurStores = () => {
  const [selectedCity, setSelectedCity] = useState("all");
  const [stores, setStores] = useState([]);
  const [cities, setCities] = useState(["all"]);
  const [_loading, setLoading] = useState(true);

  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Our Stores", link: ROUTES.OUR_STORES },
  ];

  // Fetch stores from backend
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stores/`);
        if (response.ok) {
          const data = await response.json();
          setStores(data.stores || []);
          
          // Extract unique cities from stores
          const uniqueCities = ["all", ...new Set(data.stores?.map(store => store.city.toLowerCase()) || [])];
          setCities(uniqueCities);
        } else {
          console.error("Failed to fetch stores");
          toast.error("Failed to load store information");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error("Unable to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores =
    selectedCity === "all"
      ? stores
      : stores.filter((store) => store.city.toLowerCase() === selectedCity);

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-500">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.link}
                    className="text-gray-500 hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Visit Our Stores
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Find the nearest store location and experience our products in
              person. Our expert staff are ready to assist you with all your
              technology needs.
            </p>
          </div>
        </div>
      </section>

      {/* City Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city, index) => (
              <button
                key={index}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedCity === city
                    ? "text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{
                  backgroundColor:
                    selectedCity === city ? "var(--brand-primary)" : undefined,
                }}
              >
                {city === "all"
                  ? "All Locations"
                  : city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Store Listings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
              >
                {/* Store Image */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-0 right-0 bg-white px-3 py-1 m-3 rounded-full text-sm font-medium capitalize">
                    {store.city}
                  </div>
                </div>

                {/* Store Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{store.name}</h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-start">
                      <FiMapPin className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">{store.address}</p>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">{store.contact}</p>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">{store.email}</p>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-gray-500 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">{store.hours}</p>
                    </div>
                  </div>

                  <a
                    href={store.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium transition-colors duration-300"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    View on Google Maps <FiArrowRight className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">
                No stores found in this location
              </h3>
              <p className="text-gray-600">
                Please select another location or view all stores.
              </p>
              <button
                onClick={() => setSelectedCity("all")}
                className="mt-4 px-4 py-2 rounded-md text-white transition-all"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                View All Stores
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Store Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Why Visit Our Stores?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Consultation",
                description:
                  "Our trained staff can help you choose the perfect device based on your needs and budget.",
              },
              {
                title: "Hands-on Experience",
                description:
                  "Try before you buy! Get hands-on experience with our wide range of products.",
              },
              {
                title: "Immediate Support",
                description:
                  "Get immediate technical support and service for your existing devices.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Services Available at Our Stores
            </h2>
            <p className="text-gray-700">
              Visit any of our stores to access these premium services and get
              the most out of your devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Product Demonstrations",
              "Technical Support",
              "Device Setup & Configuration",
              "Screen Protector Installation",
              "Software Updates",
              "Device Diagnostics",
              "Warranty Services",
              "Trade-in Programs",
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <p className="font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Can't Find a Store Near You?
          </h2>
          <p className="text-lg mb-6">
            Contact us to learn about our upcoming store locations or shop
            online with free delivery!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to={ROUTES.CONTACT}
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="px-6 py-3 bg-transparent border-2 border-white font-medium rounded-md hover:bg-white hover:text-blue-600 transition-colors"
            >
              Shop Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStores;
