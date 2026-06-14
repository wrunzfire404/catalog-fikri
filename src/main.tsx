import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Visit from "./pages/Visit";
import Contact from "./pages/Contact";
import Admin from "./pages/admin/Admin";
import "./styles.css";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#EFECE2]/60 flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-background min-h-screen shadow-2xl relative overflow-x-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ToastProvider>
          <CartProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/visit" element={<Visit />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </AppLayout>
          </CartProvider>
        </ToastProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
