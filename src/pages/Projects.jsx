import React, { useState, useRef, useEffect } from 'react'
import Diamond from '../components/Diamond'
import filter from "../public/SVGs/fillter.svg"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import DonationCard from '../components/DonationCard'
import { executeProcedure } from "../services/apiServices"

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState(0)
  const [filters, setFilters] = useState([])
  const [donationCards, setDonationCards] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjectsCount, setTotalProjectsCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const showLeftArrow =true
  const showRightArrow= true

  const filtersContainerRef = useRef(null)
  const itemsPerPage = 12

  // Check scroll position to show/hide arrows
  // const checkScrollPosition = () => {
  //   const container = filtersContainerRef.current
  //   if (container) {
  //     setShowLeftArrow(container.scrollLeft > 0)
  //     setShowRightArrow(
  //       container.scrollLeft < container.scrollWidth - container.clientWidth - 10
  //     )
  //   }
  // }

  // Scroll handlers
  const scrollLeft = () => {
    if (filtersContainerRef.current) {
      const container = filtersContainerRef.current
      const itemWidth = container.scrollWidth / filters.length
      container.scrollBy({ left: -itemWidth * 4, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (filtersContainerRef.current) {
      const container = filtersContainerRef.current
      const itemWidth = container.scrollWidth / filters.length
      container.scrollBy({ left: itemWidth * 4, behavior: 'smooth' })
    }
  }


  // Fetch filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await executeProcedure(
          "CjSj0j5kAa/aqk9LMpWvCavGukOw8WsDmvfzbXkXVaI=",
          "1#100"
        )
        
        
        
        if (response && response.decrypted && response.decrypted.SubventionTypesData) {
          const parsedFilters = JSON.parse(response.decrypted.SubventionTypesData)
          
          
          const allFilter = { Id: 0, SubventionTypeName: "الكل" }
          const filterObjects = [allFilter, ...parsedFilters]
          
          setFilters(filterObjects)
          setActiveFilter(0)
        }
      } catch (error) {
        console.error("Error fetching filters:", error)
      }
    }

    fetchFilters()
  }, [])

  // Fetch donation cards when filter or page changes
  useEffect(() => {
    const fetchDonationCards = async () => {
      if (activeFilter === null || activeFilter === undefined) return;
      
      setLoading(true)
      try {
        const startNum = (currentPage - 1) * itemsPerPage + 1
        const params = `O#${activeFilter}#${startNum}#${itemsPerPage}`
        
        
        
        const response = await executeProcedure(
          "B0/KqqIyiS3j4lbxUKXJCw==",
          params
        )
        
        
        
        if (response && response.decrypted) {
          const projectsDataString = response.decrypted.ProjectsData
          let cardsData = []
          let totalCount = 0
          
          if (projectsDataString) {
            cardsData = JSON.parse(projectsDataString)
            totalCount = response.decrypted.totalCount || cardsData.length || 0
          }
          
          
          
          setDonationCards(Array.isArray(cardsData) ? cardsData : [])
          setTotalProjectsCount(totalCount)
          setTotalPages(Math.ceil(response.decrypted.ProjectsCount / itemsPerPage))
        }
      } catch (error) {
        console.error("Error fetching donation cards:", error)
        setDonationCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchDonationCards()
  }, [activeFilter, currentPage, itemsPerPage])

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    setCurrentPage(1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="relative overflow-hidden"
    style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
    >
      <div 
          className="flex items-center justify-between px-4 sm:pl-12 mt-24 md:mt-28"
      >
          <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl md:text-2xl px-6 sm:px-8 py-2">
              <Diamond className="absolute  -right-4 shadow-lg top-1/2 -translate-y-1/2 translate-x-1/4" />
              المشاريع
          </div>
      </div>

      
      {/* Filters with Scroll - Show exactly 4 filters at a time */}
      <div className='relative mt-6 mx-8 border-b border-[#878787]'>
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5 text-[#17343B]" />
          </button>
        )}
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ChevronRight className="w-5 h-5 text-[#17343B]" />
          </button>
        )}

        {/* Filters Container - Limited to show 4 filters at a time */}
        <div
          ref={filtersContainerRef}
          // onScroll={checkScrollPosition}
          className="flex items-center gap-8 overflow-x-auto scrollbar-hide py-2 px-8"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          {filters.map((filter) => (
            <span
              key={filter.Id}
              onClick={() => handleFilterChange(filter.Id)}
              className={`relative whitespace-nowrap py-1 cursor-pointer transition-colors duration-300 flex-shrink-0 min-w-[calc(25%-1.5rem)] text-center ${
                activeFilter === filter.Id 
                  ? 'text-[#17343B] font-bold' 
                  : 'text-[#878787] font-bold hover:text-[#17343B]/70'
              }`}
            >
              {filter.SubventionTypeName}
              {activeFilter === filter.Id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#17343B] animate-[slideIn_0.3s_ease-out]" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className='px-8 mt-4'>
        <div className="w-full flex flex-1 items-center gap-2 bg-[#E5E9EA] border border-gray-300 rounded-lg px-3 py-2">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث هنا ..."
            className="flex-1 placeholder:text-black placeholder:font-bold bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <img src={filter} alt="بحث" className="w-5 h-5" />
        </div>
      </div>

      {/* Donation Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-[#17343B]">جاري التحميل...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {donationCards.length > 0 ? (
              donationCards.map((card, index) => (
                <DonationCard
                  key={card.Id || index}
                  collected={card.OpeningBalance}
                  description={card.Description}
                  goal={card.WantedAmount}
                  image={`https://framework.md-license.com:8093/ZakatImages/${card.PhotoName}.jpg`}
                  title={card.Name}
                  payNowLink={`/project?data=${JSON.stringify({ ...card, actionID: 0 })}`}
                  showBtn={card.AllowZakat}
                />
              ))
            ) : (
              !loading && (
                <div className="col-span-full text-center py-12 text-[#17343B]">
                  لا توجد مشاريع متاحة حالياً
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          {totalProjectsCount > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage <= 1}
                  className="p-2"
                >
                  <svg 
                    className={`w-5 h-5 rotate-180 ${currentPage <= 1 ? 'opacity-50' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                      currentPage === index + 1 ? 'opacity-100' : 'opacity-80'
                    }`}
                    style={{
                      background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage >= totalPages}
                  className="p-2"
                >
                  <svg 
                    className={`w-5 h-5 ${currentPage >= totalPages ? 'opacity-50' : ''}`}
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
      

      <div className="rightBow"></div>
      <div className="leftBow"></div>
    </div>
  )
}

export default Projects