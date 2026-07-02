import { useState } from "react";
import CrudPage from "../../components/shared/CrudPage";
import Modal from "../../components/shared/Modal";
import StatusBadge from "../../components/shared/StatusBadge";
import Select from 'react-select';
import {
  deleteWebsiteReview,
  getALlWebsiteReviews,
  moderateWebsiteReview,
} from "../../api/reviews/index";
import { confirmUpdate } from "../../components/shared/Confirm";

const REVIEW_STATUSES = ["pending", "approved", "rejected"];

export default function WebsiteReviewsPage() {
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const statusOptions = REVIEW_STATUSES.map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));
  return (
    <>
      <CrudPage
        key={refreshKey}
        title="Website Reviews"
        description="Moderate customer website reviews"
        idKey="id"
        canCreate={false}
        canDelete={true}
        deleteItem={deleteWebsiteReview}
        fetchList={(page) =>
          getALlWebsiteReviews({
            page,
            limit: 10,
          })
        }
        // onEditRow={(row) => {
        //   setStatus(row.status);
        //   setModal(row);
        // }}
        columns={[
          {
            key: "no",
            label: "Serial",
          },
          {
            key: "full_name",
            label: "Customer Name",
          },
          {
            key: "review",
            label: "Customer Review",
          },
          {
            key: "rating",
            label: "Rating",
            render: (row) => (
              <span className="font-medium">{row.rating} ⭐</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "status",
            label: "Status Change",
            render: (review) => (
              <Select
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === review.status)}
                onChange={async (selected) => {
                  console.log("Review:", review.id);
                  console.log("New Status:", selected.value);
                  await await moderateWebsiteReview(review.id, {
                    status: selected.value,
                  });
                  setRefreshKey((prev) => prev + 1);
                  // Call your API here
                  // updateReviewStatus(review.id, selected.value);
                }}
                isSearchable={false}
                placeholder="Select status"
                styles={{
                  container: (base) => ({
                    ...base,
                    minWidth: 160,
                  }),
                }}
              />
            ),
          },
          {
            key: "created_at",
            label: "Submitted On",
            render: (row) => new Date(row.created_at).toLocaleDateString(),
          },
        ]}
        formFields={[]}
      />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={`Website Review by Mr./Mrs. ${modal?.full_name}`}
      >
        <form
          className="p-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await confirmUpdate({
              title: "Update Review",
              content: "This action cannot be undone.",
              okText: "Update",
              okType: "danger",
            });
            if (!ok) return;
            await moderateWebsiteReview(modal.id, {
              status,
            });

            setModal(null);
            setRefreshKey((k) => k + 1);
          }}
        >
          <div className="space-y-2">
            <div>
              <label className="text-sm font-semibold">Rating</label>
              <p className="text-lg">{modal?.rating} ⭐</p>
            </div>

            <div>
              <label className="text-sm font-semibold">Review</label>
              <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                {modal?.review || "No review provided."}
              </p>
            </div>
          </div>

          <select
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          >
            {REVIEW_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </>
  );
}
