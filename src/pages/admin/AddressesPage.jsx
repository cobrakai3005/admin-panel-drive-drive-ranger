import CrudPage from "../../components/shared/CrudPage";
import { getUsersApi } from "../../api/users";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../api/addresses";
import { useCallback, useEffect, useState } from "react";

const defaultForm = {
  user_id: "",
  address_type: "shipping",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

const fetchUserOptions = async () => {
  const res = await getAddresses();
  const users = res.data?.data || res.data || [];
  return users.map((u) => ({
    id: u.id || u.user_id,
    name: `${u.full_name} (${u.email})`,
  }));
};

export default function AddressesPage() {
  const fetchList = useCallback(async (page, filters) => {
    const res = await getAddresses({
      page,
      limit: 10,
      status: filters.status || "active",
      search: filters.search || "", // 👈 pass search term
    });

    return res;
  }, []);
  return (
    <CrudPage
      title="User Addresses"
      description="Manage customer shipping and billing addresses"
      idKey="id"
      modalWide
      defaultForm={defaultForm}
      fetchList={fetchList}
      filters={(filterState, setFilterState) => {
        const [searchInput, setSearchInput] = useState(
          filterState.search || "",
        );

        useEffect(() => {
          const timer = setTimeout(() => {
            setFilterState({ ...filterState, search: searchInput });
          }, 400); // 400ms debounce

          return () => clearTimeout(timer);
        }, [searchInput]);

        return (
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
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
      }}
      createItem={createAddress}
      updateItem={updateAddress}
      deleteItem={deleteAddress}
      columns={[
        { key: "no", label: "Serial" },
        // { key: "user_id", label: "User" },
        { key: "full_name", label: "Name" },
        { key: "city", label: "City" },
        { key: "city", label: "Full Address", 

          render: (address)=>{
            return <>
            <div>
              <p>{address.line1}, {address.line2} , {address.state} {address.postal_code}</p>
            </div>
            </>
          }
         },
        { key: "address_type", label: "Type" },
        { key: "postal_code", label: "PIN" },
      ]}
      formFields={[
        {
          name: "user_id",
          label: "User",
          type: "select",
          required: true,
          loadOptions: fetchUserOptions,
          colSpan: 2,
        },
        {
          name: "address_type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { id: "shipping", name: "Shipping" },
            { id: "billing", name: "Billing" },
            { id: "returns", name: "Returns" },
          ],
          optionValue: "id",
        },
        { name: "full_name", label: "Full Name", required: true },
        { name: "phone", label: "Phone", required: true },
        { name: "line1", label: "Address Line 1", required: true, colSpan: 2 },
        { name: "line2", label: "Address Line 2", colSpan: 2 },
        { name: "landmark", label: "Landmark" },
        { name: "city", label: "City", required: true },
        { name: "state", label: "State", required: true },
        { name: "postal_code", label: "Postal Code", required: true },
        { name: "country", label: "Country" },
        {
          name: "is_default",
          label: "Set as default",
          type: "checkbox",
          colSpan: 2,
        },
      ]}
      preparePayload={(form) => ({
        ...form,
        user_id: Number(form.user_id),
      })}
    />
  );
}
