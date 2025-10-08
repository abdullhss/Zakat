import React, { useState } from 'react'
import Diamond from "../components/Diamond";
import { PlusIcon, Search } from "lucide-react";
import filter from "../public/SVGs/fillter.svg"
import { useDispatch } from 'react-redux';
import { setShowPopup, setPopupComponent , setPopupTitle} from "../features/PaySlice/PaySlice";
import CreateCampaign from '../components/CreateCampaign';
import { toast } from 'react-toastify';

const Campaigns = () => {

    const [activeTab, setActiveTab] = useState('donation');
    const dispatch = useDispatch();
    const UserData = JSON.parse(localStorage.getItem("UserData"));

    const handleCreateCampaign = () => {
        if(UserData.Id){
            dispatch(setPopupTitle('إنشاء حملة'));
            dispatch(setPopupComponent(
                <CreateCampaign/>
            ));
            dispatch(setShowPopup(true));
        }
        else{
            toast.error("برجاء تسجيل الدخول اولا")
        }
    }

return (
    <div className="relative overflow-hidden">
        <div
        className="z-10 mx-auto px-4 flex flex-col gap-4"
        style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
        }}
        >
            <div className="flex items-center justify-between pl-12 mt-28">
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
                الحملات
                </div>
            </div>

            <div className='flex items-center gap-6'>
                {/* Search Bar */}
                <div className="flex flex-1 items-center gap-2 bg-[#E5E9EA] border border-gray-300 rounded-lg px-3 py-2 w-72">
                    <Search className="w-5 h-5" />
                    <input
                    type="text"
                    placeholder="ابحث هنا ..."
                    className="flex-1 placeholder:text-black placeholder:font-bold bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                    <img src={filter} alt="بحث" className=" w-5 h-5" />
                </div>
                <div>
                    <button onClick={handleCreateCampaign} className='flex items-center bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] gap-2 text-white font-semibold py-2 px-5 rounded-lg shadow-md'>
                        <PlusIcon size={20} className='text-[#17343B] bg-white rounded-md'/>
                        إنشاء حملة
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className='flex items-center gap-6 mt-8'>
                <button 
                onClick={() => setActiveTab('donation')}
                className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                    activeTab === 'donation' 
                    ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                    : 'bg-[#C9C9C9] text-[#3C3C3C]'
                }`}
                >
                حملات التبرع
                </button>
                <button 
                onClick={() => {UserData.Id?setActiveTab('myCampaigns'):toast.error("برجاء تسجيل الدخول اولا")}}
                className={`flex-1 items-center gap-2 font-semibold py-2.5 px-5 rounded-lg shadow-md ${
                    activeTab === 'myCampaigns' 
                    ? 'bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white' 
                    : 'bg-[#C9C9C9] text-[#3C3C3C]'
                }`}
                >
                حملاتي
                </button>  
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'donation' && (
                    <div>
                    <h3 className="text-xl font-semibold mb-4">حملات التبرع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Donation campaigns content here */}
                        <div className="bg-white p-4 rounded-lg shadow">محتوى حملات التبرع</div>
                    </div>
                    </div>
                )}
                
                {activeTab === 'myCampaigns' && (
                    <div>
                    <h3 className="text-xl font-semibold mb-4">حملاتي</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* My campaigns content here */}
                        <div className="bg-white p-4 rounded-lg shadow">محتوى حملاتي</div>
                    </div>
                    </div>
                )}
            </div>

        </div>
        <div className="rightBow"></div>
    </div>
  )
}

export default Campaigns