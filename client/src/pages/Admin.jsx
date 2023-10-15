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
      
      <Link to={`/Admin/${user.id}/Register`}>

               <button>
               Adding a new user
               </button>
             </Link>
      <Link to={`/Admin/${user.id}/UserList`}>

            <button>
            Users List
            </button>
         </Link>
         <Link to={`/Admin/${user.id}/camerasList`}>

            <button>
            Cameras List
            </button>
         </Link>
         <Link to={`/Admin/${user.id}/CamerasAccess`}>

            <button>
            Camera access permissions
            </button>
         </Link>
      
      <nav className="user-navigation">
        <ul>
          <li>{<Link to={`/Admin/${user.id}/CamerasAdmin`}> My Cameras</Link>}</li>
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
