import React, { useState, useEffect } from 'react'
import Diamond from '../components/Diamond'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import money from "../public/SVGs/moneyGreen.svg"
import phone from "../public/SVGs/phone.svg"
import { DoTransaction, executeProcedure } from '../services/apiServices'
import { toast } from 'react-toastify'

const DonationRequest = () => {
  const [offices, setOffices] = useState([])
  const [filters, setFilters] = useState([])
  const [activeFilter, setActiveFilter] = useState(0)
  const [loading, setLoading] = useState({ offices: true, filters: true })
  const [errors, setErrors] = useState({ offices: null, filters: null })

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    individualsCount: '',
    phone: '',
    amount: '',
    officeId: '',
    donationTypeId: '',
    description: ''
  })

  // fetch offices from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
          "0"
        );
        
        console.log("API Response:", response);
        console.log("Decrypted Response:", response.decrypted);
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          
          // Check if OfficesData exists and parse it
          if (data.OfficesData) {
            try {
              // If OfficesData is a string, parse it, otherwise use it directly
              const officesData = typeof data.OfficesData === 'string' 
                ? JSON.parse(data.OfficesData) 
                : data.OfficesData;
              
              setOffices(Array.isArray(officesData) ? officesData : []);
              console.log("Parsed offices:", officesData);
            } catch (parseError) {
              console.error("Error parsing OfficesData:", parseError);
              setOffices([]);
            }
          }
        }
        
        setErrors(prev => ({ ...prev, offices: null }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors(prev => ({ ...prev, offices: error.message }));
        setOffices([]);
      } finally {
        setLoading(prev => ({ ...prev, offices: false }));
      }
    };

    fetchData();
  }, []);

  // fetch types of donations from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await executeProcedure(
          "CjSj0j5kAa/aqk9LMpWvCavGukOw8WsDmvfzbXkXVaI=",
          "1#100"
        )
        
        console.log("Filters response:", response)
        
        if (response && response.decrypted && response.decrypted.SubventionTypesData) {
          const parsedFilters = JSON.parse(response.decrypted.SubventionTypesData)
          console.log("Parsed filters:", parsedFilters)
          
          const allFilter = { Id: 0, SubventionTypeName: "الكل" }
          const filterObjects = [allFilter, ...parsedFilters]
          
          setFilters(filterObjects)
          setActiveFilter(0)
        }
      } catch (error) {
        console.error("Error fetching filters:", error)
        setErrors(prev => ({ ...prev, filters: error.message }))
      } finally {
        setLoading(prev => ({ ...prev, filters: false }))
      }
    }

    fetchFilters()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    const userid = JSON.parse(localStorage.getItem('UserData'))?.Id || 0
    const response = await DoTransaction("g+a67fXnSBQre/3SDxT2uA==",
      `0#${formData.name}#${formData.individualsCount}#${formData.phone}#${formData.amount}#${formData.officeId}#${formData.donationTypeId}#${formattedDate}#False#default#True#${userid}#${formData.description}`
    )
    console.log(response.success);
    if(response.success==200){
        setFormData({
        name: '',
        individualsCount: '',
        phone: '',
        amount: '',
        officeId: '',
        donationTypeId: '',
        description: ''
      })
      toast.success("تم انشاء الطلب بنجاح")
    }
  }

  return (
    <div className='overflow-hidden min-h-screen'
      style={{
        backgroundImage: "url('/background pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between sm:px-6 lg:pr-0 lg:pl-12 mt-24 lg:mt-28 gap-4">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl lg:text-2xl px-10 sm:px-8 py-2 w-fit text-center">
          <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
          طلبات التبرع
        </div>
        
        <div className='w-full lg:w-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='font-bold text-base sm:text-lg text-center sm:text-right w-full lg:w-auto'>
            برجاء ملئ البيانات للنظر ف طلبك
          </div>
          <button
            className='text-white px-6 py-2 rounded-lg font-normal shadow-lg w-[92%] sm:w-auto text-sm sm:text-base'
            style={{background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)"}}
          >
            متابعة طلب سابق
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-4 sm:px-6 lg:px-12 mt-6 lg:mt-8">
        <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
          {/* First Row: الاسم و عدد الافراد */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                الاسم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="رجاء إدخال الاسم"
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                عدد الأفراد <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="individualsCount"
                  value={formData.individualsCount}
                  onChange={handleInputChange}
                  placeholder="رجاء إدخال عدد الأفراد"
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Second Row: رقم الهاتف و المبلغ */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="رجاء إدخال رقم الهاتف"
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300 pl-12"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <img className='w-6 h-6 sm:w-8 sm:h-8' src={phone} alt="Phone" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                المبلغ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="رجاء إدخال المبلغ"
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300 pl-12"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <img className='w-6 h-6 sm:w-8 sm:h-8' src={money} alt="Money" />
                </div>
              </div>
            </div>
          </div>

          {/* Third Row: المكاتب و نوع التبرع */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                المكاتب
              </label>
              <div className="relative">
                <select 
                  name="officeId"
                  value={formData.officeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300 bg-white"
                  disabled={loading.offices}
                >
                  <option value="">اختر المكتب</option>
                  {offices.map(office => (
                    <option key={office.Id} value={office.Id}>
                      {office.OfficeName || office.Name}
                    </option>
                  ))}
                </select>
                {loading.offices && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-800"></div>
                  </div>
                )}
              </div>
              {errors.offices && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.offices}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                نوع التبرع
              </label>
              <div className="relative">
                <select 
                  name="donationTypeId"
                  value={formData.donationTypeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300 bg-white"
                  disabled={loading.filters}
                >
                  <option value="">اختر نوع التبرع</option>
                  {filters
                    .filter(filter => filter.Id !== 0) // Remove the "الكل" option
                    .map(filter => (
                      <option key={filter.Id} value={filter.Id}>
                        {filter.SubventionTypeName}
                      </option>
                    ))
                  }
                </select>
                {loading.filters && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-800"></div>
                  </div>
                )}
              </div>
              {errors.filters && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.filters}</p>
              )}
            </div>
          </div>

          {/* Fourth Row: وصف الحالة */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
              وصف الحالة <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="رجاء إدخال وصف الحالة"
                className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300 resize-vertical"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center my-6 lg:my-8">
            <button
              type="submit"
              className="w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 text-white px-6 sm:px-12 py-3 rounded-lg font-bold text-base sm:text-lg shadow-lg transition-all hover:scale-105 mb-6 lg:mb-8"
              style={{ background: "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)" }}
            >
              طلب
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DonationRequest