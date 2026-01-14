import React, { useEffect, useState } from 'react'
import { executeProcedure } from '../services/apiServices'
import Diamond from '../components/Diamond'
import { useImageContext } from '../Context/imageContext.jsx';
const TermsAndConditions = () => {
    const [lawsData, setLawsData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const { images } = useImageContext();
    const totalPages = Math.ceil(totalCount / itemsPerPage)

    useEffect(() => {
        const getdata = async () => {
            try {
                setLoading(true)
                const response = await executeProcedure("gNiwffLjwkGYrxoUNi+znQ==", `${currentPage}#${itemsPerPage}`)
                
                if (response && response.decrypted) {
                    const data = response.decrypted
                    
                    // Parse the LawsData string to array
                    if (data.LawsData) {
                        try {
                            const parsedData = typeof data.LawsData === 'string' 
                                ? JSON.parse(data.LawsData) 
                                : data.LawsData
                            
                            setLawsData(Array.isArray(parsedData) ? parsedData : [])
                        } catch (parseError) {
                            console.error("Error parsing LawsData:", parseError)
                            setLawsData([])
                        }
                    }
                    
                    // Set total count
                    if (data.LawsCount) {
                        setTotalCount(parseInt(data.LawsCount) || 0)
                    }
                }
            } catch (error) {
                console.error("Error fetching laws data:", error)
                setLawsData([])
            } finally {
                setLoading(false)
            }
        }
        getdata()
    }, [currentPage, itemsPerPage])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className='overflow-hidden min-h-screen'
                style={{
                    backgroundImage: "url('/background pattern.png')",
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto",
                }}
            >
                <div className="flex items-center justify-between pl-12 mt-28">
                    <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                        <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
                        الشروط والأحكام
                    </div>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-xl animate-pulse">جارٍ التحميل...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='overflow-hidden min-h-screen'
            style={{
                backgroundImage: "url('/background pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
            }}
        >
            <div className="flex items-center justify-between pl-12 mt-28">
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                    <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
                    اللوائح و القوانين
                </div>
            </div>
            
            <div className='w-full px-4 md:px-12 mt-8 mb-8'>
                {lawsData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">لا توجد قوانين أو شروط متاحة حالياً</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6">
                            {lawsData.map((law, index) => (
                                <div 
                                    key={law.Id} 
                                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                        <h3 className="text-xl font-bold text-emerald-700 mb-2 md:mb-0">
                                            {law.LawTitle}
                                        </h3>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {formatDate(law.LawDate)}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                                        {law.LawText}
                                    </p>
                                    
                                    {law.LawAttachFileId && law.LawAttachFileName && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <a 
                                                href={`${images}/${law.LawAttachFileName}.pdf`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                تحميل الملف المرفق
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalCount > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between px-8 py-6 mt-8">
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
            </div>
        </div>
    )
}

export default TermsAndConditions