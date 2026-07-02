// import { useCallback, useEffect, useState } from "react";
// import { Edit3, Save } from "lucide-react";
// import PageHeader from "../../components/shared/PageHeader";
// import Pagination from "../../components/shared/Pagination";
// import Modal from "../../components/shared/Modal";
// import StatusBadge from "../../components/shared/StatusBadge";
// import FormSelect from "../../components/shared/FormSelect";
// import { getAllOrders } from "../../api/orders";
// import {
//   createTransaction,
//   getTransactions,
//   updateTransactionStatus,
//   getTransactionsByOrder,
// } from "../../api/transactions";

// const TX_STATUSES = ["pending", "success", "failed"];
// const TX_TYPES = ["authorisation", "capture", "refund", "void"];

// export default function TransactionsPage() {
//   const [rows, setRows] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [createOpen, setCreateOpen] = useState(false);
//   const [statusRow, setStatusRow] = useState(null);
//   const [form, setForm] = useState({
//     order_id: "",
//     payment_method: "card",
//     transaction_type: "authorization",
//     amount: "",
//     currency_code: "IND",
//     gateway_reference_id: "",
//     status: "pending",
//   });
//   const [statusForm, setStatusForm] = useState({
//     status: "",
//     gateway_reference_id: "",
//     error_message: "",
//   });

//   const loadOrders = async () => {
//     const res = await getAllOrders({ limit: 100 });
//     setOrders(
//       (res.data || []).map((o) => ({
//         id: o.id,
//         name: `Order #${o.id} — $${o.total_amount}`,
//       })),
//     );
//   };

//   const load = useCallback(async () => {
//     const res = await getAllOrders({ page, limit: 10 });
//     const orderList = res.data || [];
//     setRows(orderList);
//     setTotalPages(res.pagination?.totalPages || 1);
//   }, [page]);

//   useEffect(() => {
//     load();
//     loadOrders();
//   }, [load]);

//   return (
//     <div>
//       <PageHeader
//         title="Transactions"
//         description="Create transactions and update payment status by order"
//         actionLabel="Create Transaction"
//         onAction={() => setCreateOpen(true)}
//       />

//       <p className="text-sm text-slate-500 mb-4">
//         Select an order below to view or manage its transactions via the order
//         ID.
//       </p>

//       <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white mb-6">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-slate-50 border-b">
//             <tr>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
//                 Order
//               </th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
//                 Customer
//               </th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
//                 Total
//               </th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
//                 Payment
//               </th>
//               <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500 text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {rows.map((row) => (
//               <tr key={row.id} className="hover:bg-indigo-50/20">
//                 <td className="px-4 py-3 font-medium">#{row.id}</td>
//                 <td className="px-4 py-3">{row.customer_name || "—"}</td>
//                 <td className="px-4 py-3">${row.total_amount}</td>
//                 <td className="px-4 py-3">
//                   <StatusBadge status={row.payment_status} />
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <button
//                     type="button"
//                     onClick={async () => {
//                       const res = await getTransactionsByOrder(row.id);
//                       const txs = res.data || [];
//                       if (!txs.length) {
//                         alert("No transactions for this order yet.");
//                         return;
//                       }
//                       setStatusRow(txs[0]);
//                       setStatusForm({
//                         status: txs[0].status,
//                         gateway_reference_id: txs[0].gateway_reference_id || "",
//                         error_message: txs[0].error_message || "",
//                       });
//                     }}
//                     className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium hover:border-indigo-200 hover:text-indigo-600"
//                   >
//                     <Edit3 size={14} /> Update TX
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <Pagination
//           page={page}
//           totalPages={totalPages}
//           onPageChange={setPage}
//         />
//       </div>

//       <Modal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         title="Create Transaction"
//         wide
//       >
//         <form
//           className="p-6 grid grid-cols-2 gap-4"
//           onSubmit={async (e) => {
//             e.preventDefault();
//             await createTransaction({
//               ...form,
//               order_id: Number(form.order_id),
//               amount: Number(form.amount),
//             });
//             setCreateOpen(false);
//             load();
//           }}
//         >
//           <div className="col-span-2">
//             <FormSelect
//               label="Order"
//               required
//               value={form.order_id}
//               onChange={(v) => setForm({ ...form, order_id: v })}
//               options={orders}
//             />
//           </div>
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-500">
//               Payment Method
//             </label>
//             <select
//               value={form.payment_method}
//               onChange={(e) =>
//                 setForm({ ...form, payment_method: e.target.value })
//               }
//               className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm"
//             >
//               {["card", "upi", "bank_transfer", "cash"].map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-500">
//               Type
//             </label>
//             <select
//               value={form.transaction_type}
//               onChange={(e) =>
//                 setForm({ ...form, transaction_type: e.target.value })
//               }
//               className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm"
//             >
//               {TX_TYPES.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-500">
//               Amount *
//             </label>
//             <input
//               type="number"
//               required
//               step="0.01"
//               value={form.amount}
//               onChange={(e) => setForm({ ...form, amount: e.target.value })}
//               className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-semibold uppercase text-slate-500">
//               Gateway Ref
//             </label>
//             <input
//               value={form.gateway_reference_id}
//               onChange={(e) =>
//                 setForm({ ...form, gateway_reference_id: e.target.value })
//               }
//               className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm"
//             />
//           </div>
//           <button
//             type="submit"
//             className="col-span-2 inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
//           >
//             <Save size={16} /> Create
//           </button>
//         </form>
//       </Modal>

//       <Modal
//         open={!!statusRow}
//         onClose={() => setStatusRow(null)}
//         title={`Update Transaction #${statusRow?.id}`}
//       >
//         <form
//           className="p-6 space-y-4"
//           onSubmit={async (e) => {
//             e.preventDefault();
//             await updateTransactionStatus(statusRow.id, statusForm);
//             setStatusRow(null);
//             load();
//           }}
//         >
//           <select
//             required
//             value={statusForm.status}
//             onChange={(e) =>
//               setStatusForm({ ...statusForm, status: e.target.value })
//             }
//             className="w-full px-3 py-2.5 rounded-xl border text-sm"
//           >
//             {TX_STATUSES.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//           <input
//             placeholder="Gateway reference"
//             value={statusForm.gateway_reference_id}
//             onChange={(e) =>
//               setStatusForm({
//                 ...statusForm,
//                 gateway_reference_id: e.target.value,
//               })
//             }
//             className="w-full px-3 py-2.5 rounded-xl border text-sm"
//           />
//           <textarea
//             placeholder="Error message"
//             rows={2}
//             value={statusForm.error_message}
//             onChange={(e) =>
//               setStatusForm({ ...statusForm, error_message: e.target.value })
//             }
//             className="w-full px-3 py-2.5 rounded-xl border text-sm"
//           />
//           <button
//             type="submit"
//             className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
//           >
//             Save
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// }

import CrudPage from "../../components/shared/CrudPage";
import {
  getTransactions,
  createTransaction,
  updateTransactionStatus,
} from "../../api/transactions";
import { getAllOrders } from "../../api/orders";
import { useState, useEffect } from "react";
import StatusBadge from "../../components/shared/StatusBadge";

const defaultForm = {
  order_id: "",
  payment_method: "card",
  transaction_type: "authorization",
  amount: "",
  currency_code: "IND",
  gateway_reference_id: "",
  status: "pending",
  error_message: "",
};


function TransactionFilter({filterState, setFilterState}){
      const [searchInput, setSearchInput] = useState(
          filterState.search || "",
        );

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
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        );
}
export default function TransactionsPage() {
  const [orderOptions, setOrderOptions] = useState([]);

  // Load orders for the select dropdown
  useEffect(() => {
    getAllOrders({ limit: 1000 })
      .then((res) => {
        const orders = (res.data || []).map((o) => ({
          id: o.id,
          name: `${o.id} — Rs-${o.total_amount}`,
        }));
        setOrderOptions(orders);
      })
      .catch(console.error);
  }, []);

  return (
    <CrudPage
      title="Transactions"
      description="Manage all payment transactions"
      idKey="id"
      defaultForm={defaultForm}
      fileFields={[]}
      fetchList={(page, filters) =>
        getTransactions({
          page,
          limit: 10,
          order_id: filters.order_id || undefined,
          status: filters.status || undefined,
          search: filters.search || "",
        })
      }
      // createItem={createTransaction}
      updateItem={updateTransactionStatus}
      columns={[
        { key: "no", label: "Serial" },
        {
          key: "customer_name",
          label: "Customer Name",
          render: (row) => `${row.customer_name}`,
        },
        {
          key: "amount",
          label: "Amount",
          render: (row) => `$${row.amount}`,
        },
        { key: "payment_method", label: "Method" },
        { key: "transaction_type", label: "Type" },
        {
          key: "status",
          label: "Status",
          render: (row) => <StatusBadge status={row.status} />,
        },
        {
          key: "created_at",
          label: "Created",
          render: (row) => new Date(row.created_at).toLocaleDateString(),
        },
      ]}
      formFields={[
        // {
        //   name: "order_id",
        //   label: "Order",
        //   type: "select",
        //   required: true,
        //   options: orderOptions,
        //   optionValue: "id",
        //   optionLabel: "name",
          
        // },
        {
          name: "payment_method",
          label: "Payment Method",
          type: "select",
          options: [
            { id: "card", name: "Card" },
            { id: "upi", name: "UPI" },
            { id: "bank_transfer", name: "Bank Transfer" },
            { id: "cash", name: "Cash" },
            { id: "razorpay", name: "Razorpay" },
          ],
          optionValue: "id",
          optionLabel: "name",
        },
        {
          name: "transaction_type",
          label: "Type",
          type: "select",
          options: [
            { id: "authorization", name: "Authorization" },
            { id: "capture", name: "Capture" },
            { id: "refund", name: "Refund" },
            { id: "payment", name: "Payment" },
            { id: "void", name: "Void" },
          ],
          optionValue: "id",
          optionLabel: "name",
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          required: true,
          step: "0.01",
        },
        { name: "currency_code", label: "Currency", placeholder: "IND" },
        { name: "gateway_reference_id", label: "Gateway Reference" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { id: "pending", name: "Pending" },
            { id: "success", name: "Success" },
            { id: "failed", name: "Failed" },
          ],
          optionValue: "id",
          optionLabel: "name",
        },
        {
          name: "error_message",
          label: "Error Message",
          type: "textarea",
          colSpan: 2,
        },
      ]}
      FilterComponent={TransactionFilter}

      
      canCreate={true}
      canEdit={true}
      canDelete={true}
      createLabel="Create Transaction"
      modalWide={true}
      emptyMessage="No transactions found."
    />
  );
}
