import React from 'react'

const StatisticsTab = () => {
  return (
    <div>
        <div className='mt-8 mx-8 border-[1.5px] border-black rounded-lg'>
            {/* First Row */}
            <div className='grid grid-cols-3 items-center py-3 mx-8 border-b border-black'>
                <div className='flex flex-col items-center gap-3 text-center px-4'>
                    <span className='text-[#8E6D4C] font-bold'>عدد فرص التبرعات</span>
                    <span>10 فرص</span>
                </div>
                
                {/* Vertical line */}
                <div className='w-[1px] h-16 bg-black justify-self-center'></div>

                <div className='flex flex-col items-center gap-3 text-center px-4'>
                    <span className='text-[#8E6D4C] font-bold'>عدد المستفيدين</span>
                    <span>10 فرص</span>
                </div>
            </div>

            {/* Second Row */}
            <div className='grid grid-cols-3 items-center py-3 mx-8'>
                <div className='flex flex-col gap-3 items-center text-center px-4'>
                    <span className='text-[#8E6D4C] font-bold'>فرص التبرعات المتاحة</span>
                    <span>10 فرص</span>
                </div>

                {/* Vertical line */}
                <div className='w-[1px] h-16 bg-black justify-self-center'></div>
                
                <div className='flex flex-col gap-3 items-center text-center px-4'>
                    <span className='text-[#8E6D4C] font-bold'>الفرص المكتملة</span>
                    <span>10 فرص</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default StatisticsTab