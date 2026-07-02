import { useState } from "react";
import CrudPage from "../../components/shared/CrudPage";
import Modal from "../../components/shared/Modal";
import { getAllReturns, updateReturnStatus } from "../../api/returns";
import { Mail, Phone, User } from "lucide-react";

const RETURN_STATUSES = [
  "requested",
  "approved",
  "rejected",
  "received",
  "refund_issued",
  "closed",
];

export default function ReturnsPage() {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    return_status: "",
    refund_estimated_date: "",
    restocking_fees: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudPage
        key={refreshKey}
        title="Returns"
        description="Review and update return requests"
        idKey="id"
        canCreate={false}
        canDelete={false}
        fetchList={(page) => getAllReturns({ page, limit: 10 })}
        onEditRow={(row) => {
          setForm({
            return_status: row.return_status,
            refund_estimated_date:
              row.refund_estimated_date?.slice(0, 10) || "",
            restocking_fees: row.restocking_fees ?? "",
          });
          setModal(row);
        }}
        columns={[
          { key: "no", label: "Serial" },
          {
            key: "user_name",
            label: "Customer Info, (Name, Phone and email)",

            render: (row) => (
              <div className="max-w-xs truncate" title={row.recipient_address}>
                <p className="flex items-center gap-2">
                  {" "}
                  <User size={14} className="text-red-400" />
                  {row.customer_name}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400" />
                  {row.customer_phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-amber-400" />
                  {row.customer_email}
                </p>
              </div>
            ),
          },
          { key: "return_reason", label: "Reason" },
          {
            key: "refund_amount",
            label: "Refund",
            render: (r) => `$${r.refund_amount}`,
          },
          { key: "return_status", label: "Status" },
        ]}
        formFields={[]}
      />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={`Return #${modal?.id}`}
      >
        <form
          className="p-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await updateReturnStatus(modal.id, {
              ...form,
              restocking_fees: form.restocking_fees
                ? Number(form.restocking_fees)
                : 0,
            });
            setModal(null);
            setRefreshKey((k) => k + 1);
          }}
        >
          <select
            required
            value={form.return_status}
            onChange={(e) =>
              setForm({ ...form, return_status: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
          >
            {RETURN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.refund_estimated_date}
            onChange={(e) =>
              setForm({ ...form, refund_estimated_date: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Restocking fees"
            value={form.restocking_fees}
            onChange={(e) =>
              setForm({ ...form, restocking_fees: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
          >
            Update
          </button>
        </form>
      </Modal>
    </>
  );
}
