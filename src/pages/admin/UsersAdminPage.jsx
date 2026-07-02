import CrudPage from "../../components/shared/CrudPage";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  deactivateUserApi,
} from "../../api/users";
import { useState, useEffect } from "react";
import StatusBadge from "../../components/shared/StatusBadge";
import Modal from "../../components/shared/Modal";
import { getAddresses } from "../../api/addresses";

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  role: "Customer",
  profile_image: null,
};
function UsersFilters({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterState({ ...filterState, search: searchInput });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Search by name, email, phone..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
      <select
        value={filterState.role || ""}
        onChange={(e) =>
          setFilterState({ ...filterState, role: e.target.value })
        }
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
      >
        <option value="">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="Staff">Staff</option>
        <option value="Customer">Customer</option>
      </select>
      <select
        value={filterState.status || "active"}
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
export default function UsersPage() {
  const [detailModal, setDetailModal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async (user) => {
    try {
      setLoadingDetails(true);

      const res = await getAddresses({
        user_id: user.id,
      });
      const addresses = res.data || res;
      console.log(addresses);

      setDetailModal({
        ...user,
        shippingAddress: addresses.filter((a) => a.address_type === "shipping"),
        billingAddress: addresses.filter((a) => a.address_type === "billing"),
      });
    } catch (err) {
      console.error(err);

      setDetailModal({
        ...user,
        addresses: [],
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <>
      <CrudPage
        title="Users"
        description="Manage system users (Admin, Staff, Customer)"
        idKey="id"
        fileFields={["profile_image"]}
        defaultForm={defaultForm}
     
        FilterComponent={UsersFilters}
        fetchList={(page, filters) =>
          getUsersApi({
            page,
            limit: 10,
            search: filters.search || "",
            role: filters.role || undefined,
            status: filters.status || "active", // send "active" or "inactive"
          })
        }
        createItem={createUserApi}
        updateItem={updateUserApi}
        deleteItem={deleteUserApi}
        toggleStatus={deactivateUserApi}
        preparePayload={(form, editingRow) => {
          // Password: required on create, optional on update
          if (!editingRow && !form.password) {
            throw new Error("Password is required for new users");
          }
          if (editingRow && !form.password) {
            delete form.password;
          }
          // Profile image: omit if no new file
          if (form.profile_image === null || form.profile_image === undefined) {
            delete form.profile_image;
          }
          return form;
        }}
        columns={[
          { key: "no", label: "Serial" },
          {
            key: "full_name",
            label: "Name",
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.profile_image && (
                  <img
                    src={row.profile_image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover bg-slate-100"
                  />
                )}
                <span className="font-medium">{row.full_name}</span>
              </div>
            ),
          },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          {
            key: "role",
            label: "Role",
            render: (row) => (
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  row.role === "Admin"
                    ? "bg-purple-100 text-purple-700"
                    : row.role === "Staff"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {row.role}
              </span>
            ),
          },

          {
            key: "status",
            label: "Status",
            render: (row) => (
              <StatusBadge status={row.is_delete ? "inactive" : "active"} />
            ),
          },

          {
            key: "actions",
            label: "Actions",
            render: (r) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(r);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View Details
              </button>
            ),
          },
        ]}
        formFields={[
          { name: "full_name", label: "Full Name", required: true, colSpan: 2 },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", required: true },
          // {
          //   name: "password",
          //   label: "Password",
          //   type: "password",
          //   required: false,
          //   helperText:
          //     "Required for new users; leave blank to keep unchanged on edit",
          // },
          {
            name: "role",
            label: "Role",
            type: "select",
            required: true,
            options: [
              { id: "Admin", name: "Admin" },
              { id: "Staff", name: "Staff" },
              { id: "Customer", name: "Customer" },
            ],
            optionValue: "id",
            optionLabel: "name",
          },
          {
            name: "profile_image",
            label: "Profile Image",
            type: "file",
            accept: "image/*",
          },
        ]}
        canCreate={true}
        canEdit={true}
        canDelete={true}
        createLabel="Add User"
        modalWide={true}
        emptyMessage="No users found."
      />

      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title={`User  Details`}
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
                  <span className="font-medium">{detailModal.full_name}</span>
                </div>

                <div>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-medium">{detailModal.email}</span>
                </div>

                <div>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="font-medium">{detailModal.phone}</span>
                </div>

                <div>
                  <span className="text-gray-500">Role:</span>{" "}
                  <span className="font-medium">{detailModal.role}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Shipping Addresses
              </h4>

              {detailModal.shippingAddress?.length ? (
                <div className="space-y-4">
                  {detailModal.shippingAddress.map((address) => (
                    <div
                      key={address.id}
                      className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium">{address.full_name}</p>
                      <p className="text-gray-600">{address.phone}</p>
                      <p className="text-gray-600">{address.line1}</p>

                      {address.line2 && (
                        <p className="text-gray-600">{address.line2}</p>
                      )}

                      {address.landmark && (
                        <p className="text-gray-600">
                          Landmark: {address.landmark}
                        </p>
                      )}

                      <p className="text-gray-600">
                        {address.city}, {address.state} {address.postal_code}
                      </p>

                      <p className="text-gray-600">{address.country}</p>

                      {address.is_default && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No shipping addresses found.
                </p>
              )}
            </div>
            {/* Billing Address */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Billing Addresses
              </h4>

              {detailModal.billingAddress?.length ? (
                <div className="space-y-4">
                  {detailModal.billingAddress.map((address) => (
                    <div
                      key={address.id}
                      className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium">{address.full_name}</p>
                      <p className="text-gray-600">{address.phone}</p>
                      <p className="text-gray-600">{address.line1}</p>

                      {address.line2 && (
                        <p className="text-gray-600">{address.line2}</p>
                      )}

                      {address.landmark && (
                        <p className="text-gray-600">
                          Landmark: {address.landmark}
                        </p>
                      )}

                      <p className="text-gray-600">
                        {address.city}, {address.state} {address.postal_code}
                      </p>

                      <p className="text-gray-600">{address.country}</p>

                      {address.is_default && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No billing addresses found.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
