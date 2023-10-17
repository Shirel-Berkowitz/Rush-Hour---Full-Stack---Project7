import "../App.css";
import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";

const VideoAnalysis = () => {
  //const [user, setUser] = useState(null);
  
  const [camera, setCamera] = useState({});
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const { cameraID } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // setUser(currentUser);
    async function fetchData() {
      if (loading) {
      try {
        const response = await fetch(
          `http://localhost:3000/cameraAPI/api/camera/${cameraID}`,
        );
        if (response.status === 403) {
          const errorMessage = await response.json();
          alert(errorMessage);
          return;
        }
        //Camera ID
        const data = await response.json();
        setCamera(data[0]);
         
        
         console.log(data[0]);
         setLoading(false);


        } catch (error) {
          console.error(error);
        }
        }
      }
      fetchData();
  }, [cameraID,loading]);

  return (
    <div className="vid-container">
      {/* <h1 className="vid-header">Video</h1> */}
      <video width="600" height="400" controls>
        {/* <source src="../Videos/video1.mp4" type="video/mp4" /> */}
      </video>
      {user && (
        <div className="background">
          <h3 className="cam-item">Location: {camera.location}</h3>
          <h4 className="cam-item">Junction: {camera.junction}</h4>
          <h5 className="cam-item">Video: {camera.video}</h5>
         
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;