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
  const [mainScreenData, setMainScreenData] = useState(null);
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
      {/* Fixed Navbar */}
      <Navbar />
        <div className="mt-20">
          <HeroBanner data={mainScreenData?.heroBanner} />
        </div>

      {/* Floating Donation Button - يظهر في كل الصفحات ما عدا الصفحة الرئيسية */}
      {/* {!isHomePage && <FloatingDonationButton />} */}

      {/* Main Content */}
      {/* <main className="pt-16 lg:pt-20"> */}
        <Outlet />
      {/* </main> */}
    </div>
  );
};

export default Layout;
