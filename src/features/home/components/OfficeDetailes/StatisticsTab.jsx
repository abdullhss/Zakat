import React from 'react'

const StatisticsTab = () => {
  return (
    <div>
        <div className='mt-8 mx-8 border-[1.5px] border-black rounded-lg'>
            {/* First Row */}
            <div className='grid grid-cols-3 items-center py-3 mx-8 border-b-2 border-black'>
                <div className='flex flex-col items-center gap-3 text-center px-4'>
                    <span className='text-[#8E6D4C] text-lg font-bold'>عدد فرص التبرعات</span>
                    <span className='text-[#7B7B7B] font-medium'><span className='font-medium text-black'>10</span > فرص </span>
                </div>
                
                {/* Vertical line */}
                <div className='w-[2px] h-16 bg-black justify-self-center'></div>

                <div className='flex flex-col items-center gap-3 text-center px-4'>
                    <span className='text-[#8E6D4C] text-lg font-bold'>عدد المستفيدين</span>
                    <span className='text-[#7B7B7B] font-medium'><span className='font-medium text-black'>10</span > فرص </span>
                </div>
            </div>

            {/* Second Row */}
            <div className='grid grid-cols-3 items-center py-3 mx-8'>
                <div className='flex flex-col gap-3 items-center text-center px-4'>
                    <span className='text-[#8E6D4C] text-lg font-bold'>فرص التبرعات المتاحة</span>
                    <span className='text-[#7B7B7B] font-medium'><span className='font-medium text-black'>10</span > فرص </span>
                </div>

                {/* Vertical line */}
                <div className='w-[2px] h-16 bg-black justify-self-center'></div>
                
                <div className='flex flex-col gap-3 items-center text-center px-4'>
                    <span className='text-[#8E6D4C] text-lg font-bold'>الفرص المكتملة</span>
                    <span className='text-[#7B7B7B] font-medium'><span className='font-medium text-black'>10</span > فرص </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default StatisticsTab