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

const OfficeDetailes = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [currentView, setCurrentView] = useState({ type: 'main', data: null });
  const [officeData, setOfficeData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
      try {
        const decodedData = decodeURIComponent(dataParam);
        const parsedData = JSON.parse(decodedData);
        setOfficeData(parsedData);
      } catch (error) {
        console.error('Error parsing office data from URL:', error);
      }
    }
  }, [location]);

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
        return <StatisticsTab officeData={officeData} />;
      case 'about':
        return <AboutTab officeData={officeData} />;
      default:
        return <OpportunitiesTab onOpenDetail={handleOpenOpportunityDetail} Officeid={officeData.Id} />;
    }
  };

  const getTabClass = (tabName) => {
    const baseClass = "py-2 px-4 cursor-pointer transition-colors";
    const activeClass = "border-b-2 border-[#18383D] text-[#18383D] font-semibold";
    const inactiveClass = "text-gray-600 hover:text-[#18383D]";
    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

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
        <div className="text-lg">جاري تحميل بيانات المكتب...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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
          className="bg-[#18383D] relative w-full h-[400px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className='flex h-full w-full items-end px-4 md:px-12 py-6 relative z-[100]'>
            <div className='flex items-center gap-3 w-full h-fit'>
              <img 
                src={`https://framework.md-license.com:8093/ZakatImages/${officeData.OfficePhotoName}.jpg`} 
                alt={officeData.OfficeName} 
                className='w-40 h-36 rounded-md object-cover' 
              />
              <div className='flex flex-col h-32 w-full justify-between font-bold'>
                <span className='text-white text-lg'>{officeData.OfficeName}</span>
                <div className='w-full flex items-center justify-between text-[#F2DCA5]'>
                  <span>رقم الترخيص</span>
                  <span className='flex items-center gap-2'>
                    {officeData.PhoneNum} 
                    <Copy 
                      className="cursor-pointer" 
                      onClick={() => navigator.clipboard.writeText(officeData.PhoneNum)}
                      size={16} 
                    /> 
                  </span>
                </div>
                <div className='text-white text-sm mt-2'>
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
          <div className="absolute bottom-0 left-0 w-40 h-40 z-30">
            <div className="absolute bottom-[-25rem] left-[8rem] w-[30rem] h-[30rem] rounded-full bg-[#000]/20"></div>
            <div className="absolute bottom-[-20rem] left-[0rem] w-[30rem] h-[30rem] rounded-full bg-[#000]/30"></div>
          </div>

          <div className="absolute top-0 right-0 w-40 h-40 z-30">
            <div className="absolute top-[-15rem] right-[5rem] w-[30rem] h-[30rem] rounded-full bg-[#000]/20"></div>
            <div className="absolute top-[-18rem] right-[-10rem] w-[30rem] h-[30rem] rounded-full bg-[#000]/30"></div>
          </div>
          
        </motion.section>
        
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
      </div>
    </motion.div>
  );
}

export default OfficeDetailes;
