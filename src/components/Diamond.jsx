import PropTypes from "prop-types";

const Diamond = ({ className = "", width = 50, height = 50 }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        style={{ width: `${width}px`, height: `${height}px` }}
        className="bg-gradient-to-r from-[#E8B98C] to-[#AA8058] rounded-xl transform rotate-45 shadow-lg"
      ></div>
    </div>
  );
};

Diamond.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Diamond;
