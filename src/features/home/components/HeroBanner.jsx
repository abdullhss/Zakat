import styles from "./HeroBanner.module.css";
import union from "../../../../public/Union.png";
import sadaka from "../../../../public/sadaka.png";
import Wasl from "../../../../public/Wasl.svg";
import giveHand from "../../../../public/giveHand.svg";
import takeHand from "../../../../public/takeHand.svg";
import zakat from "../../../../public/Zakat.svg";
import salla from "../../../../public/Salla.svg";
import donationRequest from "../../../../public/donationRequest.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {setShowPopup, setPopupComponent , setPopupTitle } from "../../../features/PaySlice/PaySlice";
import CreateCampaign from "../../../components/CreateCampaign";

const HeroBanner = () => {
  const UserData = localStorage.getItem("UserData")
  const navigate = useNavigate() ;

  const handlSallaClicked = ()=>{
    if(UserData){
      navigate("/cart")
    }
    else{
      toast.error("برجاء تسجيل الدخول اولا")
    }
  }
  const handleDonationRequist = ()=>{
    if(UserData){
      navigate("/services/donation-request")
    }
    else{
      toast.error("برجاء تسجيل الدخول اولا")
    }
  }
  return (
    <section
      className={`bg-[#18383D] relative w-full h-[400px] overflow-hidden`}
      style={{
        backgroundImage: `url('/herobg.svg')`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
      }}
    >
      
      {/* منصة وصل الليبية */}
      <img src={Wasl} className="absolute top-0 right-1/2 translate-x-1/2">
      </img>

      <div className="flex flex-col gap-6 items-center absolute top-1/2 right-1/2 translate-x-1/2">
        <span className="text-xl md:text-3xl lg:text-4xl font-bold text-[#FFFFFF]">صندوق الزكاة الليبي</span>
        <span className="text-lg md:text-2xl lg:text-3xl text-[#FFD59E]">حلقــة الوصل بينك وبين الفقير </span>
      </div>

      {/* hands */}
      <img src={giveHand} className="absolute top-0 right-0 translate-x-1/5">
      </img>
      <img src={takeHand} className="absolute left-0 top-1/4  ">
      </img>

      <img src={donationRequest} onClick={handleDonationRequist} className="cursor-pointer absolute left-16 top-2/3 w-60">
      </img>

      {/* zakat */}
      <img src={zakat} className="absolute top-0 left-0">
      </img>

      {/* salla */}
        <img onClick={handlSallaClicked} src={salla} className="cursor-pointer absolute bottom-0 right-1/2 translate-x-1/2">
        </img>
    </section>
  );
};

export default HeroBanner;
