import { ArrowUpRightFromSquare, Banknote, ShoppingCart } from "lucide-react";
import React from "react";
import PropTypes from "prop-types";

const DonationCard = ({ image, title, description, collected, goal , className  }) => {
  const remaining = goal - collected;
  const percentage = Math.min(Math.round((collected / goal) * 100), 100);

  return (
    <div className={`relative flex flex-col gap-5 p-6 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}>
      {/* waves */}
      <div className="rightGrayWave"></div>
      <div className="leftGrayWave"></div>

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
            <h2 className="text-lg font-semibold">{title}</h2>
            <span className="text-sm text-gray-500">{description}</span>
          </div>
        </div>
        <ArrowUpRightFromSquare size={20} />
      </div>

      <hr className="h-[2px] w-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E] border-0 rounded-full relative z-10" />

      {/* Progress Section */}
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between text-base font-semibold text-[#16343A]">
          <span>تم جمع {collected}$</span>
          <span>المتبقي {remaining}$</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 text-[#16343ACC]">
          تم الوصول الى الهدف بنسبة {percentage}%
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 relative z-10">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E]">
          تبرع الان
          <Banknote color="#F2DCA5" />
        </button>
        <button className="p-3 rounded-lg border border-[#16343A] text-[#16343A]">
          <ShoppingCart />
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
  className :PropTypes.string
};

export default DonationCard;
