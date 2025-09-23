import PropTypes from "prop-types";

function SubmitButton({ textColor, bgColor }) {
  return (
    <button
      type="submit"
      className={`w-full border text-${textColor} bg-${bgColor} py-2 px-4 rounded-md hover:opacity-90 transition duration-200`}
    >
      SUBMIT
    </button>
  );
}

SubmitButton.propTypes = {
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string,
};

SubmitButton.defaultProps = {
  textColor: "white",
};

export default SubmitButton;
