import React, { useState, useEffect, useCallback } from 'react'
import PayZakat from '../components/Zakat page/PayZakat'
import Opportunities from '../components/Zakat page/Opportunities'
import { executeProcedure } from "../services/apiServices";
import PaySadaka from '../components/Sadaka page/PaySadaka';
import NewHeader from '../features/home/components/NewHeader'
import headerBackground from "../../public/header backgrounds/Sadaka.png"
const Sadaka = () => {
  const [offices, setOffices] = useState([]);
  const [zakatTypes, setZakatTypes] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationValue, setDonationValue] = useState();
  const [subventionTypes, setSubventionTypes] = useState([]);
  const [sadakaType, setSadakaType] = useState("G");
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
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
  const [sadakaSearch, setSadakaSearch] = useState("");
  const [debouncedSadakaSearch, setDebouncedSadakaSearch] = useState("");

  // Fetch offices and zakat types data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "mdemtAbueh2oz+k6MjjaFaOfTRzNK4XQQy0TBhCaV0Y=",
          "0"
        );

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

  // Debounce search input - updates after 500ms of inactivity
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSadakaSearch(sadakaSearch);
    }, 500);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timerId);
    };
  }, [sadakaSearch]);

  // Fetch donations data when selections change
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(prev => ({ ...prev, donations: true }));
        
        // Build the parameters string
        const startNum = (currentPage - 1) * 6; // Calculate start number based on current page
        const params = `${selectedOffice}#${selectedAid || "0"}#s#${debouncedSadakaSearch}#${startNum + 1}#9`;
        
        const GetSadkaSubventionTypesDataParams = `${sadakaType}#1#100`;
        
        const response = await executeProcedure(
          "0sKUt2E7SOiZ8WrjfyQIaIY5nL3Uh97WgmX3uf/9t74=",
          GetSadkaSubventionTypesDataParams
        );

        const ProjectsResponse = await executeProcedure(
          "phjR2bFDp5o0FyA7euBbsp/Ict4BDd2zHhHDfPlrwnk=",
          params
        );
        
        
        let donationsData = [];
        let subventionTypesData = [];
        let projectsCount = 0;
        
        
        if (response && response.decrypted) {
          const data = response.decrypted;
          const projectsDataDecrypted = ProjectsResponse.decrypted;
          
          // Parse ProjectsCount
          if (projectsDataDecrypted.ProjectsCount) {
            try {
              projectsCount = parseInt(projectsDataDecrypted.ProjectsCount) || 0;
              
            } catch (parseError) {
              console.error("Error parsing ProjectsCount:", parseError);
              projectsCount = 0;
            }
          }
          
          // Parse ProjectsData
          if (projectsDataDecrypted.ProjectsData) {
            try {
              const projectsData = typeof projectsDataDecrypted.ProjectsData === 'string' 
                ? JSON.parse(projectsDataDecrypted.ProjectsData) 
                : projectsDataDecrypted.ProjectsData;
              
              donationsData = Array.isArray(projectsData) ? projectsData : [];
              
            } catch (parseError) {
              console.error("Error parsing ProjectsData:", parseError);
              donationsData = [];
            }
          }
          
          // Parse SubventionTypes (this is the correct field name)
          if (data.SubventionTypesData) {
            try {
              const parsedSubventionTypes = typeof data.SubventionTypesData === 'string'
                ? JSON.parse(data.SubventionTypesData)
                : data.SubventionTypesData;
              
              subventionTypesData = Array.isArray(parsedSubventionTypes) ? parsedSubventionTypes : [];
              
            } catch (parseError) {
              console.error("Error parsing SubventionTypes:", parseError);
              subventionTypesData = [];
            }
          }
        }
        
        setDonations(donationsData);
        setSubventionTypes(subventionTypesData);
        setTotalProjectsCount(projectsCount);
        setErrors(prev => ({ ...prev, donations: null }));
      } catch (error) {
        console.error("Error fetching donations data:", error);
        setErrors(prev => ({ ...prev, donations: error.message }));
        setDonations([]);
        setSubventionTypes([]);
        setTotalProjectsCount(0);
      } finally {
        setLoading(prev => ({ ...prev, donations: false }));
      }
    };

    fetchDonations();
  }, [selectedOffice, selectedAid, selectedCategory, currentPage, sadakaType, debouncedSadakaSearch]);

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
    setSelectedAid(""); // Reset aid when category changes
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handler for search input with immediate update
  const handleSearchChange = (searchTerm) => {
    setSadakaSearch(searchTerm);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Optional: Create a debounce function for reuse
  const debounce = (func, delay) => {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
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
          <div className='mt-20'>
            <NewHeader backgroundImage={headerBackground}/>
          </div>

          <PaySadaka
            offices={offices}
            zakatTypes={zakatTypes}
            subventionTypes={subventionTypes}
            loading={loading.offices}
            error={errors.offices}
            selectedOffice={selectedOffice}
            selectedAid={selectedAid}
            selectedCategory={selectedCategory}
            onOfficeChange={handleOfficeChange}
            onAidChange={handleAidChange}
            onCategoryChange={handleCategoryChange}
            setDonationValue={setDonationValue}
            setSadakaType={setSadakaType}
            sadakaType={sadakaType}
          />
          <Opportunities 
            donations={donations}
            loading={loading.donations}
            error={errors.donations}
            currentPage={currentPage}
            totalProjectsCount={totalProjectsCount}
            onPageChange={handlePageChange}
            donationValue={donationValue}
            setZakatSearch={handleSearchChange}
            zakatSearch={sadakaSearch}
          />
        </div>

        <div className="rightBow"></div>
        <div className="leftBow"></div>
      </div>
    </section>
  )
}

export default Sadaka