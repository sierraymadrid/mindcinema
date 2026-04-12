import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function Layout() {
  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <ScrollToTop />
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
