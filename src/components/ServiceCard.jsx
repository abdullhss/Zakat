import PropTypes from "prop-types";
import Union from "../../public/Union.png"
const ServiceCard = ({ icon, title, descirption, className }) => {
  return (
    <div
      className={`relative w-96 h-auto flex flex-col gap-6 p-6 rounded-2xl shadow-md 
      bg-gradient-to-r from-[#24645ECC] to-[#18383D33] opacity-100 ${className}`}
    >
      <div className="flex flex-col gap-3">
        <span className="text-3xl text-[#17343B]">{icon}</span>
        <p className="font-semibold text-[#17343B] text-xl">{title}</p>
      </div>
      <p className="font-medium text-[#515151] text-base leading-relaxed z-10">
        {descirption}
      </p>
      <img className="absolute left-0 top-0 opacity-80" src={Union}></img>
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
