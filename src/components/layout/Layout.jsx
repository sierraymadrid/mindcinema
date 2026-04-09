import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

function Layout() {
  return (
    <div className="min-h-screen bg-[#05070b] text-white">
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
