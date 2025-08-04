import React, { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'; // Used for JSX motion elements
import { FiX, FiExternalLink, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// This component displays admin-controlled notice messages in the header
const NoticesBar = () => {
  const [notices, setNotices] = useState([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedNotices, setDismissedNotices] = useState(new Set());

  // Sample notices - in production, these would come from admin API
  const sampleNotices = useMemo(() => [
    {
      id: 1,
      text: "🎉 Grand Sale! Up to 50% off on all mobile phones",
      emoji: "🎉",
      link: "/sale",
      type: "sale",
      active: true,
      dismissible: true,
      backgroundColor: "#059669", // green-600
      textColor: "#ffffff"
    },
    {
      id: 2,
      text: "⚡ Free delivery on orders above ₹1000",
      emoji: "⚡",
      link: null,
      type: "info",
      active: true,
      dismissible: false,
      backgroundColor: "#3b82f6", // blue-600
      textColor: "#ffffff"
    },
    {
      id: 3,
      text: "📱 New iPhone 15 Series now available!",
      emoji: "📱",
      link: "/products?category=mobiles&brand=apple",
      type: "announcement",
      active: true,
      dismissible: true,
      backgroundColor: "#7c3aed", // violet-600
      textColor: "#ffffff"
    }
  ], []);

  // Initialize notices and load dismissed notices from localStorage
  useEffect(() => {
    // Load active notices (in production, fetch from admin API)
    const activeNotices = sampleNotices.filter(notice => notice.active);
    setNotices(activeNotices);

    // Load dismissed notices from localStorage
    const dismissed = localStorage.getItem('dismissedNotices');
    if (dismissed) {
      setDismissedNotices(new Set(JSON.parse(dismissed)));
    }
  }, [sampleNotices]);

  // Auto-rotate notices every 5 seconds
  useEffect(() => {
    if (notices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % notices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [notices.length]);

  // Get visible notices (not dismissed)
  const visibleNotices = notices.filter(notice => !dismissedNotices.has(notice.id));

  // Current notice to display
  const currentNotice = visibleNotices[currentNoticeIndex] || null;

  // Handle notice dismissal
  const handleDismiss = (noticeId) => {
    const newDismissed = new Set([...dismissedNotices, noticeId]);
    setDismissedNotices(newDismissed);
    localStorage.setItem('dismissedNotices', JSON.stringify([...newDismissed]));

    // If we dismissed the last notice, hide the bar
    if (newDismissed.size >= notices.length) {
      setIsVisible(false);
    }
  };

  // Handle bar close (hides until page reload)
  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't render if no notices or not visible
  if (!isVisible || !currentNotice || visibleNotices.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative overflow-hidden"
        style={{
          backgroundColor: currentNotice.backgroundColor,
          color: currentNotice.textColor,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2 min-h-[40px]">
              {/* Notice Content */}
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNotice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    {/* Icon/Emoji */}
                    {currentNotice.emoji && (
                      <span className="text-lg flex-shrink-0">
                        {currentNotice.emoji}
                      </span>
                    )}
                    
                    {/* Notice Text */}
                    <span className="text-sm font-medium text-center">
                      {currentNotice.text}
                    </span>

                    {/* Link Arrow */}
                    {currentNotice.link && (
                      <Link
                        to={currentNotice.link}
                        className="flex items-center space-x-1 hover:underline group"
                      >
                        <span className="text-xs">Shop Now</span>
                        <FiExternalLink 
                          size={12} 
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2 ml-4">
                {/* Notice Indicators */}
                {visibleNotices.length > 1 && (
                  <div className="hidden sm:flex items-center space-x-1">
                    {visibleNotices.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentNoticeIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentNoticeIndex 
                            ? 'bg-white' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Show notice ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Dismiss Button (if dismissible) */}
                {currentNotice.dismissible && (
                  <button
                    onClick={() => handleDismiss(currentNotice.id)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    title="Dismiss this notice"
                    aria-label="Dismiss notice"
                  >
                    <FiInfo size={14} />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  title="Close notices bar"
                  aria-label="Close notices bar"
                >
                  <FiX size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NoticesBar;
