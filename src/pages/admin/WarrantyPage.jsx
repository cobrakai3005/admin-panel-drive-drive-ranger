import { useState } from "react";
import CrudPage from "../../components/shared/CrudPage";
import Modal from "../../components/shared/Modal";
import { getAllClaims } from "../../api/warranty";
import { Mail, Phone, User2 } from "lucide-react";

const WARRANTY_STATUSES = ["active", "expired", "claimed", "void"];

export default function WarrantyPage() {
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [detailModal, setDetailModal] = useState(false);
  const handleViewDetails = (row) => {
    setDetailModal(row);
  };

  const hiddenDetailKeys = [
    "order_item_id",
    "order_id",
    "product_id",
    "user_id",
  ];

  const formatLabel = (key) =>
    key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "—";

    if (
      key.includes("_at") ||
      key.includes("_date") ||
      key === "delivered_at" ||
      key === "order_created_at"
    ) {
      return new Date(value).toLocaleString();
    }

    if (
      key.includes("price") ||
      key.includes("cost") ||
      key.includes("amount") ||
      key === "subtotal"
    ) {
      return `₹${Number(value).toLocaleString()}`;
    }

    return String(value);
  };

  const detailEntries = detailModal
    ? Object.entries(detailModal).filter(
        ([key]) => !hiddenDetailKeys.includes(key),
      )
    : [];
  return (
    <>
      <CrudPage
        key={refreshKey}
        title="Warranty"
        description="Manage product warranty registrations"
        idKey="id"
        canCreate={false}
        canDelete={false}
        fetchList={(page) => getAllClaims({ page, limit: 10 })}
        // onEditRow={(row) => {
        //   setStatus(row.status);
        //   setModal(row);
        // }}
        columns={[
          { key: "no", label: "Serial" },

          {
            key: "customer_name",
            label: "Customer",
            render: (row) => (
              <div>
                <div className="font-medium flex items-center gap-3 text-slate-900">
                 <User2 size={12}/> {row.customer_name}
                </div>
                <div className="text-xs flex items-center gap-3 text-slate-500">
                 <Mail size={12}/> {row.customer_email}
                </div>
                <div className="text-xs flex items-center gap-3 text-slate-500">
                 <Phone size={12}/> {row.customer_phone}
                </div>
              </div>
            ),
          },

          {
            key: "product_name",
            label: "Product",
            render: (row) => (
              <div>
                <div className="font-medium">{row.product_name}</div>
                <div className="text-xs text-slate-500">{row.sku}</div>
              </div>
            ),
          },

          {
            key: "claimed_quantity",
            label: "Claim",
            render: (row) => (
              <span className="font-medium">
                {row.claimed_quantity} / {row.quantity}
              </span>
            ),
          },

          {
            key: "warranty_status",
            label: "Warranty Status",
            render: (row) => {
              const styles = {
                active: "bg-emerald-100 text-emerald-700",
                partial_claimed: "bg-amber-100 text-amber-700",
                fully_claimed: "bg-rose-100 text-rose-700",
                expired: "bg-slate-200 text-slate-700",
              };

              const labels = {
                active: "Active",
                partial_claimed: "Partially Claimed",
                fully_claimed: "Fully Claimed",
                expired: "Expired",
              };

              return (
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    styles[row.warranty_status] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {labels[row.warranty_status] || row.warranty_status}
                </span>
              );
            },
          },

          {
            key: "warranty_end_date",
            label: "Warranty Ends",
            render: (row) =>
              row.warranty_end_date
                ? new Date(row.warranty_end_date).toLocaleDateString()
                : "—",
          },

          {
            key: "warranty_claimed_at",
            label: "Claimed On",
            render: (row) =>
              row.warranty_claimed_at
                ? new Date(row.warranty_claimed_at).toLocaleDateString()
                : "—",
          },

          {
            key: "more",
            label: "More",
            render: (row) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(row);
                }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                View Details
              </button>
            ),
          },
        ]}
        formFields={[]}
      />

      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Warranty Claim Details"
        wide="large"
      >
        {detailModal && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-gradient-to-r from-indigo-50 to-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {detailModal.product_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Claimed by {detailModal.customer_name}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {detailModal.warranty_status?.replaceAll("_", " ") || "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {detailEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {formatLabel(key)}
                  </div>

                  <div className="mt-1 break-words text-sm font-medium text-slate-900">
                    {formatValue(key, value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={`Warranty #${modal?.id}`}
      >
        <form
          className="p-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await updateWarrantyStatus(modal.id, { status });
            setModal(null);
            setRefreshKey((k) => k + 1);
          }}
        >
          <select
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
          >
            {WARRANTY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
          >
            Update Status
          </button>
        </form>
      </Modal>
    </>
  );
}
