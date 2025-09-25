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
import Diamond from "../components/Diamond";
import coins from "../../public/coins.webp";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const mainLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "عن وصل", path: "/about" },
  ];

  const dropdownLinks = [
    {
      name: "الفرص",
      key: "opportunities",
      links: [
        {
          name: "الزكاة",
          path: "/opportunities/zakat",
          icon: coins,
        },
      ],
    },
    {
      name: "الخدمات",
      key: "services",
      links: [
        {
          name: "خدمة 1",
          path: "/services/one",
          icon: coins,
        },
        {
          name: "خدمة 2",
          path: "/services/two",
          icon: coins,
        },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] bg-white shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-4 lg:px-6 relative" dir="rtl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="hidden lg:flex items-start space-x-8 space-x-reverse h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 h-full">
              <img alt="وصل الليبية" src={logo}></img>
            </Link>

            {/* main links */}
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`h-full flex items-center px-4 rounded-b-md font-medium transition-colors ${
                  location.pathname === link.path
                    ? "!h-5/6 bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                    : "text-[#17343B]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* dropdowns */}
            {dropdownLinks.map((dropdown) => (
              <div
                key={dropdown.key}
                className="relative group h-full flex items-center"
              >
                <button
                  onClick={() => toggleDropdown(dropdown.key)}
                  className={`h-full flex items-center px-4 rounded-b-md font-medium transition-colors ${
                    location.pathname.startsWith(`/${dropdown.key}`)
                      ? "!h-5/6 bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                      : "text-[#17343B]"
                  }`}
                >
                  {dropdown.name}
                  <ChevronDown
                    color={
                      location.pathname.startsWith(`/${dropdown.key}`)
                        ? "white"
                        : "#17343B"
                    }
                    size={20}
                    className={`ml-1 transition-transform ${
                      openDropdown === dropdown.key ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Left Side */}
          <div className="flex items-center space-x-3 space-x-reverse">
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

            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] text-white px-4 py-1 lg:px-10 lg:py-2.5 rounded-lg font-medium text-sm lg:text-base"
            >
              تسجيل الدخول
            </button>

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

        {/* dropdowns desktop */}
        {dropdownLinks.map(
          (dropdown) =>
            openDropdown === dropdown.key && (
              <div
                key={dropdown.key}
                className="hidden md:block absolute top-full left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50
                           transform transition-transform duration-300 ease-in-out
                           origin-top animate-slide-down"
              >
                <div className="flex items-center justify-center gap-12 px-6 py-6">
                  {dropdown.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <Diamond imgUrl={link.icon} />
                        <span>{link.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
        )}

        {/* mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block font-medium px-3 rounded-md ${
                    location.pathname === link.path
                      ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] text-white"
                      : "text-gray-700 hover:text-emerald-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {dropdownLinks.map((dropdown) => (
                <div key={dropdown.key}>
                  <button
                    onClick={() => toggleDropdown(dropdown.key)}
                    className="flex items-center justify-between w-full px-3 py-2 font-medium text-gray-700 hover:text-emerald-600"
                  >
                    {dropdown.name}
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        openDropdown === dropdown.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === dropdown.key && (
                    <div className="pl-6 space-y-2">
                      {dropdown.links.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="block text-gray-600 hover:text-emerald-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
