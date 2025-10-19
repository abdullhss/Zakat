/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import NewsCard from '../../../../components/NewsCard'
import { executeProcedure } from '../../../../services/apiServices'
import back from "../../../../public/SVGs/Back.svg"

const NewsTab = ({ Officeid, onOpenDetail }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNewsCount, setTotalNewsCount] = useState(0);
  const [expandedNewsId, setExpandedNewsId] = useState(null);

  const countPerPage = 6;

  useEffect(() => {
    if (Officeid) fetchNewsData();
  }, [currentPage, Officeid]);

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      const startNumberfromPagination = (currentPage - 1) * countPerPage + 1;
      const response = await executeProcedure(
        "EFhaK17XzchWc0b1xMCfIgqSVpriDBJx07x8Eju955s=",
        `${Officeid}#${startNumberfromPagination}#${countPerPage}`
      );

      if (response && response.decrypted) {
        const newsDataString = response.decrypted.NewsData || "[]";
        const newsData = JSON.parse(newsDataString);
        const totalCount = parseInt(response.decrypted.NewsCount || "0");
        setNews(newsData);
        setTotalNewsCount(totalCount);
        setTotalPages(Math.ceil(totalCount / countPerPage));
      } else {
        setNews([]);
        setTotalNewsCount(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      setTotalNewsCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (newsId) => setExpandedNewsId(newsId);
  const handleBackClick = () => setExpandedNewsId(null);
  const expandedNews = expandedNewsId ? news.find(item => item.Id === expandedNewsId) : null;

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      {/* Loading */}
      {loading ? (
        <div className="text-center py-8">
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            جاري تحميل الأخبار...
          </motion.p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {expandedNews ? (
            // Expanded view
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.4 }}
              className="px-6 lg:px-12 mt-6"
            >
              <NewsCard
                key={expandedNews.Id}
                canBeBig={true}
                detailClick={() => {}}
                title={expandedNews.NewsMainTitle}
                descirption={expandedNews.NewsContents}
                image={`https://framework.md-license.com:8093/ZakatImages/${expandedNews.NewsMainPhotoName}.jpg`}
                className="w-full"
              />
              <motion.button
                onClick={handleBackClick}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 py-2 px-4 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E] mt-6"
              >
                <img className='w-5' src={back} alt="back" />
                رجوع
              </motion.button>
            </motion.div>
          ) : news.length > 0 ? (
            // Grid view
            <motion.div
              key={`page-${currentPage}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className='grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-12 gap-6 mt-6'
            >
              {news.map((item, index) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NewsCard
                    canBeBig={false}
                    detailClick={() => handleDetailClick(item.Id)}
                    title={item.NewsMainTitle}
                    descirption={item.NewsContents}
                    image={`https://framework.md-license.com:8093/ZakatImages/${item.NewsMainPhotoName}.jpg`}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">لا توجد أخبار متاحة حالياً</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!loading && !expandedNewsId && totalNewsCount > 0 && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between px-8 py-6"
        >
          <div className="flex items-center gap-2 mx-auto">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`p-2 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 rounded'}`}
            >
              <svg className={`w-5 h-5 rotate-180 ${currentPage <= 1 ? 'opacity-50' : 'text-[#17343B]'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
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
                    </motion.button>
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
              <svg className={`w-5 h-5 ${currentPage >= totalPages ? 'opacity-50' : 'text-[#17343B]'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default NewsTab
