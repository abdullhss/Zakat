/* eslint-disable react/prop-types */
import { Outlet, useLocation } from "react-router-dom";
import FloatingDonationButton from "./globalComponents/FloatingDonationButton";
import Navbar from "./globalComponents/Navbar";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Floating Donation Button - يظهر في كل الصفحات ما عدا الصفحة الرئيسية */}
      {!isHomePage && <FloatingDonationButton />}

      {/* Main Content */}
      <main className="pt-16 lg:pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
