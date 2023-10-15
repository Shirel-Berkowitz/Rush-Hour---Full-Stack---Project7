// import { Outlet, Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import React from "react";
// import "../App.css";

// const CamerasAccess = () => {
//   var user1 = JSON.parse(localStorage.getItem("currentUser"));

//   const [cameras, setCameras] = useState([]);
// //   const [updatedCamera, setUpdatedCamera] = useState({
// //     ID: null, 
// //     location: "",
// //     junction: "",
// //     video: "",
// //   });
// //   const [isAdding, setIsAdding] = useState(false);

// //   const toggleAddCamera = () => {
// //          setIsAdding((prevState) => !prevState);
// //       };
// //   const [isUpdating, setIsUpdating] = useState(false);
//    const [inputs, setInputs] = useState({});
//   const handleChange = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setInputs((values) => ({ ...values, [name]: value }));
//   };

//   useEffect(() => {
//     async function fetchCameras() {

        
//       try {
//         const response = await fetch(`http://localhost:3000/cameraAPI/api/cameras`);
//         const data = await response.json();
//         setCameras(data[0]);
//       } catch (error) {
//         console.error("Error fetching users", error);
//       }
//     }
//     fetchCameras();
//   }, []);

// //   const handleDeleteCamera = async (id) => {
// //     try {
// //       await fetch(`http://localhost:3000/cameraAPI/api/cameras/${id}`, {
// //         method: "DELETE",
// //       });

// //       setCameras((prevCamera) => prevCamera.filter((camera) => camera.ID !== id));
// //     } catch (error) {
// //       console.error("Error:", error);
// //     }
// //   };


// //   

//     const handleAddPermission = async (cameraId) => {

//         const username = inputs.username;

//       try {
        

//          const userResponse = await fetch(
//        `http://localhost:3000/userAPI/api/users/${inputs.username}`,
   
//         );

//        const userData = await userResponse.json();
//        console.log(userData);
//        console.log(userData[0].ID)
//        const userID = userData[0].ID;
  
//         const response = await fetch(`http://localhost:3000/cameraAccessAPI/api/cameraAccess/${userData[0].ID}/${cameraId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({userID: userID}),
//         });
  
//         if (response.ok) {
//           // הוספת המצלמה החדשה לרשימת המצלמות
//           const addCameraAccess = await response.json();
//           console.log(addCameraAccess);

          
//           //setCameras((prevCameras) => [...prevCameras, addedCamera]);
//           //setIsAdding(false);
//         } else {
//           console.error("Failed to add a new CameraAccess");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     };
  

//   return (
//     <div className="users-container">
      
     
//       <Link to="/Admin">
//         <button className="logout-button">Back</button>
//       </Link>
//       <div>
//         <h1>Access Permissions</h1>
//         {/* <button onClick={toggleAddCamera}>Add New Camera</button>
        
//         {isAdding && ( // הצגת הפופאפ להוספת מצלמה
//            <div>
//              <h2>Add Camera</h2>
//              <input
//                type="text"
//               name="location"
//                placeholder="Location"
//                value={inputs.location|| ""}
//                onChange={handleChange}
//             required
//              />
//              <input
//                type="text"
//                name="junction"
//                placeholder="Junction"
//                value={inputs.junction|| ""}
//              onChange={handleChange}
//              required
//             />
//              <input
//              type="text"
//                name="video"
//                placeholder="Video"
//                value={inputs.video|| ""}
//                onChange={handleChange}
//             required
//              />
//             <button onClick={handleAddCamera}>Add Camera</button>
//            </div>
//         )} */}
//         <ul>
//           {cameras.map((camera) => (
//             <li key={camera.ID}>
//               location: {camera.location} 
//               <button onClick={() => handleAddPermission(camera.ID)}>Add Permission</button>
//               {/* <button onClick={() => handleDeletePermission(camera)}>Delete Permission</button> */}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* {isUpdating ? ( */}
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={inputs.username || ""}
//             onChange={handleChange}
//             required
//           />
//           {/* <input
//             type="text"
//             placeholder="Junction"
//             value={updatedCamera.junction}
//             onChange={(e) =>
//               setUpdatedCamera({ ...updatedCamera, junction: e.target.value })
//             }
//           /> */}
//           {/* <input
//             type="text"
//             placeholder="Video"
//             value={updatedCamera.video}
//             onChange={(e) =>
//               setUpdatedCamera({ ...updatedCamera, video: e.target.value })
//             }
//           /> */}
//           {/* <button onClick={handleUpdateCameraSubmit}>Update</button> */}
//         </div>
//       {/* ) : null} */}
//     </div>
//   );
// };

// export default CamerasAccess;

import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import "../App.css";

const CamerasAccess = () => {
  var user1 = JSON.parse(localStorage.getItem("currentUser"));

  const [cameras, setCameras] = useState([]);
  const [inputs, setInputs] = useState({});
  const [activeCamera, setActiveCamera] = useState(null);
  const [isAddingPermission, setIsAddingPermission] = useState(false); // משתנה לשמור אם להציג או להסתיר את התיבה להוספת הרשאה
  const [isDeleteingPermission, setIsDeleteingPermission] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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

  const handleAddPermission = (camera) => {
    if (activeCamera && activeCamera.ID === camera.ID) {
      // אם המצלמה הנבחרת כבר פעילה, סגור אותה
      setActiveCamera(null);
      setIsAddingPermission(false);
    } else {
      setActiveCamera(camera);
      setIsAddingPermission(true);
    }
  };

  const handleSendPermission = async () => {
    const username = inputs.username;
    if (activeCamera) {
      try {
        const userResponse = await fetch(
          `http://localhost:3000/userAPI/api/users/${username}`,
        );

        const userData = await userResponse.json();
        const userID = userData[0].ID;

        const response = await fetch(`http://localhost:3000/cameraAccessAPI/api/cameraAccess/${userData[0].ID}/${activeCamera.ID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userID }),
        });

        if (response.ok) {
          const addCameraAccess = await response.json();
          console.log(addCameraAccess);
          setActiveCamera(null);
          setIsAddingPermission(false);
          alert("The permission has been successfully added");
        } else {
          console.error("Failed to add a new CameraAccess");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleDeletePermission = (camera) => {
    if (activeCamera && activeCamera.ID === camera.ID) {
      // אם המצלמה הנבחרת כבר פעילה, סגור אותה
      setActiveCamera(null);
      setIsDeleteingPermission(false);
    } else {
      setActiveCamera(camera);
      setIsDeleteingPermission(true);
    }
  };

  const handleSendPermissionDelete = async () => {
    if (activeCamera) {
        try {
          const cameraAccessResponse = await fetch(
            `http://localhost:3000/cameraAccessAPI/api/cameraAccess/${activeCamera.ID}`,
          );
  
          const userData = await cameraAccessResponse.json();
          const userID = userData[0].ID;
          console.log(userID);

          const userResponse = await fetch(
            `http://localhost:3000/userAPI/api/users/${userID}`,
          );
  
          const user = await userResponse.json();
          //const userID = userData[0].ID;
          console.log(user);
  

          try {
                  await fetch(`http://localhost:3000/cameraAccessAPI/api/cameraAccess/${userID}`, {
                    method: "DELETE",
                  });
            
                  setCameras((prevCamera) => prevCamera.filter((camera) => camera.ID !== id));
                } catch (error) {
                  console.error("Error:", error);
                }
  
           if (response.ok) {
            const deleteCameraAccess = await response.json();
            console.log(deleteCameraAccess);
            setActiveCamera(null);
            setIsDeleteingPermission(false);
            alert("The permission has been successfully deleted");
          } else {
            console.error("Failed to delete a new CameraAccess");
          }
        } catch (error) {
          console.error("Error:", error);
        }
    
      }
    };
    
         
       

  return (
    <div className="users-container">
      <Link to="/Admin">
        <button className="logout-button">Back</button>
      </Link>
      <div>
        <h1>Access Permissions</h1>
        <ul>
          {cameras.map((camera) => (
            <li key={camera.ID}>
              location: {camera.location}
              <button onClick={() => handleAddPermission(camera)}>
                {activeCamera && activeCamera.ID === camera.ID
                  ? "Close Permission"
                  : "Add Permission"}
              </button>
              {activeCamera && activeCamera.ID === camera.ID && isAddingPermission && (
                <div>
                  <div>Enter the username for access:</div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={inputs.username || ""}
                    onChange={handleChange}
                    required
                  />
                  <button onClick={handleSendPermission}>Send</button>
                </div>
              )}
              <button onClick={() => handleDeletePermission(camera)}>
                {activeCamera && activeCamera.ID === camera.ID
                  ? "Close Permission"
                  : "Delete Permission"}
              </button>
              {activeCamera && activeCamera.ID === camera.ID && isAddingPermission && (
                <div>
                  {cameras.map((user) => (
             <li key={user.username}>


           </li>
          ))}
                  <button onClick={handleSendPermission}>Send</button>
                </div>
              )}
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CamerasAccess;
