import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import filter from "../public/SVGs/fillter.svg"
import LocationIcon from "../public/SVGs/LocationIcon.svg"
import OfficeCard from '../components/OfficeCard'
import { executeProcedure } from '../services/apiServices'

const Offices = () => {
    const [offices, setOffices] = useState([]);
    const [filteredOffices, setFilteredOffices] = useState([]);
    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    
    useEffect(() => {
        fetchOffice();
        fetchCities();
    }, [])

    useEffect(() => {
        let filtered = offices;
        
        if (searchTerm) {
            filtered = filtered.filter(office => 
                office.OfficeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                office.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                office.CityName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedCity) {
            filtered = filtered.filter(office => office.CityName === selectedCity);
        }
        
        setFilteredOffices(filtered);
    }, [offices, searchTerm, selectedCity])

    const fetchOffice = async () => {
        const response = await executeProcedure("mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=", "0")
        const data = JSON.parse(response.decrypted.OfficesData)
        setOffices(data)
        setFilteredOffices(data)
    }

    const fetchCities = async () => {
        try {
            const response = await executeProcedure("xR3P2FQ9gQI7pvkeyawk7A==", "1#100")
            setCities(JSON.parse(response.decrypted.CitiesData))
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    }

    return (
        <div 
            className='flex flex-col gap-8 min-h-screen bg-cover bg-center bg-no-repeat'
            style={{
                backgroundImage: "url('/background pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
            }}
        >
            {/* Header Section */}
            <div className='flex flex-col lg:flex-row items-center gap-4 px-4 md:px-12 mt-24'>
                {/* Search bar */}
                <div className='w-full lg:flex-1'>
                    <div className="w-full flex items-center gap-3 bg-[#E5E9EA] border border-gray-300 rounded-lg px-4 py-3">
                        <Search className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="ابحث هنا ..."
                            className="flex-1 placeholder:text-black placeholder:font-medium bg-transparent outline-none text-gray-700 text-right"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <img src={filter} alt="فلاتر البحث" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                {/* Location Filter */}
                <div className='w-full lg:w-auto relative'>
                    <select 
                        className='w-full border border-gray-300 rounded-lg bg-white font-medium px-10 py-3 appearance-none text-right cursor-pointer hover:border-gray-400 transition-colors'
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">جميع المدن</option>
                        {cities.map(city => (
                            <option key={city.Id} value={city.CityName}>
                                {city.CityName}
                            </option>
                        ))}
                    </select>
                    <img 
                        src={LocationIcon} 
                        alt="موقع" 
                        className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none'
                    />
                </div>
            </div>

            {/* Offices Grid with animation */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-12 pb-12'>
                <AnimatePresence>
                    {filteredOffices.map((office, index) => (
                        <motion.div
                            key={office.Id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <OfficeCard office={office} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Offices
