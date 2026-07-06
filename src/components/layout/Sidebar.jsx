import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, Store, X } from "lucide-react";
import SidebarSearch from "./SidebarSearch";
import { navGroups, standaloneNavItems } from "./sidebarNavigation";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(() =>
    getActiveGroups(location.pathname),
  );

  useEffect(() => {
    setExpandedGroups(getActiveGroups(location.pathname));
  }, [location.pathname]);

  const toggleGroup = (groupLabel) => {
    setExpandedGroups((prev) => {
      const next = Object.fromEntries(navGroups.map((group) => [group.label, false]));
      next[groupLabel] = !prev[groupLabel];
      return next;
    });
  };

  const normalizedSearch = sidebarSearch.trim().toLowerCase();

  const filteredNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(normalizedSearch) ||
          group.label.toLowerCase().includes(normalizedSearch),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const filteredStandaloneNavItems = standaloneNavItems.filter((item) =>
    item.label.toLowerCase().includes(normalizedSearch),
  );

  return (
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
        {sidebarOpen && (
          <SidebarSearch
            value={sidebarSearch}
            onChange={setSidebarSearch}
            onClear={() => setSidebarSearch("")}
          />
        )}

        {filteredStandaloneNavItems.map((item) => (
          <SidebarNavLink
            key={item.path}
            item={item}
            sidebarOpen={sidebarOpen}
          />
        ))}

        {filteredNavGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {sidebarOpen && (
              <button
                type="button"
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

            <div
              className={`overflow-hidden transition-all duration-300 ${
                !sidebarOpen
                  ? "max-h-[1000px]"
                  : normalizedSearch || expandedGroups[group.label]
                    ? "max-h-[1000px]"
                    : "max-h-0"
              }`}
            >
              {group.items.map((item) => (
                <SidebarNavLink
                  key={item.path}
                  item={item}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function SidebarNavLink({ item, sidebarOpen }) {
  return (
    <NavLink
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
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}

      {!sidebarOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
    </NavLink>
  );
}

function getActiveGroups(pathname) {
  return Object.fromEntries(
    navGroups.map((group) => [
      group.label,
      group.items.some((item) =>
        item.end ? pathname === item.path : pathname.startsWith(item.path),
      ),
    ]),
  );
}
