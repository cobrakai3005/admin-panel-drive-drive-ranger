import { useState } from "react";
import CrudPage from "../../components/shared/CrudPage";
import Modal from "../../components/shared/Modal";
import {
  deleteReview,
  getAllReviews,
  moderateReview,
  deleteReviewImages,
  toggleIsFrontReview,
} from "../../api/reviews";
import StatusBadge from "../../components/shared/StatusBadge";
import Select from "react-select";
const REVIEW_STATUSES = ["pending", "approved", "rejected"];

export default function ReviewsPage() {
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const statusOptions = REVIEW_STATUSES.map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  const handleDeleteImage = async (images) => {
    try {
      await deleteReviewImages(modal.id, [images]);

      setModal((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.public_id !== images),
      }));

      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <CrudPage
        key={refreshKey}
        title="Reviews"
        description="Moderate customer product reviews"
        idKey="id"
        canCreate={false}
        canDelete={true}
        deleteItem={deleteReview}
        fetchList={(page) => getAllReviews({ page, limit: 10 })}
        // onEditRow={(row) => {
        //   setStatus(row.status);
        //   setModal(row);
        // }}
        columns={[
          { key: "no", label: "Serial" },
          { key: "full_name", label: "Customer Name" },
          { key: "product_name", label: "Product" },
          { key: "rating", label: "Rating" },
          { key: "review", label: "Review" },

          // { key: "status", label: "Status" },

          {
            key: "is_front",
            label: "Featured",
            render: (review) => (
              <input
                type="checkbox"
                checked={Boolean(review.is_front)}
                onChange={async () => {
                  await toggleIsFrontReview(review.id);
                  setRefreshKey((k) => k + 1);
                }}
              />
            ),
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
                  await moderateReview(review.id, {
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
            key: "is_verified_purchase",
            label: "Verified Purchase",
            render: (review) => {
              return (
                <div>
                  {review.is_verified_purchase === 1 ? (
                    <StatusBadge status={"Verified"} />
                  ) : (
                    <StatusBadge status={"Not Verified"} />
                  )}
                </div>
              );
            },
          },

          {
            key: "actions",
            label: "View",
            render: (review) => (
              <button
                onClick={() => setModal(review)}
                className="text-indigo-600 hover:underline"
              >
                View
              </button>
            ),
          },
        ]}
        formFields={[]}
      />

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={`Review by ${modal?.full_name}`}
      >
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium">Product</h3>
            <p>{modal?.product_name}</p>
          </div>

          <div>
            <h3 className="font-medium">Rating</h3>
            <p>{modal?.rating}/5 ⭐</p>
          </div>

          <div>
            <h3 className="font-medium">Review</h3>
            <p className="bg-slate-50 rounded-lg p-3">{modal?.review}</p>
          </div>

          {modal?.images?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Images</h3>

              <div className="grid grid-cols-3 gap-3">
                {modal.images.map((img) => (
                  <div key={img.public_id} className="relative">
                    <img
                      src={img.url}
                      className="w-full h-28 object-cover rounded-lg border"
                    />

                    {/* Delete button if needed */}
                    <button
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2"
                      onClick={() => handleDeleteImage(img.public_id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status select */}

          <Select
            options={statusOptions}
            value={statusOptions.find((o) => o.value === modal?.status)}
            onChange={(selected) =>
              setModal({
                ...modal,
                status: selected.value,
              })
            }
          />

          {/* Featured toggle */}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(modal?.is_front)}
              onChange={async () => {
                await toggleIsFrontReview(modal.id);

                setModal({
                  ...modal,
                  is_front: !modal.is_front,
                });

                setRefreshKey((k) => k + 1);
              }}
            />
            Featured on Front
          </label>

          <button
            className="w-full bg-indigo-600 text-white rounded-lg py-2"
            onClick={async () => {
              await moderateReview(modal.id, {
                status: modal.status,
              });

              setRefreshKey((k) => k + 1);
              setModal(null);
            }}
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </>
  );
}
