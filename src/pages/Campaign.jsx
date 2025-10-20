import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Diamond from '../components/Diamond';
import cardWave from "../public/SVGs/cardWave.svg"
import Navigate from "../public/SVGs/Navigate.svg"
import moneyGreen from "../public/SVGs/moneyGreen.svg"
import money from "../public/SVGs/money.svg"
import { executeProcedure } from "../services/apiServices";
import DonationCard from "../components/DonationCard";
import { useDispatch, useSelector } from "react-redux";
import { setShowPopup, setPopupComponent, setPopupTitle } from "../features/PaySlice/PaySlice";
import PayComponent from "../components/PayComponent";
import { toast } from "react-toastify";

const Campaign = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [donationCards, setDonationCards] = useState([]);
    const [donationError, setDonationError] = useState("");
    const [fetchError, setFetchError] = useState("");
    const UserData = JSON.parse(localStorage.getItem("UserData"));
    
    // Get and parse the data from URL
    const dataParam = searchParams.get('data');
    const isMine = searchParams.get('isMine') === 'true';
    
    // Parse campaign data with error handling
    const parseCampaignData = (data) => {
        try {
            if (!data) throw new Error("No campaign data provided");
            return JSON.parse(decodeURIComponent(data));
        } catch (error) {
            console.error("Error parsing campaign data:", error);
            setFetchError("خطأ في تحميل بيانات الحملة");
            return null;
        }
    };

    const [campaignData, setCampaignData] = useState(() => parseCampaignData(dataParam));
    
    // FIXED: Correct progress calculation
    const totalAmount = campaignData.WantedAmount;
    const remainingAmount = campaignData.CampaignRemainingAmount;
    const collected = totalAmount - remainingAmount;
    const remaining = remainingAmount;
    const percentage = totalAmount > 0 ? ((collected / totalAmount) * 100).toFixed(1) : 0;
    
    // Donation state
    const [donationAmount, setDonationAmount] = useState("");

    const handleAmountChange = (e) => {
        const value = e.target.value;
        
        // Validate input is a positive number
        if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
            setDonationAmount(value);
            setDonationError("");
        } else {
            setDonationError("يرجى إدخال مبلغ صحيح");
        }
    };

    // Validate donation amount
    const validateDonation = (amount) => {
        if (!amount || amount.trim() === "") {
            return "يرجى إدخال مبلغ التبرع";
        }
        
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            return "يرجى إدخال مبلغ صحيح";
        }
        
        if (numericAmount <= 0) {
            return "يجب أن يكون مبلغ التبرع أكبر من الصفر";
        }
        
        return "";
    };

    useEffect(() => {
        if (dataParam) {
            const parsedData = parseCampaignData(dataParam);
            setCampaignData(parsedData);
        }
    }, [dataParam]);

    useEffect(() => {
        const fetchDonationCards = async () => {
            if (!campaignData) return;
            
            setLoading(true);
            setFetchError("");
            
            try {
                // Using a generic parameter for campaigns - adjust based on your API
                const params = `C#${campaignData.Id}#1#4`; // Assuming campaign-specific parameter
                const response = await executeProcedure("B0/KqqIyiS3j4lbxUKXJCw==", params);

                if (response && response.decrypted) {
                    const campaignsDataString = response.decrypted.CampaignsData;
                    let cardsData = [];

                    if (campaignsDataString) {
                        try {
                            cardsData = JSON.parse(campaignsDataString);
                        } catch (parseError) {
                            console.error("Error parsing donation cards:", parseError);
                            setFetchError("خطأ في تحميل قائمة التبرعات");
                        }
                    }

                    setDonationCards(Array.isArray(cardsData) ? cardsData : []);
                } else {
                    setFetchError("فشل في تحميل بيانات التبرعات");
                }
            } catch (error) {
                console.error("Error fetching donation cards:", error);
                setFetchError("حدث خطأ أثناء تحميل فرص التبرع المماثلة");
            } finally {
                setLoading(false);
            }
        };

        fetchDonationCards();
    }, [campaignData]);

    // Filter donation cards to exclude current campaign and show only 3
    const filteredDonationCards = donationCards
        .filter(card => card.Id !== campaignData?.Id)
        .slice(0, 3);

    const dispatch = useDispatch();
    
    const handleDonateNow = () => {
        const validationError = validateDonation(donationAmount);
        
        if (validationError) {
            setDonationError(validationError);
            return;
        }

        if (!campaignData) {
            setDonationError("لا يمكن إتمام التبرع، بيانات الحملة غير متوفرة");
            return;
        }

        // Fixed actionID as 5
        const finalActionID = 5;
        
        // Service type for actionID 5
        const serviceTypeId = "2"; // Adjust based on your API requirements for actionID 5

        // Clear any previous errors
        setDonationError("");
        
        // Open payment popup
        dispatch(setShowPopup(true));
        dispatch(setPopupTitle("الدفع"));
        dispatch(setPopupComponent(
            <PayComponent
                Project_Id={campaignData.Id} // Using Campaign_Id instead of Project_Id
                officeName={campaignData.UserName || "حملة تبرع"}
                officeId={campaignData.GeneralUser_Id} // Using GeneralUser_Id as officeId for campaigns
                serviceTypeId={serviceTypeId}
                SubventionType_Id={3} // Assuming a default value for campaigns, adjust as needed
                totalAmount={parseFloat(donationAmount) || 0}
                currency="ريال"
                actionID={finalActionID}
                Campaign_Id={campaignData.Id} // Using Campaign_Id instead of Project_Id
                onSuccess={() => {
                    // Handle successful donation
                    
                    setDonationAmount(""); // Clear donation amount after success
                    toast.success("تم التبرع بنجاح!");
                }}
                onError={(error) => {
                    setDonationError(error || "حدث خطأ أثناء عملية الدفع");
                    toast.error("فشل في عملية التبرع");
                }}
            />
        ));
    };

    const handleSimilarDonationClick = (cardData) => {
        try {
            const encodedData = encodeURIComponent(JSON.stringify(cardData));
            navigate(`/campaign?data=${encodedData}&isMine=false`);
        } catch (error) {
            console.error("Error navigating to similar donation:", error);
            setFetchError("خطأ في تحميل بيانات الحملة");
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const progressVariants = {
        hidden: { width: 0 },
        visible: {
            width: `${percentage}%`,
            transition: {
                duration: 1,
                ease: "easeOut",
                delay: 0.3
            }
        }
    };

    const buttonHoverVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.95
        }
    };

    // Mock data for statistics (replace with actual data if available)
    const statistics = {
        visits: 197.1,
        donations: 91.9,
        beneficiaries: 100
    };

    // If no campaign data, show error message
    if (!campaignData || fetchError) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-96 gap-4"
            >
                <div className="text-center text-red-500 text-xl">
                    {fetchError || "خطأ في تحميل بيانات الحملة"}
                </div>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    العودة للخلف
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative overflow-hidden min-h-screen"
            style={{
                backgroundImage: "url('/background pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
            }}
        >
            {/* Header Section */}
            <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between px-4 sm:pl-12 mt-24 md:mt-28"
            >
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl md:text-2xl px-6 sm:px-8 py-2">
                    <Diamond className="absolute -right-4 shadow-lg top-1/2 -translate-y-1/2 translate-x-1/4" />
                    التفاصيل
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex justify-center w-full px-4 sm:px-6">
                <motion.div 
                    variants={containerVariants}
                    className="w-full max-w-5xl flex flex-col lg:flex-row items-start justify-around gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6"
                >
                    {/* Campaign Details Card */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover="hover"
                        className="relative flex flex-col gap-4 sm:gap-5 px-6 sm:pl-8 sm:pr-5 py-4 sm:py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden flex-1 w-full"
                    >
                        <img src={cardWave} className="absolute left-0" alt="wave background" />
                        
                        {/* Campaign Image */}
                        <motion.img 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            src={`https://framework.md-license.com:8093/ZakatImages/${campaignData.CampaignPhotoName}.jpg`} 
                            alt={campaignData.CampaignName} 
                            className="w-full h-40 sm:h-48 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                                e.target.alt = 'صورة الحملة غير متوفرة';
                            }}
                        />
                        
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col justify-between flex-1">
                                <motion.p 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="font-medium text-base sm:text-lg"
                                >
                                    {campaignData.CampaignName || "اسم الحملة غير متوفر"}
                                </motion.p>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-[#4C4C4C] mt-2 text-sm sm:text-base"
                                >
                                    {campaignData.CampaignDesc || "لا يوجد وصف للحملة"}
                                </motion.p>
                            </div>
                            <div className="flex-shrink-0">
                                <img src={Navigate} width={20} className="sm:w-6" alt="navigation" />
                            </div>
                        </div>
                        
                        {/* Progress Section */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col gap-3 relative z-10"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm sm:text-base font-bold text-[#16343A] gap-2">
                                <span>تم جمع {collected.toLocaleString()}$</span>
                                <span>المتبقي {remaining.toLocaleString()}$</span>
                            </div>
                            <div className="w-full h-2 sm:h-[9px] bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    variants={progressVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="h-full bg-gradient-to-r from-[#17343B] via-[#18383D] to-[#24645E]"
                                ></motion.div>
                            </div>
                            <span className="text-[#16343ACC] text-xs sm:text-sm">
                                تم الوصول الى الهدف بنسبة {percentage}%
                            </span>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col gap-2"
                        >
                            <p className="text-base sm:text-lg font-medium">المستخدم</p>
                            <p className="w-full rounded-xl text-base sm:text-lg font-medium bg-white p-2 sm:p-3">
                                {campaignData.UserName || "غير محدد"}
                            </p>
                        </motion.div>

                        {/* Campaign Type */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col gap-2"
                        >
                            <p className="text-base sm:text-lg font-medium">نوع الحملة</p>
                            <p className="w-full rounded-xl text-base sm:text-lg font-medium bg-white p-2 sm:p-3">
                                {campaignData.CampaignType || "غير محدد"}
                            </p>
                        </motion.div>
                    </motion.div>
                    
                    {/* Sidebar */}
                    <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-96">
                        {/* Donation Section - Only show if not owner's campaign */}
                        {!isMine ? (
                            <motion.div 
                                variants={itemVariants}
                                whileHover="hover"
                                className="px-6 sm:pl-8 sm:pr-5 py-4 sm:py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] w-full"
                            >
                                <div className="relative w-full mb-4">
                                    <img
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                                        src={moneyGreen}
                                        alt="Money"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        max={campaignData.CampaignRemainingAmount}
                                        value={donationAmount}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            const max = campaignData.CampaignRemainingAmount;

                                            if (value > max) {
                                            setDonationAmount(max);
                                            } else if (value < 1) {
                                            setDonationAmount(1);
                                            } else {
                                            setDonationAmount(e.target.value);
                                            }
                                        }}
                                        placeholder="رجاء إدخال مبلغ التبرع"
                                        className="w-full pl-9 sm:pl-10 pr-3 py-3 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:font-medium border-[#979797] bg-transparent"
                                        />

                                </div>
                                
                                {/* Donation Error Message */}
                                {donationError && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                                    >
                                        {donationError}
                                    </motion.div>
                                )}
                                
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <motion.button 
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={handleDonateNow}
                                        disabled={!donationAmount || donationError}
                                        variants={buttonHoverVariants}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 rounded-lg text-white bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] transition-opacity text-sm sm:text-base ${
                                            !donationAmount || donationError ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                        }`}
                                    >
                                        <img src={money} alt="donate icon" />
                                        تبرع الان
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            // Show message if it's the user's own campaign
                            <motion.div 
                                variants={itemVariants}
                                className="px-6 sm:pl-8 sm:pr-5 py-4 sm:py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] w-full text-center"
                            >
                                <p className="text-lg font-medium text-gray-600">
                                    لا يمكنك التبرع لها
                                </p>
                            </motion.div>
                        )}
                        
                        {/* Statistics Section */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover="hover"
                            className="px-6 sm:pl-8 sm:pr-5 py-4 sm:py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] w-full"
                        >
                            {/* Top Statistics Section */}
                            <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                                {/* Visits */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-right"
                                >
                                    <div className="text-[#8E6D4C] text-base sm:text-lg mb-2 font-medium text-center">الزيارات</div>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="font-bold text-gray-800 text-lg sm:text-xl">{statistics.visits}</span>
                                        <span className="text-[#7B7B7B] font-medium text-sm sm:text-base">زيارة</span>
                                    </div>
                                </motion.div>

                                {/* Donation Operations */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="border-r-2 border-[#17343B] pr-6 sm:pr-8 text-center"
                                >
                                    <div className="text-[#8E6D4C] text-base sm:text-lg mb-2 font-medium">عمليات التبرع</div>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="font-bold text-gray-800 text-lg sm:text-xl">{statistics.donations}</span>
                                        <span className="text-[#7B7B7B] text-sm sm:text-base">عملية</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Divider */}
                            <motion.div 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8 }}
                                className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-6 sm:mb-8"
                            />

                            {/* Bottom Statistics Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="text-center" 
                                dir="rtl"
                            >
                                <div className="text-amber-700 text-lg sm:text-xl mb-2 sm:mb-3 font-semibold">عدد المستفيدين</div>
                                <div className="text-lg sm:text-xl font-bold text-gray-800">{statistics.beneficiaries}</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Similar Donations Section */}
            {!isMine && filteredDonationCards.length > 0 && (
                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col gap-8 px-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl md:text-2xl px-6 sm:px-8 py-2">
                            <Diamond className="absolute -right-4 shadow-lg top-1/2 -translate-y-1/2 translate-x-1/4" />
                            فرص تبرع مماثلة
                        </div>
                    </div>

                    {/* Error Message for Donation Cards */}
                    {fetchError && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center"
                        >
                            <p className="text-yellow-700">{fetchError}</p>
                        </motion.div>
                    )}

                    {/* Donation Cards */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center text-gray-600 text-lg">
                                جاري تحميل فرص التبرع المماثلة...
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 px-4 md:px-12">
                            {filteredDonationCards.map((item) => (
                                <div
                                    key={item.Id}
                                    className="flex-shrink-0"
                                >
                                    <DonationCard
                                        image={`https://framework.md-license.com:8093/ZakatImages/${item.CampaignPhotoName}.jpg`}
                                        title={item.CampaignName}
                                        description={item.CampaignDesc}
                                        collected={item.WantedAmount - item.CampaignRemainingAmount}
                                        goal={item.WantedAmount}
                                        className="min-w-[320px]"
                                        payNowLink={`/campaign?data=${encodeURIComponent(JSON.stringify(item))}&isMine=false`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
            

        <div className="rightBow"></div>
        <div className="leftBow"></div> 
        </motion.div>
    );
};

export default Campaign;