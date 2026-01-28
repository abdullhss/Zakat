import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Diamond from "../Diamond";
import money from "../../public/SVGs/money.svg"
import moneyGreen from "../../public/SVGs/moneyGreen.svg"
import ShoppingCart from "../../public/SVGs/ShoppingCart.svg"
import { CalculatorIcon } from "lucide-react";
import ZakatCalculator from "./ZakatCalc";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux";
import { setShowPopup, setPopupComponent, setPopupTitle } from "../../features/PaySlice/PaySlice";
import PayComponent from "../PayComponent";
import { DoTransaction, executeProcedure } from "../../services/apiServices";
import cartReducer, { setCartData } from "../../features/CartSlice/CartSlice";
import { toast } from "react-toastify";
import {
  cleanAmount,
  formatAmountAsTyping,
  parseAmountToNumber
} from "../../utils/amountUtils"; // Import your utils

const PayZakat = ({
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
  onCategoryChange,
  setDonationValue
}) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [zakatPopUp, setZakatPopUp] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const amountInputRef = useRef(null);
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
      name: type.ZakatTypeName?.replace(/\\r/g, '').trim(),
      isActive: type.IsActive
    }))
    : [];

  // Check if the selected category is "الفقراء والمساكين" (ID: 1)
  const isAidEnabled = selectedCategory === "1";

  // Check if all required fields are filled
  const isFormValid = selectedOffice && selectedAid && selectedCategory && donationAmount;
  const isPayNowValid = selectedOffice && selectedCategory && donationAmount;

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

  // Handle category selection
  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value);
    // Reset aid selection when category changes (unless it's the specific category)
    if (e.target.value !== "1") {
      onAidChange("");
    }
  };

  // Handle donation amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Clean the input value
    const cleanedValue = cleanAmount(value);
    
    // Update state with cleaned value for formatting
    setDonationAmount(cleanedValue);
    
    // Send numeric value to parent (without commas)
    setDonationValue(parseAmountToNumber(cleanedValue));
  };

  // Handle amount input focus
  const handleAmountFocus = () => {
    setIsAmountFocused(true);
    // Select all text when focused for easy editing
    setTimeout(() => {
      if (amountInputRef.current) {
        amountInputRef.current.select();
      }
    }, 0);
  };

  // Handle amount input blur
  const handleAmountBlur = () => {
    setIsAmountFocused(false);
    // Format on blur
    if (donationAmount) {
      const cleanedValue = cleanAmount(donationAmount);
      setDonationAmount(cleanedValue);
      setDonationValue(parseAmountToNumber(cleanedValue));
    }
  };

  // Get formatted display value
  const getDisplayValue = () => {
    if (!donationAmount) return "";
    
    if (isAmountFocused) {
      // Show raw value while editing
      return donationAmount;
    }
    
    // Show formatted value when not focused
    return formatAmountAsTyping(donationAmount);
  };

  // Handle donate now
  const handleDonateNow = () => {
    const officeName = getSelectedOfficeName();
    dispatch(setPopupTitle("الدفع"))
    dispatch(setPopupComponent(
      <PayComponent
        officeName={officeName}
        PaymentDesc={categories[selectedCategory - 1]?.name || ""}
        officeId={selectedOffice}
        accountTypeId={selectedCategory} // Using category as account type
        serviceTypeId="1" // Default service type ID, adjust as needed
        totalAmount={parseAmountToNumber(donationAmount) || 0}
        currency="دينار" // Or whatever currency you're using
        SubventionType_Id={isAidEnabled ? selectedAid : 0}
      />
    ));
    dispatch(setShowPopup(true))
  };

  // Handle add to cart
  const cartData = useSelector((state) => state.cart);
  const userid = JSON.parse(localStorage.getItem("UserData"))?.Id;

  const safeParseArray = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (userid) {
      try {
        const cart = cartData?.cartData ?? {};
        const firstItemCount = Number(cart.CartFirstItemCount) || 0;
        const firstItems = safeParseArray(cart.CartFirstItemData);
        const firstOfficeId = firstItems?.[0]?.Office_Id ?? null;

        if (firstItemCount == 0 || firstOfficeId == selectedOffice) {
          const safeCount = firstItemCount;
          const safeUserid = userid ?? 0;
          const safeSelectedAid = isAidEnabled ? selectedAid : 0;
          const safeDonation = parseAmountToNumber(donationAmount) || 0;
          const categoryName = (categories && categories[selectedCategory - 1]?.name) || "";

          const payload = `0#${firstItems?.[0]?.Id || 0}#${safeUserid}#1#0#${selectedOffice}#${safeSelectedAid}#${safeDonation}#${categoryName}#false`;

          const response = await DoTransaction("R4O0YYBMjM1ZWmcw3ZuKbQ==", payload);

          const handleFetchCartData = async () => {
            const data = await executeProcedure(
              "ErZm8y9oKKuQnK5LmJafNAUcnH+bSFupYyw5NcrCUJ0=",
              userid
            );
            dispatch(setCartData(data.decrypted));
          };

          await handleFetchCartData();
          toast.success("تمت الاضافة إلى السلة بنجاح");
        } else {
          toast.error("يجب ان تكون جميع عناصر السلة من نفس المكتب");
        }
      } catch (err) {
        console.error("handleAddToCart error:", err);
        toast.error("حصل خطأ أثناء إضافة العنصر للسلة. حاول مرة أخرى.");
      }
    } else {
      toast.error("برجاء تسجيل الدخول أولاً");
    }
  };

  const handleZakatCalcAppeare = () => {
    setZakatPopUp((prev) => !prev)
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

  // Update donation amount from calculator
  const handleCalculatorAmount = (amount) => {
    setDonationAmount(amount.toString());
    setDonationValue(amount);
  };

  return (
    <div className="relative flex flex-col gap-6">
      {/* Zakat header */}
      <div className="flex items-center justify-between pl-12 mt-28">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
          اخرج زكاتك
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

        {/* radio buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 font-semibold ${selectedCategory === category.id.toString()
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-[#B7B7B7]"
                } ${!selectedOffice ? "opacity-50 cursor-not-allowed" : ""} ${!category.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="zakatCategory"
                value={category.id}
                checked={selectedCategory === category.id.toString()}
                onChange={handleCategoryChange}
                className="text-emerald-600 focus:ring-emerald-600"
                disabled={!selectedOffice || !category.isActive}
              />
              {category.name}
            </label>
          ))}
        </div>

        <hr className="border border-[#B7B7B7] mt-10" />

        {/* zakat calculator */}
        <div className="flex flex-col md:items-end md:flex-row items-stretch gap-6 mt-6">
          {/* card */}
          <div className="flex flex-1 flex-col md:flex-row items-start md:items-end justify-between p-4 gap-4 border border-[#B7B7B7] rounded-lg">
            <div className="flex items-start gap-2">
              <CalculatorIcon color="#000000" size={30} />
              <div className="flex flex-col justify-between gap-2">
                <h3 className="text-[#16343A] font-bold text-lg md:text-xl">
                  حاسبة الزكاة
                </h3>
                <span className="text-[#666666] text-sm md:text-base font-medium">
                  أداة ذكية لحساب الزكاة لأموالك وممتلكاتك بسهولة
                </span>
              </div>
            </div>
            <button onClick={handleZakatCalcAppeare} className="w-full md:w-auto px-4 py-2 bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white rounded-lg">
              احسب الآن
            </button>
          </div>

          {/* input field */}
          <div className="flex flex-1 items-center mt-2 md:mt-0">
            <div className="relative w-full">
              <img
                className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6"
                src={moneyGreen}
                alt="Money"
              />
              <input
                ref={amountInputRef}
                type="text"
                inputMode="decimal"
                value={getDisplayValue()}
                onChange={handleAmountChange}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                placeholder={
                  selectedOffice ? "يرجى إدخال المبلغ المدفوع (مثال: 1,000.50)" : "يرجى اختيار مكتب أولاً"
                }
                className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg text-sm md:text-base text-left
                  focus:outline-none focus:ring-2 focus:ring-emerald-600
                  placeholder:font-medium placeholder:text-right ${selectedOffice
                    ? "border-[#979797]"
                    : "border-gray-300 bg-gray-100"
                  }`}
                disabled={!selectedOffice}
              />
            </div>
          </div>
        </div>

        {/* buttons row */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            onClick={handleDonateNow}
            className={`flex-1 flex items-center justify-center gap-3 text-white font-semibold py-2 px-6 rounded-lg shadow-lg text-sm md:text-base ${!isPayNowValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            style={{
              background:
                "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
            }}
            disabled={!isPayNowValid}
          >
            <img src={money} alt="تبرع" className="w-5 h-5 md:w-6 md:h-6" />
            <span>ادفع الآن</span>
          </button>

          <button
            onClick={handleAddToCart}
            className={`w-full sm:w-auto flex items-center justify-center border rounded-lg p-2 ${!isPayNowValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            disabled={!isPayNowValid}
          >
            <img src={ShoppingCart} alt="سلة التسوق" className="w-5 h-5" />
          </button>
        </div>
      </div>
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
              <ZakatCalculator
                closeZakatCalc={setZakatPopUp}
                setDonationAmount={handleCalculatorAmount} // Updated this
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

PayZakat.propTypes = {
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
  setDonationValue: PropTypes.func
};

PayZakat.defaultProps = {
  offices: [],
  zakatTypes: [],
  subventionTypes: [],
  loading: false,
  error: null,
  selectedOffice: "",
  selectedAid: "",
  selectedCategory: "",
  onOfficeChange: () => { },
  onAidChange: () => { },
  onCategoryChange: () => { },
  setDonationValue: () => { }
};

export default PayZakat;