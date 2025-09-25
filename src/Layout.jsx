/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import FloatingDonationButton from "./globalComponents/FloatingDonationButton";
import Navbar from "./globalComponents/Navbar";


const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />
      <FloatingDonationButton />

      {/* Floating Donation Button */}

      {/* Main Content - with top padding to account for fixed navbar */}
      <main className="pt-16 lg:pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
