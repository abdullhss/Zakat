import React from "react";
import googlePlay from "../../../../public/GooglePlay.svg";
import AppleStore from "../../../../public/AppleStore.svg";
import Mobile from "../../../../public/mobiles.png";
import Union from "../../../../public/Union.png";
import PropTypes from "prop-types";

const DownloadApp = ({ appsURLS = [] }) => {
  // Extract URLs from the appsURLS array
  const iosUrl = appsURLS.find(app => app.Type === "IOS")?.UpdateLink || "#";
  const androidUrl = appsURLS.find(app => app.Type === "Andriod")?.UpdateLink || "#";

  // Handle opening app store URLs
  const handleOpenAppStore = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      console.warn("No valid URL provided");
    }
  };

  return (
    <div className=" py-8 md:py-24">
      <div className="relative flex flex-col w-full md:flex-row px-4 md:px-28 items-center justify-between py-8 md:py-16 bg-[#ececec] ">
        {/* Desktop Background - Hidden on mobile */}
        <div
          className="hidden md:block absolute top-0 right-0 h-full w-1/3 z-0 rotate-180"
          style={{
            backgroundImage: `url(${Union})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        ></div>

        <div
          className="hidden md:block absolute top-0 left-0 h-full w-1/3 z-0 rotate-180"
          style={{
            backgroundImage: `url(${Union})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        ></div>

        {/* Mobile Background */}
        <div
          className="md:hidden absolute top-0 right-0 h-full w-full z-0 opacity-30"
          style={{
            backgroundImage: `url(${Union})`,
            backgroundRepeat: "repeat",
          }}
        ></div>

        {/* Mobile Layout */}
        <div className="md:hidden relative z-20 flex flex-col items-center justify-center gap-6 w-full text-center">
          {/* Mobile phone image at top */}
          <div className="mb-4">
            <img
              src={Mobile}
              className="w-48 h-auto mx-auto"
              alt="Mobile App"
            />
          </div>
          
          {/* Title */}
          <p className="text-2xl font-bold text-[#17343B]">حمل تطبيق وصل</p>
          
          {/* Download buttons - stacked vertically on mobile */}
          <div className="flex flex-col w-full gap-4 px-4">
            {/* Apple Store Button */}
            <button 
              onClick={() => handleOpenAppStore(iosUrl)}
              className="bg-black text-white flex items-center justify-center rounded-lg gap-3 px-6 py-4 w-full hover:opacity-90 transition-opacity"
            >
              <img src={AppleStore} alt="Apple Store" className="w-8 h-8" />
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-80">تنزيل من</span>
                <span className="text-sm font-semibold">Apple Store</span>
              </div>
            </button>
            
            {/* Google Play Button */}
            <button 
              onClick={() => handleOpenAppStore(androidUrl)}
              className="bg-black text-white flex items-center justify-center rounded-lg gap-3 px-6 py-4 w-full hover:opacity-90 transition-opacity"
            >
              <img src={googlePlay} alt="Google Play" className="w-8 h-8" />
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-80">احصل عليه من</span>
                <span className="text-sm font-semibold">Google Play</span>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden md:flex relative z-20 flex-col items-start justify-center gap-6">
          <p className="text-xl md:text-3xl font-bold">حمل تطبيق وصل</p>
          <div className="flex w-full justify-between gap-8 mt-12 md:mt-0">
            {/* Apple Store Button */}
            <button 
              onClick={() => handleOpenAppStore(iosUrl)}
              className="bg-black text-white flex flex-col md:flex-row items-center rounded-lg gap-2 px-4 py-2 hover:opacity-90 transition-opacity"
            >
              <div className="flex flex-col gap-1 items-end md:items-start">
                <span className="text-xs">تنزيل من</span>
                <span className="text-sm font-semibold">Apple Store</span>
              </div>
              <img src={AppleStore} alt="Apple Store" />
            </button>
            
            {/* Google Play Button */}
            <button 
              onClick={() => handleOpenAppStore(androidUrl)}
              className="bg-black text-white flex flex-col md:flex-row items-center rounded-lg gap-2 px-4 py-2 hover:opacity-90 transition-opacity"
            >
              <div className="flex flex-col gap-1 items-end md:items-start">
                <span className="text-xs">احصل عليه من</span>
                <span className="text-sm font-semibold">Google Play</span>
              </div>
              <img src={googlePlay} alt="Google Play" />
            </button>
          </div>
        </div>

        {/* Desktop Mobile Image - Hidden on mobile */}
        <div className="hidden md:block">
          <img
            src={Mobile}
            className="absolute w-40 top-0 left-4 md:w-80 md:-top-1/2 md:left-28 z-20"
            alt="Mobile App"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;

DownloadApp.propTypes = {
  appsURLS: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.number,
      Type: PropTypes.string,
      ServerVersion: PropTypes.number,
      UpdateLink: PropTypes.string,
    })
  ),
};

DownloadApp.defaultProps = {
  appsURLS: [],
};