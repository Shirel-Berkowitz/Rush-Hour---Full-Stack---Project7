import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import "../App.css";

const CamerasList = () => {
  var user1 = JSON.parse(localStorage.getItem("currentUser"));

  const [cameras, setCameras] = useState([]);
  const [updatedCamera, setUpdatedCamera] = useState({
    ID: null, 
    location: "",
    junction: "",
    video: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const response = await fetch(`http://localhost:3000/cameraAPI/api/cameras`);
        const data = await response.json();
        setCameras(data[0]);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    }
    fetchCameras();
  }, []);

  const handleDeleteCamera = async (id) => {
    try {
      await fetch(`http://localhost:3000/cameraAPI/api/cameras/${id}`, {
        method: "DELETE",
      });

      setCameras((prevCamera) => prevCamera.filter((camera) => camera.ID !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateCamera = (camera) => {
    setUpdatedCamera({
      ID: camera.ID,
      location: camera.location,
      junction: camera.junction,
      video: camera.video,
    });
    setIsUpdating(true);
  };

  const handleUpdateCameraSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/cameraAPI/api/cameras/${updatedCamera.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCamera),
        }
      );
      const updatedData = await response.json();
      console.log("User updated:", updatedData);

      // עדכון המצלמות לאחר העדכון
      setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.ID === updatedCamera.ID ? updatedCamera : camera
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
        <h1>Cameras List</h1>
        <ul>
          {cameras.map((camera) => (
            <li key={camera.ID}>
              location: {camera.location} junction: {camera.junction} video: {camera.video}
              <button onClick={() => handleDeleteCamera(camera.ID)}>Delete Camera</button>
              <button onClick={() => handleUpdateCamera(camera)}>Update Camera</button>
            </li>
          ))}
        </ul>
      </div>

      {isUpdating ? (
        <div>
          <h2>Update  Camera</h2>
          <input
            type="text"
            placeholder="Location"
            value={updatedCamera.location}
            onChange={(e) =>
              setUpdatedCamera({ ...updatedCamera, location: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Junction"
            value={updatedCamera.junction}
            onChange={(e) =>
              setUpdatedCamera({ ...updatedCamera, junction: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Video"
            value={updatedCamera.video}
            onChange={(e) =>
              setUpdatedCamera({ ...updatedCamera, video: e.target.value })
            }
          />
          <button onClick={handleUpdateCameraSubmit}>Update</button>
        </div>
      ) : null}
    </div>
  );
};

export default CamerasList;



