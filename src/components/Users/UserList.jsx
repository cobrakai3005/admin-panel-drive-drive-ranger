import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/users/useUser";

function UsersList() {
  const {
    getUsers,
    getUsersLoading,
    getUsersError,
    deactivateUser,
    deactivateUserLoading,
    resetGetUsersError,
  } = useAuth();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    resetGetUsersError();
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        await deactivateUser(userId);
        // Refresh user list after deactivation
        fetchUsers();
      } catch (error) {
        console.error("Failed to deactivate user:", error);
      }
    }
  };

  if (getUsersLoading) return <p>Loading users...</p>;
  if (getUsersError) return <p>Error: {getUsersError.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users List</h2>
      
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tableCellStyle}>{user.id}</td>
                <td style={tableCellStyle}>{user.full_name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleDeactivate(user.id)}
                    disabled={deactivateUserLoading}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: deactivateUserLoading ? "#ccc" : "#ff4d4d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: deactivateUserLoading ? "not-allowed" : "pointer"
                    }}
                  >
                    {deactivateUserLoading ? "Deactivating..." : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Basic inline styles
const tableHeaderStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
};

const tableCellStyle = {
  padding: "12px",
};

export default UsersList;