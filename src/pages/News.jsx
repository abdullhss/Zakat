import React, { useEffect, useState } from 'react'
import { executeProcedure } from '../services/apiServices'
import NewsCard from '../components/NewsCard';
import Back from "../public/SVGs/Back.svg"

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNewsCount, setTotalNewsCount] = useState(0);

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

  console.log(selectedNews);
  
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
    setSelectedNews(item);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 لما يفتح الخبر يطلع لفوق
  };

  const handleBack = () => {
    setSelectedNews(null);
  };

  return (
    <div className="relative overflow-hidden">
        <div
            className="min-h-screen"
            style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            }}
        >
            {selectedNews ? (
            <div className="flex flex-col items-start mx-8 my-10">
                <NewsCard
                image={`https://framework.md-license.com:8093/ZakatImages/${selectedNews.NewsMainPhotoName}${selectedNews.AttachmentFileExt}`}
                title={selectedNews.NewsMainTitle}
                descirption={selectedNews.NewsContents}
                canBeBig={true}
                newsPageOnly={true}
                newsItem={selectedNews}
                />

                <button
                onClick={handleBack}
                className="flex items-center gap-2 mt-8 px-6 py-2 rounded-lg text-white bg-gradient-to-b from-[#17343B] via-[#18383D] to-[#24645E] hover:opacity-90"
                >
                    <img src={Back}></img>
                    رجوع
                </button>
            </div>
            ) : (
            <>
                <div className="news-list grid grid-cols-1 lg:grid-cols-2 gap-6 my-8 mx-8">
                {news.map((item, index) => (
                    <NewsCard
                    key={index}
                    title={item.NewsMainTitle}
                    descirption={item.NewsContents}
                    image={`https://framework.md-license.com:8093/ZakatImages/${item.NewsMainPhotoName}${item.AttachmentFileExt}`}
                    detailClick={() => handleNewsDetails(item)}
                    canBeBig={false}
                    />
                ))}
                </div>

                {totalPages > 1 && (
                <div className="flex items-center justify-between px-8 py-6">
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
                </div>
                )}
            </>
            )}
        </div>
    </div>
  );
};

export default News;
