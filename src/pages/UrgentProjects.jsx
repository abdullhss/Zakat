import React, { useState, useEffect } from 'react'
import Diamond from '../components/Diamond'
import filter from "../public/SVGs/fillter.svg"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import DonationCard from '../components/DonationCard'
import { executeProcedure } from "../services/apiServices"
import { useImageContext } from '../Context/imageContext.jsx';
const UrgentProjects = () => {
  const [donationCards, setDonationCards] = useState([])
  const [offices, setOffices] = useState([])
  const [selectedOfficeId, setSelectedOfficeId] = useState(0) // Default to 0 for "الكل"
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjectsCount, setTotalProjectsCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingOffices, setLoadingOffices] = useState(false)
  const itemsPerPage = 12
  const { images } = useImageContext();
  // Fetch offices on component mount
  useEffect(() => {
    const fetchOffices = async () => {
      setLoadingOffices(true)
      try {
        const response = await executeProcedure(
          "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
          "0"
        )
        
        if (response && response.decrypted) {
          const data = response.decrypted
          
          // Check if OfficesData exists and parse it
          if (data.OfficesData) {
            try {
              const officesData = typeof data.OfficesData === 'string' 
                ? JSON.parse(data.OfficesData) 
                : data.OfficesData
              
              setOffices(Array.isArray(officesData) ? officesData : [])
            } catch (parseError) {
              console.error("Error parsing OfficesData:", parseError)
              setOffices([])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching offices:", error)
        setOffices([])
      } finally {
        setLoadingOffices(false)
      }
    }

    fetchOffices()
  }, [])

  // Fetch donation cards when page or office filter changes
  useEffect(() => {
    const fetchDonationCards = async () => {
      setLoading(true)
      try {
        const startNum = (currentPage - 1) * itemsPerPage + 1
        const params = `${selectedOfficeId}#${startNum}#${itemsPerPage}`
        
        const response = await executeProcedure(
          "VhHmn+1EDh7y7eor+QB6x6Sr9C8GNNtWwSOKT9ErVP4=",
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
          setTotalPages(Math.ceil(totalCount / itemsPerPage))
        }
      } catch (error) {
        console.error("Error fetching donation cards:", error)
        setDonationCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchDonationCards()
  }, [currentPage, itemsPerPage, selectedOfficeId])

  const handleOfficeChange = (e) => {
    const officeId = parseInt(e.target.value)
    setSelectedOfficeId(officeId)
    setCurrentPage(1) // Reset to first page when filter changes
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
      <div className="flex items-center justify-between px-4 sm:pl-12 mt-24 md:mt-28">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl md:text-2xl px-6 sm:px-8 py-2">
          <Diamond className="absolute -right-4 shadow-lg top-1/2 -translate-y-1/2 translate-x-1/4" />
          المشاريع
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='px-8 mt-8 border-b border-[#878787] pb-4'>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Office Filter Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={selectedOfficeId}
              onChange={handleOfficeChange}
              className="w-full md:w-48 bg-[#E5E9EA] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 outline-none"
              disabled={loadingOffices}
            >
              <option value={0}>الكل</option>
              {offices.map((office) => (
                <option key={office.Id} value={office.Id}>
                  {office.OfficeName || office.Name || `المكتب ${office.Id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
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
                  image={`${images}/${card.PhotoName}.jpg`}
                  title={card.Name}
                  payNowLink={`/project?Id=${card.Id}&actionID=${0}`}
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

export default UrgentProjects