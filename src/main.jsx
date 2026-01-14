import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./application/store/store.js";
import { HelmetProvider } from "react-helmet-async";
import { ImageProvider } from "./Context/imageProvider.jsx";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <ImageProvider>
        <App />
      </ImageProvider>
    </Provider>
  </HelmetProvider>
);
