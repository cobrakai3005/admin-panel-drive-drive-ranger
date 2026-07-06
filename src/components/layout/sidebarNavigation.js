import {
  Award,
  CalendarRange,
  Car,
  CreditCard,
  GitBranch,
  Image,
  Layers,
  LayoutDashboard,
  Link2,
  Package,
  Settings,
  Shield,
  ShipIcon,
  ShoppingCart,
  Star,
  Tags,
  Ticket,
  Users,
} from "lucide-react";

export const standaloneNavItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
];

export const navGroups = [
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
    ],
  },
  {
    label: "Users",
    items: [{ path: "/users", icon: Users, label: "Users" }],
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
    items: [{ path: "/settings", icon: Settings, label: "Settings" }],
  },
];

export function getSidebarPageTitle(pathname) {
  const navItems = [...standaloneNavItems, ...navGroups.flatMap((g) => g.items)];
  const currentItem = navItems.find((item) =>
    item.end
      ? pathname === item.path
      : pathname.startsWith(item.path) && item.path !== "/",
  );

  return currentItem?.label || (pathname === "/" ? "Dashboard" : "Admin");
}
