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

function TransactionFilter({ filterState, setFilterState }) {
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
          key: "amount (in Rupee)",
          label: "Amount",
          render: (row) => `${row.amount}`,
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
