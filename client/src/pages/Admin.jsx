import { Outlet, Link } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const Admin = () => {
  var user = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="users-container">
      <header>
        <nav className="top-navbar">
          <ul className="nav__links">
            <li>
              <h2 className="logo">Rush hour</h2>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/Register`}>Add user</Link>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/UserList`}>Users</Link>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/camerasList`}>Cameras</Link>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/CamerasAccess`}>
                Cameras permissions
              </Link>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/UserAccess`}>Users permissions</Link>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/UnusualEvents`}>Unusual Events</Link>
            </li>
            <li>
              <Link to={`/Admin/${user.id}/CamerasAdmin`}>My Cameras</Link>
            </li>
            {/* Uncomment the following lines when needed */}
            {/* <li>
            <Link to={`/Admin/${user.id}/VideoAnalysis`}>Video analysis</Link>
          </li> */}
            <li>
              <Link to={`/Admin/${user.id}/Info`}>Info</Link>
            </li>
            <li>
              <Link
                to="/Login"
                // style={{
                //   position: "absolute",
                //   top: 0,
                //   right: 0,
                //   margin: "10px",
                // }}
              >
                <button
                  className="logout-button"
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <h1 className="user-name">welcome admin {user.name}</h1>

      {/* <Link to={`/Admin/${user.id}/Register`}>
        <button>Add new user</button>
      </Link>
      <Link to={`/Admin/${user.id}/UserList`}>
        <button>Users List</button>
      </Link>
      <Link to={`/Admin/${user.id}/camerasList`}>
        <button>Cameras List</button>
      </Link>
      <Link to={`/Admin/${user.id}/CamerasAccess`}>
        <button>Camera access permissions</button>
      </Link>
      <Link to={`/Admin/${user.id}/UserAccess`}>
        <button>User access permissions</button>
      </Link>
      <Link to={`/Admin/${user.id}/UnusualEvents`}>
        <button>Unusual Events</button>
      </Link> */}

      <nav className="user-navigation">
        <ul>
          <li>
            {<Link to={`/Admin/${user.id}/CamerasAdmin`}> My Cameras</Link>}
          </li>
          <li>
            {/* {<Link to={`/Admin/${user.id}/VideoAnalysis`}>Video analysis</Link>} */}
          </li>
          <li>{<Link to={`/Admin/${user.id}/Info`}>Info</Link>}</li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Admin;
