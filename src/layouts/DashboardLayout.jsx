import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export const DashboardLayout = ({ searchQuery, onSearchChange }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#182B36] flex flex-col font-sans antialiased overflow-x-hidden w-full">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Shell (Pushed right on desktop by sidebar w-72) */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen w-full transition-all duration-200">
        {/* Top Navbar */}
        <Navbar
          onOpenMobile={() => setIsMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {/* Main Routed Page Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
