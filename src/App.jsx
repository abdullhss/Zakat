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
import { setShowPopup} from "./features/PaySlice/PaySlice";
import Popup from "./components/Popup";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Sadaka from "./pages/Sadaka";
import Projects from "./pages/Projects";
import Project from "./pages/Project";

// Main Pages (with navbar via Layout)

// Protected Routes (you can add these later)
// import DashboardPage from './features/dashboard/components/DashboardPage';

/**
 * Main App component with routing configuration
 */
function App() {
  const dispatch = useDispatch();
  const {showPayPopup,  popupComponent , popupTitle} = useSelector((state) => state.pay);
  return (
    <Provider store={store}>
      <Router>
        <div className="App" dir="rtl">
          <Routes>
            {/* Auth Routes - No Layout (Full Screen) */}
            <Route path="/login" element={<Login />} />

            {/* Main Routes - With Layout (Navbar + Content) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/opportunities/zakat" element={<Zakat/>} />
              <Route path="/opportunities/sadaka" element={<Sadaka/>} />
              <Route path="/opportunities/projects" element={<Projects/>} />
              <Route path="/project" element={<Project/>} />
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
      </Router>

      <AnimatePresence>
        {showPayPopup && (
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
              <Popup title={popupTitle} bodyComponent={popupComponent} onClose={() => dispatch(setShowPopup(true))}/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer className={"mt-20"} />
    </Provider>
  );
}

export default App;
