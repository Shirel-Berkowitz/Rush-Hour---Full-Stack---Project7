// import { Outlet, Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import React from "react";
// import "../App.css";

// const CamerasList = () => {
//   var user1 = JSON.parse(localStorage.getItem("currentUser"));

//   const [cameras, setCameras] = useState([]);
//   const [updatedCamera, setUpdatedCamera] = useState({
//     ID: null,
//     location: "",
//     junction: "",
//     video: "",
//   });
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);

//   const toggleAddCamera = () => {
//     setIsAdding((prevState) => !prevState);
//   };

//   useEffect(() => {
//     async function fetchCameras() {
//       try {
//         const response = await fetch(`http://localhost:3000/cameraAPI/api/cameras`);
//         const data = await response.json();
//         setCameras(data[0]);
//       } catch (error) {
//         console.error("Error fetching cameras", error);
//       }
//     }
//     fetchCameras();
//   }, []);

//   const handleDeleteCamera = async (id) => {
//     try {
//       await fetch(`http://localhost:3000/cameraAPI/api/cameras/${id}`, {
//         method: "DELETE",
//       });

//       setCameras((prevCamera) => prevCamera.filter((camera) => camera.ID !== id));
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleUpdateCamera = (camera) => {
//     setUpdatedCamera({
//       ID: camera.ID,
//       location: camera.location,
//       junction: camera.junction,
//       video: camera.video,
//     });
//     setIsUpdating(true);
//   };
  
//   const handleUpdateCameraSubmit = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/cameraAPI/api/cameras/${updatedCamera.ID}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedCamera),
//         }
//       );
//       // נוסיף בדיקות לפני שממשנים את המצלמה
//       if (response.ok) {
//         const updatedData = await response.json();
//         console.log("Camera updated:", updatedData);
  
//         // עדכון המצלמות לאחר העדכון
//         setCameras((prevCameras) =>
//           prevCameras.map((camera) =>
//             camera.ID === updatedCamera.ID ? updatedCamera : camera
//           )
//         );
  
//         setIsUpdating(false);
//       } else {
//         console.error("Failed to update the camera");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleAddCamera = async () => {
//     try {
//       const newCamera = {
//         location: updatedCamera.location,
//         junction: updatedCamera.junction,
//         video: updatedCamera.video,
//       };
  
//       // אחרי הבקשה לשרת, בדוק האם המזהה מופיע כבר ברשימת המצלמות
//       const isIdUnique = cameras.every((camera) => camera.ID !== updatedCamera.ID);
      
//       if (!isIdUnique) {
//         console.error("Camera with the same ID already exists");
//         return;
//       }
  
//       const response = await fetch("http://localhost:3000/cameraAPI/api/cameras", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newCamera),
//       });
  
//       if (response.ok) {
//         // הוספת המצלמה החדשה לרשימת המצלמות
//         const addedCamera = await response.json();
//         setCameras((prevCameras) => [...prevCameras, addedCamera]);
//         setIsAdding(false); // סגור את הטופס לאחר הוספה
//         setUpdatedCamera({ location: "", junction: "", video: "" }); // אפס את הנתונים לטופס
//       } else {
//         console.error("Failed to add a new camera");
//         // הוספתי כאן הודעת שגיאה, כדי להציג אותה למשתמש במקרה של שגיאה
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="users-container">
//       <Link to="/Admin">
//         <button className="logout-button">Back</button>
//       </Link>
//       <div>
//         <h1>Cameras List</h1>
//         <button onClick={toggleAddCamera}>Add New Camera</button>
        
//         {isAdding && ( // הצגת הפופאפ להוספת מצלמה
//           <div>
//             <h2>Add Camera</h2>
//             <input
//               type="text"
//               name="location"
//               placeholder="Location"
//               value={updatedCamera.location}
//               onChange={(e) =>
//                 setUpdatedCamera({ ...updatedCamera, location: e.target.value })
//               }
//             />
//             <input
//               type="text"
//               name="junction"
//               placeholder="Junction"
//               value={updatedCamera.junction}
//               onChange={(e) =>
//                 setUpdatedCamera({ ...updatedCamera, junction: e.target.value })
//               }
//             />
//             <input
//               type="text"
//               name="video"
//               placeholder="Video"
//               value={updatedCamera.video}
//               onChange={(e) =>
//                 setUpdatedCamera({ ...updatedCamera, video: e.target.value })
//               }
//             />
//             <button onClick={handleAddCamera}>Add Camera</button>
//           </div>
//         )}
//         <ul>
//          {cameras.map((camera) => (
//              <li key={camera.ID}>
//                    location: {camera.location} junction: {camera.junction} video: {camera.video}
//                   <button onClick={() => handleDeleteCamera(camera.ID)}>Delete Camera</button>
//                   <button onClick={() => handleUpdateCamera(camera)}>Update Camera</button>
//                 </li>
//                    ))}
//              </ul>
//       </div>

//       {isUpdating ? (
//         <div>
//           <h2>Update Camera</h2>
//           <input
//             type="text"
//             name="location"
//             placeholder="Location"
//             value={updatedCamera.location}
//             onChange={(e) =>
//               setUpdatedCamera({ ...updatedCamera, location: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             name="junction"
//             placeholder="Junction"
//             value={updatedCamera.junction}
//             onChange={(e) =>
//               setUpdatedCamera({ ...updatedCamera, junction: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             name="video"
//             placeholder="Video"
//             value={updatedCamera.video}
//             onChange={(e) =>
//               setUpdatedCamera({ ...updatedCamera, video: e.target.value })
//             }
//           />
//           <button onClick={handleUpdateCameraSubmit}>Update</button>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default CamerasList;


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
  const [isAdding, setIsAdding] = useState(false);

  const toggleAddCamera = () => {
         setIsAdding((prevState) => !prevState);
      };
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputs, setInputs] = useState({});
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
      if (response.ok) {
      const updatedData = await response.json();
      console.log("User updated:", updatedData);

      // עדכון המצלמות לאחר העדכון
      setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.ID === updatedCamera.ID ? updatedCamera : camera
        )
      );

      setIsUpdating(false);
    } else {
               console.error("Failed to update the camera");
             }
    } catch (error) {
      console.error("Error:", error);
    }
   };

    const handleAddCamera = async () => {
      try {
        // הגדרת מצלמה חדשה להוספה
        const newCamera = {
          location:inputs.location,
          junction: inputs.junction,
          video: inputs.video,
        };
  
        const response = await fetch("http://localhost:3000/cameraAPI/api/cameras", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCamera),
        });
  
        if (response.ok) {
          // הוספת המצלמה החדשה לרשימת המצלמות
          const addedCamera = await response.json();
          console.log(addedCamera);

          
          setCameras((prevCameras) => [...prevCameras, addedCamera]);
          setIsAdding(false);
        } else {
          console.error("Failed to add a new camera");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  

  return (
    <div className="users-container">
      
     
      <Link to="/Admin">
        <button className="logout-button">Back</button>
      </Link>
      <div>
        <h1>Cameras List</h1>
        <button onClick={toggleAddCamera}>Add New Camera</button>
        
        {isAdding && ( // הצגת הפופאפ להוספת מצלמה
           <div>
             <h2>Add Camera</h2>
             <input
               type="text"
              name="location"
               placeholder="Location"
               value={inputs.location|| ""}
               onChange={handleChange}
            required
             />
             <input
               type="text"
               name="junction"
               placeholder="Junction"
               value={inputs.junction|| ""}
             onChange={handleChange}
             required
            />
             <input
             type="text"
               name="video"
               placeholder="Video"
               value={inputs.video|| ""}
               onChange={handleChange}
            required
             />
            <button onClick={handleAddCamera}>Add Camera</button>
           </div>
        )}
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



