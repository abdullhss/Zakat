import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Diamond from "../components/Diamond";
import cardWave from "../public/SVGs/cardWave.svg"
import Navigate from "../public/SVGs/Navigate.svg"
import moneyGreen from "../public/SVGs/moneyGreen.svg"
import money from "../public/SVGs/money.svg"
import shoppingCart from "../public/SVGs/ShoppingCart.svg"
import { executeProcedure } from "../services/apiServices";
import DonationCard from "../components/DonationCard";
import { useDispatch, useSelector } from "react-redux";
import { setShowPopup, setPopupComponent, setPopupTitle } from "../features/PaySlice/PaySlice";
import PayComponent from "../components/PayComponent";
import { toast } from "react-toastify";

const Project = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const rawData = params.get("data");
    const [loading, setLoading] = useState(false);
    const [donationCards, setDonationCards] = useState([]);
    const [donationError, setDonationError] = useState("");
    const [fetchError, setFetchError] = useState("");
    const [donationType, setDonationType] = useState(""); // "zakat" or "sadaqa"
    const UserData = JSON.parse(localStorage.getItem("UserData"));
    // Parse project data with error handling
    const parseProjectData = (data) => {
        try {
            if (!data) throw new Error("No project data provided");
            return JSON.parse(decodeURIComponent(data));
        } catch (error) {
            console.error("Error parsing project data:", error);
            setFetchError("خطأ في تحميل بيانات المشروع");
            return null;
        }
    };

    const [projectData, setProjectData] = useState(() => parseProjectData(rawData));
    
    // Calculate progress values with safety checks
    const collected = projectData ? (projectData.WantedAmount - projectData.RemainingAmount) || 0 : 0;
    const remaining = projectData ? (projectData.RemainingAmount || 0) : 0;
    const totalAmount = projectData ? (projectData.WantedAmount || 0) : 0;
    const percentage = totalAmount > 0 ? ((collected / totalAmount) * 100).toFixed(1) : 0;
    
    // Donation state
    const [donationAmount, setDonationAmount] = useState(projectData.donationValue);

    // Check if we need to show donation type radio buttons
    // Show radio buttons only if AllowZakat is true AND actionID is 0 (meaning it can be either)
    const showDonationTypeRadio = projectData?.AllowZakat && projectData?.actionID === 0;

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

    const handleDonationTypeChange = (type) => {
        setDonationType(type);
        setDonationError(""); // Clear any previous errors when selection changes
    };

    // Get the final actionID based on conditions
    const getFinalActionID = () => {
        if (!projectData) return 2; // Default to sadaqa if no project data
        
        // If AllowZakat is false, always use actionID 2 (sadaqa)
        if (!projectData.AllowZakat) {
            return 2;
        }
        
        // If AllowZakat is true and we have donation type selection
        if (showDonationTypeRadio) {
            return donationType === "zakat" ? 1 : 2;
        }
        
        // If AllowZakat is true but no selection needed, use the project's actionID
        return projectData.actionID || 2;
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
        
        if (numericAmount > 1000000) { // Example limit: 1,000,000
            return "مبلغ التبرع كبير جداً، يرجى الاتصال بالدعم";
        }

        // Additional validation for donation type when required
        if (showDonationTypeRadio && !donationType) {
            return "يرجى اختيار نوع التبرع";
        }
        
        return "";
    };

    useEffect(() => {
        if (rawData) {
            const parsedData = parseProjectData(rawData);
            setProjectData(parsedData);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchDonationCards = async () => {
            if (!projectData) return;
            
            setLoading(true);
            setFetchError("");
            
            try {
                const params = `O#${projectData.SubventionType_Id}#1#4`;
                const response = await executeProcedure("B0/KqqIyiS3j4lbxUKXJCw==", params);

                if (response && response.decrypted) {
                    const projectsDataString = response.decrypted.ProjectsData;
                    let cardsData = [];

                    if (projectsDataString) {
                        try {
                            cardsData = JSON.parse(projectsDataString);
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
    }, [projectData]);

    // Filter donation cards to exclude current project and show only 3
    const filteredDonationCards = donationCards
        .filter(card => card.Id !== projectData?.Id)
        .slice(0, 3);

    const dispatch = useDispatch();
    
    const handleDonateNow = () => {
        const validationError = validateDonation(donationAmount);
        
        if (validationError) {
            setDonationError(validationError);
            return;
        }

        if (!projectData) {
            setDonationError("لا يمكن إتمام التبرع، بيانات المشروع غير متوفرة");
            return;
        }

        // Get the final actionID based on conditions
        const finalActionID = getFinalActionID();
        
        // Determine service type based on actionID
        const serviceTypeId = finalActionID === 1 ? "1" : "2"; // 1 for zakat, 2 for sadaqa

        // Clear any previous errors
        setDonationError("");
        
        // Open payment popup
        dispatch(setShowPopup(true));
        dispatch(setPopupTitle("الدفع"));
        dispatch(setPopupComponent(
            <PayComponent
                officeName={projectData.OfficeName}
                officeId={projectData.Office_Id}
                serviceTypeId={serviceTypeId}
                SubventionType_Id={projectData.SubventionType_Id}
                totalAmount={parseFloat(donationAmount) || 0}
                currency="ريال"
                actionID={finalActionID} // Use the calculated finalActionID
                Project_Id={projectData.Id}
                onSuccess={() => {
                    // Handle successful donation
                    console.log("Donation successful");
                    setDonationAmount(""); // Clear donation amount after success
                    setDonationType(""); // Clear donation type selection
                }}
                onError={(error) => {
                    setDonationError(error || "حدث خطأ أثناء عملية الدفع");
                }}
            />
        ));
    };

    const handleAddToCart = () => {
        if(UserData){
            console.log(UserData.Id);
        }else{
            toast.error("برجاء تسجيل الدخول اولا")
        }
    };

    const handleSimilarDonationClick = (cardData) => {
        try {
            const encodedData = encodeURIComponent(JSON.stringify({
                ...cardData,
                actionID: projectData?.actionID // Preserve actionID if available
            }));
            navigate(`/project?data=${encodedData}`);
        } catch (error) {
            console.error("Error navigating to similar donation:", error);
            setFetchError("خطأ في تحميل بيانات المشروع");
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

    // Radio button animation variants
    const radioVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    // If no project data, show error message
    if (!projectData || fetchError) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-96 gap-4"
            >
                <div className="text-center text-red-500 text-xl">
                    {fetchError || "خطأ في تحميل بيانات المشروع"}
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
                    <Diamond className="absolute  -right-4 shadow-lg top-1/2 -translate-y-1/2 translate-x-1/4" />
                    التفاصيل
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex justify-center w-full px-4 sm:px-6">
                <motion.div 
                    variants={containerVariants}
                    className="w-full max-w-5xl flex flex-col lg:flex-row items-start justify-around gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6"
                >
                    {/* Project Details Card */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover="hover"
                        className="relative flex flex-col gap-4 sm:gap-5 px-6 sm:pl-8 sm:pr-5 py-4 sm:py-5 rounded-2xl shadow-md bg-gradient-to-tl from-[#DEDEDE] to-[#FFFFFF] overflow-hidden flex-1 w-full"
                    >
                        <img src={cardWave} className="absolute left-0" alt="wave background" />
                        
                        {/* Project Image */}
                        <motion.img 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            src={`https://framework.md-license.com:8093/ZakatImages/${projectData.PhotoName}.jpg`} 
                            alt={projectData.Name} 
                            className="w-full h-40 sm:h-48 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'; // Fallback image
                                e.target.alt = 'صورة المشروع غير متوفرة';
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
                                    {projectData.Name || "اسم المشروع غير متوفر"}
                                </motion.p>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-[#4C4C4C] mt-2 text-sm sm:text-base"
                                >
                                    {projectData.Description || "لا يوجد وصف للمشروع"}
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
                            <p className="text-base sm:text-lg font-medium">المكتب</p>
                            <p className="w-full rounded-xl text-base sm:text-lg font-medium bg-white p-2 sm:p-3">
                                {projectData.OfficeName || "غير محدد"}
                            </p>
                        </motion.div>

                        {/* Show current donation type if not showing radio buttons */}
                        {!showDonationTypeRadio && (
                            <motion.div 
                                variants={itemVariants}
                                className="flex flex-col gap-2"
                            >
                                <p className="text-base sm:text-lg font-medium">نوع التبرع</p>
                                <p className="w-full rounded-xl text-base sm:text-lg font-medium bg-white p-2 sm:p-3">
                                    {projectData.AllowZakat ? 
                                        (projectData.actionID === 1 ? "زكاة" : "صدقة") 
                                        : "صدقة"}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                    
                    {/* Sidebar */}
                    <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-96">
                        {/* Donation Section */}
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
                                    value={donationAmount}
                                    onChange={handleAmountChange}
                                    placeholder="رجاء إدخال مبلغ التبرع"
                                    className="w-full pl-9 sm:pl-10 pr-3 py-3 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:font-medium border-[#979797] bg-transparent"
                                />
                            </div>
                            
                            {/* Donation Type Radio Buttons - Conditionally Rendered */}
                            {showDonationTypeRadio && (
                                <motion.div
                                    variants={radioVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="mb-6 p-4 rounded-xl border border-gray-200 bg-gradient-to-l from-gray-50 to-white shadow-sm"
                                >
                                    <p className="text-base font-semibold text-gray-800 mb-4 text-right">
                                    اختر نوع التبرع:
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "زكاة", value: "zakat",},
                                        { label: "صدقة", value: "sadaqa",},
                                    ].map(({ label, value, icon }) => (
                                        <motion.label
                                        key={value}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 ${
                                            donationType === value
                                            ? "border-[#17433b] bg-emerald-50 text-[#17433b] shadow-md"
                                            : "border-gray-300 bg-white hover:border-[#17433b]"
                                        }`}
                                        >
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 ${
                                            donationType === value
                                                ? "border-[#17433b] bg-[#17433b]"
                                                : "border-gray-400"
                                            }`}
                                        ></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{icon}</span>
                                            <span className="text-sm md:text-base font-medium">{label}</span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="donationType"
                                            value={value}
                                            checked={donationType === value}
                                            onChange={() => handleDonationTypeChange(value)}
                                            className="hidden"
                                        />
                                        </motion.label>
                                    ))}
                                    </div>
                                </motion.div>
                            )}

                            

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
                                    disabled={!donationAmount || donationError || (showDonationTypeRadio && !donationType)}
                                    variants={buttonHoverVariants}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 rounded-lg text-white bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] transition-opacity text-sm sm:text-base ${
                                        !donationAmount || donationError || (showDonationTypeRadio && !donationType) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                    }`}
                                >
                                    <img src={money} alt="donate icon" />
                                    تبرع الان
                                </motion.button>
                                <motion.button 
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={handleAddToCart}
                                    variants={buttonHoverVariants}
                                    className={`p-2 sm:p-3 rounded-lg border border-[#16343A] text-[#16343A] transition-colors`}
                                >
                                    <img src={shoppingCart} width={24} className="sm:w-8" alt="shopping cart" />
                                </motion.button>
                            </div>
                        </motion.div>
                        
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
                                        <span className="font-bold text-gray-800 text-lg sm:text-xl">197.1</span>
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
                                        <span className="font-bold text-gray-800 text-lg sm:text-xl">91.9</span>
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
                                <div className="text-lg sm:text-xl font-bold text-gray-800">100</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Similar Donations Section */}
            <motion.div 
                variants={itemVariants}
                className="flex flex-col gap-8 px-4 "
            >
                <div className="flex items-center justify-between">
                    <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl md:text-2xl px-6 sm:px-8 py-2">
                        <Diamond className="absolute  -right-4 shadow-lg top-1/2 -translate-y-1/2 translate-x-1/4" />
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
                ) : filteredDonationCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 px-4 md:px-12">
                        {filteredDonationCards.map((item) => (
                            <div
                                key={item.Id}
                                className="flex-shrink-0"
                            >
                                <DonationCard
                                    image={`https://framework.md-license.com:8093/ZakatImages/${item.PhotoName}.jpg`}
                                    title={item.Name}
                                    description={item.Description}
                                    collected={item.WantedAmount - item.RemainingAmount}
                                    goal={item.WantedAmount}
                                    className="min-w-[320px]"
                                    payNowLink={`/project?data=${encodeURIComponent(JSON.stringify({ ...item, actionID: projectData.actionID }))}`}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    !fetchError && (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center text-gray-600 text-lg">
                                لا توجد فرص تبرع مماثلة حالياً
                            </div>
                        </div>
                    )
                )}
            </motion.div>
            

        <div className="rightBow"></div>
        <div className="leftBow"></div> 
        </motion.div>
    );
};

export default Project;