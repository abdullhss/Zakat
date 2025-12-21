/* eslint-disable react/prop-types */
import { Outlet, useLocation } from "react-router-dom";
import FloatingDonationButton from "./globalComponents/FloatingDonationButton";
import Navbar from "./globalComponents/Navbar";
import HeroBanner from "./features/home/components/HeroBanner";
import { useEffect, useState } from "react";
import { executeProcedure } from "./services/apiServices";

const Layout = () => {
  const location = useLocation();
  
  const isHomePage = location.pathname === "/";
  const isOfficePage = location.pathname.startsWith("/office");
const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  const [mainScreenData, setMainScreenData] = useState(null);
useEffect(() => {
  const handleScroll = () => {
    const triggerPoint = window.innerHeight * 0.4;

    if (window.scrollY >= triggerPoint) {
      setShowFloatingBtn(true);
    } else {
      setShowFloatingBtn(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "I0uFFxOqnfWgAy1EbMHIi+epTgwWrmYV51/bDxo0U0s=",
          "0"
        );
        setMainScreenData(response);
      } catch (error) {
        console.error("Error fetching main screen data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {!isOfficePage && (
        <div className="mt-20">
          <HeroBanner data={mainScreenData?.heroBanner} />
        </div>
      )}

    {showFloatingBtn && <FloatingDonationButton />}

      {/* Main Content */}
      <Outlet />
    </div>
  );
};

export default Layout;
