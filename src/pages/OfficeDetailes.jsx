/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'
import Diamond from '../components/Diamond';
import OpportunitiesTab from '../features/home/components/OfficeDetailes/OpportunitiesTab';
import NewsTab from '../features/home/components/OfficeDetailes/NewsTab';
import StatisticsTab from '../features/home/components/OfficeDetailes/StatisticsTab';
import AboutTab from '../features/home/components/OfficeDetailes/AboutTab';
import NewHeader from '../features/home/components/NewHeader';
import { toast } from 'react-toastify';
import { executeProcedure } from '../services/apiServices';
import officeBanner from "../../public/header backgrounds/Maktab.png"
import { useImageContext } from '../Context/imageContext.jsx';
import PropTypes from 'prop-types';

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { HandCoinsIcon, MegaphoneIcon } from 'lucide-react'
import Sheep from "../../public/Sheep.svg"
import zakat from "../public/SVGs/zakat.svg"
import speaker from "../public/SVGs/Speaker.svg"
import DonateRequest from "../public/SVGs/DonateRequest.svg";
import rememberIcon from "../../public/remember-1-svgrepo-com.svg" 
import food from "../../public/food-svgrepo-com.svg" 
import ZakatCategories from '../features/home/components/ZakatCategories.jsx';

const OfficeDetailes = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [currentView, setCurrentView] = useState({ type: 'main', data: null });
  const [officeData, setOfficeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [statisticalData, setStatisticalData] = useState(null);
  const { images } = useImageContext();

  // Extract office ID from URL
  useEffect(() => {
    const getOfficeIdFromUrl = () => {
      const urlParams = new URLSearchParams(location.search);
      
      // Try to get office ID from the new format (officeId parameter)
      let officeId = urlParams.get('officeId');
      
      // If not found in new format, try the old format with data parameter
      if (!officeId) {
        const dataParam = urlParams.get('data');
        if (dataParam) {
          try {
            const decodedData = decodeURIComponent(dataParam);
            const parsedData = JSON.parse(decodedData);
            // Extract ID from the old format
            officeId = parsedData.Id || parsedData.id;
          } catch (error) {
            console.error('Error parsing office data from URL:', error);
          }
        }
      }
      
      return officeId;
    };

    const officeId = getOfficeIdFromUrl();
    
    if (officeId) {
      fetchOfficeData(officeId);
    } else {
      console.error('No office ID found in URL');
      setLoading(false);
    }
  }, [location]);

  // Fetch office data from API
  const fetchOfficeData = async (officeId) => {
    setLoading(true);
    try {
      const response = await executeProcedure(
        "5xJLdRhPAVFesIaSW5zQItZrXcRd4zmEDhXFi9diKCA=",
        `${officeId}`
      );
      
      const officeDataArray = JSON.parse(response.decrypted.OfficeData);
      if (officeDataArray && officeDataArray.length > 0) {
        setOfficeData(officeDataArray[0]);
        
        // Fetch statistical data after office data is loaded
        fetchStatisticalData(officeId);
      } else {
        console.error('No office data found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching office data:', error);
      setLoading(false);
    }
  };

  // Fetch statistical data
  const fetchStatisticalData = async (officeId) => {
    try {
      const response = await executeProcedure(
        "Pnl2I5yvrTFeVH96QlzAsUDfACCXKoNvDpsIS2YJ77E=",
        `${officeId}#0`
      );
      setStatisticalData(response.decrypted);
    } catch (error) {
      console.error('Error fetching statistical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOpportunityDetail = (opportunityId) => {
    setCurrentView({ type: 'opportunityDetail', data: opportunityId });
  };

  const renderTabContent = () => {
    if (!officeData) return <div className="text-center py-8">جاري تحميل بيانات المكتب...</div>;

    switch (activeTab) {
      case 'opportunities':
        return <OpportunitiesTab Officeid={officeData.Id} />;
      case 'news':
        return <NewsTab Officeid={officeData.Id} />;
      case 'statistics':
        return <StatisticsTab statisticalData={statisticalData} />;
      case 'about':
        return <AboutTab officeData={officeData} />;
      default:
        return <OpportunitiesTab onOpenDetail={handleOpenOpportunityDetail} Officeid={officeData.Id} />;
    }
  };

  const getTabClass = (tabName) => {
    const baseClass = "py-2 px-4 cursor-pointer transition-colors font-medium";
    const activeClass = "border-b-2 border-[#18383D] text-[#18383D] font-semibold";
    const inactiveClass = "text-gray-600 hover:text-[#18383D]";
    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{
          backgroundImage: "url('/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <div className="text-lg">جاري تحميل بيانات المكتب...</div>
      </div>
    );
  }

  if (!officeData) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{
          backgroundImage: "url('/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <div className="text-lg text-red-500">حدث خطأ في تحميل بيانات المكتب</div>
      </div>
    );
  }
  
  const headerBackground = officeData?.HeaderPhotoName &&`url("${images}/${officeData.HeaderPhotoName}.jpg")`

  return (
    <motion.div 
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className='mt-20'>
        <NewHeader backgroundImage={officeBanner} officeName={officeData.OfficeName}/>
      </div>
      <div
        className='min-h-screen'
        style={{
          backgroundImage: "url('/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        {/* Header Section */}
        <motion.section
          className="bg-transparent relative w-full overflow-hidden bgpy-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
           style={{
            // backgroundImage: headerBackground,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className='flex h-full w-full items-end px-4 md:px-12 py-6 relative z-[100]'>
            <div className='flex items-center gap-3 w-full h-fit'>
              <img 
                src={`${images}/${officeData.OfficePhotoName}.jpg`} 
                alt={officeData.OfficeName} 
                className='w-40 h-36 rounded-md object-cover' 
              />
              <div className='flex flex-col h-32 w-full justify-between font-bold'>
                <span className='text-black text-lg'>{officeData.OfficeName}</span>
                <div className='w-full flex items-center gap-4 text-[#18383D]'>
                  <span>رقم الهاتف</span>
                  <span className='flex items-center gap-2'>
                    {officeData.PhoneNum} 
                    <Copy 
                      className="cursor-pointer" 
                      onClick={() => {navigator.clipboard.writeText(officeData.PhoneNum) ; toast.success('تم نسخ رقم الهاتف بنجاح')}}
                      size={16} 
                    /> 
                  </span>
                </div>
                <div className='text-black text-sm mt-2'>
                  <div>المدينة: {officeData.CityName}</div>
                  <div>العنوان: {officeData.Address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* الزخارف */}
          <div
            className="absolute top-0 right-0 w-1/6 h-full z-20"
            style={{
              backgroundImage: "url('/Union.png')",
              opacity: "0.4",
              backgroundRepeat: "repeat-y",
              transform: "rotate(180deg)",
              backgroundSize: "auto",
            }}
          ></div>

          <div
            className="absolute top-0 left-0 w-1/4 h-full z-20"
            style={{
              backgroundImage: "url('/Union.png')",
              opacity: "0.4",
              backgroundRepeat: "repeat-y",
              backgroundSize: "auto",
            }}
          ></div>
        </motion.section>
        
        <ZakatCategories officeId={officeData.Id} officeName={officeData.OfficeName} />
        
        {/* Title */}
        <div className='mt-8'>
          <motion.div 
            className="w-fit relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
            تفاصيل
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <motion.div 
          className='flex items-center justify-between px-4 md:px-12 py-1 mt-4 border-b-2 border-[#878787] w-full'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {['opportunities', 'news', 'statistics', 'about'].map(tab => (
            <span 
              key={tab}
              className={getTabClass(tab)}
              onClick={() => {
                setActiveTab(tab);
                setCurrentView({ type: 'main' });
              }}
            >
              {tab === 'opportunities' && 'الفرص'}
              {tab === 'news' && 'الأخبار'}
              {tab === 'statistics' && 'إحصائيات'}
              {tab === 'about' && 'عن المكتب'}
            </span>
          ))}
        </motion.div>

        {/* Animated Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen px-4 md:px-12 py-6"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
        <div className='my-8'>
          <Services Officeid={officeData.Id} officeName={officeData.OfficeName} />
        </div>
      </div>
    </motion.div>
  );
}

export default OfficeDetailes;

const Services = ({ Officeid, officeName }) => {
  const [isInView, setIsInView] = useState(false);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Service card data
  const services = [
    {
      icon: <img src={food} alt="Sheep" className='w-10'/>,
      title: "زكاة الفطر",
      link:`/fitrZakat?Officeid=${Officeid}&officeName=${officeName}`,
      description: "خدمة تتيح لك دفع زكاة الفطر إلكترونيًا لتصل إلى مستحقيها في الوقت المحدد وبالطريقة الشرعية."
    },
    {
      icon: <img src={DonateRequest} alt="Zakat" />,
      title: "تبرع لمن تحب",
      link:`/DonateTo?Officeid=${Officeid}&officeName=${officeName}`,
      description: "خدمة تتيح لك إرسال تبرع باسم من تحب في أبواب الخير المختلفة وبطرق سهلة وسريعة."
    },
    {
      icon: <img src={Sheep} alt="Sheep" />,
      title: "الأضاحي",
      link:`/sacrifice?Officeid=${Officeid}&officeName=${officeName}`,
      description: "خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."
    }
  ]

  // Check scroll position to show/hide arrows - Fixed for RTL
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // For RTL layout, scrollLeft is negative or positive depending on browser
      // The maximum scroll position is 0, minimum is -(scrollWidth - clientWidth)
      const maxScrollLeft = 0;
      const minScrollLeft = -(scrollWidth - clientWidth);
      
      setCanScrollLeft(scrollLeft > minScrollLeft);
      setCanScrollRight(scrollLeft < maxScrollLeft);
    }
  };

  // Scroll functions fixed for RTL
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // In RTL, scrolling left means moving towards the end (more negative)
      scrollContainerRef.current.scrollBy({
        left: -340,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // In RTL, scrolling right means moving towards the start (less negative)
      scrollContainerRef.current.scrollBy({
        left: 340,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Check scroll position on mount, scroll, and resize
  useEffect(() => {
    checkScrollPosition();
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      
      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, []);

  // Simple fade up animation
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      className="flex flex-col gap-6 mt-8"
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      viewport={{ amount: 0.2, once: false }}
    >
      {/* donation header */}
      <div className="flex items-center justify-between pl-12">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <div>
            <Diamond
              className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4"
            />
          </div>
          الخدمات
        </div>
      </div>

      {/* Services Cards with Horizontal Scroll */}
      <div className="relative md:px-8">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-[#17343B]" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-[#17343B]" />
          </button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto scrollbar-hide md:pr-8"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="flex-shrink-0"
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                link={service.link}
                descirption={service.description}
                className="min-w-[320px] max-w-[420px] h-full"
              />
            </div>
          ))}
        </div>

        {/* Shadow Overlays */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-[1000] pointer-events-none md:right-8"></div>
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000] pointer-events-none md:left-8"></div>
      </div>
    </motion.div>
  )
}

Services.propTypes = {
  Officeid: PropTypes.string.isRequired,
  officeName: PropTypes.string.isRequired,
}