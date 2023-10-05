import "../App.css";
import { useEffect, useState } from "react";
import React from "react";

const Cameras = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(
        `http://localhost:3000/cameraAccessAPI/api/cameraAccess/${user.id}`,
      );
      //Camera ID
      const data = await response.json();
      const camera = {id:data}
       console.log("data");
       console.log(data);


  //     // Authentication successful
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/cameraAPI/api/${camera.id}`
  //       );

  //         const user = await response.json();
  //         //  console.log("user");
  //         //  console.log(user[0]);

  //         const currentUser = {
  //           id: user[0]["ID"],
  //           name: user[0]["name"],
  //           username: user[0]["username"],
  //           userRank: user[0]["userRank"],
  //         };
  //         console.log("currentUser");
  //         console.log(currentUser);
  //         localStorage.setItem("currentUser", JSON.stringify(currentUser));
  //         if (currentUser.userRank === "admin") {
  //           navigate(`/Admin`);
  //         } else {
  //           navigate(`/Users`);
  //         }
  //       } catch (error) {
  //         //           console.error(error);
  //       }
  //     } else {
  //       // Authentication failed
  //       alert("Username or password is incorrect");
  //     }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="info-container">
      <h1 className="cam-header">Cameras</h1>
      {user && (
        <div className="background">
          <div className="cam-details">
            <button onClick={handleSubmit}>
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
