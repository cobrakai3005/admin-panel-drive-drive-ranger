import { useState, useEffect } from "react";
import CrudPage from "../../components/shared/CrudPage";
import { getAuditLogs, getAuditLogByRecord } from "../../api/auditLogs";
import { Loader2, X } from "lucide-react";

export default function AuditLogsPage() {
  // Modal state for viewing details
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async (log) => {
    setSelectedLog(log);
    setLoadingDetails(true);
    setShowDetailModal(true);
    try {
      const res = await getAuditLogByRecord(log.table_name, log.record_id);
      setDetails(res.data);
    } catch (error) {
      console.error("Failed to load audit details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetails(null);
    setSelectedLog(null);
  };

  // Columns definition (including custom actions)
  const columns = [
    { key: "no", label: "Serial" },
    { key: "action", label: "Action" },
    { key: "table_name", label: "Table" },
    // { key: "record_id", label: "Record" },
    // { key: "user_id", label: "User" },
    {
      key: "created_at",
      label: "When",
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    },
    // Actions column with View Details button
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => handleViewDetails(row)}
          className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  // Filters render function (matches BrandsPage pattern)
  const renderFilters = ({filterState, setFilterState}) => {
    // Local state for filter inputs
    const [searchInput, setSearchInput] = useState(filterState.search || "");
    const [tableInput, setTableInput] = useState(filterState.table_name || "");
   
    const [actionInput, setActionInput] = useState(filterState.action || "");

    // Debounce search (and other fields) – update filterState after 400ms
    useEffect(() => {
      const timer = setTimeout(() => {
        setFilterState({
          ...filterState,
          search: searchInput,
          table_name: tableInput,

          action: actionInput,
        });
      }, 400);

      return () => clearTimeout(timer);
    }, [searchInput, tableInput, actionInput]);

    return (
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Table"
          value={tableInput}
          onChange={(e) => setTableInput(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      
      </div>
    );
  };
  const getChanges = (oldData = {}, newData = {}) => {
    const keys = new Set([
      ...Object.keys(oldData || {}),
      ...Object.keys(newData || {}),
    ]);

    return [...keys].map((key) => ({
      field: key,
      before: oldData?.[key],
      after: newData?.[key],
      changed:
        JSON.stringify(oldData?.[key]) !== JSON.stringify(newData?.[key]),
    }));
  };
  return (
    <>
      <CrudPage
        title="Audit Logs"
        description="System activity and change history (read-only)"
        idKey="id"
        canCreate={false}
        canEdit={false}
        canDelete={false}
        fetchList={(page, filters) =>
          getAuditLogs({
            page,
            limit: 15,
            search: filters.search || "",
            table_name: filters.table_name || ""
          })
        }
        columns={columns}
        formFields={[]}
        FilterComponent={renderFilters}
      />

      {/* Detail Modal (standalone, no Chakra) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700/20">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Audit Log Details
                </h2>

                {/* {selectedLog && (
                  <p className="text-sm text-slate-500 mt-1">
                    Log #{selectedLog.id}
                  </p>
                )} */}
              </div>

              <button
                onClick={closeDetailModal}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingDetails ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={34} className="animate-spin text-indigo-600" />
                </div>
              ) : details?.length ? (
                details.map((log) => {
                  const changes = getChanges(log.old_data, log.new_data);

                  return (
                    <div key={log.id} className="space-y-6">
                      {/* Information */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4">
                        <div>
                          <p className="text-xs text-slate-500">Action</p>
                          <p className="font-semibold capitalize">
                            {log.action}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Table</p>
                          <p className="font-semibold">{log.table_name}</p>
                        </div>

                        {/* <div>
                          <p className="text-xs text-slate-500">Record ID</p>
                          <p className="font-semibold">{log.record_id}</p>
                        </div> */}

                        <div>
                          <p className="text-xs text-slate-500">Created</p>
                          <p className="font-semibold">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Changes */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">
                          Changed Fields
                        </h3>

                        <div className="overflow-hidden rounded-xl border-b border-zinc-700/50">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="text-left p-3 w-48">Field</th>

                                <th className="text-left p-3 bg-red-50 text-red-700">
                                  Before
                                </th>

                                <th className="text-left p-3 bg-green-50 text-green-700">
                                  After
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {changes.map((item) => (
                                <tr
                                  key={item.field}
                                  className={`border-t  border-zinc-700/20 ${
                                    item.changed ? "bg-yellow-50/40" : ""
                                  }`}
                                >
                                  <td className="p-3 font-medium">
                                    {item.field}
                                  </td>

                                  <td className="p-3 align-top">
                                    <pre className="bg-red-50 rounded-lg p-2 text-xs overflow-auto max-h-44 whitespace-pre-wrap">
                                      {JSON.stringify(item.before, null, 2)}
                                    </pre>
                                  </td>

                                  <td className="p-3 align-top">
                                    <pre className="bg-green-50 rounded-lg p-2 text-xs overflow-auto max-h-44 whitespace-pre-wrap">
                                      {JSON.stringify(item.after, null, 2)}
                                    </pre>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Raw JSON */}
                      {/* <div className="grid lg:grid-cols-2 gap-5">
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">
                            Complete Before JSON
                          </h4>

                          <pre className="bg-red-50 border rounded-xl p-4 overflow-auto max-h-96 text-xs">
                            {JSON.stringify(log.old_data || {}, null, 2)}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">
                            Complete After JSON
                          </h4>

                          <pre className="bg-green-50 border rounded-xl p-4 overflow-auto max-h-96 text-xs">
                            {JSON.stringify(log.new_data || {}, null, 2)}
                          </pre>
                        </div>
                      </div> */}

                      {/* User */}
                      <div className="border rounded-xl p-4">
                        <h3 className="font-semibold mb-4">User Information</h3>

                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p>{log.user_name || "-"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p>{log.email || "-"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Phone</p>
                            <p>{log.phone || "-"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Role</p>
                            <p>{log.role || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-500">
                  No details available.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
