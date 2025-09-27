/* eslint-disable react/prop-types */
import React from "react";
import Diamond from "../components/Diamond";

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
      className="fixed top-24 px-2 py-2 lg:top-28 right-0  z-[10000] bg-white/90 backdrop-blur-sm rounded-l-xl lg:px-4 lg:py-2 flex items-center space-x-2 space-x-reverse shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
      dir="rtl"
    >
      <Diamond width={25} height={25}/>
      <span className="text-emerald-800 font-medium text-xs lg:text-sm whitespace-nowrap">
        التبرع السريع
      </span>
    </button>
  );
};

export default FloatingDonationButton;
