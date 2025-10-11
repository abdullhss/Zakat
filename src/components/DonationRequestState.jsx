import React from 'react'
import { Phone, Users } from 'lucide-react'
import proptypes from 'prop-types';

const DonationRequestState = ({ data, status }) => {
  const statusConfig = {
    pending: {
      text: 'معلق',
      bgColor: '#E6B017'
    },
    accepted: {
      text: 'مقبول', 
      bgColor: '#18383D'
    },
    rejected: {
      text: 'مرفوض',
      bgColor: '#F04F32'
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
      <div className="mx-auto rounded-xl shadow-lg p-6 w-full"
        style={{background: "linear-gradient(180deg, #FCFCFC 0%, #CFCFCF 100%)"}}
      >
        <div className="flex flex-col items-start justify-between mb-6">
          <h1 className="text-xl flex w-full items-center justify-between font-semibold text-gray-800">
                    <span>{data?.AssistanceName || 'مجدي امين محمد'}</span>
                    <div className="mb-6 flex justify-end">
                    <span 
                      className="text-white px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: currentStatus.bgColor }}
                    >
                      {currentStatus.text}
                    </span>
                    </div>
          </h1>
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-teal-700" />
            <span className="text-black">{data?.MobileNum || '+092000000'}</span>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <Users className="w-5 h-5 text-teal-700" />
            <span className="text-gray-600 text-sm">عدد الافراد {data?.PersonsCount || 5}</span>
          </div>
        </div>

        <div className="flex items-center font-bold justify-between mb-6 pt-4 border-t-2 border-[#979797]">
          <span className="text-black text-lg">المبلغ</span>
          <span className="text-xl font-bold text-gray-800">$ {data?.WantedAmount || '200.00'}</span>
        </div>

        <div className="flex items-center font-bold justify-between mb-6 pb-4 border-b-2 border-[#979797]">
          <span className="text-black">نوع التبرع</span>
          <span className="text-black">{data?.SubventionTypeName || 'مشاريع'}</span>
        </div>

        <div className="mb-4">
          <h2 className="text-black text-lg mb-3 font-semibold">وصف الحالة</h2>
          <p className="text-[#666666] text-sm leading-relaxed font-medium">
            {data?.AssistanceDesc || 'Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent torquent per'}
          </p>
        </div>
      </div>
  )
}

export default DonationRequestState
DonationRequestState.propTypes = {
  data: proptypes.any,
  status: proptypes.oneOf(['pending', 'accepted', 'rejected']).isRequired,
};