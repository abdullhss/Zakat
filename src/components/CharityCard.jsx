import React from 'react'
import PropTypes from "prop-types";
import UnionWhite from "../../public/Union white.png"

const CharityCard = ({title , description , className}) => {
  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-r from-[#24645E] to-[#3B889A] rounded-lg overflow-hidden ${className}`}>
        <div className='flex flex-col gap-3 text-white'>
            <p className='text-lg font-semibold'>{title}</p>
            <p className='text-lg font-normal'>{description}</p>
        </div>
        <img src={UnionWhite} className='absolute left-0 top-0'></img>
    </div>
  )
}

export default CharityCard


CharityCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className :PropTypes.string
};