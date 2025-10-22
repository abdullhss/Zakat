import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { executeProcedure } from '../services/apiServices'
import NewsCard from '../components/NewsCard';
import Back from "../public/SVGs/Back.svg"
import { motion, AnimatePresence } from "framer-motion";

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNewsCount, setTotalNewsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const startItemOfpagination = ((currentPage - 1) * itemsPerPage) + 1;

        const response = await executeProcedure(
          "EFhaK17XzchWc0b1xMCfIgqSVpriDBJx07x8Eju955s=",
          `0#${startItemOfpagination}#${itemsPerPage}`
        );

        if (response.decrypted && response.decrypted.NewsData) {
          const parsedNews = JSON.parse(response.decrypted.NewsData);
          setNews(parsedNews);

          const newsCount = parseInt(response.decrypted.NewsCount);
          setTotalNewsCount(newsCount);

          const pages = Math.ceil(newsCount / itemsPerPage);
          setTotalPages(pages);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewsDetails = (item) => {
    // Navigate to news details page with the news data
    navigate('/news/details', { 
      state: { newsItem: item } 
    });
  };

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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="news-list grid grid-cols-1 lg:grid-cols-2 gap-6 my-8 mx-8">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NewsCard
                  title={item.NewsMainTitle}
                  descirption={item.NewsContents}
                  image={`https://framework.md-license.com:8093/ZakatImages/${item.NewsMainPhotoName}${item.AttachmentFileExt}`}
                  detailClick={() => handleNewsDetails(item)}
                  canBeBig={false}
                />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-between px-8 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mx-auto">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className={`p-2 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 rounded'}`}
                >
                  <svg
                    className={`w-5 h-5 rotate-180 ${currentPage <= 1 ? 'opacity-50' : 'text-[#17343B]'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`text-sm py-1 px-3 rounded-md transition-all ${currentPage === pageNumber
                            ? 'text-white shadow-lg'
                            : 'text-[#17343B] bg-gray-100 hover:bg-gray-200'
                            }`}
                          style={{
                            background: currentPage === pageNumber
                              ? "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)"
                              : ''
                          }}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-1 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className={`p-2 ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 rounded'}`}
                >
                  <svg
                    className={`w-5 h-5 ${currentPage >= totalPages ? 'opacity-50' : 'text-[#17343B]'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default News;