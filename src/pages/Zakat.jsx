import React, { useState, useEffect } from 'react'
import PayZakat from '../components/Zakat page/PayZakat'
import Opportunities from '../components/Zakat page/Opportunities'
import { executeProcedure } from "../services/apiServices";

const Zakat = () => {
  const [offices, setOffices] = useState([]);
  const [zakatTypes, setZakatTypes] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState({
    offices: true,
    donations: false
  });
  const [errors, setErrors] = useState({
    offices: null,
    donations: null
  });

  // State for user selections
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedAid, setSelectedAid] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch offices and zakat types data
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
          
          // Check if ZakatTypesData exists and parse it
          if (data.ZakatTypesData) {
            try {
              // If ZakatTypesData is a string, parse it, otherwise use it directly
              const zakatTypesData = typeof data.ZakatTypesData === 'string'
                ? JSON.parse(data.ZakatTypesData)
                : data.ZakatTypesData;
              
              setZakatTypes(Array.isArray(zakatTypesData) ? zakatTypesData : []);
              console.log("Parsed zakat types:", zakatTypesData);
            } catch (parseError) {
              console.error("Error parsing ZakatTypesData:", parseError);
              setZakatTypes([]);
            }
          }
        }
        
        setErrors(prev => ({ ...prev, offices: null }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors(prev => ({ ...prev, offices: error.message }));
        setOffices([]);
        setZakatTypes([]);
      } finally {
        setLoading(prev => ({ ...prev, offices: false }));
      }
    };

    fetchData();
  }, []);

  // Fetch donations data when selections change
  useEffect(() => {
    const fetchDonations = async () => {
      // Don't fetch if no office is selected
      if (!selectedOffice) {
        setDonations([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, donations: true }));
        
        // Build the parameters string
        const startNum = (currentPage - 1) * 6; // Calculate start number based on current page
        const params = `${selectedOffice}#${selectedAid || "0"}#z#${startNum+1}#6`;
        
        console.log("Fetching donations with params:", params);
        
        const response = await executeProcedure(
          "phjR2bFDp5o0FyA7euBbsp/Ict4BDd2zHhHDfPlrwnk=",
          params
        );
        console.log(response);
        
        let donationsData = [];
        
        if (response && response.decrypted) {
          // Handle different response structures
          if (Array.isArray(response.decrypted)) {
            donationsData = response.decrypted;
          } else if (response.decrypted.data && Array.isArray(response.decrypted.data)) {
            donationsData = response.decrypted.data;
          } else if (response.decrypted.donations && Array.isArray(response.decrypted.donations)) {
            donationsData = response.decrypted.donations;
          } else if (response.decrypted && typeof response.decrypted === 'object') {
            donationsData = [response.decrypted];
          }
        } else if (Array.isArray(response)) {
          donationsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          donationsData = response.data;
        }
        
        console.log("Donations data:", donationsData);
        setDonations(donationsData);
        setErrors(prev => ({ ...prev, donations: null }));
      } catch (error) {
        console.error("Error fetching donations data:", error);
        setErrors(prev => ({ ...prev, donations: error.message }));
        setDonations([]);
      } finally {
        setLoading(prev => ({ ...prev, donations: false }));
      }
    };

    fetchDonations();
  }, [selectedOffice, selectedAid, selectedCategory, currentPage]);

  // Handler functions to update state
  const handleOfficeChange = (officeId) => {
    setSelectedOffice(officeId);
    setSelectedAid("");
    setSelectedCategory("");
    setCurrentPage(1); // Reset to first page when office changes
  };

  const handleAidChange = (aidId) => {
    setSelectedAid(aidId);
    setCurrentPage(1); // Reset to first page when aid changes
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section>
      <div className="relative overflow-hidden">
        <div
          className="min-h-screen z-10 mx-auto px-4 flex flex-col gap-4"
          style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          <PayZakat 
            offices={offices}
            zakatTypes={zakatTypes}
            loading={loading.offices}
            error={errors.offices}
            selectedOffice={selectedOffice}
            selectedAid={selectedAid}
            selectedCategory={selectedCategory}
            onOfficeChange={handleOfficeChange}
            onAidChange={handleAidChange}
            onCategoryChange={handleCategoryChange}
          />
          <Opportunities 
            donations={donations}
            loading={loading.donations}
            error={errors.donations}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="rightBow"></div>
        <div className="leftBow"></div>
      </div>
    </section>
  )
}

export default Zakat