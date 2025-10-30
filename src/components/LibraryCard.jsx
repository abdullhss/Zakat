import React from 'react'
import PropTypes from "prop-types";
import cardWave from "../public/SVGs/cardWave.svg"
import { Phone } from 'lucide-react';


const LibraryCard = ({ image , title , className , onClick , PhoneNum}) => {
  return (
    <div onClick={()=>{onClick()}} className={`relative cursor-pointer flex flex-col gap-5 p-6 rounded-2xl border border-[#B7B7B7] shadow-md bg-gradient-to-r from-[#FCFCFC]/40 to-[#C7C7C7]/40 overflow-hidden ${className}`}>
      <img src={cardWave} className="absolute left-0 top-0 h-full" />
      <div className="flex items-center gap-3 relative z-10">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
        <div className='flex flex-col gap-4'>
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className='flex items-center gap-2'>
            <span><Phone/></span>
            <h2 className="">{PhoneNum}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

LibraryCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick:PropTypes.any,
  PhoneNum:PropTypes.any
};

export default LibraryCard