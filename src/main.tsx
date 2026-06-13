import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Checkout from "./pages/Checkout";
import Visit from "./pages/Visit";
import Admin from "./pages/Admin";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
