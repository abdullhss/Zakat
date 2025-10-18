/* eslint-disable react/prop-types */
import React from 'react'
import LocationIcon from "../../../../public/SVGs/LocationIcon.svg"
import Global from "../../../../public/SVGs/Global.svg"
import phone from "../../../../public/SVGs/phone.svg"
import { MapPin } from 'lucide-react'

const AboutTab = ({ officeData }) => {
  // Check if officeData exists and has the required properties
  if (!officeData) {
    return (
      <div className="p-6 m-8 rounded-lg"
        style={{background:"linear-gradient(90deg, #FFFFFF 0%, #DEDEDE 100%)"}}
      >
        <h3 className="text-xl font-bold mb-4">بيانات التواصل</h3>
        <hr className='border-[#17343B] border-[1.5px]' />
        <div className="space-y-4 mt-4">
          <div className="text-center py-4">جاري تحميل بيانات المكتب...</div>
        </div>
      </div>
    );
  }

  // Function to handle map navigation
  const handleOpenMap = () => {
    if (officeData.OfficeLatitude && officeData.OfficeLongitude) {
      const url = `https://www.google.com/maps?q=${officeData.OfficeLatitude},${officeData.OfficeLongitude}`;
      window.open(url, '_blank');
    } else {
      // Fallback to address-based map search
      const query = encodeURIComponent(`${officeData.Address}, ${officeData.CityName}`);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="p-6 m-8 rounded-lg"
      style={{background:"linear-gradient(90deg, #FFFFFF 0%, #DEDEDE 100%)"}}
    >
      <h3 className="text-xl font-bold mb-4">بيانات التواصل</h3>
      <hr className='border-[#17343B] border-[1.5px]' />
      <div className="space-y-4 mt-4">
        {/* City */}
        <div className='flex items-center gap-2 font-medium'>
          <img className='w-7' src={LocationIcon} alt="المدينة" />
          {officeData.CityName || "غير محدد"}
        </div>
        
        {/* Address */}
        <div className='flex items-center gap-2 font-medium'>
          <img className='w-7' src={Global} alt="العنوان" />
          {officeData.Address || "غير محدد"}
        </div>
        
        {/* Phone Number */}
        <div className='flex items-center gap-2 font-medium'>
          <img className='w-7' src={phone} alt="هاتف" />
          {officeData.PhoneNum || "غير محدد"}
        </div>
        
        {/* Map Navigation */}
        <button 
          className='flex items-center gap-2 font-medium cursor-pointer hover:text-[#17343B] transition-colors'
          onClick={handleOpenMap}
        >
          <MapPin color='#17343B'/>
          الانتقال الى الخريطة
        </button>
      </div>

      {/* Additional Office Information
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">معلومات المكتب</h3>
        <hr className='border-[#17343B] border-[1.5px]' />
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">اسم المكتب:</span>
            <span>{officeData.OfficeName || "غير محدد"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">الحالة:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              officeData.IsActive 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {officeData.IsActive ? "نشط" : "غير نشط"}
            </span>
          </div>
          {officeData.OfficeLatitude && officeData.OfficeLongitude && (
            <div className="flex justify-between items-center">
              <span className="font-medium">الإحداثيات:</span>
              <span className="text-sm">
                {officeData.OfficeLatitude}, {officeData.OfficeLongitude}
              </span>
            </div>
          )}
        </div>
      </div> */}
    </div>
  )
}

export default AboutTab