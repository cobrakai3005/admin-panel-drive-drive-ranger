import CrudPage from "../../components/shared/CrudPage";
import {
  getShipments,
  getShipmentById as getShipment,
  updateShipment,
  deleteShipment,
  addTrackingEvent,
  createShipment,
} from "../../api/shipments";
import { useState, useEffect } from "react";
import StatusBadge from "../../components/shared/StatusBadge";
import Modal from "../../components/shared/Modal";
import { Mail, Phone, User } from "lucide-react";

const defaultForm = {
  order_id: "",
  carrier: "",
  recipient_address: "",
  status: "pending",
};
function ShipmentFilter({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterState({ ...filterState, search: searchInput });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="flex items-center gap-3">
      {/* <input
        type="text"
        placeholder="Search tracking, carrier, address..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      /> */}
      <select
        value={filterState.status || ""}
        onChange={(e) =>
          setFilterState({ ...filterState, status: e.target.value })
        }
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="assigned">Assigned</option>
        <option value="picked_up">Picked Up</option>
        <option value="in_transit">In Transit</option>
        <option value="out_for_delivery">Out for Delivery</option>
        <option value="delivered">Delivered</option>
        <option value="failed">Failed</option>
        <option value="returned">Returned</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {/* <input
        type="text"
        placeholder="Carrier (e.g. UPS)"
        value={filterState.carrier || ""}
        onChange={(e) =>
          setFilterState({ ...filterState, carrier: e.target.value })
        }
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      /> */}
    </div>
  );
}
export default function ShipmentAdmin() {
  const [detailModal, setDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false); // new loading state
  const [trackingForm, setTrackingForm] = useState({
    event: "",
    timestamp: "",
  });

  const [addingEvent, setAddingEvent] = useState(false);

  // Handler to fetch full shipment details
  const handleViewDetails = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getShipment(id);
      setDetailModal(data);
    } catch (error) {
      console.error("Failed to fetch shipment details", error);
      // Optionally show a toast/notification here
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddTrackingEvent = async () => {
    console.log("Adding tracking event:", trackingForm);
    if (!trackingForm.event || !trackingForm.timestamp) {
      return;
    }

    try {
      setAddingEvent(true);
      console.log(trackingForm);
      const json = {
        event: [
          {
            event: trackingForm.event,
            timestamp: String(trackingForm.timestamp),
          },
        ],
      };
      await addTrackingEvent(detailModal.id, JSON.stringify(json));

      // Refresh shipment
      const shipment = await getShipment(detailModal.id);
      setDetailModal(shipment);

      // Reset form
      setTrackingForm({
        event: "",
        timestamp: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingEvent(false);
    }
  };

  const history = (detailModal?.tracking_history || []).flatMap((item) => {
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  });
  console.log("Tracking History:", history);
  return (
    <>
      <CrudPage
        title="Shipments"
        description="Manage all shipments"
        idKey="id"
        fileFields={[]}
        defaultForm={defaultForm}
        FilterComponent={ShipmentFilter}
        fetchList={(page, filters) =>
          getShipments({
            page,
            limit: 10,
            status: filters.status || undefined,
            carrier: filters.carrier || undefined,
            search: filters.search || "",
          })
        }
        // createItem={createShipment}
        updateItem={updateShipment}
        deleteItem={deleteShipment}
        columns={[
          { key: "no", label: "Serial" },
          // { key: "order_id", label: "Order Id" },
          {
            key: "customer_name",
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
          {
            key: "recipient_address",
            label: "Recipient Address",
            render: (row) => (
              <div className="max-w-xs truncate" title={row.recipient_address}>
                {row.recipient_address}
              </div>
            ),
          },
          {
            key: "current_status",
            label: "Status",
            render: (row) => <StatusBadge status={row.current_status} />,
          },
          {
            key: "created_at",
            label: "Created",
            render: (row) => new Date(row.created_at).toLocaleDateString(),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(row.id); // <-- call async handler
                }}
                disabled={detailLoading} // disable while loading
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {detailLoading ? "Loading..." : "View Details"}
              </button>
            ),
          },
        ]}
        formFields={[
          // {
          //   name: "order_id",
          //   label: "Order ID",
          //   type: "number",
          //   required: true,
          // },
          { name: "carrier", label: "Carrier", colSpan: 2 },
          {
            name: "recipient_address",
            label: "Recipient Address",
            type: "textarea",
            colSpan: 2,
            required: true,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { id: "pending", name: "Pending" },
              { id: "assigned", name: "Assigned" },
              { id: "picked_up", name: "Picked Up" },
              { id: "in_transit", name: "In Transit" },
              { id: "out_for_delivery", name: "Out for Delivery" },
              { id: "delivered", name: "Delivered" },
              { id: "failed", name: "Failed" },
              { id: "returned", name: "Returned" },
              { id: "cancelled", name: "Cancelled" },
            ],
            optionValue: "id",
            optionLabel: "name",
          },
        ]}
        canCreate={true}
        canEdit={true}
        canDelete={true}
        createLabel="Add Shipment"
        emptyMessage="No shipments found."
      />

      {/* Order Details Modal - unchanged, assumes detailModal now contains full data */}
      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title={`Shipment  Details`}
        wide="large"
      >
        {detailModal && (
          <div className="p-6 space-y-6 min-h-[80vh] overflow-auto">
            {/* {Trackking } */}

            <div className="space-y-2">
              {history?.length ? (
                <div className="overflow-x-auto scrollbar scrollbar-thumb-indigo-500 scrollbar-track-slate-100 pb-8 pt-4">
                  <div className="flex items-start min-w-max px-6">
                    {history.map((event, index) => {
                      const isLatest = index === 0; // Most recent event
                      const isLast = index === history.length - 1; // Oldest event

                      return (
                        <div key={index} className="flex items-start">
                          {/* Timeline Item */}
                          <div className="flex flex-col items-center w-52 group">
                            {/* Dot Logic */}
                            <div className="relative flex items-center justify-center">
                              {/* Only the latest event pulses */}
                              {isLatest && (
                                <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-indigo-400 opacity-40"></span>
                              )}

                              {/* All dots are Indigo because they are all in the history (completed) */}
                              <div
                                className={`relative z-10 w-5 h-5 rounded-full border-4 border-white shadow-sm bg-indigo-600`}
                              />
                            </div>

                            {/* Card */}
                            <div
                              className={`mt-5 relative flex flex-col p-4 rounded-2xl border transition-all w-full ${
                                isLatest
                                  ? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50"
                                  : "bg-gray-50/50 border-gray-100"
                              }`}
                            >
                              {/* Small Arrow pointing up to the dot */}
                              <div
                                className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l ${
                                  isLatest
                                    ? "bg-white border-indigo-200"
                                    : "bg-gray-50 border-gray-100"
                                }`}
                              ></div>

                              <h5
                                className={`font-bold text-sm leading-tight ${
                                  isLatest ? "text-indigo-900" : "text-gray-700"
                                }`}
                              >
                                {event.event}
                              </h5>

                              <p className="text-[11px] text-gray-500 mt-2 flex items-center">
                                <svg
                                  className="w-3 h-3 mr-1 opacity-60"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {new Date(event.timestamp).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Connecting Line - All lines are indigo because these events are finished */}
                          {!isLast && (
                            <div className="w-20 h-[3px] mt-[9px] -mx-1 bg-indigo-500/30" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-sm text-gray-400">
                    No tracking history yet.
                  </p>
                </div>
              )}
            </div>
            {/*  */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Tracking History
              </h4>

              <div className="border border-zinc-300 rounded-xl p-4 bg-white space-y-3">
                <h5 className="font-medium">Add Tracking Event</h5>

                <input
                  className="w-full border border-zinc-300 rounded-lg p-2"
                  placeholder="Event"
                  name="event"
                  value={trackingForm.event}
                  onChange={(e) =>
                    setTrackingForm((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />

                <input
                  type="date"
                  className="w-full border border-zinc-300 rounded-lg p-2"
                  name="timestamp"
                  placeholder="Timestamp"
                  value={trackingForm.timestamp}
                  onChange={(e) =>
                    setTrackingForm((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />

                <button
                  onClick={handleAddTrackingEvent}
                  disabled={addingEvent}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addingEvent ? "Adding..." : "Add Event"}
                </button>
              </div>
            </div>
            {/* Customer Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Customer Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Address:</span>{" "}
                  <span className="font-medium">
                    {detailModal.recipient_address}
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
                          Rs:{parseFloat(item.unit_price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          Rs: {parseFloat(item.total_price).toFixed(2)}
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
                        Rs: {parseFloat(detailModal.subtotal).toFixed(2)}
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
                          Rs: {parseFloat(detailModal.shipping_cost).toFixed(2)}
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
                          Rs {parseFloat(detailModal.tax_amount).toFixed(2)}
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
                          -Rs:{" "}
                          {parseFloat(detailModal.discount_amount).toFixed(2)}
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
                        Rs {parseFloat(detailModal.total_amount).toFixed(2)}
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
    </>
  );
}
