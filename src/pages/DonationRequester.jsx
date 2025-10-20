import React, { useEffect, useState } from 'react'
import Diamond from '../components/Diamond'
import DonationRequestState from '../components/DonationRequestState';
import { executeProcedure } from '../services/apiServices';

const DonationRequester = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [donationsData, setDonationsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 6;

    // Safely get user ID from localStorage
    const getUserID = () => {
        try {
            const userData = localStorage.getItem('UserData');
            if (!userData) {
                return null;
            }
            const parsedData = JSON.parse(userData);
            return parsedData?.Id || null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    };

    const userid = getUserID();

    useEffect(() => {
        const getMyDonations = async() => {
            // Clear previous data and errors
            setDonationsData([]);
            setError(null);
            setIsLoading(true);

            // Check if user ID exists
            if (!userid) {
                setError('لم يتم العثور على بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.');
                setIsLoading(false);
                return;
            }

            // Map tab to status symbol
            const statusSymbol = {
                'pending': 'S',  // معلق
                'accepted': 'A', // مقبول
                'rejected': 'R'  // مرفوض
            }[activeTab];

            
            
            try {
                const response = await executeProcedure(
                    "rdnUGkRMST7dHq1V0H9KoYvdHrP0kCHyTr4b3fuITxw=",
                    `${userid}#${statusSymbol}#${currentPage}#${pageSize}`
                );
                
                
                

                if (response.decrypted) {
                    try {
                        // Parse the AssistancesData string into actual array
                        const parsedData = JSON.parse(response.decrypted.AssistancesData);
                        setDonationsData(parsedData);
                        
                        // Calculate total pages based on count and page size
                        const count = parseInt(response.decrypted.AssistancesCount);
                        setTotalCount(count);
                        setTotalPages(Math.ceil(count / pageSize));
                        
                    } catch (error) {
                        console.error('Error parsing donations data:', error);
                        setError('حدث خطأ في تحويل بيانات التبرعات.');
                        setDonationsData([]);
                    }
                } else {
                    setError('لم يتم استلام بيانات من الخادم.');
                }
            } catch (error) {
                console.error('Error fetching donations:', error);
                setError('حدث خطأ في جلب بيانات التبرعات. يرجى المحاولة مرة أخرى.');
            } finally {
                setIsLoading(false);
            }
        }
        getMyDonations();
    }, [activeTab, currentPage, userid]);

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Show error message if no user ID
    if (!userid) {
        return (
            <div className="relative overflow-hidden min-h-screen flex items-center justify-center"
                style={{
                    backgroundImage: "url('/background pattern.png')",
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto",
                }}
            >
                <div className="z-10 mx-auto px-4 text-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">بيانات المستخدم غير متوفرة</h2>
                        <p className="text-gray-600 mb-6">لم يتم العثور على بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        >
                            إعادة تحميل الصفحة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden"
            style={{
                backgroundImage: "url('/background pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
            }}
        >
            <div className="z-10 mx-auto px-4 flex flex-col gap-4">
                <div className="flex items-center justify-between pl-12 mt-28">
                    <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                        <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
                        طلبات التبرع
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex items-center gap-6 mt-8 px-8'>
                <button 
                    onClick={() => {
                        setActiveTab('pending');
                        setCurrentPage(1);
                    }}
                    className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                        activeTab === 'pending' 
                        ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                        : 'bg-[#C9C9C9] text-[#3C3C3C]'
                    }`}
                >
                    المعلقة
                </button>
                <button 
                    onClick={() => {
                        setActiveTab('accepted');
                        setCurrentPage(1);
                    }}
                    className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                        activeTab === 'accepted' 
                        ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                        : 'bg-[#C9C9C9] text-[#3C3C3C]'
                    }`}
                >
                    المقبولة
                </button>  
                <button 
                    onClick={() => {
                        setActiveTab('rejected');
                        setCurrentPage(1);
                    }}
                    className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                        activeTab === 'rejected' 
                        ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                        : 'bg-[#C9C9C9] text-[#3C3C3C]'
                    }`}
                >
                    المرفوضة
                </button>  
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24645E]"></div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="text-center py-8 px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="text-red-500 text-lg mb-2">⚠️</div>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Donations Grid */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-8 mb-16">
                    {donationsData.length > 0 ? (
                        donationsData.map((donation) => (
                            <DonationRequestState 
                                key={donation.Id}
                                data={donation}
                                status={activeTab} // Pass the current tab as status
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            لا توجد طلبات في هذا القسم
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && totalCount > 0 && totalPages > 1 && (
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
        </div>
    )
}

export default DonationRequester