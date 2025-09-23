import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Global navigation bar component
 */
const Navbar = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Navigate to login page
   */
  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle search functionality
   */
  const handleSearch = () => {
    console.log("Search clicked");
    // TODO: Implement search functionality
  };

  /**
   * Handle phone contact
   */
  const handlePhoneContact = () => {
    console.log("Phone contact clicked");
    // TODO: Implement phone contact
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-4 lg:px-6" dir="rtl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {/* Right Side - Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center relative">
                  <span className="text-sm lg:text-base font-bold text-white">
                    وصل
                  </span>
                </div>
                <span className="text-sm lg:text-base font-bold text-emerald-700">
                  الليبية
                </span>
              </div>
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              الرئيسية
            </Link>
            {/* chances Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-emerald-600 transition-colors flex items-center font-medium">
                الفرص
                <svg
                  className="mr-1 h-4 w-4 transition-transform group-hover:rotate-180"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-emerald-600 transition-colors flex items-center font-medium">
                الخدمات
                <svg
                  className="mr-1 h-4 w-4 transition-transform group-hover:rotate-180"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <Link
              to="/about"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              عن وصل
            </Link>
          </div>

          {/* Left Side Actions */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Contact Actions */}
            <div className="hidden md:flex items-center space-x-3 space-x-reverse">
              <button
                onClick={handleSearch}
                className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                title="البحث"
              >
                <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                title="السلة"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6" />
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="bg-emerald-700 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg hover:bg-emerald-800 transition-colors font-medium text-sm lg:text-base"
            >
              تسجيل الدخول
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <button className="block w-full text-right text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                القروض
              </button>
              <button className="block w-full text-right text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                الخدمات
              </button>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                عن وصل
              </Link>

              {/* Mobile Contact Actions */}
              <div className="flex items-center space-x-4 space-x-reverse pt-4 border-t border-gray-100">
                <button
                  onClick={handleSearch}
                  className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
                  <span>البحث</span>
                </button>
                <button className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-emerald-600 transition-colors">
                  <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4" />
                  <span>السلة</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
