import React from 'react'
import PropTypes from "prop-types";

const NewsCard = ({ 
  image, 
  title, 
  descirption, 
  canBeBig = false, 
  detailClick, 
  newsPageOnly = false, 
  className, 
  newsItem ,
  officeName
}) => {
  return (
    <div className={`flex flex-col gap-5 p-3 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden ${className}`}>
      <img 
        className={`${canBeBig ? "h-64" : "h-32"} rounded-md object-cover w-full`} 
        src={image} 
        alt={title} 
      />

      <div className='flex flex-col gap-1.5'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        {newsPageOnly && canBeBig && newsItem && <h2 className='text-lg font-medium'>{newsItem.NewsSubTitle}</h2>}
        <p className={`text-black ${canBeBig ? "text-lg " : "text-sm line-clamp-3"}`}>
          {officeName}
        </p>
        <p className={`text-[#3C3C43] ${canBeBig ? "text-lg " : "text-sm line-clamp-3"}`}>
          {descirption}
        </p>

        {newsPageOnly && canBeBig && newsItem && (
          <div className="mt-4 text-[#3C3C43] space-y-2">
            <p><span className="font-semibold">نوع الخبر:</span> {newsItem.NewsTypeName}</p>
            <p><span className="font-semibold">اسم المكتب:</span> {newsItem.OfficeName}</p>
            {/* <p><span className="font-semibold">المستخدم:</span> {newsItem.UserName}</p> */}
            <p><span className="font-semibold">تاريخ النشر:</span> {new Date(newsItem.NewsPublishDate).toLocaleDateString('en-US')}</p>
            <p><span className="font-semibold">تاريخ الإنشاء:</span> {new Date(newsItem.NewsCreateDate).toLocaleDateString('en-US')}</p>
          </div>
        )}

        {!canBeBig && (
          <button 
            onClick={detailClick} 
            className="mt-6 flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E]"
          >
            التفاصيل
          </button>
        )}
      </div>
    </div>
  )
}

NewsCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  descirption: PropTypes.string.isRequired,
  canBeBig: PropTypes.bool,
  detailClick: PropTypes.any,
  newsPageOnly: PropTypes.bool,
  className: PropTypes.string,
  newsItem: PropTypes.object,
  officeName:PropTypes.string
};

export default NewsCard;
