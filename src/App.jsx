/* eslint-disable react/prop-types */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import "./App.css";
import { store } from "./application/store/store";
import Layout from "./Layout";
import Home from "./features/home/components/Home";
// Layout

// Auth Pages (no navbar)
import Login from "./features/auth/components/Login/Login";
import ApiTestComponent from "./features/ApiTestComponent";
import Zakat from "./pages/Zakat";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {   setShowPopup,
  setPopupComponent,
  setPopupTitle,
  openPopup,
  closePopup,
  closeAllPopups,} from "./features/PaySlice/PaySlice";
import Popup from "./components/Popup";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Sadaka from "./pages/Sadaka";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import KafaraAndNozor from "./pages/KafaraAndNozor";
import Campaigns from "./pages/Campaigns.jsx";
import DonationRequest from "./pages/DonationRequest";
import Campaign from "./pages/Campaign.jsx";
import DonationRequester from "./pages/DonationRequester.jsx";
import MainZakatPage from "./pages/MainZakatPage.jsx";
import cartReducer , {setCartData} from "./features/CartSlice/CartSlice";
import { executeProcedure } from "./services/apiServices.js";
import { useEffect } from "react";
import Cart from "./pages/Cart.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Offices from "./pages/Offices.jsx";
import OfficeDetailes from "./pages/OfficeDetailes.jsx";
import News from "./pages/News.jsx";
import EnterOTP from "./pages/EnterOTP.jsx";
import Signup from "./pages/Signup.jsx";
import Sacrifice from "./pages/Sacrifice.jsx";
import NewsDetails from "./pages/NewsDetails.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import UrgentProjects from "./pages/UrgentProjects.jsx";

// Main Pages (with navbar via Layout)

// Protected Routes (you can add these later)
// import DashboardPage from './features/dashboard/components/DashboardPage';

/**
 * Main App component with routing configuration
 */
const storedUser = localStorage.getItem("UserData");
const userID = storedUser ? JSON.parse(storedUser)?.Id : null;

function App() {
  const dispatch = useDispatch();
  const {showPayPopup,  popupComponent , popupTitle ,popups  } = useSelector((state) => state.pay);
  const cartData = useSelector((state) => state.cart);
  
  
  const handleFetchCartData =   async () => {
    const data = await executeProcedure(
      "ErZm8y9oKKuQnK5LmJafNAUcnH+bSFupYyw5NcrCUJ0=",
      userID
    );
    dispatch(setCartData(data.decrypted));
  } 
  useEffect(() => {
    if(userID != null){
      handleFetchCartData();
    }
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer
        className="!z-[99999] mt-20"
        toastClassName="!z-[99999]"
        bodyClassName="!z-[99999]"
        style={{ zIndex: 99999 }}
      />
      <Router>
        <ScrollToTop/>
        <div className="App" dir="rtl">
          <Routes>
            {/* Auth Routes - No Layout (Full Screen) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/OTP" element={<EnterOTP />} />

            {/* Main Routes - With Layout (Navbar + Content) */}
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home />} />
              <Route path="/services/zakat" element={<Zakat/>} />
              <Route path="/zakat" element={<MainZakatPage/>} />
              <Route path="/services/sadaka" element={<Sadaka/>} />
              <Route path="/opportunities/projects" element={<Projects/>} />
              <Route path="/services/karfaraAndNozor" element={<KafaraAndNozor/>} />
              <Route path="/services/campaigns" element={<Campaigns/>} />
              <Route path="/campaign" element={<Campaign/>} />
              <Route path="/project" element={<Project/>} />
              <Route path="/DonationRequester" element={<DonationRequester/>} />
              <Route path="/services/donation-request" element={<DonationRequest/>} />
              <Route path="/offices" element={<Offices/>} />
              <Route path="/office" element={<OfficeDetailes/>} />
              <Route path="/news" element={<News/>} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/sacrifice" element={<Sacrifice/>} />
              <Route path="/news/details" element={<NewsDetails />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs/>} />
              <Route path="/tos" element={<TermsAndConditions/>} />
              <Route path="/opportunities/UrgentProjects" element={<UrgentProjects/>} />
            </Route>
            
            <Route path="/ApiTestComponent" element={<ApiTestComponent />} />

            {/* Catch all route - 404 page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      404
                    </h1>
                    <p className="text-gray-600 mb-8">الصفحة غير موجودة</p>
                    <a
                      href="/"
                      className="bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
                    >
                      العودة للرئيسية
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
        
      <AnimatePresence>
        {showPayPopup && popups.length === 0 && (
          <motion.div
            dir="rtl"
            className="fixed top-0 right-0 h-screen w-screen z-[10000] bg-black/50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch(setShowPopup(false))}
          >
            <motion.div
              className="bg-white w-full md:w-1/2 h-full shadow-lg"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Popup
                title={popupTitle}
                bodyComponent={popupComponent}
                onClose={() => dispatch(setShowPopup(false))}
              />
            </motion.div>
          </motion.div>
        )}

        {/* النظام الجديد - أكتر من Popup */}

        {[...popups].reverse().map((popup, index) => (
          <motion.div
            key={index}
            dir="rtl"
            className={`fixed top-0 right-0 h-screen w-screen z-[${10001 + index}] bg-black/50 overflow-y-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch(closePopup())}
          >
            <motion.div
              className="bg-white w-full md:w-1/2 h-full shadow-lg"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Popup
                title={popup.title}
                bodyComponent={popup.component}
                onClose={() => dispatch(closePopup())}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      </Router>

    </Provider>
  );
}

export default App;
