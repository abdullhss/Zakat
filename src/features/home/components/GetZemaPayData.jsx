import React, { useState } from 'react'
import { setShowPopup, setPopupComponent , setPopupTitle ,openPopup} from "../../../features/PaySlice/PaySlice";
import { useDispatch } from 'react-redux';
import PayComponent from '../../../components/PayComponent';


const GetZemaPayData = () => {

    const [payAmount, setPayAmount] = useState(0) ; 
    const dispatch = useDispatch() ;
    const handlePayNow = ()=>{
            dispatch(
              openPopup({
                title: "الدفع",
                component: (
                  <PayComponent
                    totalAmount={payAmount}
                    actionID={12}
                  />
                )
              })
            );
    }
    return (
    <div className='px-6 py-2 flex flex-col gap-16'>
        <label className='flex flex-col gap-2 font-semibold'>
            ادخل المبلغ
            <input 
                type='number'
                min={0}
                value={payAmount}
                onChange={(e)=>{if(e.target.value > 0){setPayAmount(e.target.value)}}}
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg text-sm md:text-base
                focus:outline-none focus:ring-2 focus:ring-emerald-600
                placeholder:font-medium`}
            >
            </input>
        </label>
        <button
            className={`w-full flex items-center justify-center gap-3 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-sm md:text-base `}
            onClick={(e) => { e.preventDefault(); handlePayNow(); }}
            style={{
            background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
            }}
        >
            ادفع الان
        </button>
    </div>
  )
}

export default GetZemaPayData