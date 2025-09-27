import React from 'react'
import PropTypes from "prop-types";
import cardWave from "../public/SVGs/cardWave.svg"


const NewsCard = ({ image , title , descirption , className}) => {
  return (
    <div className={`flex flex-col gap-5 p-3 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}>
        <img className='h-32 rounded-md' src={image}></img> 
        <div className='flex flex-col gap-1.5'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className="text-[#3C3C43] text-sm line-clamp-3">{descirption}</p>
            <button className="mt-6 flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E]">
                التفاصيل
            </button>
        </div>
    </div>
  )
}

NewsCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  descirption : PropTypes.string.isRequired ,
  className: PropTypes.string
};

export default NewsCard