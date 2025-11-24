import React, { useEffect, useState } from 'react'
import Diamond from '../components/Diamond'
import moneyWhite from "../public/SVGs/moneyWhite.svg"
import { ChevronDown, Trash2, X } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion"
import { DoMultiTransaction, executeProcedure } from '../services/apiServices'
import { useDispatch } from 'react-redux'
import { setShowPopup, setPopupComponent, setPopupTitle } from "../features/PaySlice/PaySlice";
import PayComponent from "../components/PayComponent";

const Sacrifice = () => {
  const [accordions, setAccordions] = useState([
    {
      id: 'fedia',
      title: 'فدية',
      description: 'عند فعل محظور من محظورات الإحرام',
      items: []
    },
    {
      id: 'sadaka',
      title: 'صدقة',
      description: 'اطعام وخير وقربه الى الله عز وجل',
      items: []
    },
    {
      id: 'akika',
      title: 'عقيقة',
      description: 'شطر لله على المولود',
      items: []
    }
  ])

  const [loading, setLoading] = useState(true)
  const [showReceipt, setShowReceipt] = useState(false)
  const [offices, setOffices] = useState([])
  const [selectedOffice, setSelectedOffice] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [ projectId , setProjectId] = useState() ;
  const dispatch = useDispatch() ; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await executeProcedure("0V3HF8ODsBqiZxlZyMzcGPMr+f0FRBb9gGH90HPX0fI=", "1#100")
        console.log(response.decrypted)
        
        if (response.decrypted && response.decrypted.SacrificeTypesData) {
          // Parse the JSON string from the response
          const sacrificeTypes = JSON.parse(response.decrypted.SacrificeTypesData)
          
          // Update all accordions with the fetched data
          setAccordions(prev => prev.map(accordion => ({
            ...accordion,
            items: sacrificeTypes.map(type => ({
              id: type.Id,
              name: type.SacrificeTypeName,
              price: type.SacrificeTypePrice,
              count: 0
            }))
          })))
        }
      } catch (error) {
        console.error('Error fetching sacrifice types:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate total count and price across all accordions
  const totalCount = accordions.reduce((total, accordion) => {
    return total + accordion.items.reduce((acc, item) => acc + item.count, 0)
  }, 0)

  const totalPrice = accordions.reduce((total, accordion) => {
    return total + accordion.items.reduce((acc, item) => acc + (item.price * item.count), 0)
  }, 0)

  // Get all selected items for receipt
  const getSelectedItems = () => {
    const selectedItems = []
    accordions.forEach(accordion => {
      accordion.items.forEach(item => {
        if (item.count > 0) {
          selectedItems.push({
            accordionTitle: accordion.title,
            name: item.name,
            count: item.count,
            price: item.price,
            total: item.price * item.count
          })
        }
      })
    })
    return selectedItems
  }

  // Update count for a specific item
  const updateItemCount = (accordionId, itemId, newCount) => {
    setAccordions(prev => prev.map(accordion => {
      if (accordion.id === accordionId) {
        return {
          ...accordion,
          items: accordion.items.map(item => 
            item.id === itemId 
              ? { ...item, count: Math.max(0, newCount) }
              : item
          )
        }
      }
      return accordion
    }))
  }

  // Reset all counts
  const resetAll = () => {
    setAccordions(prev => prev.map(accordion => ({
      ...accordion,
      items: accordion.items.map(item => ({ ...item, count: 0 }))
    })))
    setShowReceipt(false)
  }

  const handleProceedToPay = async () => {
    if (!selectedOffice) {
      alert('يرجى اختيار المكتب أولاً')
      return
    }
    
    setShowReceipt(true);
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    const storedUser = localStorage.getItem("UserData");
    const userID = storedUser ? JSON.parse(storedUser)?.Id : 0;
    
    // Collect all selected items from all accordions
    const selectedItems = [];
    accordions.forEach(accordion => {
      accordion.items.forEach(item => {
        if (item.count > 0) {
          selectedItems.push({
            accordionId: accordion.id, // 'fedia', 'sadaka', 'akika'
            accordionTitle: accordion.title,
            itemId: item.id,
            itemName: item.name,
            count: item.count,
            price: item.price,
            total: item.price * item.count
          });
        }
      });
    });

    const repeatedKey = Array(selectedItems.length)
      .fill("kAFkdKp7DkzI4pr68GyuFasVrqQM9BlA6boVaGxe6xs=")
      .join("^");

    const MultiTableName = `akNrCC3HOjYZr7wlP2MSFg==^${repeatedKey}`;
    console.log('MultiTableName:', MultiTableName);
    
    // Static columns values (main order)
    const staticColumnsValue = `0#${formattedDate}#${selectedOffice}#${userID}#${totalPrice}#False#default#0#False`;
    
    // Build dynamic values for each selected item
    const dynamicValues = selectedItems.map(item => {
      // Map accordion id to SacrificeCategory_Id
      let sacrificeCategoryId;
      switch(item.accordionId) {
        case 'fedia':
          sacrificeCategoryId = 1;
          break;
        case 'sadaka':
          sacrificeCategoryId = 2;
          break;
        case 'akika':
          sacrificeCategoryId = 3;
          break;
      }
      
      return `0#0#${sacrificeCategoryId}#${item.itemId}#${item.count}#${item.price}#${item.total}`;
    });

    
    const MultiColumnsValues = `${staticColumnsValue}^${dynamicValues.join('^')}`;
    
    console.log('MultiColumnsValues:', MultiColumnsValues);
    
    const MultiTransaction = await DoMultiTransaction(MultiTableName, MultiColumnsValues);
    setProjectId(MultiTransaction.MultiIdinties.split(",")[0])
  };

  const handlePayment = () => {
    if (!selectedOffice) {
      alert('يرجى اختيار المكتب أولاً')
      return
    }
    dispatch(setPopupTitle("الدفع"));
    dispatch(setPopupComponent(
      <PayComponent
      Project_Id={projectId}
      actionID={8}
      officeId={selectedOffice}
      totalAmount={totalPrice}
      officeName={offices[selectedOffice].OfficeName}
      />
    ));
    dispatch(setShowPopup(true));
  }

  const getAllOffices = async () => {
    try {
      const response = await executeProcedure(
        "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
        "0"
      );
      if (response.decrypted && response.decrypted.OfficesData) {
        const officesData = JSON.parse(response.decrypted.OfficesData);
        setOffices(officesData);
        
        // Extract unique cities
        const uniqueCities = [...new Set(officesData.map(office => office.CityName))];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error('Error fetching offices:', error);
    }
  }

  useEffect(() => {
    getAllOffices();
  }, []);

  // Filter offices by selected city
  const filteredOffices = selectedCity 
    ? offices.filter(office => office.CityName === selectedCity)
    : offices;

  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18383D] mx-auto"></div>
          <p className="mt-4 text-[#18343A]">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  const selectedItems = getSelectedItems()

  return (
    <div className="relative overflow-hidden">
      {/* Receipt Popup */}
      {showReceipt && (
        <div onClick={()=>{    setShowReceipt(false)}} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-t-2xl text-white p-6">
              <button 
                onClick={() => setShowReceipt(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center">
                <h2 className="text-xl font-bold">إيصال الطلب</h2>
                <p className="text-sm opacity-90 mt-1">ملخص طلب الأضاحي</p>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-6">
              {/* Selected Office */}
              {selectedOffice && (
                <div className='flex items-center gap-2 font-bold'>
                  <h4 className="font-semibold text-[#16343A] text-sm ">المكتب المختار:</h4>
                  <p className="text-[#16343A] text-sm">
                    {offices.find(office => office.Id.toString() === selectedOffice)?.OfficeName}
                  </p>
                </div>
              )}

              {/* Selected Items */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-[#16343A] text-lg border-b-2 border-[#18383D] pb-2">
                  الأضاحي المختارة
                </h3>
                
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#16343A]">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.accordionTitle}</p>
                        <p className="text-xs text-gray-500">الكمية: {item.count}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-[#16343A]">
                          {item.total.toLocaleString()} د.ل
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.price.toLocaleString()} د.ل لكل واحد
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">لا توجد أضاحي مختارة</p>
                )}
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">العدد الكلي:</span>
                  <span className="font-semibold">{totalCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">الإجمالي:</span>
                  <span className="font-bold text-lg text-[#16343A]">
                    {totalPrice.toLocaleString()} د.ل
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)"
                }}
              >
                <img src={moneyWhite} alt="money icon" className="w-5 h-5" />
                الدفع الآن
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => setShowReceipt(false)}
                className="w-full mt-3 px-6 py-3 rounded-xl text-[#16343A] border-2 border-[#16343A] font-medium hover:bg-[#16343A] hover:text-white transition-all"
              >
                تعديل الطلب
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen z-10 mx-auto px-4 flex flex-col gap-4"
        style={{
          backgroundImage: "url('/background pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-4 md:pl-12 mt-20 md:mt-28">
          <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg md:text-2xl px-4 md:px-8 py-2">
            <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
            الأضاحي
          </div>
        </div>

        <h2 className='font text-center md:text-right text-lg font-medium p-2'>
          خدمة لتوكيل ذبح الأضاحي و توزيعها علي مستحقيها
        </h2>


        {/* Content */}
        <div className='flex flex-col gap-6 md:gap-8 mt-4 md:mt-6'>
          {/* Office Selection */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
            <div className=" gap-4">
              {/* Office Selection */}
              <div>
                <label className="font-bold block text-lg text-[#16343A] mb-2 text-right">
                  اختر المكتب
                </label>
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 font-medium border-gray-300 focus:border-[#18383D] focus:ring-2 focus:ring-[#18383D] focus:ring-opacity-20 outline-none transition-all text-right bg-white"
                >
                  <option value="">اختر المكتب</option>
                  {filteredOffices.map((office) => (
                    <option key={office.Id} value={office.Id}>
                      {office.OfficeName} - {office.Address}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Accordions */}
            <div className='lg:col-span-2 flex flex-col gap-4 md:gap-6'>
              {accordions.map((accordion) => {
                const accordionTotal = accordion.items.reduce((sum, item) => sum + (item.price * item.count), 0)
                const accordionCount = accordion.items.reduce((sum, item) => sum + item.count, 0)
                
                return (
                  <Accordion key={accordion.id} type="single" collapsible>
                    <AccordionItem
                      value={accordion.id}
                      className="rounded-xl overflow-hidden border-none"
                      style={{
                        background: "linear-gradient(90deg, #FCFCFC 0%, #CFCFCF 100%)",
                      }}
                    >
                      <AccordionTrigger className="px-4 py-3 text-right hover:no-underline focus:no-underline data-[state=open]:no-underline">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col items-start">
                            <span className="text-base md:text-lg font-semibold text-[#16343A]">
                              {accordion.title}
                            </span>
                            <span className="text-xs md:text-sm text-gray-600">
                              {accordion.description}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {accordionCount > 0 && (
                              <span className="text-xs bg-[#16343A] text-white px-2 py-1 rounded-full">
                                {accordionCount}
                              </span>
                            )}
                            <span className="text-[#16343A] text-base md:text-lg font-bold mx-2">
                              {accordionTotal.toLocaleString()} د.ل
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-4 py-3 bg-transparent">
                        {accordion.items.length > 0 ? (
                          accordion.items.map((item, index) => (
                            <div 
                              key={item.id} 
                              className={`flex justify-between items-center py-3 ${
                                index > 0 ? 'border-t-2 border-[#18383D]' : ''
                              }`}
                            >
                              <div className="flex-1">
                                <h3 className="text-[#16343A] font-semibold text-sm md:text-base">
                                  {item.name}
                                </h3>
                                <p className="text-gray-500 text-xs md:text-sm">
                                  السعر: {item.price.toLocaleString()} دينار
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateItemCount(accordion.id, item.id, item.count - 1)}
                                  className="bg-[#16343A] text-white rounded-md w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-sm md:text-base hover:bg-[#1a444a] transition-colors"
                                >
                                  −
                                </button>
                                <span className="text-sm md:text-base font-semibold text-[#16343A] min-w-8 text-center">
                                  {item.count}
                                </span>
                                <button
                                  onClick={() => updateItemCount(accordion.id, item.id, item.count + 1)}
                                  className="bg-[#16343A] text-white rounded-md w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-sm md:text-base hover:bg-[#1a444a] transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            لا توجد أنواع أضاحي متاحة
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              })}
            </div>

            {/* Total Summary */}
            <div className='lg:col-span-2 flex flex-col h-fit gap-3 p-4 md:p-6 rounded-md'
              style={{background:"linear-gradient(180deg, #FCFCFC 0%, #CFCFCF 100%)"}}
            >
              <div className='w-full flex items-center justify-between font-medium text-sm md:text-base'>
                <span>العدد الكلي</span>
                <span>{totalCount}</span>
              </div>
              
              <div className='flex items-center justify-between font-bold text-base md:text-lg'>
                <span>إجمالي المبلغ</span>
                <span>{totalPrice.toLocaleString()} د.ل</span>
              </div>

              <hr className='border-[1.5px] border-[#18383D] my-2' />
              
              <div className='flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between'>
                <button 
                  onClick={handleProceedToPay}
                  disabled={totalCount === 0 || !selectedOffice}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-medium text-sm md:text-base transition-all ${
                    totalCount === 0 || !selectedOffice
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'hover:opacity-90'
                  }`}
                  style={{
                    background: totalCount === 0 || !selectedOffice
                      ? '#gray-400' 
                      : "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)"
                  }}
                >
                  <img src={moneyWhite} alt="money icon" className="w-4 h-4 md:w-5 md:h-5" />
                  متابعة الدفع
                </button>

                <button 
                  onClick={resetAll}
                  disabled={totalCount === 0}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm md:text-base transition-all ${
                    totalCount === 0
                      ? 'text-gray-400 border-2 border-gray-400 cursor-not-allowed'
                      : 'text-[#F04F32] border-2 border-[#F04F32] hover:text-white hover:bg-[#F04F32]'
                  }`}
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  حذف الكل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rightBow"></div>
    </div>
  )
}

export default Sacrifice