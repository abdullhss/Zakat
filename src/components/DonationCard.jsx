import React from "react";
import PropTypes from "prop-types";
import Navigate from "../public/SVGs/Navigate.svg"
import money from "../public/SVGs/money.svg"
import shoppingCart from "../public/SVGs/ShoppingCart.svg"
import cardWave from "../public/SVGs/cardWave.svg"
import handWithMoney from "../public/SVGs/handWithMoney.svg"
const DonationCard = ({ image, title, description, collected, goal  ,showBtn = false , className  }) => {
  const remaining = goal - collected;
  const percentage = Math.min(Math.round((collected / goal) * 100), 100);

  return (
    <div className={`relative flex flex-col gap-5 pl-8 pr-5 py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}>
      {/* waves */}
      <img src={cardWave} className="absolute left-0" />

      {/* Header */}
      <div className="flex items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-3">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex flex-col justify-center gap-2">
            {
              showBtn&&(
                <button
                  className="w-fit flex items-center gap-2 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
                  style={{
                    background:
                      "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                  }}
                >
                  <img src={handWithMoney} alt="زكاة" className="w-6 h-6" />
                  <span>تقبل الزكاة</span>
                </button>
              )
            }
            <h2 className="text-lg font-bold">{title}</h2>
            <span className="text text-gray-500">{description}</span>
          </div>
        </div>
        <img src={Navigate} width={25}/>
      </div>

      <hr className="h-[2px] w-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E] border-0 rounded-full relative z-10" />

      {/* Progress Section */}
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between text-base font-bold text-[#16343A]">
          <span>تم جمع {collected}$</span>
          <span>المتبقي {remaining}$</span>
        </div>
        <div className="w-full h-[9px] bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-[#16343ACC]">
          تم الوصول الى الهدف بنسبة {percentage}%
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 relative z-10">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E]">
          <img src={money} width={30}/>
          تبرع الان
        </button>
        <button className="p-3 rounded-lg border border-[#16343A] text-[#16343A]">
          <img src={shoppingCart} width={30}/>
        </button>
      </div>
    </div>
  );
};

DonationCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  collected: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  showBtn:PropTypes.bool,
  className :PropTypes.string
};

export default DonationCard;
