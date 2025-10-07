import React, { useState, useEffect } from 'react'
import Diamond from '../components/Diamond'
import { executeProcedure } from '../services/apiServices'
import moneyGreen from "../public/SVGs/moneyGreen.svg"
import money from "../public/SVGs/money.svg"
import { useDispatch } from "react-redux";
import { setShowPopup, setPopupComponent, setPopupTitle } from "../features/PaySlice/PaySlice";
import PayComponent from "../components/PayComponent";

const KafaraAndNozor = () => {
  const [activeTab, setActiveTab] = useState('kafara'); // 'kafara' or 'nothor'
  const [offices, setOffices] = useState([]);
  const [kafaraValue, setKafaraValue] = useState(0);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [nothorDescription, setNothorDescription] = useState('');
  const [kafaraDescription, setKafaraDescription] = useState('');
  const [counter, setCounter] = useState(1);
  const [kafaraAmount, setKafaraAmount] = useState('');
  const [isManualAmount, setIsManualAmount] = useState(false);
  const [loading, setLoading] = useState({ offices: true, kafaraValue: true });
  const [errors, setErrors] = useState({ offices: null, kafaraValue: null });
  
  const dispatch = useDispatch();

  // Get selected office name
  const selectedOfficeData = offices.find(office => office.Id.toString() === selectedOffice);
  const officeName = selectedOfficeData ? selectedOfficeData.OfficeName : '';

  // Validation for Pay Now button
  const isPayNowValid = selectedOffice && (
    activeTab === 'nothor' 
      ? donationAmount && parseFloat(donationAmount) > 0
      : kafaraAmount && parseFloat(kafaraAmount) > 0
  );

  // Fetch offices data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
          "0"
        );
        
        console.log("API Response:", response);
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          
          if (data.OfficesData) {
            try {
              const officesData = typeof data.OfficesData === 'string' 
                ? JSON.parse(data.OfficesData) 
                : data.OfficesData;
              
              setOffices(Array.isArray(officesData) ? officesData : []);
              console.log("Parsed offices:", officesData);
            } catch (parseError) {
              console.error("Error parsing OfficesData:", parseError);
              setOffices([]);
            }
          }
        }
        
        setErrors(prev => ({ ...prev, offices: null }));
      } catch (error) {
        console.error("Error fetching offices data:", error);
        setErrors(prev => ({ ...prev, offices: error.message }));
        setOffices([]);
      } finally {
        setLoading(prev => ({ ...prev, offices: false }));
      }
    };

    fetchData();
  }, []);

  // Fetch kafara value data
  useEffect(() => {
    const fetchKafaraValue = async () => {
      try {
        const response = await executeProcedure(
          "T8mEvmQC2AYQQYTmdNYTU/U5ngsTOI/NJy4+CGMFmAM=",
          "0"
        );
        
        console.log("Kafara Value API Response:", response);
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          
          if (data.KafaraValueData) {
            try {
              const kafaraData = typeof data.KafaraValueData === 'string' 
                ? JSON.parse(data.KafaraValueData) 
                : data.KafaraValueData;
              
              // Extract the kafara value from the array
              if (Array.isArray(kafaraData) && kafaraData.length > 0) {
                const kafaraValue = kafaraData[0].KafaraValue || 0;
                setKafaraValue(kafaraValue);
                console.log("Kafara value:", kafaraValue);
                
                // Auto-calculate initial kafara amount
                if (!isManualAmount) {
                  setKafaraAmount((kafaraValue * counter).toString());
                }
              }
            } catch (parseError) {
              console.error("Error parsing KafaraValueData:", parseError);
              setKafaraValue(0);
            }
          }
        }
        
        setErrors(prev => ({ ...prev, kafaraValue: null }));
      } catch (error) {
        console.error("Error fetching kafara value:", error);
        setErrors(prev => ({ ...prev, kafaraValue: error.message }));
        setKafaraValue(0);
      } finally {
        setLoading(prev => ({ ...prev, kafaraValue: false }));
      }
    };

    fetchKafaraValue();
  }, []);

  // Update kafara amount when counter changes
  useEffect(() => {
    if (!isManualAmount && kafaraValue > 0) {
      setKafaraAmount((kafaraValue * counter).toString());
    }
  }, [counter, kafaraValue, isManualAmount]);

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
  };

  const handleAmountChange = (e) => {
    setDonationAmount(e.target.value);
  };

  const handleNothorDescriptionChange = (e) => {
    setNothorDescription(e.target.value);
  };

  const handleKafaraDescriptionChange = (e) => {
    setKafaraDescription(e.target.value);
  };

  const handleKafaraAmountChange = (e) => {
    const value = e.target.value;
    setKafaraAmount(value);
    setIsManualAmount(value !== "" && value !== (kafaraValue * counter).toString());
  };

  const incrementCounter = () => {
    setCounter(prev => prev + 1);
  };

  const decrementCounter = () => {
    setCounter(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleCounterChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setCounter(value > 0 ? value : 1);
  };

  const resetToCalculatedAmount = () => {
    setKafaraAmount((kafaraValue * counter).toString());
    setIsManualAmount(false);
  };

  const handleDonateNow = () => {
    const amount = activeTab === 'nothor' ? donationAmount : kafaraAmount;
    const description = activeTab === 'nothor' ? nothorDescription : kafaraDescription;
    const actionID = activeTab === 'nothor' ? '4' : '3'; // 3 for kafara, 4 for nothor

    dispatch(setShowPopup(true));
    dispatch(setPopupTitle("الكفارات والنذور"));
    dispatch(setPopupComponent(
      <PayComponent
        officeName={officeName}
        officeId={selectedOffice}
        serviceTypeId="1"
        totalAmount={parseFloat(amount) || 0}
        currency="ريال"
        actionID={actionID}
        PaymentDesc={description}
      />
    ));
  };

  const renderOfficeOptions = () => {
    if (loading.offices) {
      return <option>جاري تحميل المكاتب...</option>;
    }

    if (offices.length === 0) {
      return <option>لا توجد مكاتب متاحة</option>;
    }

    return offices.map((office) => (
      <option key={office.Id} value={office.Id} className="bg-white text-black">
        {office.OfficeName} - {office.CityName}
      </option>
    ));
  };

  return (
    <div className='overflow-hidden min-h-screen'
      style={{
        backgroundImage: "url('/background pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      <div className="flex items-center justify-between pl-12 mt-28">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
          الكفارات والنذور
        </div>
      </div>
      
      <div className='w-full md:px-12 mt-8'>
        {/* Tabs */}
        <div className='w-full flex items-center gap-6 mb-8'>
          <button 
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-lg transition-all ${
              activeTab === 'kafara' 
                ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('kafara')}
          >
            الكفارات
          </button>
          <button 
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-lg transition-all ${
              activeTab === 'nothor' 
                ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('nothor')}
          >
            النذور
          </button>
        </div>

        {/* النذور Form */}
        {activeTab === 'nothor' && (
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col md:flex-row items-center gap-6'>
              <div className="flex-1 w-full">
                <label className="block mb-2 text-gray-700 font-medium">
                  المكاتب
                </label>
                <select
                  value={selectedOffice}
                  onChange={handleOfficeChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  disabled={loading.offices}
                >
                  <option className="bg-white text-black" value="">
                    {loading.offices ? "جاري تحميل المكاتب..." : "اختر مكتب"}
                  </option>
                  {renderOfficeOptions()}
                </select>
              </div>
              <div className="flex flex-1 w-full items-center">
                <div className='w-full flex flex-col'>
                  <label className="block mb-2 text-gray-700 font-medium">
                    مبلغ التبرع
                  </label>
                  <div className="relative w-full">
                    <img
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6"
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
                      className={`w-full pl-12 pr-3 py-3 border-2 rounded-lg text-sm md:text-base
                        focus:outline-none focus:ring-2 focus:ring-emerald-600
                        placeholder:font-medium ${
                          selectedOffice
                            ? "border-[#979797]"
                            : "border-gray-300 bg-gray-100"
                        }`}
                      disabled={!selectedOffice}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full'>
              <label className="block mb-2 text-gray-700 font-medium">
                الوصف (اختياري)
              </label>
              <textarea
                value={nothorDescription}
                onChange={handleNothorDescriptionChange}
                placeholder="أضف وصفاً للنذر (اختياري)"
                className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold min-h-[100px] resize-vertical"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* الكفارات Form */}
        {activeTab === 'kafara' && (
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col md:flex-row items-center gap-6'>
              <div className="flex-1 w-full">
                <label className="block mb-2 text-gray-700 font-medium">
                  المكاتب
                </label>
                <select
                  value={selectedOffice}
                  onChange={handleOfficeChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  disabled={loading.offices}
                >
                  <option className="bg-white text-black" value="">
                    {loading.offices ? "جاري تحميل المكاتب..." : "اختر مكتب"}
                  </option>
                  {renderOfficeOptions()}
                </select>
              </div>
              
              <div className="flex-1 w-full">
                <label className="block mb-2 text-gray-700 font-medium">
                  العدد
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={incrementCounter}
                    className="bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    +
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={counter}
                    onChange={handleCounterChange}
                    className="w-20 border-2 border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    onClick={decrementCounter}
                    className="bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            <div className='flex flex-col md:flex-row items-center gap-6'>
              <div className="flex-1 w-full">
                <label className="block mb-2 text-gray-700 font-medium">
                  المبلغ
                </label>
                <div className="relative w-full">
                  <img
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6"
                    src={moneyGreen}
                    alt="Money"
                  />
                  <input
                    type="number"
                    min="1"
                    value={kafaraAmount}
                    onChange={handleKafaraAmountChange}
                    placeholder="المبلغ"
                    className="w-full pl-12 pr-3 py-3 border-2 border-[#979797] rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:font-medium"
                  />
                  {isManualAmount && (
                    <button
                      onClick={resetToCalculatedAmount}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 transition-colors"
                    >
                      إعادة الحساب
                    </button>
                  )}
                </div>
                {!isManualAmount && kafaraValue > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    (المبلغ المحسوب: {kafaraValue} × {counter} = {kafaraValue * counter})
                  </p>
                )}
              </div>
            </div>

            <div className='w-full'>
              <label className="block mb-2 text-gray-700 font-medium">
                وصف الكفارة (اختياري)
              </label>
              <textarea
                value={kafaraDescription}
                onChange={handleKafaraDescriptionChange}
                placeholder="أضف وصفاً للكفارة (اختياري)"
                className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold min-h-[100px] resize-vertical"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Donate Now Button */}
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={handleDonateNow}
            className={`w-full flex items-center justify-center gap-3 text-white font-semibold py-3 px-8 rounded-lg shadow-lg text-sm md:text-base min-w-[200px] ${
              !isPayNowValid ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            style={{
              background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
            }}
            disabled={!isPayNowValid}
          >
            <img src={money} alt="تبرع" className="w-5 h-5 md:w-6 md:h-6" />
            <span>تبرع الآن</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default KafaraAndNozor