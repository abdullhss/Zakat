import React from "react";
import PropTypes from "prop-types";
import Navigate from "../public/SVGs/Navigate.svg";
import money from "../public/SVGs/money.svg";
import cardWave from "../public/SVGs/cardWave.svg";
import handWithMoney from "../public/SVGs/handWithMoney.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const DonationCard = ({
  image,
  title,
  description,
  collected,
  goal,
  showBtn = false,
  payNowLink,
  cantPay,
  className,
  OfficeName
}) => {
  const remaining = goal - collected;
  const percentage = Math.min(Math.round((collected / goal) * 100), 100);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const projectLink = `${window.location.origin}${payNowLink}`;

  const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.slice(0, maxLength) + "... المزيد"
    : text;
};


  return (
    <div
      className={`relative flex flex-col justify-between gap-5 pl-8 pr-5 py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden w-[500px] h-[430px] ${className}`}    >
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
              {/* زر تقبل الزكاة */}
              {showBtn ? (
                <button
                  className="w-fit flex items-center gap-2 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
                  style={{
                    background:
                      "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                  }}
                >
                  <img src={handWithMoney} alt="زكاة" className="w-6 h-6" />
                  <span>تقبل  الصدقة و الزكاة</span>
                </button>
              ): (
                <button
                  className="w-fit flex items-center gap-2 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
                  style={{
                    background:
                      "linear-gradient(90deg , #1B3F45 0% , #2B5E61 50% , #3A8D84 100%)",
                  }}
                >
                  <img src={handWithMoney} alt="زكاة" className="w-6 h-6" />
                  <span>تقبل الصدقة</span>
                </button>
              )}
              <h2 className="text-lg font-bold">{title}</h2>
              <span className="text text-gray-500">
                {truncateText(description, 50)}
              </span>
              
            </div>
          </div>
          <img
            src={Navigate}
            onClick={() => setShowShareModal(true)}
            width={25}
          />

        </div>

        <hr className="h-[2px] w-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E] border-0 rounded-full" />
        {OfficeName&&<span className="font-semibold">{OfficeName}</span>}

        {/* Progress Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-base font-bold text-[#16343A]">
            <span>تم جمع {Number(collected).toLocaleString()} د.ل</span>
            <span>المتبقي {Number(remaining).toLocaleString()} د.ل</span>
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
      <div className="flex items-center gap-4 relative z-10 mt-auto">
        <Link
          to={payNowLink}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white 
            bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] 
            `}
        >
          <img src={money} width={30} />
          {cantPay ? "تم الوصول للهدف" : "ادفع الان"}
        </Link>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6 animate-slideUp">

            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              مشاركة المشروع
            </h2>

            <p className="text-gray-600 text-center mb-3">
              يمكنك نسخ رابط المشروع لمشاركته مع الآخرين
            </p>

            {/* Input + Copy Button */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={projectLink}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-gray-100"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(projectLink);
                  toast.success("تم نسخ الرابط!");
                }}
                className="bg-[#18383D] text-white px-4 py-2 rounded-lg hover:bg-[#24645E] transition"
              >
                نسخ
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 mb-4">
              {/* Facebook */}
                <img
                onClick={() => {
                  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    "تقدر تشوف مشروع التبرع من هنا:"
                  )}&url=${encodeURIComponent(projectLink)}`;
                  window.open(twitterShareUrl, "_blank");
                }}
                src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
                className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                width={20} />
              {/* WhatsApp */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                className="w-10 h-10 cursor-pointer hover:scale-110 transition"
                onClick={() => window.open(
                  `https://wa.me/?text=${encodeURIComponent("أشاركك هذا المشروع: " + projectLink)}`,
                  "_blank"
                )}
                alt="WhatsApp Share"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-2 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-semibold"
            >
              إغلاق
            </button>


          </div>
        </div>
      )}

    </div>
  );
};

DonationCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  collected: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  showBtn: PropTypes.bool,
  payNowLink: PropTypes.string,
  cantPay: PropTypes.bool,
  className: PropTypes.string,
  OfficeName:PropTypes.string
};

export default DonationCard;
