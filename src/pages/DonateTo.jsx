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
  const [donorPhone, setDonorPhone] = useState("09");
  const [phoneError, setPhoneError] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const Officeid = searchParams.get("Officeid");
  const officeName = searchParams.get("officeName");
  // Check if office is passed via URL params
  const isOfficeFromRoute = Officeid && officeName;

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

    // If office is passed via URL params, set it directly
    if (isOfficeFromRoute && Officeid) {
      setSelectedOffice(Officeid);
      setLoading(prev => ({ ...prev, offices: false }));
    } else {
      // Only fetch offices if not from route
      fetchData();
    }
  }, [isOfficeFromRoute, Officeid]);

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
        
        const params = `${selectedOffice}#0#s#0#1#100`;
        
        const response = await executeProcedure(
          "phjR2bFDp5o0FyA7euBbsp/Ict4BDd2zHhHDfPlrwnk=",
          params
        );
        console.log(response);
        
        
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
    let value = e.target.value;

    // يسمح بالأرقام فقط
    if (!/^\d*$/.test(value)) return;

    // ممنوع يكون فاضي
    if (value === "") {
      setDonorPhone("");
      setPhoneError("رقم الهاتف مطلوب");
      return;
    }

    // دايمًا يبدأ بـ 09
    if (!value.startsWith("09")) {
      value = "09";
    }

    // يمنع أكتر من 10 أرقام
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setDonorPhone(value);

    // تحقق من بادئات ليبيانا والمدار
    const validPrefixes = ["091", "092", "094", "095"];

    if (value.length === 10 && !validPrefixes.some(p => value.startsWith(p))) {
      setPhoneError("الرقم يجب أن يبدأ بـ 091 أو 092 أو 094 أو 095");
    } else {
      setPhoneError("");
    }
  };


  const handlePayNow = () => {
    if (!selectedOffice || !donationAmount || !donorName || !donorPhone) {
      alert("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }
    
    // Get office name - use from URL if available, otherwise from fetched offices
    const finalOfficeName = isOfficeFromRoute 
      ? officeName 
      : offices.find(office => office.Id == selectedOffice)?.OfficeName || '';

    // Create description with name and phone
    const paymentDescription = `${donorName} - ${donorPhone}`;
    
    dispatch(
      openPopup({
        title: "الدفع",
        component: (
          <PayComponent
            officeId={selectedOffice}
            officeName={finalOfficeName}
            SubventionType_Id={selectedSubvention || '0'}
            totalAmount={donationAmount}
            Project_Id='0'
            actionID={10}
            PaymentDesc={paymentDescription}
            donationNameForLover={donorName}
          />
        )
      })
    );
  };

  // Get office name for display
  const getCurrentOfficeName = () => {
    if (isOfficeFromRoute) {
      return officeName || "المكتب المحدد";
    }
    return offices.find(office => office.Id == selectedOffice)?.OfficeName || "";
  };

  return (
    <>
      <div  className='flex flex-col gap-4 m-8'>
        {/* Office Selection - Only show if not from route */}
        {!isOfficeFromRoute && (
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

        {/* Show current office info when from route */}
        {isOfficeFromRoute && selectedOffice && (
          <div className='flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <span className='font-bold text-lg'>المكتب المحدد</span>
            <div className='py-2 px-3 bg-white border border-gray-300 rounded-md'>
              {getCurrentOfficeName()}
            </div>
            <p className='text-sm text-gray-600 text-right'>
              تم تحديد هذا المكتب مسبقاً. يمكنك اختيار نوع الإعانة والمبلغ المراد التبرع به.
            </p>
          </div>
        )}

        {/* Subvention Types Dropdown */}
        <div className='flex flex-col gap-4'>
          <span className='font-bold text-lg'>الإعانات</span>
          {loading.subventionTypes ? (
            <div className='py-3 border-1 text-center'>جاري تحميل الإعانات...</div>
          ) : error.subventionTypes ? (
            <div className='py-3 border-1 text-center text-red-500'>خطأ في تحميل الإعانات: {error.subventionTypes}</div>
          ) : (
            <select 
              className='py-3 border-2 rounded-md border-[#B7B7B7]'
              value={selectedSubvention}
              onChange={handleSubventionChange}
              disabled={!selectedOffice}
            >
              <option value="">اختر إعانة</option>
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
              selectedOffice ? "يرجى إدخال المبلغ المدفوع" : "يرجى اختيار مكتب أولاً"
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
          <span className='font-bold text-lg'>رقم هاتف المتبرع له </span>

          <input
            type="tel"
            value={donorPhone}
            onChange={handleDonorPhoneChange}
            placeholder="أدخل رقم هاتف المتبرع له "
            className={`w-full px-3 py-3 border-2 rounded-lg text-sm md:text-base 
              focus:outline-none focus:ring-2 
              ${phoneError ? "border-red-500 focus:ring-red-500" : "border-[#979797] focus:ring-emerald-600"}
            `}
          />

          {phoneError && (
            <span className="text-red-600 text-sm">{phoneError}</span>
          )}
        </div>

        
        <div className='flex-grow'></div>
        
        {/* Pay Now Button */}
        <button
          className={`w-full flex items-center justify-center gap-3 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-sm md:text-base ${
            !selectedOffice || !donationAmount || !donorName || !donorPhone ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => { e.preventDefault(); handlePayNow(); }}
          disabled={
            !selectedOffice || !donationAmount || !donorName || !donorPhone || phoneError
          }
          style={{
            background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
          }}
        >
          <img src={money} alt="تبرع" className="w-5 h-5 md:w-6 md:h-6" />
          <span>ادفع الآن</span>
        </button>
      </div>
    </>
  )
}

export default DonateTo