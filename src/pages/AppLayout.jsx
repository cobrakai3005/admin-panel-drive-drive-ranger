// #E31E24

import React, { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Tags,
  Layers,
  Award,
  Boxes,
  Warehouse,
  Ticket,
  CreditCard,
  RotateCcw,
  Shield,
  Star,
  ScrollText,
  Car,
  GitBranch,
  CalendarRange,
  Link2,
  MapPin,
  Store,
  Image,
  ShipIcon,
} from "lucide-react";
import { useAuthProvider } from "../context/AuthContext";
import { toast, Toaster } from "sonner";
import { ChevronRight } from "lucide-react";
import { getMe } from "../api/auth";
// Standalone links (not inside any group)
const standaloneNavItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
];

// Accordion groups
const navGroups = [
  {
    label: "Catalog",
    items: [
      { path: "/categories", icon: Tags, label: "Categories" },
      { path: "/sub-categories", icon: Layers, label: "Sub Categories" },
      { path: "/brands", icon: Award, label: "Brands" },
      { path: "/products", icon: Package, label: "Products" },
      { path: "/images", icon: Image, label: "Products Images" },
    ],
  },
  {
    label: "Vehicles",
    items: [
      { path: "/vehicle-makes", icon: Car, label: "Makes" },
      { path: "/vehicle-models", icon: GitBranch, label: "Models" },
      {
        path: "/vehicle-generations",
        icon: CalendarRange,
        label: "Generations",
      },
      { path: "/vehicle-compatibility", icon: Link2, label: "Compatibility" },
    ],
  },
  {
    label: "Sales",
    items: [
      { path: "/orders", icon: ShoppingCart, label: "Orders" },
      { path: "/transactions", icon: CreditCard, label: "Transactions" },
      { path: "/coupons", icon: Ticket, label: "Coupons" },
      { path: "/shipments", icon: ShipIcon, label: "Shipments" },
      // { path: "/returns", icon: RotateCcw, label: "Returns" },
    ],
  },
  {
    label: "Users",
    items: [
      { path: "/users", icon: Users, label: "Users" },
      // { path: "/addresses", icon: MapPin, label: "Addresses" },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/reviews", icon: Star, label: "Reviews" },

      { path: "/warranty", icon: Shield, label: "Warranty" },
    ],
  },
  {
    label: "System",
    items: [
      // { path: "/audit-logs", icon: ScrollText, label: "Audit Logs" },
      { path: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

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

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initial = {};

    navGroups.forEach((group) => {
      initial[group.label] = group.items.some((item) =>
        item.end
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path),
      );
    });

    return initial;
  });

  const handleLogout = () => {
    toast.success("Logged Out");
    logout();
    navigate("/auth");
  };

  const pageTitle =
    navGroups
      .flatMap((g) => g.items)
      .find((i) =>
        i.end
          ? location.pathname === i.path
          : location.pathname.startsWith(i.path) && i.path !== "/",
      )?.label || (location.pathname === "/" ? "Dashboard" : "Admin");

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  useEffect(() => {
    const next = {};

    navGroups.forEach((group) => {
      next[group.label] = group.items.some((item) =>
        item.end
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path),
      );
    });

    setExpandedGroups(next);
  }, [location.pathname]);
  const toggleGroup = (groupLabel) => {
    setExpandedGroups((prev) => {
      const isCurrentlyOpen = prev[groupLabel];

      const next = {};

      navGroups.forEach((group) => {
        next[group.label] = false;
      });

      // Open only the clicked group (or close all if already open)
      next[groupLabel] = !isCurrentlyOpen;

      return next;
    });
  };
  return (
    <div
      data-theme={theme}
      className="flex min-h-screen overflow-x-scroll bg-slate-50"
    >
      <aside
        className={`fixed top-0 left-0 h-full bg-primary text-zinc-200 transition-all duration-300 z-50 shadow-2xl ${
          sidebarOpen ? "w-44 md:w-72" : "w-[72px]"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 min-h-[100px]">
          <div className="flex items-center gap-2.5 min-w-0">
            {sidebarOpen && (
              <>
                <Store className="text-primary-light shrink-0" size={22} />
                <span className="text-lg font-bold bg-gradient-to-r from-slate-50 to-slate-500 bg-clip-text text-transparent truncate">
                  4x4 Admin
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-white rounded-lg hover:bg-white/10 shrink-0 mr-6"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav className="custom-scrollbar flex-1 px-2 py-3 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* Dashboard */}
          {standaloneNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-3 transition-all group relative ${
                  isActive
                    ? "bg-primary-light text-primary shadow-lg shadow-black/15"
                    : "text-zinc-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}

              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}

          {/* Existing accordion groups */}
          {navGroups.map((group) => (
            // existing group code...
            <div key={group.label} className="mb-2">
              {/* Group Header */}
              {sidebarOpen && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-100 hover:bg-white/10 rounded-lg transition"
                >
                  <span>{group.label}</span>

                  {expandedGroups[group.label] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}

              {/* Nav Links */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  !sidebarOpen
                    ? "max-h-[1000px]"
                    : expandedGroups[group.label]
                      ? "max-h-[1000px]"
                      : "max-h-0"
                }`}
              >
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all group relative ${
                        isActive
                          ? "bg-primary-light text-primary shadow-lg shadow-black/15"
                          : "text-zinc-100 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <item.icon size={18} className="shrink-0" />

                    {sidebarOpen && (
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    )}

                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* <div className="px-2 py-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-colors ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div> */}
      </aside>
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
            <Outlet context={{ theme, setTheme: handleThemeChange }} />
          </div>
        </div>
      </main>
    </div>
  );
}
