// import { useCallback, useEffect, useState } from "react";
// import { Edit3, Save, Plus, Minus, Trash2, Eye, AlertCircle } from "lucide-react";
// import PageHeader from "../../components/shared/PageHeader";
// import Modal from "../../components/shared/Modal";
// import FormSelect from "../../components/shared/FormSelect";
// import { fetchProductItemOptions } from "../../api/productItems";
// import {
//   getStock,
//   setStock,
//   adjustStock,
//   deleteStock,
//   getStockStatus,
//   getReorderList,
// } from "../../api/productStock";

// export default function ProductStockPage() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ---- Modal state ----
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("set"); // "set" | "adjust" | "status"
//   const [selectedItemId, setSelectedItemId] = useState("");
//   const [stockData, setStockData] = useState(null); // for status modal

//   // ---- Set/Adjust form state ----
//   const [form, setForm] = useState({
//     quantity: 0,
//     reserved_quantity: 0,
//     backorder_allowed: false,
//     threshold_quantity: 0,
//   });

//   // ---- Adjust specific fields ----
//   const [adjustFields, setAdjustFields] = useState({
//     quantity_change: "",
//     reserved_change: "",
//     backorder_allowed: undefined,
//     threshold_quantity: "",
//   });

//   // ---- Reorder list ----
//   const [reorderModalOpen, setReorderModalOpen] = useState(false);
//   const [reorderList, setReorderList] = useState([]);

//   const loadItems = useCallback(async () => {
//     setLoading(true);
//     try {
//       const list = await fetchProductItemOptions();
//       setItems(list);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadItems();
//   }, [loadItems]);

//   // ---- Open Set Stock modal ----
//   const openSetStock = async (itemId) => {
//     setSelectedItemId(itemId);
//     setModalMode("set");
//     try {
//       const res = await getStock(itemId);
//       const stock = res.data || {};
//       setForm({
//         quantity: stock.quantity ?? 0,
//         reserved_quantity: stock.reserved_quantity ?? 0,
//         backorder_allowed: Boolean(stock.backorder_allowed),
//         threshold_quantity: stock.threshold_quantity ?? 0,
//       });
//     } catch {
//       setForm({
//         quantity: 0,
//         reserved_quantity: 0,
//         backorder_allowed: false,
//         threshold_quantity: 0,
//       });
//     }
//     setModalOpen(true);
//   };

//   // ---- Open Adjust Stock modal ----
//   const openAdjustStock = async (itemId) => {
//     setSelectedItemId(itemId);
//     setModalMode("adjust");
//     // Pre-fill current values for reference
//     try {
//       const res = await getStock(itemId);
//       const stock = res.data || {};
//       setAdjustFields({
//         quantity_change: "",
//         reserved_change: "",
//         backorder_allowed: stock.backorder_allowed,
//         threshold_quantity: stock.threshold_quantity ?? "",
//       });
//     } catch {
//       setAdjustFields({
//         quantity_change: "",
//         reserved_change: "",
//         backorder_allowed: false,
//         threshold_quantity: "",
//       });
//     }
//     setModalOpen(true);
//   };

//   // ---- Open Status modal ----
//   const openStatus = async (itemId) => {
//     setSelectedItemId(itemId);
//     setModalMode("status");
//     try {
//       const res = await getStockStatus(itemId);
//       setStockData(res.data);
//     } catch (error) {
//       setStockData(null);
//       alert("No stock record found for this item.");
//     }
//     setModalOpen(true);
//   };

//   // ---- Handle Set Stock save ----
//   const handleSetStock = async (e) => {
//     e.preventDefault();
//     await setStock(selectedItemId, {
//       ...form,
//       quantity: Number(form.quantity),
//       reserved_quantity: Number(form.reserved_quantity),
//       threshold_quantity: Number(form.threshold_quantity),
//     });
//     setModalOpen(false);
//     loadItems();
//   };

//   // ---- Handle Adjust Stock save ----
//   const handleAdjustStock = async (e) => {
//     e.preventDefault();
//     const payload = {};
//     if (adjustFields.quantity_change !== "") payload.quantity_change = Number(adjustFields.quantity_change);
//     if (adjustFields.reserved_change !== "") payload.reserved_change = Number(adjustFields.reserved_change);
//     if (adjustFields.backorder_allowed !== undefined) payload.backorder_allowed = adjustFields.backorder_allowed;
//     if (adjustFields.threshold_quantity !== "") payload.threshold_quantity = Number(adjustFields.threshold_quantity);

//     if (Object.keys(payload).length === 0) {
//       alert("At least one field must be filled.");
//       return;
//     }
//     await adjustStock(selectedItemId, payload);
//     setModalOpen(false);
//     loadItems();
//   };

//   // ---- Handle Delete Stock ----
//   const handleDeleteStock = async (stockId, itemId) => {
//     if (!window.confirm("Are you sure you want to delete this stock record?")) return;
//     await deleteStock(stockId);
//     loadItems();
//   };

//   // ---- Fetch reorder list ----
//   const openReorderList = async () => {
//     try {
//       const res = await getReorderList(false); // exclude backorder allowed
//       setReorderList(res.data || []);
//       setReorderModalOpen(true);
//     } catch (error) {
//       alert("Failed to fetch reorder list.");
//     }
//   };

//   // ---- Helper to get stock status badge ----
//   const getStatusBadge = (status) => {
//     const map = {
//       OUT_OF_STOCK: { label: "Out of Stock", className: "bg-red-100 text-red-700" },
//       LOW_STOCK: { label: "Low Stock", className: "bg-yellow-100 text-yellow-700" },
//       IN_STOCK: { label: "In Stock", className: "bg-green-100 text-green-700" },
//     };
//     return map[status] || { label: "Unknown", className: "bg-gray-100 text-gray-700" };
//   };

//   return (
//     <div>
//       <PageHeader
//         title="Product Stock"
//         description="Manage inventory levels per product item (SKU)"
//       >
//         <button
//           onClick={openReorderList}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
//         >
//           <AlertCircle size={16} /> Reorder List
//         </button>
//       </PageHeader>

//       <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-slate-50 border-b border-slate-100">
//             <tr>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">ID</th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">SKU</th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Product</th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Category</th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Status</th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {loading ? (
//               <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
//             ) : items.map((item) => {
//               // We don't have stock status in the list; we could optionally fetch it per item, but we'll keep it simple.
//               // We'll show a placeholder or fetch on hover? For simplicity, we'll just show "—".
//               return (
//                 <tr key={item.id} className="hover:bg-indigo-50/20">
//                   <td className="px-4 py-3">{item.id}</td>
//                   <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
//                   <td className="px-4 py-3">{item.product?.name || item.name}</td>
//                   <td className="px-4 py-3">{item.product?.category || item.name}</td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => openStatus(item.id)}
//                       className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
//                     >
//                       <Eye size={14} /> View status
//                     </button>
//                   </td>
//                   <td className="px-4 py-3 text-right space-x-1">
//                     <button
//                       type="button"
//                       onClick={() => openSetStock(item.id)}
//                       className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:border-indigo-200 hover:text-indigo-600"
//                     >
//                       <Edit3 size={14} /> Set
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => openAdjustStock(item.id)}
//                       className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:border-orange-200 hover:text-orange-600"
//                     >
//                       <Plus size={14} /> Adjust
//                     </button>
//                     <button
//                       type="button"
//                       onClick={async () => {
//                         try {
//                           const res = await getStock(item.id);
//                           const stockId = res.data?.id;
//                           if (!stockId) {
//                             alert("No stock record to delete.");
//                             return;
//                           }
//                           handleDeleteStock(stockId, item.id);
//                         } catch {
//                           alert("No stock record found.");
//                         }
//                       }}
//                       className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:border-red-200 hover:text-red-600"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* ========== Modal for Set, Adjust, Status ========== */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={
//         modalMode === "set" ? "Set Stock" :
//         modalMode === "adjust" ? "Adjust Stock" :
//         "Stock Status"
//       }>
//         {modalMode === "set" && (
//           <form onSubmit={handleSetStock} className="p-6 space-y-4">
//             <FormSelect
//               label="Product Item"
//               value={selectedItemId}
//               onChange={setSelectedItemId}
//               options={items}
//               optionValue="id"
//               optionLabel="sku"
//               required
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-semibold uppercase text-slate-500">Quantity *</label>
//                 <input
//                   type="number"
//                   required
//                   min={0}
//                   value={form.quantity}
//                   onChange={(e) => setForm({ ...form, quantity: e.target.value })}
//                   className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-semibold uppercase text-slate-500">Reserved</label>
//                 <input
//                   type="number"
//                   min={0}
//                   value={form.reserved_quantity}
//                   onChange={(e) => setForm({ ...form, reserved_quantity: e.target.value })}
//                   className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-semibold uppercase text-slate-500">Threshold</label>
//                 <input
//                   type="number"
//                   min={0}
//                   value={form.threshold_quantity}
//                   onChange={(e) => setForm({ ...form, threshold_quantity: e.target.value })}
//                   className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
//                 />
//               </div>
//               <label className="flex items-center gap-2 text-sm mt-6">
//                 <input
//                   type="checkbox"
//                   checked={form.backorder_allowed}
//                   onChange={(e) => setForm({ ...form, backorder_allowed: e.target.checked })}
//                 />
//                 Allow backorder
//               </label>
//             </div>
//             <div className="flex justify-end pt-2">
//               <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
//                 <Save size={16} /> Save Stock
//               </button>
//             </div>
//           </form>
//         )}

//         {modalMode === "adjust" && (
//           <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
//             <p className="text-sm text-slate-500">Adjust quantity or reserved by a positive/negative number. Leave blank to keep unchanged.</p>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-semibold uppercase text-slate-500">Quantity change</label>
//                 <input
//                   type="number"
//                   value={adjustFields.quantity_change}
//                   onChange={(e) => setAdjustFields({ ...adjustFields, quantity_change: e.target.value })}
//                   placeholder="e.g. +5 or -3"
//                   className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-semibold uppercase text-slate-500">Reserved change</label>
//                 <input
//                   type="number"
//                   value={adjustFields.reserved_change}
//                   onChange={(e) => setAdjustFields({ ...adjustFields, reserved_change: e.target.value })}
//                   placeholder="e.g. +2 or -1"
//                   className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-semibold uppercase text-slate-500">Threshold quantity</label>
//                 <input
//                   type="number"
//                   min={0}
//                   value={adjustFields.threshold_quantity}
//                   onChange={(e) => setAdjustFields({ ...adjustFields, threshold_quantity: e.target.value })}
//                   placeholder="New threshold"
//                   className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
//                 />
//               </div>
//               <label className="flex items-center gap-2 text-sm mt-6">
//                 <input
//                   type="checkbox"
//                   checked={adjustFields.backorder_allowed}
//                   onChange={(e) => setAdjustFields({ ...adjustFields, backorder_allowed: e.target.checked })}
//                 />
//                 Allow backorder
//               </label>
//             </div>
//             <div className="flex justify-end pt-2">
//               <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold">
//                 <Save size={16} /> Apply Adjustment
//               </button>
//             </div>
//           </form>
//         )}

//         {modalMode === "status" && stockData && (
//           <div className="p-6 space-y-3">
//             <div className="flex justify-between items-center border-b pb-2">
//               <span className="font-semibold">Product</span>
//               <span className="text-sm">{stockData.product_item_id}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Quantity</span>
//               <span>{stockData.quantity}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Reserved</span>
//               <span>{stockData.reserved_quantity}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Available</span>
//               <span className="font-bold">{stockData.available_quantity}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Threshold</span>
//               <span>{stockData.threshold_quantity}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Backorder Allowed</span>
//               <span>{stockData.backorder_allowed ? "Yes" : "No"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Status</span>
//               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(stockData.stock_status).className}`}>
//                 {getStatusBadge(stockData.stock_status).label}
//               </span>
//             </div>
//             {stockData.alert_message && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
//                 {stockData.alert_message}
//               </div>
//             )}
//             <div className="flex justify-end pt-2">
//               <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200">Close</button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ========== Reorder List Modal ========== */}
//       <Modal open={reorderModalOpen} onClose={() => setReorderModalOpen(false)} title="Products Needing Reorder">
//         <div className="p-6">
//           {reorderList.length === 0 ? (
//             <p className="text-slate-500">All products have sufficient stock.</p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left py-2">SKU</th>
//                   <th className="text-left py-2">Product</th>
//                   <th className="text-left py-2">Available</th>
//                   <th className="text-left py-2">Threshold</th>
//                   <th className="text-left py-2">Priority</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reorderList.map((item) => (
//                   <tr key={item.product_item_id} className="border-b border-slate-50">
//                     <td className="py-2 font-mono text-xs">{item.sku}</td>
//                     <td className="py-2">{item.name}</td>
//                     <td className="py-2">{item.available_quantity}</td>
//                     <td className="py-2">{item.threshold_quantity}</td>
//                     <td className="py-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         item.priority === "URGENT" ? "bg-red-100 text-red-700" :
//                         item.priority === "LOW" ? "bg-yellow-100 text-yellow-700" :
//                         "bg-green-100 text-green-700"
//                       }`}>
//                         {item.priority}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//           <div className="flex justify-end mt-4">
//             <button onClick={() => setReorderModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200">Close</button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }