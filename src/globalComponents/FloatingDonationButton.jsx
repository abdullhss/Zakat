/* eslint-disable react/prop-types */
import React from "react";
import Diamond from "../components/Diamond";
import whiteplant from "../public/SVGs/whiteplanet.svg"
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
      <Diamond rounded={false} width={30} height={30} imgUrl={whiteplant}/>
      <span
        className="font-bold whitespace-nowrap bg-gradient-to-b from-[#24645E] via-[#18383D] to-[#17343B] bg-clip-text text-transparent"
      >
        التبرع السريع
      </span>
    </button>
  );
};

export default FloatingDonationButton;
