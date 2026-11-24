
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthProvider";

const Main = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { role } = useAuth();

  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#182B36] flex">

      {/* Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">

        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          isAdmin={isAdmin}
          title="CircularShield"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Main;
