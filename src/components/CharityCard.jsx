import React from 'react'
import PropTypes from "prop-types";
import UnionWhite from "../../public/Union white.png"

const CharityCard = ({ title, description, className }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-lg overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(36, 100, 94, 0.5) -6.91%, rgba(57, 104, 112, 0.5) 62.58%, rgba(59, 136, 154, 0.5) 100%)",
      }}
    >
      <div className="flex flex-col gap-3 text-white">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-lg font-normal">{description}</p>
      </div>
      <img src={UnionWhite} className="absolute left-0 top-0" />
    </div>
  )
}

export default CharityCard

CharityCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string
};
