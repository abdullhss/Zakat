import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShowPopup, setPopupComponent, setPopupTitle } from "../../../features/PaySlice/PaySlice";
import CreateCampaign from "../../../components/CreateCampaign";

import Wasl from "../../../../public/Wasl.svg";
import giveHand from "../../../../public/giveHand.svg";
import takeHand from "../../../../public/takeHand.svg";
import zakat from "../../../../public/Zakat.svg";
import salla from "../../../../public/Salla.svg";
import donationRequest from "../../../../public/donationRequest.svg";

const HeroBanner = () => {
  const UserData = localStorage.getItem("UserData");
  const navigate = useNavigate();

  const handleSallaClicked = () => {
    if (UserData) {
      navigate("/cart");
    } else {
      toast.error("برجاء تسجيل الدخول أولاً");
    }
  };

  const handleDonationRequest = () => {
    if (UserData) {
      navigate("/services/donation-request");
    } else {
      toast.error("برجاء تسجيل الدخول أولاً");
    }
  };

  return (
    <section
      className="relative w-full h-[400px] bg-[#18383D] overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/herobg.svg')` }}
    >
      {/* منصة وصل الليبية */}
      <img
        src={Wasl}
        alt="Wasl"
        className="absolute top-0 right-1/2 translate-x-1/2 w-[250px] md:w-[300px] lg:w-[350px]"
      />

      {/* النصوص */}
      <div className="flex flex-col gap-4 md:gap-6 items-center absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          صندوق الزكاة الليبي
        </span>
        <span className="text-base sm:text-xl md:text-2xl lg:text-3xl text-[#FFD59E]">
          حلقــة الوصل بينك وبين الفقير
        </span>
      </div>

      {/* الأيادي */}
      <img
        src={giveHand}
        alt="give hand"
        className="absolute top-14 right-0 w-[160px] md:w-[300px] lg:w-[400px]"
      />
      <img
        src={takeHand}
        alt="take hand"
        className="absolute left-0 bottom-12 w-[160px] md:w-[300px] lg:w-[400px]"
      />

      {/* طلب التبرع */}
      <img
        src={donationRequest}
        alt="donation request"
        onClick={handleDonationRequest}
        className="cursor-pointer absolute left-6 sm:left-10 top-2/3 w-[120px] sm:w-[160px] md:w-[200px] lg:w-[250px] transition-transform duration-200 hover:scale-105"
      />

      {/* الزكاة */}
      <img
        src={zakat}
        alt="zakat"
        className="absolute top-0 left-0 w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px]"
      />

      {/* السلة */}
      <img
        onClick={handleSallaClicked}
        src={salla}
        alt="salla"
        className="cursor-pointer absolute bottom-0 right-1/2 translate-x-1/2 w-[120px] sm:w-[160px] md:w-[200px] lg:w-[250px] transition-transform duration-200 hover:scale-105"
      />
    </section>
  );
};

export default HeroBanner;
