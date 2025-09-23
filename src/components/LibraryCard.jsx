import React from 'react'
import PropTypes from "prop-types";


const LibraryCard = ({ image , title , className}) => {
  return (
    <div className={`relative flex flex-col gap-5 p-6 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] opacity-80 overflow-hidden ${className}`}>
        <div className="leftGrayWave"></div>
        
        <div className="flex items-center gap-3">
            {image && (
                <img
                src={image}
                alt={title}
                className="w-32 h-32 object-cover rounded-lg"
                />
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
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