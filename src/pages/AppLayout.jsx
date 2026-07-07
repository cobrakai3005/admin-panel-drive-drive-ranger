import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuthProvider } from "../context/AuthContext";
import { toast, Toaster } from "sonner";
import Sidebar from "../components/layout/Sidebar";
import { getSidebarPageTitle } from "../components/layout/sidebarNavigation";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("admin-theme") || "default";
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);
  };
  const location = useLocation();
  const { user, logout } = useAuthProvider();

  const handleLogout = () => {
    toast.success("Logged Out");
    logout();
    navigate("/auth");
  };

  const pageTitle = getSidebarPageTitle(location.pathname);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen overflow-x-scroll bg-slate-50"
    >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Toaster
        theme="light" // or "dark"
        position="top-center"
        style={{
          // Base styles for normal toasts
          "--normal-bg": "#f8f9fa",
          "--normal-text": "#212529",
          "--normal-border": "#dee2e6",

          // Success toast colors
          "--success-bg": "#d1e7dd",
          "--success-text": "#0f5132",
          "--success-border": "#badbcc",

          // Error toast colors
          "--error-bg": "#f8d7da",
          "--error-text": "#842029",
          "--error-border": "#f5c2c7",

          // Warning toast colors
          "--warning-bg": "#fff3cd",
          "--warning-text": "#664d03",
          "--warning-border": "#ffecb5",

          // Info toast colors
          "--info-bg": "#cff4fc",
          "--info-text": "#055160",
          "--info-border": "#9eeaf9",
        }}
      />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-72 ml-44" : "ml-[100px]"}`}
      >
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-lg font-semibold text-slate-800">
                {pageTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative p-2 rounded-lg hover:bg-slate-100"
              >
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  {sidebarOpen && (
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-slate-800">
                        {user?.full_name || "Admin"}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {user?.role || "Administrator"}
                      </p>
                    </div>
                  )}
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <Link
                          to={"/accounts"}
                          className="text-sm font-semibold"
                        >
                          {user?.full_name}
                        </Link>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 min-h-[calc(100vh-120px)]">
            <Outlet context={{ theme, 59: handleThemeChange }} />
          </div>
        </div>
      </main>
    </div>
  );
}
