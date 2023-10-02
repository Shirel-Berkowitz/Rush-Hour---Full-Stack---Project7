import "../App.css";
import { useEffect, useState } from "react";
import React from "react";

const Cameras = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
  }, []);

  return (
    <div className="info-container">
      <h1 className="cam-header">Cameras</h1>
      {user && (
        <div className="background">
          <div className="cam-details">
            <button>
              <h3 className="cam-item">Location: {user.id}</h3>
              <h4 className="cam-item">Junction: {user.id}</h4>
              <h5 className="cam-item">Video: {user.id}</h5>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cameras;
