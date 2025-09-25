import React from "react";
import googlePlay from "../../../../public/GooglePlay.svg";
import AppleStore from "../../../../public/AppleStore.svg";
import Mobile from "../../../../public/mobiles.png";

const DownloadApp = () => {
  return (
    <div className="bg-white py-24">
      <div
        className="relative flex flex-col w-full md:flex-row px-2 md:px-28 items-center justify-between bg-[#ececec] py-16"
        style={{
          backgroundImage: "url('../../../../public/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <div className="flex flex-col items-start justify-center gap-6">
          <p className="text-xl md:text-3xl font-bold">حمل تطبيق وصل</p>
          <div className="flex w-full justify-between gap-8 mt-12 md:mt-0">
            <button className="bg-black text-white flex flex-col md:flex-row items-center rounded-lg gap-2 px-4 py-2">
              <div className="flex flex-col gap-1">
                <span>تنزيل من</span>
                <span>Apple Store</span>
              </div>
              <img src={AppleStore} alt="" />
            </button>
            <button className="bg-black text-white flex flex-col md:flex-row items-center rounded-lg gap-2 px-4 py-2">
              <div className="flex flex-col gap-1">
                <span>احصل عليه من</span>
                <span>Google Play</span>
              </div>
              <img src={googlePlay} alt="" />
            </button>
          </div>
        </div>
        <div>
          <img src={Mobile} className="absolute w-40 top-0 left-4 md:w-80 md:-top-1/2 md:left-28" />
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
