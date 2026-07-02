import React, { useState } from "react";
import api from "../config/axios";

const openRazorpay = async (data) => {
  console.log(data);

  const options = {
    key: data.key, 

    amount: data.amount,
    currency: data.currency,
    order_id: data.razorpayOrderId,

    name: "My Ecom",
    description: "Order Payment",

    handler: async function (response) {
      console.log(response);
      const verify = await api.post("/orders/verify-payment", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (verify.data.success) {
        alert("Payment Successful");
      } else {
        alert("Payment Failed");
      }
    },

    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  await rzp.open();
};
export default function Checkout() {
  // Form state
  const [formData, setFormData] = useState({
    shipping_address_id: 5,
    billing_address_id: 5,
    customer_notes: "Leave at back door",
    shipping_cost: 50.0,
    tax_amount: 100.0,
    currency_code: "IND",
    coupon_code: "", // optional
    payment_method: "card",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Remove coupon_code if empty (optional)
    const payload = { ...formData };
    if (!payload.coupon_code) delete payload.coupon_code;

    try {
      const { data } = await api.post("/orders/create", payload);
      setMessage({ type: "success", text: "Order created successfully!" });
      console.log("Response:", data.data);
      // Optionally reset form or redirect

      openRazorpay(data.data);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        {/* Shipping Address ID */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="shipping_address_id">Shipping Address ID:</label>
          <input
            type="number"
            id="shipping_address_id"
            name="shipping_address_id"
            value={formData.shipping_address_id}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Billing Address ID */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="billing_address_id">Billing Address ID:</label>
          <input
            type="number"
            id="billing_address_id"
            name="billing_address_id"
            value={formData.billing_address_id}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Customer Notes */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="customer_notes">Customer Notes:</label>
          <textarea
            id="customer_notes"
            name="customer_notes"
            value={formData.customer_notes}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Shipping Cost */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="shipping_cost">Shipping Cost:</label>
          <input
            type="number"
            step="0.01"
            id="shipping_cost"
            name="shipping_cost"
            value={formData.shipping_cost}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Tax Amount */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="tax_amount">Tax Amount:</label>
          <input
            type="number"
            step="0.01"
            id="tax_amount"
            name="tax_amount"
            value={formData.tax_amount}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Currency Code */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="currency_code">Currency Code:</label>
          <input
            type="text"
            id="currency_code"
            name="currency_code"
            value={formData.currency_code}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Coupon Code (optional) */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="coupon_code">Coupon Code (optional):</label>
          <input
            type="text"
            id="coupon_code"
            name="coupon_code"
            value={formData.coupon_code}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="payment_method">Payment Method:</label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          >
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Submitting..." : "Place Order"}
        </button>
      </form>

      {/* Status Messages */}
      {message.text && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "4px",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
            border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
