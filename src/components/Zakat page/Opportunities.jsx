import React from "react";
import PropTypes from "prop-types";
import Diamond from "../Diamond";
import checklist from "../../public/SVGs/checklist.svg"
import filter from "../../public/SVGs/fillter.svg"
import Arrow from "../../public/SVGs/Arrow.svg"
import { Search } from "lucide-react";
import DonationCard from "../DonationCard"
import { useLocation } from "react-router-dom";
import { useImageContext } from '../../Context/imageContext.jsx';
const Opportunities = ({ 
  donations = [], 
  loading = false, 
  error = null,
  currentPage = 1,
  totalProjectsCount = 0,
  onPageChange,
  donationValue=0,
  setZakatSearch ,
  zakatSearch
}) => {
  const { images } = useImageContext();
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  const actionID = path === "zakat" ? 1 : path === "sadaka" ? 2 : 0;

  // Pagination logic - use totalProjectsCount from API
  const cardsPerPage = 6;
  const totalPages = Math.ceil(totalProjectsCount / cardsPerPage);
  
  // Get current donations for the page (already sliced by API)
  const currentDonations = donations;

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Render donation cards or loading/error state
  const renderDonationCards = () => {
    if (loading) return [];

      // عرض المشاريع لو موجودة
      return currentDonations.map((project) => (
        <DonationCard
          key={project.Id}
          image={`${images}/${project.PhotoName}.jpg`}
          title={project.Name}
          description={project.Description}
          collected={project.OpeningBalance}
          goal={project.WantedAmount}
          className="bg-white"
          payNowLink={`/project?Id=${project.Id}&actionID=${actionID}&donationValue=${donationValue}`}
          showBtn={project.AllowZakat}
        />
      ));

  };

  return (
    <div className="flex flex-col gap-6">
      {/* Zakat header */}
        <div className="flex items-center justify-between pl-12">
            <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
            <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
            المشاريع
            </div>
        </div>
        <div className="flex flex-col gap-6 px-2 lg:px-24">
                <div className="flex flex-col items-start md:flex-row md:items-center gap-6">
                    {/* Search Bar */}
                    <div className="flex flex-1 items-center gap-2 bg-[#E5E9EA] border border-gray-300 rounded-lg px-3 py-2 w-72">
                        <Search className="w-5 h-5" />
                        <input
                        value={zakatSearch}
                        onChange={(e)=>{setZakatSearch(e.target.value)}}
                        type="text"
                        placeholder="ابحث هنا ..."
                        className="flex-1 placeholder:text-black placeholder:font-bold bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                        <img src={filter} alt="بحث" className="w-5 h-5" />
                    </div>

                    {/* <button
                        className="flex items-center gap-2 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
                        style={{
                        background:
                            "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        <span>الفرص المكتملة</span>
                        <img src={checklist} alt="قائمة" className="w-5 h-5" />
                    </button> */}
                </div>
                <div>
                    {/* DonationCard grid - max 6 cards (3 per row) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {renderDonationCards()}
                    </div>
                </div>
                {/* pagination - Only show if there are donations */}
                {totalProjectsCount > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevPage} disabled={currentPage <= 1}>
                          <img 
                            src={Arrow} 
                            className={`rotate-180 ${currentPage <= 1 ? 'opacity-50' : ''}` }
                            alt="الصفحة التالية"
                          />
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => onPageChange(index + 1)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                              currentPage === index + 1 ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                              background:
                                "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                          >
                            {index + 1}
                          </button>
                        ))}
                        
                        <button  onClick={handleNextPage}  disabled={currentPage >= totalPages} >
                          <img 
                            src={Arrow} 
                            className={`${currentPage >= totalPages ? 'opacity-50' : ''}`}

                            alt="الصفحة السابقة"
                          />
                        </button>
                    </div>
                  </div>
                )}
        </div>
    </div>
  );
};

Opportunities.propTypes = {
  donations: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  currentPage: PropTypes.number,
  totalProjectsCount: PropTypes.number,
  onPageChange: PropTypes.func,
  donationValue:PropTypes.number,
  setZakatSearch : PropTypes.func,
  zakatSearch:PropTypes.string
};

Opportunities.defaultProps = {
  donations: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalProjectsCount: 0,
  donationValue:0,
  onPageChange: () => {},
  setZakatSearch : ()=>{},
  zakatSearch:""
};

export default Opportunities;