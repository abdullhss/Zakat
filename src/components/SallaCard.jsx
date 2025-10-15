import React from "react";
import PropTypes from "prop-types";
import cardWave from "../public/SVGs/cardWave.svg";
import { Trash2 } from "lucide-react";
import money from "../public/SVGs/moneyGreen.svg";
const SallaCard = ({
  image,
  title,
  description,
  collected,
  goal,
  className,
  price,
}) => {
  const remaining = goal - collected;
  const percentage = Math.min(Math.round((collected / goal) * 100), 100);

  return (
    <div
    className={`relative flex flex-col justify-between gap-5 pl-8 pr-5 py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}
    style={{ minHeight: "370px" }}
    >
        {/* waves */}
        <img src={cardWave} className="absolute left-0 top-0" />

        <div className="flex flex-col flex-1 gap-5 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
                {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 object-cover rounded-lg"
                />
                )}
                <div className="flex flex-col justify-center gap-2">
                <h2 className="text-lg font-bold">{title}</h2>
                <span className="text text-gray-500">{description}</span>
                </div>
            </div>
            <Trash2 className="w-6 h-6 text-red-500 cursor-pointer transition-colors" />
            </div>

            <hr className="h-[2px] w-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E] border-0 rounded-full" />

            {/* Progress Section */}
            <div className="flex flex-col gap-3">
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

            {/* Spacer علشان الزر يفضل في الآخر */}
            <div className="flex-1"></div>
        </div>

        {/* Buttons (تحت خالص) */}
            <div className=" w-full bg-transparent py-2 px-4 font-bold border border-[#979797] rounded-lg flex items-center gap-4 relative z-10 mt-auto">
                <img className="absolute left-3" src={money} width={30} />
                {price}
            </div>
    </div>
  );
};

SallaCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  collected: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default SallaCard;
