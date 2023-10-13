import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import "../App.css";

const UserList = () => {
  var user1 = JSON.parse(localStorage.getItem("currentUser"));

  const [users, setUsers] = useState([]);
  const [updatedUser, setUpdatedUser] = useState({
    ID: null, 
    name: "",
    username: "",
    userRank: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`http://localhost:3000/userAPI/api/users`);
        const data = await response.json();
        setUsers(data[0]);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    }
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/userAPI/api/users/${id}`, {
        method: "DELETE",
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.ID !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateUser = (user) => {
    setUpdatedUser({
      ID: user.ID,
      name: user.name,
      username: user.username,
      userRank: user.userRank,
    });
    setIsUpdating(true);
  };

  const handleUpdateUserSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/userAPI/api/users/${updatedUser.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      const updatedData = await response.json();
      console.log("User updated:", updatedData);

      // עדכון המשתמשים לאחר העדכון
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.ID === updatedUser.ID ? updatedUser : user
        )
      );

      setIsUpdating(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="users-container">
      
      <Link to="/Login">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("currentUser");
          }}
        >
          Logout
        </button>
      </Link>
      <Link to="/Admin">
        <button className="logout-button">Back</button>
      </Link>
      <div>
        <h1>Users List</h1>
        <ul>
          {users.map((user) => (
            <li key={user.ID}>
              name: {user.name} username: {user.username} rank: {user.userRank}
              <button onClick={() => handleDeleteUser(user.ID)}>Delete User</button>
              <button onClick={() => handleUpdateUser(user)}>Update User</button>
            </li>
          ))}
        </ul>
      </div>

      {isUpdating ? (
        <div>
          <h2>Update User</h2>
          <input
            type="text"
            placeholder="Name"
            value={updatedUser.name}
            onChange={(e) =>
              setUpdatedUser({ ...updatedUser, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Username"
            value={updatedUser.username}
            onChange={(e) =>
              setUpdatedUser({ ...updatedUser, username: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Rank"
            value={updatedUser.userRank}
            onChange={(e) =>
              setUpdatedUser({ ...updatedUser, userRank: e.target.value })
            }
          />
          <button onClick={handleUpdateUserSubmit}>Update</button>
        </div>
      ) : null}
    </div>
  );
};

export default UserList;



