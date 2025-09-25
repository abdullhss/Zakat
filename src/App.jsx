/* eslint-disable react/prop-types */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import { store } from "./application/store/store";
import Layout from "./Layout";
import Home from "./features/home/components/Home";
// Layout

// Auth Pages (no navbar)
import Login from "./features/auth/components/Login/Login";
import ApiTestComponent from "./features/ApiTestComponent";
import Zakat from "./pages/Zakat";

// Main Pages (with navbar via Layout)

// Protected Routes (you can add these later)
// import DashboardPage from './features/dashboard/components/DashboardPage';

/**
 * Main App component with routing configuration
 */
function App() {
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
    </Provider>
  );
}

export default App;
