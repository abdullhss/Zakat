import React from 'react'
import PropTypes from "prop-types";


const NewsCard = ({ image , title , descirption , className}) => {
  return (
    <div className={`flex flex-col gap-5 p-6 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}>
        <img className='h-32' src={image}></img> 
        <div className='flex flex-col gap-3'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className='text-[#3C3C43] text-sm'>{descirption}</p>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E]">
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