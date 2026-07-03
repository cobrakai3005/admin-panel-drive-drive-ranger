import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import AppLayout from "./pages/AppLayout";
import ProtectedRoute from "./pages/ProtectedRoute";

// Lazy loaded pages
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const SubCategoriesPage = lazy(() => import("./pages/admin/SubCategoriesPage"));
const BrandsPage = lazy(() => import("./pages/admin/BrandsPage"));
const ProductsAdminPage = lazy(() => import("./pages/admin/ProductsAdminPage"));
const ProductItemsPage = lazy(() => import("./pages/admin/ProductItemsPage"));
const UsersAdminPage = lazy(() => import("./pages/admin/UsersAdminPage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const CouponsPage = lazy(() => import("./pages/admin/CouponsPage"));
const TransactionsPage = lazy(() => import("./pages/admin/TransactionsPage"));
const ReturnsPage = lazy(() => import("./pages/admin/ReturnsPage"));
const WarrantyPage = lazy(() => import("./pages/admin/WarrantyPage"));
const ReviewsPage = lazy(() => import("./pages/admin/ReviewsPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const VehicleMakesPage = lazy(() => import("./pages/admin/VehicleMakesPage"));
const VehicleModelsPage = lazy(() => import("./pages/admin/VehicleModelsPage"));
const VehicleGenerationsPage = lazy(
  () => import("./pages/admin/VehicleGenerationsPage"),
);
const VehicleCompatibilityPage = lazy(
  () => import("./pages/admin/VehicleCompatibilityPage"),
);
const ProductImagesAdminPage = lazy(
  () => import("./pages/admin/ProductImagesAdminPage"),
);
const ShipmentAdmin = lazy(() => import("./pages/admin/ShipmentAdminPage"));
const AccountsPage = lazy(() => import("./pages/admin/AccountsPage"));
const WebsiteReviews = lazy(() => import("./pages/admin/WebisteReviews"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));

const Auth = lazy(() => import("./pages/Auth"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <DashboardPage />
            </Suspense>
          }
        />

        <Route
          path="categories"
          element={
            <Suspense fallback={<Loader />}>
              <CategoriesPage />
            </Suspense>
          }
        />

        <Route
          path="sub-categories"
          element={
            <Suspense fallback={<Loader />}>
              <SubCategoriesPage />
            </Suspense>
          }
        />

        <Route
          path="brands"
          element={
            <Suspense fallback={<Loader />}>
              <BrandsPage />
            </Suspense>
          }
        />

        <Route
          path="products"
          element={
            <Suspense fallback={<Loader />}>
              <ProductsAdminPage />
            </Suspense>
          }
        />

        <Route
          path="product-items"
          element={
            <Suspense fallback={<Loader />}>
              <ProductItemsPage />
            </Suspense>
          }
        />

        <Route
          path="users"
          element={
            <Suspense fallback={<Loader />}>
              <UsersAdminPage />
            </Suspense>
          }
        />

        <Route
          path="orders"
          element={
            <Suspense fallback={<Loader />}>
              <OrdersPage />
            </Suspense>
          }
        />

        <Route
          path="coupons"
          element={
            <Suspense fallback={<Loader />}>
              <CouponsPage />
            </Suspense>
          }
        />

        <Route
          path="transactions"
          element={
            <Suspense fallback={<Loader />}>
              <TransactionsPage />
            </Suspense>
          }
        />

        <Route
          path="returns"
          element={
            <Suspense fallback={<Loader />}>
              <ReturnsPage />
            </Suspense>
          }
        />

        <Route
          path="warranty"
          element={
            <Suspense fallback={<Loader />}>
              <WarrantyPage />
            </Suspense>
          }
        />

        <Route
          path="shipments"
          element={
            <Suspense fallback={<Loader />}>
              <ShipmentAdmin />
            </Suspense>
          }
        />

        <Route
          path="reviews"
          element={
            <Suspense fallback={<Loader />}>
              <ReviewsPage />
            </Suspense>
          }
        />

        <Route
          path="website-reviews"
          element={
            <Suspense fallback={<Loader />}>
              <WebsiteReviews />
            </Suspense>
          }
        />

        <Route
          path="check"
          element={
            <Suspense fallback={<Loader />}>
              <Checkout />
            </Suspense>
          }
        />

        <Route
          path="audit-logs"
          element={
            <Suspense fallback={<Loader />}>
              <AuditLogsPage />
            </Suspense>
          }
        />

        <Route
          path="vehicle-makes"
          element={
            <Suspense fallback={<Loader />}>
              <VehicleMakesPage />
            </Suspense>
          }
        />

        <Route
          path="vehicle-models"
          element={
            <Suspense fallback={<Loader />}>
              <VehicleModelsPage />
            </Suspense>
          }
        />

        <Route
          path="vehicle-generations"
          element={
            <Suspense fallback={<Loader />}>
              <VehicleGenerationsPage />
            </Suspense>
          }
        />

        <Route
          path="vehicle-compatibility"
          element={
            <Suspense fallback={<Loader />}>
              <VehicleCompatibilityPage />
            </Suspense>
          }
        />

        <Route
          path="settings"
          element={
            <Suspense fallback={<Loader />}>
              <SettingsPage />
            </Suspense>
          }
        />

        <Route
          path="accounts"
          element={
            <Suspense fallback={<Loader />}>
              <AccountsPage />
            </Suspense>
          }
        />

        <Route
          path="images"
          element={
            <Suspense fallback={<Loader />}>
              <ProductImagesAdminPage />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={<h2 className="text-slate-500">404 — Page not found</h2>}
        />
      </Route>

      <Route
        path="/auth"
        element={
          <Suspense fallback={<Loader />}>
            <Auth />
          </Suspense>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <Suspense fallback={<Loader />}>
            <VerifyOTP />
          </Suspense>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<Loader />}>
            <ForgotPassword />
          </Suspense>
        }
      />
    </>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
