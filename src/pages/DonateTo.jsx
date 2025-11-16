import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { executeProcedure } from "../services/apiServices";
import moneyGreen from "../public/SVGs/moneyGreen.svg"
import money from "../public/SVGs/moneyWhite.svg"
import { setShowPopup, setPopupComponent, setPopupTitle, openPopup } from "../features/PaySlice/PaySlice";
import { useLocation, useSearchParams } from 'react-router-dom';
import PayComponent from '../components/PayComponent';

const DonateTo = () => {
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
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedSubvention, setSelectedSubvention] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Check if we're on the office route and extract office data
  const isOfficeRoute = location.pathname === "/office";
  const officeDataFromRoute = isOfficeRoute ? searchParams.get("data") : null;

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

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
    // Reset subvention and donation amount when office changes
    setSelectedSubvention("");
    setDonationAmount("");
    setDonorName("");
    setDonorPhone("");
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

  const handleDonorNameChange = (e) => {
    setDonorName(e.target.value);
  };

  const handleDonorPhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setDonorPhone(value);
    }
  };

  const handlePayNow = () => {
    if (!selectedOffice || !donationAmount || !donorName || !donorPhone) {
      alert("يرجى إدخال جميع البيانات المطلوبة");
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

    // Create description with name and phone
    const paymentDescription = `${donorName} - ${donorPhone}`;
    
    dispatch(
      openPopup({
        title: "الدفع",
        component: (
          <PayComponent
            officeId={selectedOffice}
            officeName={officeName}
            SubventionType_Id={selectedSubvention || '0'}
            totalAmount={donationAmount}
            Project_Id='0'
            actionID={10}
            PaymentDesc={paymentDescription}
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
      <div  className='flex flex-col gap-4 m-8'>
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

        {/* Donation Amount Input */}
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
              selectedOffice ? "رجاء ادخال المبلغ المدفوع" : "يرجى اختيار مكتب أولاً"
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

        {/* Donor Name Input */}
        <div className="flex flex-col gap-2">
          <span className='font-bold text-lg'>اسم المتبرع له</span>
          <input
            type="text"
            value={donorName}
            onChange={handleDonorNameChange}
            placeholder="أدخل اسم المتبرع له"
            className="w-full px-3 py-3 border-2 border-[#979797] rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Donor Phone Input */}
        <div className="flex flex-col gap-2">
          <span className='font-bold text-lg'>رقم المتبرع له</span>
          <input
            type="tel"
            value={donorPhone}
            onChange={handleDonorPhoneChange}
            placeholder="أدخل رقم المتبرع له"
            className="w-full px-3 py-3 border-2 border-[#979797] rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        
        <div className='flex-grow'></div>
        
        {/* Pay Now Button */}
        <button
          className={`w-full flex items-center justify-center gap-3 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-sm md:text-base ${
            !selectedOffice || !donationAmount || !donorName || !donorPhone ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => { e.preventDefault(); handlePayNow(); }}
          disabled={!selectedOffice || !donationAmount || !donorName || !donorPhone}
          style={{
            background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
          }}
        >
          <img src={money} alt="تبرع" className="w-5 h-5 md:w-6 md:h-6" />
          <span>ادفع الان</span>
        </button>
      </div>
    </>
  )
}

export default DonateTo