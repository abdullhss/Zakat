import PropTypes from "prop-types";
import Union from "../../public/Union.png"
import { ArrowLeft } from "lucide-react";

const ServiceCard = ({ icon, title, descirption, className }) => {
  return (
    <div
      className={`relative h-full flex flex-col gap-6 p-6 rounded-2xl shadow-md overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(270deg, rgba(36, 100, 94, 0) 0%, rgba(24, 56, 61, 0.2) 69.49%, rgba(23, 52, 59, 0.4) 106.91%)",
      }}
    >
      <div className="flex flex-col gap-3">
        <span className="">{icon}</span>
        <p className="font-bold text-[#17343B] text-xl">{title}</p>
      </div>
      <p className="font-medium text-[#515151] text-base leading-relaxed z-10 mb-5">
        {descirption}
      </p>
      <img className="absolute left-0 top-0" src={Union} />
      <button className="bg-[#17343B] rounded-lg p-0.5 absolute left-2 bottom-2 "><ArrowLeft color="white"/></button>
    </div>
  );
};

ServiceCard.propTypes = {
  icon: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  descirption: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ServiceCard;
