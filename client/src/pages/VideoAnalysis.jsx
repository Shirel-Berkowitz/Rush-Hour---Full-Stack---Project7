import "../App.css";
import { useEffect, useState } from "react";
import React from "react";

const VideoAnalysis = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
  }, []);

  return (
    <div className="vid-container">
      {/* <h1 className="vid-header">Video</h1> */}
      <video width="600" height="400" controls>
        <source src="..Videos/video1.mp4" type="video/mp4" />
      </video>
      {user && (
        <div className="background">
          <div className="vid-analysis">
            <h3 className="vid-item">ID: {user.id}</h3>
            <h3 className="vid-item">Name: {user.name}</h3>
            <h3 className="vid-item">Username: {user.username}</h3>
            <h3 className="vid-item">Rank: {user.userRank}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;
