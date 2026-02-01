import React, { useState, useEffect } from 'react'
import Diamond from '../components/Diamond'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import money from "../public/SVGs/moneyGreen.svg"
import phone from "../public/SVGs/phone.svg"
import { DoTransaction, executeProcedure } from '../services/apiServices'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents , useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import PropTypes from "prop-types";
import NewHeader from "../features/home/components/NewHeader";
import headerBackground from "../../public/header backgrounds/taleb23ana.png" ;

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<div style="background-color: #24645E; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DonationRequest = () => {
  const [offices, setOffices] = useState([])
  const [filters, setFilters] = useState([])
  const [activeFilter, setActiveFilter] = useState(0)
  const [loading, setLoading] = useState({ offices: true, filters: true })
  const [errors, setErrors] = useState({ offices: null, filters: null })
  const [canSendRequest , setCanSendRequest] = useState(false)
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const navigate = useNavigate() ; 
  // Form state
  const [formData, setFormData] = useState({
    name: userData.UserName,
    individualsCount: '',
    phone: userData.MobileNum,
    amount: '',
    officeId: '',
    donationTypeId: '',
    description: '',
    address: ''
  })

    // Map state
  const [position, setPosition] = useState([32.8872, 13.1913]);
  const [markerPosition, setMarkerPosition] = useState([32.8872, 13.1913]);
  const CheckPrevAssistance = async()=>{
    const response = await executeProcedure("ad/2ZM2fs/e3YjR6tghLEILauQgFqTpHsnFNAfPpFcQ=" , userData.Id);
    if(JSON.parse(response.decrypted.CheckData)[0].PrevCount > 0){
      setCanSendRequest(false);
    }
    else{
      setCanSendRequest(true)
    }
  }
    useEffect(() => {
      CheckPrevAssistance() ;
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords
            setPosition([latitude, longitude])
            setMarkerPosition([latitude, longitude])

            // Reverse geocode to get address
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
              .then((res) => res.json())
              .then((data) => {
                if (data && data.display_name) {
                  setFormData(prev => ({
                    ...prev,
                    address: data.display_name
                  }))
                }
              })
              .catch(() => {
                setFormData(prev => ({
                  ...prev,
                  address: `موقعك الحالي: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                }))
              })
          },
          (err) => {
            console.warn("Error getting location:", err)
          }
        )
      } else {
        toast.error("المتصفح لا يدعم تحديد الموقع الجغرافي.")
      }
    }, [])

  // Fetch offices from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
          "0"
        );
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          
          if (data.OfficesData) {
            try {
              const officesData = typeof data.OfficesData === 'string' 
                ? JSON.parse(data.OfficesData) 
                : data.OfficesData;
              
              setOffices(Array.isArray(officesData) ? officesData : []);
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

  // Fetch types of donations from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await executeProcedure(
          "CjSj0j5kAa/aqk9LMpWvCavGukOw8WsDmvfzbXkXVaI=",
          "1#100"
        )
        
        if (response && response.decrypted && response.decrypted.SubventionTypesData) {
          const parsedFilters = JSON.parse(response.decrypted.SubventionTypesData)
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

  // Map click handler component
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setPosition([lat, lng]);
        
        // Reverse geocoding to get address (simplified version)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(response => response.json())
          .then(data => {
            if (data && data.display_name) {
              setFormData(prev => ({
                ...prev,
                address: data.display_name
              }));
            }
          })
          .catch(error => {
            console.error("Error fetching address:", error);
            // If reverse geocoding fails, use coordinates as address
            setFormData(prev => ({
              ...prev,
              address: `موقع: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
            }));
          });
      },
    });
    return null;
  }
  function FlyToUserLocation({ position }) {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 13, { duration: 1.5 });
      }
    }, [position, map]);

    return null;
  }
  FlyToUserLocation.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddressSearch = () => {
    if (!formData.address.trim()) return;

    // Simple geocoding using Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPosition = [parseFloat(lat), parseFloat(lon)];
          setPosition(newPosition);
          setMarkerPosition(newPosition);
        } else {
          toast.error("لم يتم العثور على العنوان المطلوب");
        }
      })
      .catch(error => {
        console.error("Error searching address:", error);
        toast.error("حدث خطأ في البحث عن العنوان");
      });
  }

  const handleSubmit = async (e) => {
    if(!canSendRequest){
      e.preventDefault()
      toast.info("لا يمكنك تقديم طلب جديد قبل انتهاء الطلب السابق.")
    }
    else{
      e.preventDefault()
      // Validate required fields including address
      if (!formData.address.trim()) {
        toast.error("الرجاء إدخال العنوان أو تحديده على الخريطة");
        return; 
      }

      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      const userid = JSON.parse(localStorage.getItem('UserData'))?.Id || 0
      
      const response = await DoTransaction(
        "g+a67fXnSBQre/3SDxT2uA==",
        `0#${formData.name}#${formData.individualsCount}#${formData.phone}#${formData.amount}#${formData.officeId}#${formData.donationTypeId}#${formattedDate}#False#default#True#${userid}#${formData.description}#0#${formData.address}#${markerPosition[0]}#${markerPosition[1]}`
      )
      
      if(response.success == 200){
        setFormData({
          name: '',
          individualsCount: '',
          phone: '',
          amount: '',
          officeId: '',
          donationTypeId: '',
          description: '',
          address: ''
        })
        setMarkerPosition([30.0444, 31.2357])
        setPosition([30.0444, 31.2357])
        toast.success("تم انشاء الطلب بنجاح")
        navigate(-1)
      }
    }
  }

  return (
      <div
    className="overflow-hidden min-h-screen"
    style={{
      backgroundImage: "url('/background pattern.png')",
      backgroundRepeat: "repeat",
      backgroundSize: "auto",
      backgroundPosition: "center",
    }}
  >
    <div className='mt-20'>
      <NewHeader backgroundImage={headerBackground}/>
    </div>
     {!canSendRequest ? (
      <BlockedRequest />
    ) : (
      <div className='overflow-hidden min-h-screen'
      style={{
        backgroundImage: "url('/background pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between sm:px-6 lg:pr-0 lg:pl-12 mt-24 lg:mt-28 gap-4">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-lg sm:text-xl lg:text-2xl px-10 sm:px-8 py-2 w-fit text-center">
          <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
          طلبات الإعانة
        </div>
        
        <div className='w-full lg:w-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='font-bold text-base sm:text-lg text-center sm:text-right w-full lg:w-auto'>
            برجاء ملئ البيانات للنظر ف طلبك
          </div>
          <Link
            to={"/DonationRequester"}
            className='text-white text-center px-6 py-2 rounded-lg font-normal shadow-lg w-[92%] sm:w-auto text-sm sm:text-base'
            style={{background: "linear-gradient(90deg, #24645E -6.91%, #18383D 62.58%, #17343B 100%)"}}
          >
            متابعة طلب سابق
          </Link>
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
                المكاتب<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="officeId"
                  value={formData.officeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300 bg-white"
                  disabled={loading.offices}
                  required
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
                  <option value="">اختر النوع</option>
                  {filters
                    .filter(filter => filter.Id !== 0)
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

          {/* Address Section with Map */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                العنوان <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  name="address" 
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="ادخل العنوان أو انقر على الخريطة لتحديد الموقع"
                  className="flex-1 px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-sm sm:text-base lg:text-lg border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleAddressSearch}
                  className="px-4 py-2 sm:py-3 bg-emerald-800 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                >
                  بحث
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-right">
                يمكنك إدخال العنوان أو النقر على الخريطة لتحديد الموقع تلقائياً
              </p>
            </div>

            {/* Map */}
            <div className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden border-2 border-gray-300">
              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={markerPosition}>
                  <Popup>
                    موقع الطلب <br /> {formData.address || 'لم يتم تحديد العنوان بعد'}
                  </Popup>
                </Marker>

                <MapClickHandler />
                <FlyToUserLocation position={position} />
              </MapContainer>

            </div>
          </div>

          {/* Description */}
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
    )}
  </div>
  )
  
}

export default DonationRequest

const BlockedRequest = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="mb-4 text-emerald-800 text-5xl">⚠️</div>
      <h2 className="text-xl font-bold mb-3 text-gray-800">
        لا يمكنك تقديم طلب جديد
      </h2>
      <p className="text-gray-600 mb-6">
        لا يمكنك تقديم طلب جديد قبل انتهاء الطلب السابق.
      </p>

      <Link
        to="/DonationRequester"
        className="inline-block px-6 py-3 rounded-lg text-white font-medium"
        style={{
          background:
            "linear-gradient(90deg, #24645E 41.45%, #18383D 83.11%, #17343B 100%)",
        }}
      >
        متابعة الطلب السابق
      </Link>
    </div>
  </div>
);
