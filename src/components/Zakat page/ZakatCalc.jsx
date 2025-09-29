import React, { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import money from "../../public/SVGs/moneyGreen.svg"
import PropTypes from "prop-types";
import { executeProcedure } from '../../services/apiServices';

export default function ZakatCalc({ closeZakatCalc }) {
  const [openToggles, setOpenToggles] = useState({
    cash: false,
    gold: false,
    silver: false
  });
  const [values, setValues] = useState({
    cash: '',
    gold: '',
    silver: '',
    donation: ''
  });
  const [goldKarat, setGoldKarat] = useState('');
  const [goldOptions, setGoldOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [zakatResult, setZakatResult] = useState(null);
  const [calculationDetails, setCalculationDetails] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const categories = [
    { id: 'cash', label: 'زكاة المال', placeholder: 'رجاء إدخال مبلغ التبرع', kindId: 1 },
    { id: 'gold', label: 'زكاة الذهب', placeholder: 'برجاء ادخال عدد الجرامات', kindId: 2 },
    { id: 'silver', label: 'زكاة الفضة', placeholder: 'برجاء ادخال عدد الجرامات', kindId: 3 }
  ];

  const handleToggle = (id) => {
    setOpenToggles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleInputChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const calculateZakat = async () => {
    try {
      setCalculating(true);
      setZakatResult(null);
      setCalculationDetails([]);
      setShowReceipt(false);

      // Prepare all zakat calculations
      const calculations = [];
      const details = [];
      
      // Cash Zakat (مال) - only if toggle is open and has value
      if (openToggles.cash && values.cash && parseFloat(values.cash) > 0) {
        const cashParams = `1#0#${values.cash}`;
        calculations.push({
          promise: executeProcedure("j2SYWVFNaSQEOaJaPQgHKg==", cashParams),
          type: 'cash',
          amount: values.cash,
          label: 'زكاة المال'
        });
      }

      // Gold Zakat (ذهب) - only if toggle is open and has value
      if (openToggles.gold && values.gold && parseFloat(values.gold) > 0 && goldKarat) {
        // Find the selected gold option to get its ID
        const selectedGold = goldOptions.find(option => option.value === goldKarat);
        if (selectedGold) {
          const goldParams = `2#${selectedGold.id}#${values.gold}`;
          calculations.push({
            promise: executeProcedure("j2SYWVFNaSQEOaJaPQgHKg==", goldParams),
            type: 'gold',
            amount: values.gold,
            label: `زكاة الذهب - ${selectedGold.label}`,
            karat: selectedGold.label
          });
        }
      }

      // Silver Zakat (فضة) - only if toggle is open and has value
      if (openToggles.silver && values.silver && parseFloat(values.silver) > 0) {
        const silverParams = `3#0#${values.silver}`;
        calculations.push({
          promise: executeProcedure("j2SYWVFNaSQEOaJaPQgHKg==", silverParams),
          type: 'silver',
          amount: values.silver,
          label: 'زكاة الفضة'
        });
      }

      // Check if any toggles are open but have no value
      const openButEmpty = Object.keys(openToggles).filter(id => 
        openToggles[id] && (!values[id] || parseFloat(values[id]) <= 0)
      );

      if (openButEmpty.length > 0) {
        alert('يرجى إدخال قيمة للأنواع المفتوحة لحساب الزكاة');
        return;
      }

      if (calculations.length === 0) {
        alert('يرجى فتح وإدخال قيمة واحدة على الأقل لحساب الزكاة');
        return;
      }

      // Execute all calculations
      const results = await Promise.all(calculations.map(calc => calc.promise));
      
      // Process results and create details
      let totalZakat = 0;
      results.forEach((result, index) => {
        const calc = calculations[index];
        
        if (result && result.decrypted) {
          const zakaValue = parseFloat(result.decrypted.ZakaValue) || 0;
          
          if (zakaValue > 0) {
            totalZakat += zakaValue;
            details.push({
              label: calc.label,
              amount: calc.amount,
              result: zakaValue,
              status: 'calculated'
            });
          } else {
            details.push({
              label: calc.label,
              amount: calc.amount,
              result: 0,
              status: 'below_threshold'
            });
          }
          
          console.log(`${calc.type} calculation:`, zakaValue);
        }
      });

      console.log('Total Zakat:', totalZakat);
      setZakatResult(totalZakat);
      setCalculationDetails(details);
      setShowReceipt(true);

    } catch (error) {
      console.error('Error calculating zakat:', error);
      alert('حدث خطأ في حساب الزكاة. يرجى المحاولة مرة أخرى.');
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await executeProcedure(
          "+gN72EWKhIINeJxnT9fpTxvlC+rWIXioQ20N7cIWsx4=",
          "0"
        );
        
        console.log("API Response:", response);
        console.log("Decrypted Response:", response.decrypted);

        if (response.decrypted && response.decrypted.ZakatGoldValues) {
          // Parse the ZakatGoldValues string into an array
          const goldData = JSON.parse(response.decrypted.ZakatGoldValues);
          
          // Transform the data for dropdown options
          const options = goldData.map(item => ({
            id: item.Id, // This is the ID we need for the second API
            value: item.GoldValueGrame.toString(),
            label: item.GoldValueName,
            percentage: item.GoldPercentage,
            price: item.GoldPrice
          }));
          
          setGoldOptions(options);
          console.log("Gold Options:", options);
        }
      } catch (error) {
        console.error("Error fetching gold data:", error);
        setGoldOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update gold karat if options change and no value is selected
  useEffect(() => {
    if (goldOptions.length > 0 && !goldKarat) {
      setGoldKarat(goldOptions[0].value);
    }
  }, [goldOptions, goldKarat]);

  // Calculate display total (for UI only)
  const displayTotal = zakatResult !== null ? zakatResult : 0;
  const donationAmount = parseFloat(values.donation) || 0;
  const finalTotal = displayTotal + donationAmount;

  // Reset receipt when inputs change
  useEffect(() => {
    if (showReceipt) {
      setShowReceipt(false);
      setCalculationDetails([]);
    }
  }, [values.cash, values.gold, values.silver, goldKarat, openToggles]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">حاسبة الزكاة</h1>
        <button
          onClick={() => { closeZakatCalc(false) }}
          className="w-8 h-8 flex items-center justify-center text-white"
        >
          <span className="text-xl bg-gradient-to-l p-1 from-[#17343B] via-[#18383D] to-[#24645E] rounded-md">
            <X size={20} />
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-lg font-semibold mb-6">اختر نوع الزكاة المراد حسابها</p>

        {/* Toggle Categories */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleToggle(category.id)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-base">{category.label}</span>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-5 rounded-full transition-colors ${openToggles[category.id] ? 'bg-[#16343A]' : 'bg-gray-300'} relative`}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${openToggles[category.id] ? 'right-1' : 'right-6'}`}></div>
                  </div>
                </div>
              </button>

              {openToggles[category.id] && (
                <div className="p-4 bg-gray-50 space-y-3">
                  {/* Divider Line */}
                  <div className="w-full mx-auto h-px bg-gray-300"></div>

                  {/* Gold Karat Selector */}
                  {category.id === 'gold' && (
                    <div className="relative">
                      <select
                        value={goldKarat}
                        onChange={(e) => setGoldKarat(e.target.value)}
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent appearance-none bg-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <option value="">جاري التحميل...</option>
                        ) : (
                          <>
                            <option value="" disabled>اختر العيار</option>
                            {goldOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  )}

                  {/* Input Field */}
                  <div className="relative">
                    <input
                      type="number"
                      value={values[category.id]}
                      onChange={(e) => handleInputChange(category.id, e.target.value)}
                      placeholder={category.placeholder}
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <img src={money} alt="money" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Receipt Section */}
        {showReceipt && calculationDetails.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center">تفاصيل الحساب</h3>
            <div className="space-y-3">
              {calculationDetails.map((detail, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{detail.label}</div>
                    <div className="text-xs text-gray-500">المبلغ: {detail.amount}</div>
                  </div>
                  <div className="text-left">
                    {detail.status === 'below_threshold' ? (
                      <span className="text-red-600 text-sm font-medium">المبلغ اقل من النصاب</span>
                    ) : (
                      <span className="text-green-600 font-medium">{detail.result.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Zakat */}
        <div className="mt-6 w-full px-6 mx-auto h-px bg-gray-300"></div>
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">إجمالي مستحق الزكاة</span>
            <span className="text-2xl font-bold">
              {zakatResult !== null ? zakatResult.toLocaleString() : '0'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">مبلغ إضافي</span>
              <span className="text-gray-400 text-sm">(اختياري)</span>
            </div>
            <div className="relative w-24">
              <input
                type="number"
                value={values.donation}
                onChange={(e) => handleInputChange('donation', e.target.value)}
                placeholder="0"
                className="w-full p-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                <img src={money} alt="money" />
              </div>
            </div>
          </div>
        </div>

        {/* Final Total */}
        <div className="w-full px-4 mx-auto h-px bg-gray-300"></div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-medium">الإجمالي</span>
          <span className="text-2xl font-bold">
            {finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Calculate Button fixed at bottom */}
      <div className="p-4 border-t">
        <button 
          onClick={calculateZakat}
          disabled={calculating}
          className="w-full bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white py-4 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {calculating ? 'جاري الحساب...' : 'احسب الآن'}
        </button>
      </div>
    </div>
  );
}

ZakatCalc.propTypes = {
  closeZakatCalc: PropTypes.any
}