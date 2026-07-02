import { useEffect, useState } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  Tags,
  Car,
  ClipboardList,
} from "lucide-react";
import { getCategories } from "../../api/categories";
import { getAllProductsApi } from "../../api/products";
import { getUsersApi } from "../../api/users";
import { getAllOrders } from "../../api/orders";
import { getBrands } from "../../api/brands";
import { getMakes } from "../../api/vehicles";
import { Link } from "react-router-dom";
import { getShipments } from "../../api/shipments";

const statCards = [
  { key: "products", label: "Products", icon: Package, bg: "bg-indigo-100", fg: "text-indigo-600" },
  { key: "users", label: "Users", icon: Users, bg: "bg-emerald-100", fg: "text-emerald-600" },
  { key: "orders", label: "Orders", icon: ShoppingCart, bg: "bg-amber-100", fg: "text-amber-600" },
  { key: "categories", label: "Categories", icon: Tags, bg: "bg-purple-100", fg: "text-purple-600" },
  { key: "brands", label: "Brands", icon: ClipboardList, bg: "bg-rose-100", fg: "text-rose-600" },
  { key: "shipments", label: "Shipments", icon: Car, bg: "bg-blue-100", fg: "text-blue-600" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [products, users, orders, categories, brands, makes] = await Promise.all([
          getAllProductsApi({ limit: 1 }),
          getUsersApi().then((r) => r.data),
          getAllOrders({ limit: 1 }),
          getCategories({ limit: 1 }),
          getBrands({ limit: 1 }),
          getShipments({ limit: 1 }),
        ]);
        setStats({
          products: products.pagination?.total ?? products.data?.length ?? 0,
          users: users.pagination?.total ?? users.length ?? 0,
          orders: orders.pagination?.total ?? 0,
          categories: categories.pagination?.total ?? 0,
          brands: brands.pagination?.total ?? 0,
          shipments: makes.pagination?.totalItems ?? makes.pagination?.total ?? 0,
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Overview of your 4x4 e-commerce store</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, bg, fg }) => (
          <Link
          to={`/${label.toLowerCase()}`}
            key={key}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats[key] ?? "—"}</p>
              </div>
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon size={24} className={fg} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
