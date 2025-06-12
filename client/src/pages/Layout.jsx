
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
