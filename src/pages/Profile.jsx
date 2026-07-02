// pages/Profile.js
import React, { useState } from "react";
import { useAuthProvider } from "../context/AuthContext";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateProfileImage, logout, loading } = useAuthProvider();
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("profile_image", imageFile);
    setUploading(true);
    try {
      await updateProfileImage(formData);
      toast.success("Profile image updated");
      setImageFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                {user?.full_name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !imageFile}
              className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-medium text-gray-700">Full Name</label>
            <p className="text-gray-900">{user?.full_name}</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Phone</label>
            <p className="text-gray-900">{user?.phone}</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Role</label>
            <p className="text-gray-900">{user?.role}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={async () => {
              await logout();
              // navigation is handled inside logout or we can do it here
            }}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}