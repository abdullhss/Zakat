import React from 'react'
import logo from '../../public/Logo.png'
import zakatWaslheader from '../../public/zakatWaslheader.png'
import PropTypes from 'prop-types'
import zakatWaslStamp from '../../public/5etm.png'
const ZakatWasl = ({officeName , officeId , donationDate , donationId , donationAmount , donationAmountInWords , donationPhone , donationName , donationType , donationNameForLover ,  paymentDescription}) => {
    let donationTypeText = '';

    switch (donationType) {
      case '1':
        donationTypeText = 'زكاة';
        break;
      case '2':
        donationTypeText = 'صدقة';
        break;
      case '3':
        donationTypeText = 'كفارة';
        break;
      case '4':
        donationTypeText = 'نذر';
        break;
      case '5':
        donationTypeText = 'حملة';
        break;
      case '6':
        donationTypeText = 'سلة الزكاة';
        break;
      case '7':
        donationTypeText = 'سلة الصدقة';
        break;
      case '8':
        donationTypeText = 'الأضاحي';
        break;
      case '9':
        donationTypeText = 'فدية';
        break;
      case '10':
        donationTypeText = 'التبرع لمن تحب';
        break;
      case '11':
        donationTypeText = 'زكاة الفطر';
        break;
      case '12':
        donationTypeText = 'ابراء الذمة';
        break;
      default:
        donationTypeText = 'غير محدد';
    }
    
    return (
    <div className='border-2 border-[#226A6A] rounded-lg flex flex-col bg-white'>
        <div className='p-4 flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <img src={zakatWaslheader} alt='zakatWasl' width={550} className="rounded-2xl" />
                <img src={logo} alt='zakatWasl' width={100} />
            </div>
            <div className='flex flex-col gap-0.5 items-center '>
                <div className='flex flex-col gap-4 justify-between w-full mb-1'>
                    <div className='flex items-center justify-between w-full gap-24'>
                        <ZakatWaslInput className='w-1/2 text-nowrap' width='w-1/2' inputName='المكتب' inputValue={officeName} />
                        <ZakatWaslInput className='w-1/2 justify-end text-nowrap' width='w-1/2' inputName='رقم التسلسل:' inputValue={officeId} />
                    </div>
                    <div className='flex items-center justify-between w-full gap-24'>
                        <ZakatWaslInput className='w-1/2 text-nowrap' width='w-1/2' inputName='التاريــــخ :' inputValue={donationDate} />
                        <ZakatWaslInput className='w-1/2  justify-end text-nowrap' width='w-1/2' inputName='رقم العملية:' inputValue={donationId} />
                    </div>
                </div>

                <ZakatWaslInput className='w-full' inputName='إسم: المتبرع' inputValue={donationName} />
                { donationType == 10 ? <ZakatWaslInput inputName='إسم: المتبرع له' inputValue={donationNameForLover} /> : <ZakatWaslInput inputName='الجهة: أفراد / شركات' inputValue='افراد' />}
                <ZakatWaslInput inputName='النوع' inputValue={donationTypeText} />
                <ZakatWaslInput inputName='القيمة' inputValue={donationAmount} />
                <ZakatWaslInput inputName='القيمة بالحروف' inputValue={donationAmountInWords} />
                <ZakatWaslInput inputName='رقم الهاتف' inputValue={donationPhone} />
            </div>
            <div className='flex items-center justify-end gap-6 mt-4 w-full'>
                <span className='font-medium'>الختم : </span>
                <img src={zakatWaslStamp} alt='zakatWasl' width={200}/>
            </div>
        </div>
        <div className='flex items-center justify-center w-full'>
            <div className='w-3/5 bg-gradient-to-t from-[#226A6A] to-[#18383D] flex flex-col items-center justify-center gap-1 p-2 rounded-t-[200px] h-fit'>
                <span className='text-white font-medium'>تم التحويل عن طريق منصة وصل الليبية</span>
                <span className='text-white font-medium text-sm'>للإستفسار والتواصل يرجى الإتصال على الرقم التالي 0920924026</span>
            </div>
        </div>
    </div>
  )
}

export default ZakatWasl

const ZakatWaslInput = ({inputName , inputValue , className , width = 'w-1/4'}) => {
    return (
        <div className={`flex items-center w-full ${className}`}>
            <div className={`bg-[#226A6A] text-white px-2 py-1 rounded-r-md font-medium ${width}`}>
                {inputName}
            </div>
            <div className='outline outline-2 outline-[#226A6A] px-2 py-0.5 rounded-l-md w-full'>
                {inputValue}
            </div>
        </div>
    )
}

ZakatWasl.propTypes = {
    officeName: PropTypes.string.isRequired,
    officeId: PropTypes.string.isRequired,
    donationDate: PropTypes.string.isRequired,
    donationId: PropTypes.string.isRequired,
    donationAmount: PropTypes.string.isRequired,
    donationAmountInWords: PropTypes.string.isRequired,
    donationPhone: PropTypes.string.isRequired,
    donationName: PropTypes.string.isRequired,
    donationType: PropTypes.number.isRequired,
    donationNameForLover: PropTypes.string,
    paymentDescription: PropTypes.string,
}


ZakatWaslInput.propTypes = {
inputName: PropTypes.string.isRequired,
inputValue: PropTypes.string.isRequired,
className: PropTypes.string,
width: PropTypes.string,
}
