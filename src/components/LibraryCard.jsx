import React from 'react'
import PropTypes from "prop-types";
import cardWave from "../public/SVGs/cardWave.svg"


const LibraryCard = ({ image , title , className}) => {
  return (
    <div className={`relative flex flex-col gap-5 p-6 rounded-2xl border border-[#B7B7B7] shadow-md bg-gradient-to-r from-[#FCFCFC]/40 to-[#C7C7C7]/40 overflow-hidden ${className}`}>
      <img src={cardWave} className="absolute left-0 top-0 h-full" />
      <div className="flex items-center gap-3 relative z-10">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </div>
  )
}

LibraryCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default LibraryCard