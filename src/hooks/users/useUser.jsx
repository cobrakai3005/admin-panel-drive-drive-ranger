import { useState } from "react";
import { getUsersApi, deactivateUserApi } from "../../api/users/index";

export default function useAuth() {
  // Loading states
  const [getUsersLoading, setGetUsersLoading] = useState(false);
  const [deactivateUserLoading, setDeactivateUserLoading] = useState(false);

  // Error states
  const [getUsersError, setGetUsersError] = useState(null);
  const [deactivateUserError, setDeactivateUserError] = useState(null);

  // Get users function
  const getUsers = async () => {
    setGetUsersLoading(true);
    setGetUsersError(null);
    try {
      const response = await getUsersApi();
      return response.data;
    } catch (error) {
      setGetUsersError(error);
      throw error;
    } finally {
      setGetUsersLoading(false);
    }
  };

  // Deactivate user function
  const deactivateUser = async (userId) => {
    setDeactivateUserLoading(true);
    setDeactivateUserError(null);
    try {
      const response = await deactivateUserApi(userId);
      return response;
    } catch (error) {
      setDeactivateUserError(error);
      throw error;
    } finally {
      setDeactivateUserLoading(false);
    }
  };

  return {
    // Functions
    getUsers,
    deactivateUser,

    // Loading states
    getUsersLoading,
    deactivateUserLoading,

    // Error states
    getUsersError,
    deactivateUserError,

    // Reset error functions
    resetGetUsersError: () => setGetUsersError(null),
    resetDeactivateUserError: () => setDeactivateUserError(null),
  };
}
