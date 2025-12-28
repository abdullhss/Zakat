import React, { useState, useEffect, useRef } from 'react'
import { executeProcedure } from "../services/apiServices";
import moneyGreen from "../public/SVGs/moneyGreen.svg"
import money from "../public/SVGs/moneyWhite.svg"
import { Calculator } from 'lucide-react';
import ZakatCalc from './Zakat page/ZakatCalc';
import { useDispatch } from 'react-redux';
import { setShowPopup, setPopupComponent, setPopupTitle, openPopup } from "../features/PaySlice/PaySlice";
import { motion, AnimatePresence } from 'framer-motion';
import PayComponent from './PayComponent';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  cleanAmount,
  formatAmountAsTyping,
  parseAmountToNumber
} from "../utils/amountUtils";

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
  const [isDonationAmountFocused, setIsDonationAmountFocused] = useState(false);
  const donationAmountRef = useRef(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check if we're on the office route and extract office data
  const isOfficeRoute = location.pathname === "/office";
  const officeDataFromRoute = isOfficeRoute ? searchParams.get("data") : null;

  // Get display value for donation amount
  const getDisplayValue = () => {
    if (!donationAmount) return "";

    if (isDonationAmountFocused) {
      // Show raw value while editing
      return donationAmount;
    }

    // Show formatted value when not focused
    return formatAmountAsTyping(donationAmount);
  };

  // Handle focus for donation amount input
  const handleAmountFocus = () => {
    setIsDonationAmountFocused(true);
    setTimeout(() => {
      if (donationAmountRef.current) {
        donationAmountRef.current.select();
      }
    }, 0);
  };

  // Handle blur for donation amount input
  const handleAmountBlur = () => {
    setIsDonationAmountFocused(false);
    // Clean and format the amount on blur
    if (donationAmount) {
      const cleanedValue = cleanAmount(donationAmount);
      setDonationAmount(cleanedValue);
    }
  };

  // Fetch offices data only if not on office route
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

    // If on office route, set the office from URL parameters
    if (isOfficeRoute && officeDataFromRoute) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(officeDataFromRoute));
        setSelectedOffice(decodedData.Id);
        setLoading(prev => ({ ...prev, offices: false }));
      } catch (error) {
        console.error("Error parsing office data from URL:", error);
        setError(prev => ({ ...prev, offices: "خطأ في تحميل بيانات المكتب" }));
        setLoading(prev => ({ ...prev, offices: false }));
      }
    } else {
      // Only fetch offices if not on office route
      fetchData();
    }
  }, [isOfficeRoute, officeDataFromRoute]);

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
    const cleanedValue = cleanAmount(value);
    
    // Only allow positive numbers
    const numericValue = parseAmountToNumber(cleanedValue);
    if (numericValue > 0 || cleanedValue === "") {
      setDonationAmount(cleanedValue);
    }
  };

  // Updated to accept the amount from ZakatCalc
  const setDonationValue = (amount) => {
    setDonationAmount(amount.toString());
  };

  const handlePayNow = () => {
    const numericAmount = parseAmountToNumber(donationAmount);
    if (!selectedOffice || !numericAmount) {
      alert("يرجى إدخال مبلغ التبرع");
      return;
    }

    // Get office name - try to get from URL data first, then from fetched offices
    let officeName = '';
    if (isOfficeRoute && officeDataFromRoute) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(officeDataFromRoute));
        officeName = decodedData.OfficeName || '';
      } catch (error) {
        console.error("Error getting office name from URL:", error);
      }
    }

    // If we don't have office name from URL, try to get from fetched offices
    if (!officeName) {
      officeName = offices.find(office => office.Id == selectedOffice)?.OfficeName || '';
    }

    dispatch(
      openPopup({
        title: "الدفع",
        component: (
          <PayComponent
            officeId={selectedOffice}
            officeName={officeName}
            SubventionType_Id={selectedSubvention || '0'}
            totalAmount={numericAmount}
            Project_Id='0'
            actionID={activeTab === "الصدقات" ? 2 : 1}
          />
        )
      })
    );
  };

  // Get office name for display when on office route
  const getCurrentOfficeName = () => {
    if (isOfficeRoute && officeDataFromRoute) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(officeDataFromRoute));
        return decodedData.OfficeName || "المكتب المحدد";
      } catch (error) {
        return "المكتب المحدد";
      }
    }
    return offices.find(office => office.Id == selectedOffice)?.OfficeName || "";
  };

  return (
    <>
      <div className='flex flex-col gap-4 min-h-[85vh]'>
        <div className='flex flex-col gap-4'>
          <span className='font-bold text-lg'>اختر نوع الدفع السريع</span>
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

        {/* Office Selection - Only show if not on office route */}
        {!isOfficeRoute && (
          <div className='flex flex-col gap-4'>
            <span className='font-bold text-lg'>المكاتب</span>
            {loading.offices ? (
              <div className='py-3 border-1 text-center'>جاري تحميل المكاتب...</div>
            ) : error.offices ? (
              <div className='py-3 border-1 text-center text-red-500'>خطأ في تحميل المكاتب: {error.offices}</div>
            ) : (
              <select
                className='py-3 border-2 rounded-md border-[#B7B7B7] px-2'
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
        )}

        {/* Show current office info when on office route */}
        {isOfficeRoute && selectedOffice && (
          <div className='flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <span className='font-bold text-lg'>المكتب المحدد</span>
            <div className='py-2 px-3 bg-white border border-gray-300 rounded-md'>
              {getCurrentOfficeName()}
            </div>
            <p className='text-sm text-gray-600 text-right'>
              تم تحديد هذا المكتب مسبقاً. يمكنك اختيار نوع الاعانة والمبلغ المراد التبرع به.
            </p>
          </div>
        )}

        {/* Subvention Types Dropdown */}
        {/* <div className='flex flex-col gap-4'>
          <span className='font-bold text-lg'>الاعانات</span>
          {loading.subventionTypes ? (
            <div className='py-3 border-1 text-center'>جاري تحميل الاعانات...</div>
          ) : error.subventionTypes ? (
            <div className='py-3 border-1 text-center text-red-500'>خطأ في تحميل الاعانات: {error.subventionTypes}</div>
          ) : (
            <select
              className='py-3 border-2 rounded-md border-[#B7B7B7] px-2'
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
        </div> */}

        <div className="relative w-full">
          <img
            className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6"
            src={moneyGreen}
            alt="Money"
          />
          <input
            ref={donationAmountRef}
            type="text"
            inputMode="decimal"
            value={getDisplayValue()}
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            placeholder={
              selectedOffice ? "رجاء ادخال المبلغ المدفوع (مثال: 1,000.50)" : "يرجى اختيار مكتب أولاً"
            }
            className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg text-sm md:text-base text-left
              focus:outline-none focus:ring-2 focus:ring-emerald-600
              placeholder:font-medium placeholder:text-right ${
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
              <Calculator className='' />
              حاسبة الزكاة
            </div>
            <button
              className='text-white px-3 py-2 rounded-md'
              onClick={handleCalcZakat}
              style={{ background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)" }}
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