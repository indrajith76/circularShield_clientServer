import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

export const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#102C3A] flex flex-col font-sans antialiased overflow-x-hidden w-full selection:bg-[#087F70]/20 selection:text-[#087F70]">
      {/* Admin Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Admin Content Container */}
      <div
        className={`flex flex-col flex-1 min-h-screen w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Admin Navbar */}
        <AdminNavbar
          isCollapsed={isCollapsed}
          onOpenMobile={() => setIsMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Admin Routed Page Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>

        {/* Minimal Admin Footer */}
        <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white text-center text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            CircularShield Administration & Security Operations Console • Build 2026.11
          </span>
          <span className="font-mono text-[11px] text-[#087F70]">
            Authorized Personnel Only • AES-256 Encrypted Session
          </span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
