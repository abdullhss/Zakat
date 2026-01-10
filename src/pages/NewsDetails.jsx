import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NewsCard from '../components/NewsCard'
import Back from "../public/SVGs/Back.svg"
import { motion } from "framer-motion"

const NewsDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { newsItem } = location.state || {}

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: "url('/background pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">No news data found</h2>
          <button 
            onClick={handleBack}
            className="mt-4 flex items-center gap-2 mx-auto px-6 py-2 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E] hover:opacity-90"
          >
            <img src={Back} alt="Back" />
            رجوع
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-auto">
      <div
        className="min-h-screen"
        style={{
          backgroundImage: "url('/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <motion.div
          className="flex flex-col items-start mx-8 my-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NewsCard
            image={`https://framework.md-license.com:8093/ZakatImages/${newsItem.NewsMainPhotoName}.jpg`}
            title={newsItem.NewsMainTitle}
            descirption={newsItem.NewsContents}
            canBeBig={true}
            newsPageOnly={true}
            newsItem={newsItem}
            className={"w-full"}
          />

          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 mt-8 px-6 py-2 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E] hover:opacity-90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={Back} alt="Back" />
            رجوع
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default NewsDetails