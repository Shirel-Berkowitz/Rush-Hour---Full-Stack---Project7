import { Outlet, Link } from "react-router-dom";
import React from "react";
import "../App.css";

const Admin = () => {
  var user = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="users-container">
      <h1 className="user-name">welcome admin {user.name}</h1>
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
      <Link to="/Register"><button
          className="logout-button">
          Adding a new user
        </button>
        </Link>
      <nav className="user-navigation">
        <ul>
          {/* <li>{<Link to={`/Admin/${user.id}/Cameras`}>Cameras</Link>}</li> */}
          <li>{<Link to={`/Admin/${user.id}/Info`}>Info</Link>}</li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Admin;