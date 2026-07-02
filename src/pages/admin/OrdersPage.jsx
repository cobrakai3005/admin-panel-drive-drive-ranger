import { useEffect, useState } from "react";
import CrudPage from "../../components/shared/CrudPage";
import Modal from "../../components/shared/Modal";
import { getAllOrders, updateOrderStatus } from "../../api/orders";
import Select from "react-select";

const ORDER_STATUSES = [
  { value: "pending", label: "PENDING" },
  { value: "confirmed", label: "CONFIRMED" },
  { value: "processing", label: "PROCESSING" },
  { value: "shipped", label: "SHIPPED" },
  { value: "delivered", label: "DELLIVERED" },
  { value: "cancelled", label: "CANCELLED" },
  { value: "refunded", label: "REFUNDED" },
];

function OrderFilter({ filterState, setFilterState }) {
  // const [searchInput, setSearchInput] = useState(filterState.search || "");

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setFilterState({ ...filterState, search: searchInput });
  //   }, 400); // 400ms debounce

  //   return () => clearTimeout(timer);
  // }, [searchInput]);
  const statusOptions = ORDER_STATUSES;
  return (
    <div className="flex items-center gap-3">
      {/* <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      /> */}
      <Select
        options={statusOptions}
        value={statusOptions.find(
          (option) => option.value === (filterState.status || "Chose"),
        )}
        onChange={(selected) =>
          setFilterState((prev) => ({
            ...prev,
            status: selected.value,
          }))
        }
        isSearchable={false}
        className="min-w-[180px] text-sm"
        classNamePrefix="react-select"
      />
    </div>
  );
}
export default function OrdersPage() {
  const [statusModal, setStatusModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [statusForm, setStatusForm] = useState({
    order_status: "",
    admin_notes: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudPage
        key={refreshKey}
        title="Orders"
        description="View and update order status"
        idKey="id"
        canCreate={false}
        canDelete={false}
        FilterComponent={OrderFilter}
       
        fetchList={(page, filters) =>
          getAllOrders({
            page,
            limit: 10,
            status: filters.status || "active",
            search: filters.search || "",
          })
        }
        onEditRow={(row) => {
          setStatusForm({
            order_status: row.order_status,
            admin_notes: row.admin_notes || "",
          });
          setStatusModal(row);
        }}
        columns={[
          { key: "no", label: "Order Sr" },
          { key: "customer_name", label: "Customer" },
          {
            key: "phone",
            label: "Customer Phone",
            render: (r) => ` ${r.billing_phone}`,
          },
          {
            key: "shipping_address",
            label: "Full Shipping Address",
            render: (r) => `${r.shipping_address.full_address}`,
          },
          {
            key: "order_date",
            label: "Date",
            render: (r) => new Date(r.order_date).toLocaleDateString(),
          },
          {
            key: "total_amount",
            label: "Total in (Rupee)",
            render: (r) => ` ${parseFloat(r.total_amount).toFixed(2)}`,
          },
          {
            key: "order_status",
            label: "Status",
            render: (r) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  r.order_status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : r.order_status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : r.order_status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.order_status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : r.order_status === "refunded"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                }`}
              >
                {r.order_status}
              </span>
            ),
          },
          {
            key: "payment_status",
            label: "Payment",
            render: (r) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium Rs- {
                  r.payment_status === "paid"
                    ? "bg-green-100 text-green-700"
                    : r.payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : r.payment_status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-purple-100 text-purple-700"
                }`}
              >
                {r.payment_status}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (r) => (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click from interfering
                  setDetailModal(r);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View Details
              </button>
            ),
          },
        ]}
        formFields={[]}
      />

      {/* Order Details Modal */}
      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title={`Order  Details`}
        wide="large"
      >
        {detailModal && (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Customer Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Customer Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium">
                    {detailModal.customer_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-medium">
                    {detailModal.customer_email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="font-medium">
                    {detailModal.customer_phone}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Role:</span>{" "}
                  <span className="font-medium">
                    {detailModal.customer_role}
                  </span>
                </div>
              </div>
            </div>
            {/* Order Items */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Order Items ({detailModal.items?.length || 0})
              </h4>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        SKU
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Variation
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {detailModal.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">
                              {item.product?.name ||
                                item.product?.snapshot?.product_name}
                            </div>
                            {item.product?.snapshot && (
                              <div className="text-xs text-gray-500">
                                {item.product.snapshot.product_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.product?.sku ||
                            item.product?.snapshot?.sku ||
                            "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.product?.variation ||
                            item.product?.snapshot?.variation ||
                            "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          Rs- {parseFloat(item.unit_price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          Rs- {parseFloat(item.total_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-right text-sm">
                        Subtotal:
                      </td>
                      <td className="px-4 py-2 text-right text-sm">
                        Rs- {parseFloat(detailModal.subtotal).toFixed(2)}
                      </td>
                    </tr>
                    {parseFloat(detailModal.shipping_cost) > 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-2 text-right text-sm text-gray-600"
                        >
                          Shipping:
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          Rs- {parseFloat(detailModal.shipping_cost).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {parseFloat(detailModal.tax_amount) > 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-2 text-right text-sm text-gray-600"
                        >
                          Tax:
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          Rs- {parseFloat(detailModal.tax_amount).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {parseFloat(detailModal.discount_amount) > 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-2 text-right text-sm text-green-600"
                        >
                          Discount:
                        </td>
                        <td className="px-4 py-2 text-right text-sm text-green-600">
                          -Rs- {parseFloat(detailModal.discount_amount).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-gray-300">
                      <td
                        colSpan="5"
                        className="px-4 py-3 text-right text-sm font-bold"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-indigo-600">
                        Rs- {parseFloat(detailModal.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {/* Order Status */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Order Status
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Order Status:</span>{" "}
                  <span className="font-medium capitalize">
                    {detailModal.order_status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Payment Status:</span>{" "}
                  <span className="font-medium capitalize">
                    {detailModal.payment_status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Payment Method:</span>{" "}
                  <span className="font-medium capitalize">
                    {detailModal.payment_method}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Order Date:</span>{" "}
                  <span className="font-medium">
                    {new Date(detailModal.order_date).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Shipping Address
              </h4>
              <div className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium">{detailModal.shipping_full_name}</p>
                <p className="text-gray-600">{detailModal.shipping_phone}</p>
                <p className="text-gray-600">{detailModal.shipping_line1}</p>
                {detailModal.shipping_line2 && (
                  <p className="text-gray-600">{detailModal.shipping_line2}</p>
                )}
                {detailModal.shipping_landmark && (
                  <p className="text-gray-600">
                    Landmark: {detailModal.shipping_landmark}
                  </p>
                )}
                <p className="text-gray-600">
                  {detailModal.shipping_city}, {detailModal.shipping_state}{" "}
                  {detailModal.shipping_postal_code}
                </p>
                <p className="text-gray-600">{detailModal.shipping_country}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Billing Address
              </h4>
              <div className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium">{detailModal.billing_full_name}</p>
                <p className="text-gray-600">{detailModal.billing_phone}</p>
                <p className="text-gray-600">{detailModal.billing_line1}</p>
                {detailModal.billing_line2 && (
                  <p className="text-gray-600">{detailModal.billing_line2}</p>
                )}
                {detailModal.billing_landmark && (
                  <p className="text-gray-600">
                    Landmark: {detailModal.billing_landmark}
                  </p>
                )}
                <p className="text-gray-600">
                  {detailModal.billing_city}, {detailModal.billing_state}{" "}
                  {detailModal.billing_postal_code}
                </p>
                <p className="text-gray-600">{detailModal.billing_country}</p>
              </div>
            </div>

            {/* Admin Notes */}
            {detailModal.admin_notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                  Admin Notes
                </h4>
                <div className="text-sm bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  {detailModal.admin_notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={`Update Order #Rs- {statusModal?.id}`}
      >
        <form
          className="p-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await updateOrderStatus(statusModal.id, statusForm);
            setStatusModal(null);
            setRefreshKey((k) => k + 1);
          }}
        >
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Order Status
            </label>

            <Select
              options={ORDER_STATUSES}
              value={ORDER_STATUSES.find(
                (option) => option.value === statusForm.order_status,
              )}
              onChange={(selected) =>
                setStatusForm({
                  ...statusForm,
                  order_status: selected.value,
                })
              }
              isSearchable={false}
              className="mt-1"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Admin Notes
            </label>
            <textarea
              rows={3}
              value={statusForm.admin_notes}
              onChange={(e) =>
                setStatusForm({ ...statusForm, admin_notes: e.target.value })
              }
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              placeholder="Add notes about this order..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
          >
            Update Status
          </button>
        </form>
      </Modal>
    </>
  );
}
