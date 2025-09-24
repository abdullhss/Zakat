/* eslint-disable react/prop-types */
import React from "react";

/**
 * Floating donation button that appears on all screens
 */
const FloatingDonationButton = () => {
  /**
   * Handle donation button click
   */
  const handleDonationClick = () => {
    console.log("Donation clicked");
    // TODO: Add donation functionality
  };

  return (
    <button
      onClick={handleDonationClick}
      className="fixed top-24 lg:top-28 right-0   z-[1000] bg-white/90 backdrop-blur-sm rounded-l-xl lg:px-4 lg:py-2 flex items-center space-x-2 space-x-reverse shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
      dir="rtl"
    >
      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
        <svg
          className="w-3 h-3 lg:w-4 lg:h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      </div>
      <span className="text-emerald-800 font-medium text-xs lg:text-sm whitespace-nowrap">
        التبرع السريع
      </span>
    </button>
  );
};

export default FloatingDonationButton;
