import CrudPage from "../../components/shared/CrudPage";
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
  updateCoupon,
} from "../../api/coupons";
import { useEffect, useState } from "react";
import StatusBadge from "../../components/shared/StatusBadge";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

const defaultForm = {
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: 0,
  max_discount_amount: "",
  usage_limit_per_user: 1,
  total_usage_limit: "",
  valid_from: "",
  valid_to: "",
  description: "",
  custom_code: "",
};
function CouponFilter({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterState({ ...filterState, search: searchInput });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Search by order ID or ref..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
      <select
        value={filterState.status || ""}
        onChange={(e) =>
          setFilterState({ ...filterState, status: e.target.value })
        }
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
export default function CouponsPage() {
  // We'll use a local refresh counter
  const [refreshKey, setRefreshKey] = useState(0);

  const handleToggle = async (row) => {
  
    await toggleCouponStatus(row);
    setRefreshKey((prev) => prev + 1); // trigger re-fetch
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    try {
      await deleteCoupon(row.id);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };
  return (
    <CrudPage
      key={refreshKey} // force re‑mount and re‑fetch when changed
      title="Coupons"
      description="Create and view coupon templates"
      idKey="id"
      canEdit={true}
      canDelete={true} // disable built-in delete
      toggleStatus={handleToggle} // disable built-in toggle
      modalWide
      defaultForm={defaultForm}
      fetchList={(page, filters) =>
        getCoupons({
          page,
          limit: 10,
          search: filters.search,
          status: filters.status || "active",
        })
      }
      createItem={createCoupon}
      updateItem={updateCoupon}
      FilterComponent={CouponFilter}
      deleteItem={deleteCoupon}
      columns={[
        { key: "no", label: "Serial" },
        { key: "code", label: "Code" },
        { key: "discount_type", label: "Type" },
        { key: "discount_value", label: "Value" },
        {
          key: "valid_from",
          label: "From",
          render: (r) => new Date(r.valid_from).toLocaleDateString(),
        },
        {
          key: "valid_to",
          label: "To",
          render: (r) => new Date(r.valid_to).toLocaleDateString(),
        },
        {
          key: "status",
          label: "Status",
          render: (r) => (
            <StatusBadge status={r.is_active ? "active" : "inactive"} />
          ),
        },
        // Custom actions column
        // {
        //   key: "actions",
        //   label: "Actions",
        //   // render: (row) => (
        //   //   <div className="flex items-center gap-1 justify-end">
        //   //     <button
        //   //       type="button"
        //   //       onClick={() => handleToggle(row)}
        //   //       className="p-2 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
        //   //       title={row.is_active ? "Deactivate" : "Activate"}
        //   //     >
        //   //       {row.is_active ? (
        //   //         <ToggleRight size={16} />
        //   //       ) : (
        //   //         <ToggleLeft size={16} />
        //   //       )}
        //   //     </button>
        //   //     <button
        //   //       type="button"
        //   //       onClick={() => handleDelete(row)}
        //   //       className="p-2 rounded-lg border border-slate-200 hover:border-rose-200 hover:text-rose-600 transition-colors"
        //   //     >
        //   //       <Trash2 size={16} />
        //   //     </button>
        //   //   </div>
        //   // ),
        // },
      ]}
      formFields={[
        { name: "code", label: "Coupon Code", colSpan: 2 },
        {
          name: "discount_type",
          label: "Discount Type",

          type: "select",
          required: true,
          options: [
            { id: "percentage", name: "Percentage" },
            { id: "fixed", name: "Fixed Amount" },
          ],
          optionValue: "id",
        },
        {
          name: "discount_value",
          label: "Discount Value",
          colSpan: 2,
          type: "number",
          required: true,
          step: "0.01",
        },
        {
          name: "min_order_amount",
          label: "Min Order Amount",
          type: "number",
          step: "0.01",
        },
        {
          name: "max_discount_amount",
          label: "Max Discount",
          type: "number",
          step: "0.01",
        },

        {
          name: "total_usage_limit",
          label: "Total Usage Limit",
          type: "number",
        },
        {
          name: "valid_from",
          label: "Valid From",
          type: "date",
          required: true,
        },
        {
          name: "valid_to",
          label: "Valid To",
          type: "date",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          colSpan: 2,
        },
      ]}
      preparePayload={(form) => ({
        ...form,
        discount_value: Number(form.discount_value),
        min_order_amount: Number(form.min_order_amount) || 0,
        max_discount_amount: form.max_discount_amount
          ? Number(form.max_discount_amount)
          : null,

        total_usage_limit: form.total_usage_limit
          ? Number(form.total_usage_limit)
          : null,
      })}
    />
  );
}
