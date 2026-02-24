import React, { useEffect, useState } from 'react'
import Diamond from "../components/Diamond";
import { PlusIcon, Search } from "lucide-react";
import filter from "../public/SVGs/fillter.svg"
import { useDispatch } from 'react-redux';
import { setShowPopup, setPopupComponent , setPopupTitle} from "../features/PaySlice/PaySlice";
import CreateCampaign from '../components/CreateCampaign';
import { toast } from 'react-toastify';
import DonationCard from '../components/DonationCard';
import { executeProcedure } from '../services/apiServices';
import { useImageContext } from '../Context/imageContext.jsx';
import NewHeader from '../features/home/components/NewHeader'
import headerBackground from "../../public/header backgrounds/sofaraa 5er.png"
const pageSize = 6 ;
const Campaigns = () => {
    const [activeTab, setActiveTab] = useState('donation');
    const dispatch = useDispatch();
    const UserData = JSON.parse(localStorage.getItem("UserData"));
    const { images } = useImageContext();
    // Pagination states for donation campaigns
    const [donationCurrentPage, setDonationCurrentPage] = useState(1);
    const [donationTotalPages, setDonationTotalPages] = useState(0);
    const [donationCampaigns, setDonationCampaigns] = useState([]);
    const [donationTotalCount, setDonationTotalCount] = useState(0);
    console.log(donationCampaigns);
    
    // Pagination states for my campaigns
    const [myCampaignsCurrentPage, setMyCampaignsCurrentPage] = useState(1);
    const [myCampaignsTotalPages, setMyCampaignsTotalPages] = useState(0);
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [myCampaignsTotalCount, setMyCampaignsTotalCount] = useState(0);

    const handleCreateCampaign = () => {
        if(UserData){
            dispatch(setPopupTitle('إنشاء حملة'));
            dispatch(setPopupComponent(
                <CreateCampaign/>
            )); 
            dispatch(setShowPopup(true));
        }
        else{
            toast.error("برجاء تسجيل الدخول اولا")
        }
    }

    // Get donation campaigns data from backend
// Get donation campaigns data from backend
useEffect(() => {
    const fetchDonationCampaigns = async () => {
        try {
            const response = await executeProcedure(
                "792hE7jGjfELBbjahPuEaeKSFknF+Bg3QdRnCfJ7ssk=",
                `${(donationCurrentPage - 1)*pageSize + 1}#${pageSize}`
            );
            
            
            // Fix: Parse the JSON string to array
            const campaignsData = JSON.parse(response.decrypted.CampaignsData);
            setDonationCampaigns(campaignsData);
            setDonationTotalCount(response.decrypted.CampaignsCount || 0);
            setDonationTotalPages(Math.ceil((response.decrypted.CampaignsCount || 0) / pageSize));
        } catch (error) {
            console.error("Error fetching donation campaigns:", error);
            // Set to empty array on error to prevent map errors
            setDonationCampaigns([]);
        }
    };

    if (activeTab === 'donation') {
        fetchDonationCampaigns();
    }
}, [donationCurrentPage, activeTab]);

// Get self user campaigns data from backend
useEffect(() => {
    const fetchMyCampaigns = async () => {
        try {
            if (!UserData?.Id) return;
            
            const response = await executeProcedure(
                "uIcc/W+fVBc3HevZNS9f4AzhqGV1bGCighxc8yfJRmk=",
                `${UserData.Id}#${(myCampaignsCurrentPage - 1)*pageSize + 1}#${pageSize}`
            );
                ``
            
            
            // Fix: Parse the JSON string to array and fix the count
            const myCampaignsData = JSON.parse(response.decrypted.CampaignsData);
            setMyCampaigns(myCampaignsData);
            setMyCampaignsTotalCount(response.decrypted.CampaignsCount || 0); // Fixed: should be UserCampaignsCount, not UserCampaignsData
            setMyCampaignsTotalPages(Math.ceil((response.decrypted.CampaignsCount || 0) / pageSize));
        } catch (error) {
            console.error("Error fetching my campaigns:", error);
            // Set to empty array on error to prevent map errors
            setMyCampaigns([]);
        }
    };

    if (activeTab === 'myCampaigns' && UserData?.Id) {
        fetchMyCampaigns();
    }
}, [myCampaignsCurrentPage, activeTab]);
    // Pagination handlers for donation campaigns
    const handleDonationPrevPage = () => {
        if (donationCurrentPage > 1) {
            setDonationCurrentPage(donationCurrentPage - 1);
        }
    };

    const handleDonationNextPage = () => {
        if (donationCurrentPage < donationTotalPages) {
            setDonationCurrentPage(donationCurrentPage + 1);
        }
    };

    const handleDonationPageChange = (page) => {
        setDonationCurrentPage(page);
    };

    // Pagination handlers for my campaigns
    const handleMyCampaignsPrevPage = () => {
        if (myCampaignsCurrentPage > 1) {
            setMyCampaignsCurrentPage(myCampaignsCurrentPage - 1);
        }
    };

    const handleMyCampaignsNextPage = () => {
        if (myCampaignsCurrentPage < myCampaignsTotalPages) {
            setMyCampaignsCurrentPage(myCampaignsCurrentPage + 1);
        }
    };

    const handleMyCampaignsPageChange = (page) => {
        setMyCampaignsCurrentPage(page);
    };
    
    // Helper function to render pagination buttons
    const renderPaginationButtons = (currentPage, totalPages, handlePageChange) => {
        if (totalPages <= 1) return null;

        const buttons = [];
        const maxVisiblePages = 4;

        if (totalPages <= maxVisiblePages) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                            currentPage === i ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Show limited pages with ellipsis
            if (currentPage <= 3) {
                // Show first 3 pages and last page
                for (let i = 1; i <= 3; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                                currentPage === i ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                                background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                        >
                            {i}
                        </button>
                    );
                }
                buttons.push(<span key="ellipsis" className="px-2">...</span>);
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                            currentPage === totalPages ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        {totalPages}
                    </button>
                );
            } else if (currentPage >= totalPages - 2) {
                // Show first page and last 3 pages
                buttons.push(
                    <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                            currentPage === 1 ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        1
                    </button>
                );
                buttons.push(<span key="ellipsis" className="px-2">...</span>);
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                                currentPage === i ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                                background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                        >
                            {i}
                        </button>
                    );
                }
            } else {
                // Show first page, current page-1, current page, current page+1, last page
                buttons.push(
                    <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className="text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center opacity-80"
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        1
                    </button>
                );
                buttons.push(<span key="ellipsis1" className="px-2">...</span>);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center ${
                                currentPage === i ? 'opacity-100' : 'opacity-80'
                            }`}
                            style={{
                                background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                            }}
                        >
                            {i}
                        </button>
                    );
                }
                buttons.push(<span key="ellipsis2" className="px-2">...</span>);
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="text-white text-sm p-0.5 px-3 rounded-md shadow-md flex items-center justify-center opacity-80"
                        style={{
                            background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)",
                        }}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return buttons;
    };

    return (
        <div className="relative overflow-hidden">
            <div className='mt-20'>
        <NewHeader backgroundImage={headerBackground}/>
      </div>
            <div
            className="z-10 mx-auto px-4 flex flex-col gap-4"
            style={{
                backgroundImage: "url('/background pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
                backgroundPosition: "center",
            }}
            >
                <div className="flex items-center justify-between pl-12 mt-28">
                    <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                    <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
                    سفراء الخير
                    </div>
                </div>

                <div className='flex items-center gap-6'>
                    {/* Search Bar */}
                    <div className="flex flex-1 items-center gap-2 bg-[#E5E9EA] border border-gray-300 rounded-lg px-3 py-2 w-72">
                        <Search className="w-5 h-5" />
                        <input
                        type="text"
                        placeholder="ابحث هنا ..."
                        className="flex-1 placeholder:text-black placeholder:font-bold bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                        <img src={filter} alt="بحث" className=" w-5 h-5" />
                    </div>
                    <div>
                        <button onClick={handleCreateCampaign} className='flex items-center bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] gap-2 text-white font-semibold py-2 px-5 rounded-lg shadow-md'>
                            <PlusIcon size={20} className='text-[#17343B] bg-white rounded-md'/>
                            إنشاء حملة
                        </button>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className='flex items-center gap-6 mt-8'>
                    <button 
                    onClick={() => setActiveTab('donation')}
                    className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                        activeTab === 'donation' 
                        ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                        : 'bg-[#C9C9C9] text-[#3C3C3C]'
                    }`}
                    >
                    حملات التبرع
                    </button>
                    <button 
                    onClick={() => {UserData?setActiveTab('myCampaigns'):toast.error("برجاء تسجيل الدخول اولا")}}
                    className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                        activeTab === 'myCampaigns' 
                        ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                        : 'bg-[#C9C9C9] text-[#3C3C3C]'
                    }`}
                    >
                    حملاتي
                    </button>  
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'donation' && (
                        <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donationCampaigns.map((campaign, index) => (
                                <DonationCard
                                    key={index}
                                    image={`${images}/${campaign.CampaignPhotoName}.jpg`}
                                    title={campaign.CampaignName}
                                    description={campaign.CampaignDesc}
                                    collected={campaign.WantedAmount - campaign.CampaignRemainingAmount}
                                    goal={campaign.WantedAmount}
                                    cantPay={campaign.CampaignRemainingAmount == 0}
                                    payNowLink={`/Campaign?data=${encodeURIComponent(JSON.stringify(campaign))}&isMine=${false}&isMine=false`}
                                />
                            ))}
                        </div>
                        
                        {/* Donation Campaigns Pagination */}
                        {donationTotalCount > 0 && donationTotalPages > 1 && (
                            <div className="flex items-center justify-between px-8 py-6">
                            <div className="flex items-center gap-2">
                                <button 
                                onClick={handleDonationPrevPage} 
                                disabled={donationCurrentPage <= 1}
                                className="p-2"
                                >
                                <svg 
                                    className={`w-5 h-5 rotate-180 ${donationCurrentPage <= 1 ? 'opacity-50' : ''}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                </button>

                                {renderPaginationButtons(donationCurrentPage, donationTotalPages, handleDonationPageChange)}
                                
                                <button 
                                onClick={handleDonationNextPage} 
                                disabled={donationCurrentPage >= donationTotalPages}
                                className="p-2"
                                >
                                <svg 
                                    className={`w-5 h-5 ${donationCurrentPage >= donationTotalPages ? 'opacity-50' : ''}`}
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
                    )}
                    
                    {activeTab === 'myCampaigns' && (
                        <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCampaigns.map((campaign, index) => (
                                <DonationCard
                                    key={index}
                                    image={`${images}/${campaign.CampaignPhotoName}.jpg`}
                                    title={campaign.CampaignName}
                                    description={campaign.CampaignDesc}
                                    collected={campaign.WantedAmount - campaign.CampaignRemainingAmount}
                                    goal={campaign.WantedAmount}
                                    cantPay={campaign.CampaignRemainingAmount === 0}
                                    payNowLink={`/Campaign?data=${encodeURIComponent(JSON.stringify(campaign))}&isMine=${true}&isMine=false`}
                                />
                            ))}
                        </div>
                        
                        {/* My Campaigns Pagination */}
                        {myCampaignsTotalCount > 0 && myCampaignsTotalPages > 1 && (
                            <div className="flex items-center justify-between px-8 py-6">
                            <div className="flex items-center gap-2">
                                <button 
                                onClick={handleMyCampaignsPrevPage} 
                                disabled={myCampaignsCurrentPage <= 1}
                                className="p-2"
                                >
                                <svg 
                                    className={`w-5 h-5 rotate-180 ${myCampaignsCurrentPage <= 1 ? 'opacity-50' : ''}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M10.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                </button>

                                {renderPaginationButtons(myCampaignsCurrentPage, myCampaignsTotalPages, handleMyCampaignsPageChange)}
                                
                                <button 
                                onClick={handleMyCampaignsNextPage} 
                                disabled={myCampaignsCurrentPage >= myCampaignsTotalPages}
                                className="p-2"
                                >
                                <svg 
                                    className={`w-5 h-5 ${myCampaignsCurrentPage >= myCampaignsTotalPages ? 'opacity-50' : ''}`}
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
                    )}
                </div>

            </div>
            <div className="rightBow"></div>
        </div>
    )
}

export default Campaigns