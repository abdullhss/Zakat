import PropTypes from "prop-types";

const Diamond = ({ className = "" , rounded = true, width = 50, height = 50, imgUrl }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        style={{ width: `${width}px`, height: `${height}px` }}
        className={`relative bg-gradient-to-r from-[#E8B98C] to-[#AA8058] transform rotate-45 shadow-lg overflow-hidden ${rounded ? "rounded-xl" : "rounded-md"}`}
      >
        {imgUrl && (
          <img
            src={imgUrl}
            alt="diamond-content"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

Diamond.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  imgUrl: PropTypes.string,
  rounded: PropTypes.bool,
};

export default Diamond;
