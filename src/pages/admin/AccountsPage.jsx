import React, { useState, useEffect, useRef } from "react";
import {
  getProfile,
  updateProfileApi,
  changePasswordApi,
} from "../../api/users";
import { toast } from "sonner";
import Modal from "../../components/shared/Modal";

export default function AccountsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    email: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Change Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.success) {
        setUser(response.data);
        setEditForm({
          full_name: response.data.full_name || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
        });
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching your profile.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Profile handlers (unchanged)
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(false);
    if (!editForm.full_name.trim()) {
      setEditError("Full name is required.");
      return;
    }
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", editForm.full_name.trim());
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }
      const response = await updateProfileApi(formData);
      if (response.success) {
        setEditSuccess(true);
        setUser((prev) => ({
          ...prev,
          full_name: editForm.full_name.trim(),
          profile_image: response.data?.profile_image || prev.profile_image,
        }));
        setTimeout(() => {
          setIsEditing(false);
          setEditSuccess(false);
          setProfileImageFile(null);
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, 1500);
        toast.success(response.message);
      } else {
        setEditError(response.message || "Update failed.");
        toast.error(response.message);
      }
    } catch (err) {
      setEditError(err.message || "An error occurred while updating profile.");
    } finally {
      setEditLoading(false);
    }
  };

  // Change Password handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await changePasswordApi(passwordForm);
      if (response.success) {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordSuccess(false);
        }, 1500);
        toast.success(response.message);
      } else {
        setPasswordError(response.message || "Failed to change password.");
        toast.error(response.message);
      }
    } catch (err) {
      setPasswordError(err.message || "An error occurred.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-600">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">No profile data found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Account</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Image / Avatar */}
        <div className="flex-shrink-0">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.full_name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200">
              {getInitials(user.full_name)}
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.full_name}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              Role:{" "}
              <span className="font-black text-green-500">{user.role}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <p className="text-gray-800">{user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Member since
              </label>
              <p className="text-gray-800">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Last updated
              </label>
              <p className="text-gray-800">
                {new Date(user.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (unchanged, but now phone/email are read-only) */}
      {isEditing && (
        <Modal
          title={"Edit Profile"}
          onClose={() => {
            setIsEditing(false);
            setEditError(null);
            setEditSuccess(false);
            setProfileImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          open={isEditing}
        >
          <form onSubmit={handleEditSubmit} className=" p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>

            {editError && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {editError}
              </div>
            )}
            {editSuccess && (
              <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                Profile updated successfully!
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {editLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <Modal
          open={isChangingPassword}
          title={"Change Password"}
          onClose={() => {
            setIsChangingPassword(false);
            setPasswordError(null);
            setPasswordSuccess(false);
            setPasswordForm({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }}
        >
          <form onSubmit={handlePasswordSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength="6"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {passwordError && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                Password changed successfully!
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordError(null);
                  setPasswordSuccess(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {passwordLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
