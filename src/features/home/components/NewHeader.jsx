import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../../features/PaySlice/PaySlice";
import FastDonation from "../../../components/FastDonation";
import salla from "../../../../public/Salla.svg";
import donationRequest from "../../../../public/donationRequest.svg";
import fastDonation from "../../../../public/fastDonation.svg";
import shoppingCart from "../../../public/SVGs/ShoppingCart.svg";
import PropTypes from "prop-types";

const NewHeader = ({backgroundImage , officeName}) => {
  const UserData = localStorage.getItem("UserData");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation() ;
  const isOfficePage = location.pathname.startsWith("/office");

  const cartData = useSelector((state) => state.cart);

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

  const handleDonationClick = () => {
    dispatch(
      openPopup({
        title: "الدفع السريع",
        component: <FastDonation />,
      })
    );
  };
  console.log(backgroundImage);
  
  return (
    <section
      className="relative w-full h-[200px] md:h-[400px] overflow-hidden bg-[length:100%_100%] bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {
        isOfficePage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
            <h1 className="text-white text-xl md:text-4xl font-bold">{officeName}</h1>
          </div>
        )
      }

      {/* طلب التبرع */}
      <img
        src={donationRequest}
        alt="donation request"
        onClick={handleDonationRequest}
        className="cursor-pointer absolute left-1 md:left-1/4 bottom-0 w-[120px] sm:w-[160px] md:w-[200px] lg:w-[250px] transition-transform duration-200 hover:scale-105"
      />

      <img
        src={fastDonation}
        alt="fast donation"
        onClick={handleDonationClick}
        className="cursor-pointer absolute right-1 md:right-1/4 bottom-0 w-[120px] sm:w-[160px] md:w-[200px] transition-transform duration-200 hover:scale-105"
      />

      {/* السلة */}
      <div
        onClick={handleSallaClicked}
        className="cursor-pointer absolute bottom-0 right-1/2 translate-x-1/2 transition-transform duration-200 hover:scale-105"
      >
        <div className="relative">
          <img
            src={shoppingCart}
            alt="cart"
            className="w-6 md:w-8 absolute bottom-1 right-8 md:right-10"
          />

          {cartData?.cartData?.CartFirstItemCount > 0 && (
            <span className="absolute top-2 right-4 md:right-7 bg-[#24645E] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartData.cartData.CartFirstItemCount}
            </span>
          )}

          {/* شعار السلة (Salla) */}
          <img src={salla} alt="salla" className="w-[150px] md:w-[200px]" />
        </div>
      </div>
    </section>
  );
};

export default NewHeader;

NewHeader.propTypes = {
  backgroundImage : PropTypes.any , 
  officeName : PropTypes.any
}
