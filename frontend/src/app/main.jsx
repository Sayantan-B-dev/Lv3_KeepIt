import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/app/App";
import "@/index.css";
import { AuthProvider } from "@/context/AuthContext";

import '@fontsource-variable/merriweather';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName={(context) =>
          `premium-toast premium-toast--${context?.type || "default"}`
        }
        bodyClassName="premium-toast__body"
        progressClassName="premium-toast__progress"
      />
    </AuthProvider>
  </React.StrictMode>
);
