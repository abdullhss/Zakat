import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../public/Logo.png";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] bg-white shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-4 lg:px-6" dir="rtl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="hidden lg:flex items-start space-x-8 space-x-reverse h-full">
            {/* Right Side - Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 h-full">
              <img alt="وصل الليبية" src={logo}></img>
            </Link>

            <Link
              to="/"
              className={`h-5/6 flex items-center px-4 rounded-b-md font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                  : "text-[#17343B]"
              }`}
            >
              الرئيسية
            </Link>

            {/* chances Dropdown */}
            <div className="relative group h-full flex items-center">
              <button
                className={`h-full flex items-center px-4 rounded-md font-medium transition-colors ${
                  location.pathname === "/opportunities"
                    ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-[#17343B]"
                }`}
              >
                الفرص
                <ChevronDown
                  color={location.pathname === "/opportunities" ? "white" : "#17343B"}
                  size={25}
                />
              </button>
            </div>

            {/* Services Dropdown */}
            <div className="relative group h-full flex items-center">
              <button
                className={`h-full flex items-center px-4 rounded-md font-medium transition-colors ${
                  location.pathname === "/services"
                    ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-[#17343B]"
                }`}
              >
                الخدمات
                <ChevronDown
                  color={location.pathname === "/services" ? "white" : "#17343B"}
                  size={25}
                />
              </button>
            </div>

            <Link
              to="/about"
              className={`h-full flex items-center px-4 rounded-md font-medium transition-colors ${
                location.pathname === "/about"
                  ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                  : "text-[#17343B]"
              }`}
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
                className="p-2 text-[#17343B] transition-colors"
                title="البحث"
              >
                <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
              </button>
              <button
                className="p-2 text-[#17343B] transition-colors"
                title="السلة"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6" />
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] text-white px-4 lg:px-10 lg:py-2.5 rounded-lg font-medium text-sm lg:text-base"
            >
              تسجيل الدخول
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-[#17343B] transition-colors"
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
                className={`block font-medium px-3 rounded-md ${
                  location.pathname === "/"
                    ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>

              <button
                className={`block w-full text-right font-medium px-3 rounded-md ${
                  location.pathname === "/opportunities"
                    ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                الفرص
              </button>

              <button
                className={`block w-full text-right font-medium px-3 rounded-md ${
                  location.pathname === "/services"
                    ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                الخدمات
              </button>

              <Link
                to="/about"
                className={`block font-medium px-3 rounded-md ${
                  location.pathname === "/about"
                    ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
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
