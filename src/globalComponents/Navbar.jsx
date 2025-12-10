import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../public/Logo.png";
import { ChevronDown } from "lucide-react";
import Diamond from "../components/Diamond";
import coins from "../../public/coins.webp";
import shoppingCart from "../public/SVGs/ShoppingCart.svg";
import speaker from "../public/SVGs/Speaker.svg";
import zakat from "../public/SVGs/zakat.svg";
import sheep from "../../public/Sheep.svg";
import DonateRequest from "../public/SVGs/DonateRequest.svg";
import rememberIcon from "../../public/remember-1-svgrepo-com.svg" 
import food from "../../public/food-svgrepo-com.svg" 
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {setCartData} from "../features/CartSlice/CartSlice";

const Navbar = () => {
  const dispatch = useDispatch() ;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const cartData = useSelector((state) => state.cart);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

    const userdata = localStorage.getItem("UserData");
    const userID = userdata ? JSON.parse(userdata)?.Id : null;
    console.log(userID);
    
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };
  const handleLogOutClick = () => {
    localStorage.removeItem("UserData");
    dispatch(setCartData(null))
    toast.success("تم تسجيل الخروج بنجاح");
  };

  // Function to handle sublink click
  const handleSublinkClick = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const navItems = [
    { type: "main", name: "الرئيسية", path: "/" },
    {
      type: "dropdown",
      name: "الفرص",
      key: "opportunities",
      links: [
        { name: "مشاريع", path: "/opportunities/projects", icon: coins, isDiamond: true },
      ],
    },
    {
      type: "dropdown",
      name: "الخدمات",
      key: "services",
      links: [
        { name: "الحملات", path: "/services/campaigns", icon: speaker, isDiamond: false },
        { name: "الزكاة", path: "/zakat", icon: zakat, isDiamond: false },
        { name: "الاضاحي", path: "/sacrifice", icon: sheep, isDiamond: false },
        { name: "طلبات الاعانة", path: "/DonationRequester", icon: DonateRequest, isDiamond: false },
        { name: "تبرع لمن تحب", path: "/DonateTo", icon: DonateRequest, isDiamond: false },
        { name: "زكاة الفطر ", path: "/fitrZakat", icon: food, isDiamond: false },
        { name: "ذكرني", path: "/remember", icon: rememberIcon, isDiamond: false },
      ],
    },
    { type: "dropdown", name: "الاستفسارات",
      links:[
        { name: " روابط خاصة ", path: "/FAQ/Links", icon: zakat, isDiamond: false },
        { name: "أسئلة شائعة", path: "/FAQ", icon: zakat, isDiamond: false },
        { name: " طلب استفسار", path: "/FAQ/ask", icon: zakat, isDiamond: false },
      ]
    },
    { type: "main", name: "من نحن", path: "/about-us" },
    { type: "main", name: " اللوائح و القوانين", path: "/tos" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] bg-white shadow-sm border-b border-gray-100">
      <nav className="px-4 lg:px-6 relative" dir="rtl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className=" lg:hidden flex items-center flex-shrink-0 h-full">
            <img alt="وصل الليبية" src={logo}></img>
          </Link>

          <div className="hidden lg:flex items-start space-x-8 space-x-reverse h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 h-full">
              <img alt="وصل الليبية" src={logo}></img>
            </Link>

            {/* nav items */}
            {navItems.map((item) =>
              item.type === "main" ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`h-full flex items-center px-4 rounded-b-md font-medium transition-colors ${
                    location.pathname === item.path
                      ? "!h-5/6 bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                      : "text-[#17343B]"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <div
                  key={item.key}
                  className="relative group h-full flex items-center"
                >
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`h-full flex items-center px-4 rounded-b-md font-medium transition-colors ${
                      location.pathname.startsWith(`/${item.key}`)
                        ? "!h-5/6 bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] underline decoration-2 underline-offset-8 text-white"
                        : "text-[#17343B]"
                    }`}
                  >
                    {item.name}
                    <ChevronDown
                      color={
                        location.pathname.startsWith(`/${item.key}`)
                          ? "white"
                          : "#17343B"
                      }
                      size={20}
                      className={`ml-1 transition-transform ${
                        openDropdown === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              )
            )}
          </div>

          {/* Left Side */}
          <div className="flex items-center space-x-3 space-x-reverse">

            {
              localStorage.getItem("UserData")?(
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-transparent hover:bg-red-600 hover:text-white transition-all text-red-600 border-2 border-red-600 px-4 py-1 lg:px-10 lg:py-2.5 rounded-lg font-medium text-sm lg:text-base"
                >
                  تسجيل الخروج
                </button>

              ):(
                <button
                  onClick={handleLoginClick}
                  className="bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] text-white px-4 py-1 lg:px-10 lg:py-2.5 rounded-lg font-medium text-sm lg:text-base"
                >
                  تسجيل الدخول
                </button>
              )
            }
            

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
        {navItems
          .filter((item) => item.type === "dropdown" && openDropdown === item.key)
          .map((dropdown) => (
            <div
              key={dropdown.key}
              className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50
                           transform transition-transform duration-300 ease-in-out
                           origin-top animate-slide-down"
            >
              <div className="w-screen flex items-center justify-center gap-12 px-6 py-6">
                {dropdown.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path === "/FAQ/ask" && !userID ? "#" : link.path}
                    onClick={(e) => {
                      if ( (link.path === "/FAQ/ask" && !userID) || (link.path === "/remember" && !userID)) {
                        e.preventDefault();
                        toast.error("يجب تسجيل الدخول اولا");
                        return;
                      }
                      setOpenDropdown(null);
                    }}
                    className=" block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {link.isDiamond ? (
                        <Diamond imgUrl={link.icon} />
                      ) : (
                        <img src={link.icon} alt={link.name} className="w-10 h-10" />
                      )}
                      <span>{link.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        {/* mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) =>
                item.type === "main" ? (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block font-medium px-3 rounded-md ${
                      location.pathname === item.path
                        ? "bg-gradient-to-t from-[#17343B] via-[#18383D] to-[#24645E] text-white"
                        : "text-gray-700 hover:text-emerald-600"
                    }`}
                    onClick={handleSublinkClick}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div key={item.key}>
                    <button
                      onClick={() => toggleDropdown(item.key)}
                      className="flex items-center justify-between w-full px-3 py-2 font-medium text-gray-700 hover:text-emerald-600"
                    >
                      {item.name}
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          openDropdown === item.key ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.key && (
                      <div className="pl-6 space-y-2">
                        {item.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path === "/FAQ/ask" && !userID ? "#" : link.path}
                            onClick={(e) => {
                              if (link.path === "/FAQ/ask" && !userID) {
                                e.preventDefault();
                                toast.error("يجب تسجيل الدخول اولا");
                                return;
                              }
                              handleSublinkClick();
                            }}
                            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
                          >

                            {link.isDiamond ? (
                              <Diamond imgUrl={link.icon} />
                            ) : (
                              <img
                                src={link.icon}
                                alt={link.name}
                                className="w-5 h-5"
                              />
                            )}
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[20000]">
            <div className="bg-white px-6 py-5 rounded-lg shadow-lg w-[90%] max-w-sm text-center">

              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                هل أنت متأكد من تسجيل الخروج؟
              </h3>

              <div className="flex gap-4 justify-center mt-4">
                <button
                  onClick={() => {
                    handleLogOutClick();
                    setShowLogoutModal(false);
                  }}
                  className="bg-red-600 text-white px-5 py-2 rounded-md font-medium hover:bg-red-700"
                >
                  نعم
                </button>

                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-400"
                >
                  إلغاء
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