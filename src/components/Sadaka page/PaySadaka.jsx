import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Diamond from "../Diamond";
import money from "../../public/SVGs/money.svg"
import moneyGreen from "../../public/SVGs/moneyGreen.svg"
import ShoppingCart from "../../public/SVGs/ShoppingCart.svg"
import { CalculatorIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import {motion} from "framer-motion"
import { useDispatch, useSelector } from "react-redux";
import { setShowPopup, setPopupComponent , setPopupTitle} from "../../features/PaySlice/PaySlice";
import PayComponent from "../PayComponent";

const PaySadaka = ({ 
  offices = [], 
  zakatTypes = [], 
  subventionTypes = [],
  loading = false, 
  error = null,
  selectedOffice,
  selectedAid,
  selectedCategory,
  onOfficeChange,
  onAidChange,
  onCategoryChange
}) => {
  const [donationAmount, setDonationAmount] = useState("");
  const {showPayPopup,  popupComponent} = useSelector((state) => state.pay);
  const dispatch = useDispatch();

  // Use subventionTypes from API or fallback to static aids
  const aids = subventionTypes.length > 0 
    ? subventionTypes.map(type => ({
        id: type.Id,
        name: type.SubventionTypeName
      }))
    : [];

  // Use zakatTypes from API or fallback to static categories
  const categories = zakatTypes.length > 0 
    ? zakatTypes.map(type => ({
        id: type.Id,
        name: type.ZakatTypeName?.replace(/\\r/g, '').trim()
      }))
    : [];

  // Check if the selected category is "الفقراء والمساكين" (ID: 1)
  const isAidEnabled = selectedCategory === "1";

  // Check if all required fields are filled
  const isFormValid = selectedOffice && selectedAid && selectedCategory && donationAmount;
  const isPayNowValid = selectedCategory==1? selectedOffice && selectedAid && selectedCategory && donationAmount:selectedOffice && selectedCategory && donationAmount;
  // Get selected office name
  const getSelectedOfficeName = () => {
    if (!selectedOffice) return "";
    const office = offices.find(office => {
      return (
        office.Id === selectedOffice ||
        office.Id?.toString() === selectedOffice ||
        office.id === selectedOffice ||
        office.id?.toString() === selectedOffice ||
        office.value === selectedOffice
      );
    });
    return office ? (office.OfficeName || office.officeName || office.name || office.Name || "") : "";
  };

  // Handle office selection
  const handleOfficeChange = (e) => {
    onOfficeChange(e.target.value);
  };

  useEffect(() => {
    if (selectedOffice && categories.length > 0 && !selectedCategory) {
      onCategoryChange(categories[0].id.toString());
    }
  }, [selectedOffice, categories, selectedCategory, onCategoryChange]);
  
  // Handle donation amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) > 0 && !isNaN(value))) {
      setDonationAmount(value);
    }
  };

  // Handle donate now
  const handleDonateNow = () => {
    const officeName = getSelectedOfficeName();
    dispatch(setShowPopup(true))
    dispatch(setPopupTitle("الدفع"))
    dispatch(setPopupComponent(
      <PayComponent
        officeName={officeName}
        officeId={selectedOffice}
        accountTypeId={selectedCategory} // Using category as account type
        serviceTypeId="1" // Default service type ID, adjust as needed
        totalAmount={parseFloat(donationAmount) || 0}
        currency="ريال" // Or whatever currency you're using
        actionID="2" //sadaka
        SubventionType_Id={selectedAid}
      />
    ));
    
    console.log("Donation data:", {
      office: selectedOffice,
      aid: selectedAid,
      category: selectedCategory,
      amount: donationAmount
    });
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isFormValid) {
      return;
    }
    console.log("Add to cart:", {
      office: selectedOffice,
      aid: selectedAid,
      category: selectedCategory,
      amount: donationAmount
    });
    // Add your cart logic here
  };
  
  // Safe office mapping function
  const renderOfficeOptions = () => {
    if (error) {
      return (
        <option value="" disabled>
          خطأ في تحميل البيانات
        </option>
      );
    }

    if (!Array.isArray(offices) || offices.length === 0) {
      return (
        <option value="" disabled>
          {loading ? "جاري تحميل المكاتب..." : "لا توجد مكاتب متاحة"}
        </option>
      );
    }
    
    return offices.map((office) => (
      <option
        key={office.Id}
        value={office.Id}
        className="bg-white text-black"
      >
        {office.OfficeName}
      </option>
    ));
  };

  return (
    <div className="relative flex flex-col gap-6">
      {/* Zakat header */}
      <div className="flex items-center justify-between pl-12 mt-28">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
            <Diamond className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4" />
            الصدقة
        </div>
      </div>

      <div className="px-8 lg:px-24">
        {/* dropdowns */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block mb-2 text-gray-700 font-medium">
              المكاتب
            </label>
            <select
              value={selectedOffice}
              onChange={handleOfficeChange}
              className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
              disabled={loading}
            >
              <option className="bg-white text-black" value="">
                {loading ? "جاري تحميل المكاتب..." : "اختر مكتب"}
              </option>
              {renderOfficeOptions()}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-gray-700 font-medium">
              الإعانة
            </label>
            <select
              value={selectedAid}
              onChange={(e) => onAidChange(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
              disabled={!selectedOffice || !isAidEnabled}
            >
              <option className="bg-white text-black" value="">
                {!selectedOffice 
                  ? "يرجى اختيار مكتب أولاً" 
                  : !isAidEnabled 
                    ? "غير متاح لهذا النوع من الزكاة" 
                    : aids.length === 0 
                      ? "جاري تحميل أنواع الإعانات..."
                      : "اختر إعانة"}
              </option>
              {aids.map((aid) => (
                <option
                  key={aid.id}
                  value={aid.id}
                  className="bg-white text-black"
                >
                  {aid.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        
        <hr className="border border-[#B7B7B7] mt-10" />

        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between font-medium text-lg my-4">
                <span>الاجمالي</span>
                <span>${donationAmount}</span>
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
                className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg text-sm md:text-base
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
        {/* buttons row */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            onClick={handleDonateNow}
            className={`flex-1 flex items-center justify-center gap-3 text-white font-semibold py-2 px-6 rounded-lg shadow-lg text-sm md:text-base ${
              !isPayNowValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              background:
                "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
            }}
            disabled={!isPayNowValid}
          >
            <div className="flex gap-2 items-center">
                <img src={money} alt="تبرع" className="w-5 h-5 md:w-6 md:h-6" />
                <span>تبرع الآن</span>
            </div>
            {/* <span></span> */}
          </button>

          <button
            onClick={handleAddToCart}
            className={`w-full sm:w-auto flex items-center justify-center border rounded-lg p-2 ${
              !isFormValid
                ? "border-gray-300 cursor-not-allowed"
                : "border-[#16343A]"
            }`}
            disabled={!isFormValid}
          >
            <img src={ShoppingCart} alt="سلة التسوق" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

PaySadaka.propTypes = {
  offices: PropTypes.array,
  zakatTypes: PropTypes.array,
  subventionTypes: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  selectedOffice: PropTypes.string,
  selectedAid: PropTypes.string,
  selectedCategory: PropTypes.string,
  onOfficeChange: PropTypes.func,
  onAidChange: PropTypes.func,
  onCategoryChange: PropTypes.func,
};

PaySadaka.defaultProps = {
  offices: [],
  zakatTypes: [],
  subventionTypes: [],
  loading: false,
  error: null,
  selectedOffice: "",
  selectedAid: "",
  selectedCategory: "",
  onOfficeChange: () => {},
  onAidChange: () => {},
  onCategoryChange: () => {},
};

export default PaySadaka;