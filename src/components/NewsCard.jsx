import React from 'react'
import PropTypes from "prop-types";
import cardWave from "../public/SVGs/cardWave.svg"


const NewsCard = ({ image , title , descirption , canBeBig=false,detailClick , className}) => {
  return (
    <div className={`flex flex-col gap-5 p-3 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}>
        <img className={`${canBeBig?"h-64":"h-32"} rounded-md`} src={image}></img> 
        <div className='flex flex-col gap-1.5'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className={`text-[#3C3C43] ${canBeBig ? "text-lg ": "text-sm line-clamp-3"}`}>{descirption}</p>
            {
              !canBeBig&&
              <button onClick={detailClick} className="mt-6 flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E]">
                  التفاصيل
              </button>
            }
        </div>
    </div>
  )
}

NewsCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  descirption : PropTypes.string.isRequired ,
  canBeBig:PropTypes.bool,
  detailClick:PropTypes.any , 
  className: PropTypes.string
};

export default NewsCard