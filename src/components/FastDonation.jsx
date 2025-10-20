import React, { useState, useEffect } from 'react'
import { executeProcedure } from "../services/apiServices";
import moneyGreen from "../public/SVGs/moneyGreen.svg"
import money from "../public/SVGs/moneyWhite.svg"
import { Calculator } from 'lucide-react';
import ZakatCalc from './Zakat page/ZakatCalc';
import { useDispatch } from 'react-redux';
import { setShowPopup, setPopupComponent , setPopupTitle ,openPopup} from "../features/PaySlice/PaySlice";
import { motion, AnimatePresence } from 'framer-motion';
import PayComponent from './PayComponent';

const FastDonation = () => {
  const [offices, setOffices] = useState([]);
  const [subventionTypes, setSubventionTypes] = useState([]);
  const [loading, setLoading] = useState({
    offices: true,
    subventionTypes: false
  });
  const [error, setError] = useState({
    offices: null,
    subventionTypes: null
  });
  const [activeTab, setActiveTab] = useState('الصدقات');
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedSubvention, setSelectedSubvention] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [zakatPopUp, setZakatPopUp] = useState(false);
  
  const dispatch = useDispatch();
  
  // Fetch offices data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
          "0"
        );
        
        
        
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          
          // Check if OfficesData exists and parse it
          if (data.OfficesData) {
            try {
              const officesData = typeof data.OfficesData === 'string' 
                ? JSON.parse(data.OfficesData) 
                : data.OfficesData;
              
              setOffices(Array.isArray(officesData) ? officesData : []);
              
            } catch (parseError) {
              console.error("Error parsing OfficesData:", parseError);
              setOffices([]);
            }
          }
        }
        
        setError(prev => ({ ...prev, offices: null }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(prev => ({ ...prev, offices: error.message }));
        setOffices([]);
      } finally {
        setLoading(prev => ({ ...prev, offices: false }));
      }
    };

    fetchData();
  }, []);

  // Fetch subvention types when office is selected
  useEffect(() => {
    const fetchSubventionTypes = async () => {
      if (!selectedOffice) {
        setSubventionTypes([]);
        setSelectedSubvention("");
        return;
      }

      try {
        setLoading(prev => ({ ...prev, subventionTypes: true }));
        
        const params = `${selectedOffice}#0#z#1#100`;
        
        
        
        const response = await executeProcedure(
          "phjR2bFDp5o0FyA7euBbsp/Ict4BDd2zHhHDfPlrwnk=",
          params
        );
        
        
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          
          // Parse SubventionTypes
          if (data.SubventionTypes) {
            try {
              const parsedSubventionTypes = typeof data.SubventionTypes === 'string'
                ? JSON.parse(data.SubventionTypes)
                : data.SubventionTypes;
              
              setSubventionTypes(Array.isArray(parsedSubventionTypes) ? parsedSubventionTypes : []);
              
            } catch (parseError) {
              console.error("Error parsing SubventionTypes:", parseError);
              setSubventionTypes([]);
            }
          } else {
            setSubventionTypes([]);
          }
        } else {
          setSubventionTypes([]);
        }
        
        setError(prev => ({ ...prev, subventionTypes: null }));
      } catch (error) {
        console.error("Error fetching subvention types:", error);
        setError(prev => ({ ...prev, subventionTypes: error.message }));
        setSubventionTypes([]);
      } finally {
        setLoading(prev => ({ ...prev, subventionTypes: false }));
      }
    };

    fetchSubventionTypes();
  }, [selectedOffice]);

  const handleCalcZakat = () => {
    setZakatPopUp(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset selections when tab changes
    setSelectedSubvention("");
    setDonationAmount("");
  };

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
    // Reset subvention and donation amount when office changes
    setSelectedSubvention("");
    setDonationAmount("");
  };

  const handleSubventionChange = (e) => {
    setSelectedSubvention(e.target.value);
    // Reset donation amount when subvention changes
    setDonationAmount("");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === "" || (parseFloat(value) > 0)) {
      setDonationAmount(value);
    }
  };

  const setDonationValue = (value) => {
    
  };

  const handlePayNow = () => {
    if (!selectedOffice || !donationAmount) {
      alert("يرجى اختيار المكتب وإدخال مبلغ التبرع");
      return;
    }
    
    dispatch(
      openPopup({
        title: "الدفع",
        component: (
          <PayComponent 
            officeId={selectedOffice}
            officeName={offices.find(office => office.Id == selectedOffice)?.OfficeName || ''}
            SubventionType_Id={selectedSubvention || '0'}
            totalAmount={donationAmount}
            Project_Id='0'
            actionID={activeTab === "الصدقات" ? 2 : 1}
          />
        )
      })
    );
  };

  return (
    <>
      <div className='flex flex-col gap-4 min-h-[85vh]'>
        <div className='flex flex-col gap-4'>
          <span className='font-bold text-lg'>اختر نوع التبرع السريع</span>
          <div className='flex items-center gap-8'>
            <button 
              className={`flex-1 w-full py-3 font-medium rounded-md ${activeTab === 'الصدقات' 
                ? 'text-white' 
                : 'bg-[#C9C9C9]'}`}
              style={activeTab === 'الصدقات' ? {
                background: 'linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)'
              } : {}}
              onClick={() => handleTabChange('الصدقات')}
            >
              الصدقات
            </button>
            <button 
              className={`flex-1 w-full py-3 font-medium rounded-md ${activeTab === 'الزكاة' 
                ? 'text-white' 
                : 'bg-[#C9C9C9]'}`}
              style={activeTab === 'الزكاة' ? {
                background: 'linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)'
              } : {}}
              onClick={() => handleTabChange('الزكاة')}
            >
              الزكاة
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <span className='font-bold text-lg'>المكاتب</span>
          {loading.offices ? (
            <div className='py-3 border-1 text-center'>جاري تحميل المكاتب...</div>
          ) : error.offices ? (
            <div className='py-3 border-1 text-center text-red-500'>خطأ في تحميل المكاتب: {error.offices}</div>
          ) : (
            <select 
              className='py-3 border-2 rounded-md border-[#B7B7B7]'
              value={selectedOffice}
              onChange={handleOfficeChange}
            >
              <option value="">اختر مكتب</option>
              {offices.map((office) => (
                <option key={office.Id} value={office.Id}>
                  {office.OfficeName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Subvention Types Dropdown */}
        <div className='flex flex-col gap-4'>
          <span className='font-bold text-lg'>الاعانات</span>
          {loading.subventionTypes ? (
            <div className='py-3 border-1 text-center'>جاري تحميل الاعانات...</div>
          ) : error.subventionTypes ? (
            <div className='py-3 border-1 text-center text-red-500'>خطأ في تحميل الاعانات: {error.subventionTypes}</div>
          ) : (
            <select 
              className='py-3 border-2 rounded-md border-[#B7B7B7]'
              value={selectedSubvention}
              onChange={handleSubventionChange}
              disabled={!selectedOffice}
            >
              <option value="">اختر اعانة</option>
              {subventionTypes.map((subvention) => (
                <option key={subvention.Id} value={subvention.Id}>
                  {subvention.SubventionTypeName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="relative w-full">
          <img
            className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6"
            src={moneyGreen}
            alt="Money"
          />
          <input
            type="number"
            min="1"
            value={donationAmount}
            onChange={handleAmountChange}
            placeholder={
              selectedOffice ? "رجاء إدخال مبلغ التبرع" : "يرجى اختيار مكتب أولاً"
            }
            className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg text-sm md:text-base
              focus:outline-none focus:ring-2 focus:ring-emerald-600
              placeholder:font-medium ${
                selectedOffice
                ? "border-[#979797]"
                : "border-gray-300 bg-gray-100"
            }`}
            disabled={!selectedOffice}
          />
        </div>
        
        {activeTab === "الزكاة" && 
          <div className="w-full flex items-center justify-between px-4 py-2 border border-[#979797] rounded-md">
            <div className='flex items-center gap-2'>
              <Calculator className=''/>
              حاسبة الزكاة
            </div>
            <button 
              className='text-white px-3 py-2 rounded-md'
              onClick={handleCalcZakat}
              style={{background:"linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)"}}
            >
              احسب الأن
            </button>
          </div>
        }
        
        <div className='flex-grow'></div>
        <button
          className={`w-full flex items-center justify-center gap-3 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-sm md:text-base ${
            !selectedOffice || !donationAmount ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => { e.preventDefault(); handlePayNow(); }}
          disabled={!selectedOffice || !donationAmount}
          style={{
            background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
          }}
        >
          <img src={money} alt="تبرع" className="w-5 h-5 md:w-6 md:h-6" />
          <span>ادفع الان</span>
        </button>
      </div>

      {/* Zakat Calculator Popup */}
      <AnimatePresence>
        {zakatPopUp && (
          <motion.div 
            className="fixed top-0 right-0 h-screen w-screen z-[10000] bg-black/50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setZakatPopUp(false)}
          >
            <motion.div 
              className="bg-white w-full md:w-1/2 h-full shadow-lg"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ZakatCalc 
                closeZakatCalc={setZakatPopUp}
                setDonationAmount={setDonationAmount}
                setDonationValue={setDonationValue}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FastDonation