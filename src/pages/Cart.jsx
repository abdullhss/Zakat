import React, { useEffect, useState } from 'react'
import Diamond from '../components/Diamond'
import Salla from "../public/SVGs/Salla.svg"
import { Search } from 'lucide-react'
import filter from "../public/SVGs/fillter.svg"
import { executeProcedure } from '../services/apiServices'
import SallaCard from '../components/SallaCard'
import money from "../../public/coins.webp";
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setShowPopup, setPopupComponent, setPopupTitle } from "../features/PaySlice/PaySlice";
import PayComponent from '../components/PayComponent'

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [activeTab, setActiveTab] = useState("charity");
  const [searchTerm, setSearchTerm] = useState("");
  const userid = JSON.parse(localStorage.getItem("UserData"))?.Id || 0;
  const dispatch = useDispatch() ;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await executeProcedure("5wqtvajPizixFRBAU+AEElAsxJWj3ghjcdWQmhzmZpg=", userid);
      
      
      if (response.decrypted) {
        const parsedData = {
          ...response.decrypted,
          CartZakatData: JSON.parse(response.decrypted.CartZakatData || "[]"),
          CartSadqaData: JSON.parse(response.decrypted.CartSadqaData || "[]")
        };
        setCartData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleDeleteItem = async (itemId, isCharity = false) => {
    // Implement delete functionality here
    
    // You'll need to call an API to remove the item from cart
    // Then refetch the data
    // await deleteCartItem(itemId, isCharity);
    // fetchData();
  };

  const getCurrentData = () => {
    if (!cartData) return [];
    
    const data = activeTab === "charity" ? cartData.CartSadqaData : cartData.CartZakatData;
    
    // Filter by search term
    return data.filter(item => 
      item.ProjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.OfficeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.SubventionTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ItemDesc?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getOfficeName = () => {
    const data = getCurrentData();
    return data.length > 0 ? data[0].OfficeName : "لا يوجد مكاتب";
  };

  const getSummaryData = () => {
    if (!cartData) return { count: 0, total: 0 };
    
    if (activeTab === "charity") {
      return {
        count: parseInt(cartData.CartSadqaItemsCount) || 0,
        total: parseInt(cartData.CartSadqaTotalValue) || 0
      };
    } else {
      return {
        count: parseInt(cartData.CartZakatItemsCount) || 0,
        total: parseInt(cartData.CartZakatTotalValue) || 0
      };
    }
  };

  const currentData = getCurrentData();
  
  const summary = getSummaryData();
  const officeName = getOfficeName();
  const cartFirstItemData = useSelector(state => state.cart.cartData?.CartFirstItemData);

  let projectid = null;
  try {
    if (cartFirstItemData) {
      const parsed = typeof cartFirstItemData === "string" 
        ? JSON.parse(cartFirstItemData) 
        : cartFirstItemData;
      projectid = parsed[0]?.Id || null;
    }
  } catch (err) {
    console.error("Error parsing CartFirstItemData:", err);
  }
  
  const handlePayCart = ()=>{
    
    
    dispatch(setShowPopup(true));
    dispatch(setPopupTitle("الدفع"));
    dispatch(setPopupComponent(
        <PayComponent
            Project_Id={projectid}
            totalAmount={summary.total}
            actionID={activeTab === "charity" ? 7 : 6}
            officeId={currentData[0].Office_Id}
            officeName={currentData[0].OfficeName}
            Salla={true}
        />
    ));
  }
  return (
    <div
      className="relative flex flex-col gap-6 overflow-hidden min-h-screen"
      style={{
        backgroundImage: "url('/background pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      {/* Zakat header */}
      <div className="flex items-center justify-between pl-12 mt-28">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
          السلة
        </div>
      </div>

      {/* Summary Section */}
      {cartData && (
        <div className="px-4 lg:px-8">
          <div className="flex flex-col gap-6 bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-[#16343A]">
                  {officeName}
                </h3>
                <p className="text-gray-600">
                  {activeTab === "charity" ? "الصدقات" : "الزكاة"}
                </p>
              </div>
              <div className="text-left">
                <p className="font-bold text-[#16343A]">
                  العدد: {summary.count}
                </p>
                <p className="font-bold text-[#16343A]">
                  الإجمالي: {summary.total}$
                </p>
              </div>
            </div>
            <button
                onClick={handlePayCart}
                className='bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white rounded-lg py-3'
            >
                المتابعة للدفع
            </button>
          </div>
        </div>
      )}

      {/* Search & Tabs */}
      <div className="w-full flex flex-col px-4 lg:px-8">
        {/* Search bar */}
        <div className="w-full flex flex-1 items-center gap-2 bg-[#E5E9EA] border border-gray-300 rounded-lg px-3 py-2">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث هنا ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full flex-1 placeholder:text-black placeholder:font-bold bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <img src={filter} alt="بحث" className="w-5 h-5" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 justify-between mt-4">
          <button
            onClick={() => setActiveTab("charity")}
            className={`w-full flex-1 py-3 rounded-lg font-bold transition-colors duration-300 ${
              activeTab === "charity"
                ? "bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white"
                : "bg-[#C9C9C9] text-[#3C3C3C]"
            }`}
          >
            الصدقات
          </button>

          <button
            onClick={() => setActiveTab("zakat")}
            className={`w-full flex-1 py-3 rounded-lg font-bold transition-colors duration-300 ${
              activeTab === "zakat"
                ? "bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] text-white"
                : "bg-[#C9C9C9] text-[#3C3C3C]"
            }`}
          >
            الزكاة
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 lg:px-8 pb-8">
        {cartData ? (
          currentData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((item) => (
                <SallaCard
                  key={item.Id}
                  image={money}
                  title={item.ProjectName || item.SubventionTypeName || item.ItemDesc || "تبرع"}
                  description={item.OfficeName}
                  collected={item.PaymentValue}
                  goal={item.PaymentValue * 1.5} // Example goal calculation
                  price={item.PaymentValue}
                  onDelete={() => handleDeleteItem(item.Id, activeTab === "charity")}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <img src={Salla} alt="Empty Cart" className="w-48 h-48 mb-4" />
              <p className="font-bold text-lg text-center">
                {searchTerm
                  ? "لا توجد نتائج للبحث"
                  : activeTab === "charity"
                  ? "ليس لديك أي صدقات مضافة للسلة"
                  : "ليس لديك أي زكاة مضافة للسلة"}
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24645E]"></div>
            <p className="mt-4 font-bold text-lg">جاري تحميل البيانات...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;