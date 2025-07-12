import React from 'react';
import { Link } from 'react-router-dom';

const StaticPromoBanners = () => {
  const bannerData = [
    // Top row - Tech categories
    {
      id: 1,
      title: "Wireless Charging",
      subtitle: "Fast & Efficient",
      image: "/accessories.png",
      link: "/products/accessories?category=wireless-charging",
      bgColor: "from-blue-400 to-blue-600",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Smart Watches",
      subtitle: "Health & Fitness",
      image: "/accessories.png", 
      link: "/products/smartwatches",
      bgColor: "from-purple-400 to-purple-600",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Headphones",
      subtitle: "Premium Audio",
      image: "/accessories.png",
      link: "/products/headphones", 
      bgColor: "from-green-400 to-green-600",
      textColor: "text-white"
    },
    {
      id: 4,
      title: "Keyboards",
      subtitle: "Gaming & Work",
      image: "/accessories.png",
      link: "/products/keyboards",
      bgColor: "from-red-400 to-red-600", 
      textColor: "text-white"
    },
    {
      id: 5,
      title: "Gaming Mouse",
      subtitle: "Precision Control",
      image: "/accessories.png",
      link: "/products/gaming-mouse",
      bgColor: "from-indigo-400 to-indigo-600",
      textColor: "text-white"
    }
  ];

  const categoryBanners = [
    {
      id: 'wired',
      title: "Wired",
      subtitle: "Reliable Connection",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      link: "/products/wired-accessories"
    },
    {
      id: 'wireless', 
      title: "Wireless",
      subtitle: "Freedom to Move",
      bgColor: "bg-pink-100",
      textColor: "text-pink-800", 
      link: "/products/wireless-accessories"
    },
    {
      id: 'true-wireless',
      title: "True Wireless", 
      subtitle: "Ultimate Freedom",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      link: "/products/true-wireless"
    }
  ];

  const innovationBanner = {
    title: "The Edge of Innovation,",
    subtitle: "In Your Hands...",
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    textColor: "text-white",
    link: "/products/latest-tech"
  };

  const appleBanner = {
    title: "Apple Accessories",
    subtitle: "Premium Quality",
    bgColor: "bg-gradient-to-r from-gray-100 to-gray-200", 
    textColor: "text-gray-800",
    link: "/products/apple-accessories"
  };

  return (
    <section className="py-12" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Browse by Category
          </h2>
          <div
            className="h-1 w-32 rounded-full"
            style={{ backgroundColor: "var(--brand-primary)" }}
          ></div>
        </div>

        {/* Tech Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {bannerData.map((banner) => (
            <Link
              key={banner.id}
              to={banner.link}
              className={`bg-gradient-to-br ${banner.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white/40 rounded"></div>
              </div>
              <h3 className={`font-bold text-lg mb-1 ${banner.textColor}`}>
                {banner.title}
              </h3>
              <p className={`text-sm opacity-90 ${banner.textColor}`}>
                {banner.subtitle}
              </p>
            </Link>
          ))}
        </div>

        {/* Categories Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {categoryBanners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.link}
              className={`${banner.bgColor} rounded-xl p-8 text-center hover:shadow-md transition-all duration-300`}
            >
              <h3 className={`font-bold text-xl mb-2 ${banner.textColor}`}>
                {banner.title}
              </h3>
              <p className={`${banner.textColor} opacity-80`}>
                {banner.subtitle}
              </p>
            </Link>
          ))}
        </div>

        {/* Innovation Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            to={innovationBanner.link}
            className={`${innovationBanner.bgColor} rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <div className="w-10 h-10 bg-white/40 rounded"></div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white/40 rounded"></div>
              </div>
            </div>
            <h3 className={`font-bold text-2xl mb-2 ${innovationBanner.textColor}`}>
              {innovationBanner.title}
            </h3>
            <p className={`text-lg ${innovationBanner.textColor} opacity-90`}>
              {innovationBanner.subtitle}
            </p>
          </Link>

          <div className="flex items-center justify-center">
            <div className="w-32 h-32 bg-white/60 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Apple Accessories Banner */}
        <Link
          to={appleBanner.link}
          className={`${appleBanner.bgColor} rounded-xl p-8 text-center hover:shadow-md transition-all duration-300 block`}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
            <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          </div>
          <h3 className={`font-bold text-2xl mb-2 ${appleBanner.textColor}`}>
            {appleBanner.title}
          </h3>
          <p className={`${appleBanner.textColor} opacity-80`}>
            {appleBanner.subtitle}
          </p>
        </Link>
      </div>
    </section>
  );
};

export default StaticPromoBanners;
