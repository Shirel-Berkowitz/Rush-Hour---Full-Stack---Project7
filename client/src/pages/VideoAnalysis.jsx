// import "../App.css";
// import { useEffect, useState } from "react";
// import React from "react";
// import { useParams } from "react-router-dom";

// const VideoAnalysis = () => {
//   //const [user, setUser] = useState(null);
  
//   const [camera, setCamera] = useState({});
//   const user = JSON.parse(localStorage.getItem("currentUser"));
//   const { cameraID } = useParams();
//   //const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     // setUser(currentUser);
//     async function fetchData() {
      
//       try {
//         const response = await fetch(
//           `http://localhost:3000/cameraAPI/api/camera/${cameraID}`,
//         );
//         if (response.status === 403) {
//           const errorMessage = await response.json();
//           alert(errorMessage);
//           return;
//         }else{
//         //Camera ID
//         const data = await response.json();
//         setCamera(data[0]);
         
        
//          console.log(data[0]);
//          //setLoading(false);
//         }


//         } catch (error) {
//           console.error(error);
//         }
        
//       }
//       fetchData();
//   }, [cameraID]);

//   return (
//     <div className="vid-container">
//       {/* <h1 className="vid-header">Video</h1> */}
//       <video width="600" height="400" controls>
//         {/* <source src="../Videos/video1.mp4" type="video/mp4" /> */}
//       </video>
//       {user && (
//         <div className="background">
//           <h3 className="cam-item">Location: {camera.location}</h3>
//           <h4 className="cam-item">Junction: {camera.junction}</h4>
//           {/* <h5 className="cam-item">Video: {camera.video}</h5> */}
//           <img src={camera.video} alt="Camera Image" width="600" height="400" />
         
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoAnalysis;

// import React, { useState, useEffect } from 'react';

// const VideoAnalysis = () => {
//   const [camera, setCamera] = useState({});
//   const [showEditPolygons, setShowEditPolygons] = useState(false);
//   const [showProcessedVideo, setShowProcessedVideo] = useState(false);
//   const [showProcessedYoloVideo, setShowProcessedYoloVideo] = useState(false);
//   const [polygons, setPolygons] = useState([]); // State to store polygons
//   const user = JSON.parse(localStorage.getItem('currentUser'));

//   const { cameraID } = useParams();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`http://localhost:3000/cameraAPI/api/camera/${cameraID}`);
//         if (response.status === 403) {
//           const errorMessage = await response.json();
//           alert(errorMessage);
//           return;
//         } else {
//           const data = await response.json();
//           setCamera(data[0]);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchData();
//   }, [cameraID]);

//   function drawPolygonsOnCanvas() {
//     const canvas = document.getElementById('polygonCanvas');
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.strokeStyle = 'blue';
//     context.fillStyle = 'rgba(0, 0, 255, 0.2';

//     polygons.forEach((polygon) => {
//       context.beginPath();
//       polygon.points.forEach((point, index) => {
//         if (index === 0) {
//           context.moveTo(point.x, point.y);
//         } else {
//           context.lineTo(point.x, point.y);
//         }
//       });
//       context.closePath();
//       context.stroke();
//       context.fill();
//     });
//   }

//   function handleCanvasClick(e) {
//     const canvas = document.getElementById('polygonCanvas');
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const updatedPolygons = [...polygons];
//     if (updatedPolygons.length === 0 || !showEditPolygons) return;
//     updatedPolygons[updatedPolygons.length - 1].points.push({ x, y });
//     setPolygons(updatedPolygons);
//     drawPolygonsOnCanvas();
//   }

//   useEffect(() => {
//     const canvas = document.getElementById('polygonCanvas');
//     canvas.addEventListener('click', handleCanvasClick);
//     return () => {
//       canvas.removeEventListener('click', handleCanvasClick);
//     };
//   }, [showEditPolygons]);

//   function getUpdatedPolygons() {
//     return polygons;
//   }

//   const handleEditPolygonsClick = () => {
//     setShowEditPolygons(true);
//     setShowProcessedVideo(false);
//     setShowProcessedYoloVideo(false);
//   };

//   const handleProcessedVideoClick = () => {
//     setShowEditPolygons(false);
//     setShowProcessedVideo(true);
//     setShowProcessedYoloVideo(false);
//   };

//   const handleProcessedYoloVideoClick = () => {
//     setShowEditPolygons(false);
//     setShowProcessedVideo(false);
//     setShowProcessedYoloVideo(true);
//   };

//   const handleSaveButtonClick = () => {
//     const updatedPolygons = getUpdatedPolygons();
//     if (updatedPolygons.length > 0) {
//       fetch(`http://localhost:3000/editPolygons/${cameraID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ polygons: updatedPolygons }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           alert(data.message);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//     }
//   };

//   return (
//     <div className="vid-container">
//       <video width="600" height="400" controls>
//         {/* <source src="../Videos/video1.mp4" type="video/mp4" /> */}
//       </video>
//       {user && (
//         <div className="background">
//           <h3 className="cam-item">Location: {camera.location}</h3>
//           <h4 className="cam-item">Junction: {camera.junction}</h4>
//           <h5 className="cam-item">Video: {camera.video}</h5>
//           <div className="button-options">
//             <button onClick={handleEditPolygonsClick}>Edit Polygons</button>
//             <button onClick={handleProcessedVideoClick}>Show Processed Video</button>
//             <button onClick={handleProcessedYoloVideoClick}>Show Processed YOLO Video</button>
//           </div>
//         </div>
//       )}
//       {showEditPolygons && (
//         <div>
//           <canvas id="polygonCanvas" width="800" height="600"></canvas>
//           <button id="saveButton" onClick={handleSaveButtonClick}>
//             Save
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoAnalysis;



// import "../App.css";
// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";

// const VideoAnalysis = () => {
//   const [camera, setCamera] = useState({});
//   const [drawingMode, setDrawingMode] = useState(false);
//   const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(-1);
//   const [selectedVertexIndex, setSelectedVertexIndex] = useState(-1);
//   //const [workplaces, setWorkplaces] = useState([]);
//   //const [imageData, setImageData] = useState(""); // This is where we'll store the base64 image data.

//   const user = JSON.parse(localStorage.getItem("currentUser"));
//   const { cameraID } = useParams();
//   const canvasRef = useRef(null);
//   const isDrawingRef = useRef(false);
//   const clickPointsRef = useRef([]);
//   const processedImageRef = useRef(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`http://localhost:3000/cameraAPI/api/camera/${cameraID}`);
//         if (response.status === 403) {
//           const errorMessage = await response.json();
//           alert(errorMessage);
//           return;
//         } else {
//           const data = await response.json();
//           setCamera(data[0]);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchData();
//   }, [cameraID]);

//   const canvas = canvasRef.current;
//   const ctx = canvas ? canvas.getContext("2d") : null;

//   const handlePolygonDrawing = () => {
//     if (drawingMode) {
//       setDrawingMode(false);
//       setSelectedPolygonIndex(-1);
//     } else {
//       setDrawingMode(true);
//       clickPointsRef.current = [];
//       setSelectedPolygonIndex(-1);
//       setSelectedVertexIndex(-1);
//     }
//   };

//   const handleMouseDown = (e) => {
//     if (drawingMode) {
//       isDrawingRef.current = true;
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;
//       clickPointsRef.current.push({ x: mouseX, y: mouseY });
//       drawDot(ctx, mouseX, mouseY);
//     } else if (selectedPolygonIndex !== -1) {
//       const mouseX = e.clientX - canvas.getBoundingClientRect().left + window.scrollX;
//       const mouseY = e.clientY - canvas.getBoundingClientRect().top + window.scrollY;
//       const vertexIndex = getSelectedVertexIndex(selectedPolygonIndex, mouseX, mouseY);
//       if (vertexIndex !== -1) {
//         setSelectedVertexIndex(vertexIndex);
//         canvas.addEventListener("mousemove", moveVertex);
//         canvas.addEventListener("mouseup", stopMovingVertex);
//       }
//     }
//   };

//   const drawDot = (ctx, x, y) => {
//     if (ctx) {
//       ctx.beginPath();
//       ctx.arc(x, y, 4, 0, 2 * Math.PI);
//       ctx.fill();
//     }
//   };

//   const renderWorkplaces = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     workplaces.forEach((workplace, index) => {
//       if (workplace.points.length > 2) {
//         const isSelected = index === selectedPolygonIndex;
//         drawPoly(workplace.points, isSelected);
//       }
//     });
//   };

//   const drawPoly = (points, isSelected) => {
//     ctx.lineWidth = isSelected ? 4 : 2;
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     points.slice(1).forEach(point => {
//       ctx.lineTo(point.x, point.y);
//     });
//     ctx.closePath();
//     ctx.stroke();
//   };

//   const getSelectedVertexIndex = (polygonIndex, x, y) => {
//     const polygon = workplaces[polygonIndex].points;
//     for (let i = 0; i < polygon.length; i++) {
//       const vertex = polygon[i];
//       const distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
//       if (distance <= 5) {
//         return i;
//       }
//     }
//     return -1;
//   };

//   const moveVertex = (e) => {
//     const mouseX = e.clientX - canvas.getBoundingClientRect().left + window.scrollX;
//     const mouseY = e.clientY - canvas.getBoundingClientRect().top + window.scrollY;
//     workplaces[selectedPolygonIndex].points[selectedVertexIndex].x = mouseX;
//     workplaces[selectedPolygonIndex].points[selectedVertexIndex].y = mouseY;
//     renderWorkplaces();
//   };

//   const stopMovingVertex = () => {
//     canvas.removeEventListener("mousemove", moveVertex);
//     canvas.removeEventListener("mouseup", stopMovingVertex);
//   };

//   //Function to update the polygons
//   const updatePolygons = () => {
//     if (workplaces[0]?.points.length < 1) {
//       workplaces.splice(0, 1);
//     }
//     console.log(workplaces);

//     const data = {
//       imageId: cameraID,
//       polygons: workplaces,
//     };

//     // Send the data to the server using fetch
//     fetch("/updatePolygons", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.blob())
//       .then((blob) => {
//         const imageUrl = URL.createObjectURL(blob);
//         setImageData(imageUrl);
//         // If you want to display the updated image, you can set the image data here.
//         // processedImageRef.current.src = imageUrl;
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <div className="vid-container">
//       {user && (
//         <div className="background">
//           <h3 className="cam-item">Location: {camera.location}</h3>
//           <h4 className="cam-item">Junction: {camera.junction}</h4>
//           {/* <img src={camera.video} alt="Camera Image" width="600" height="400" /> */}
//         </div>
//       )}
//       <button onClick={handlePolygonDrawing}>
//         {drawingMode ? "Exit Polygon Drawing Mode" : "Enter Polygon Drawing Mode"}
//       </button>
//       <canvas
//         ref={canvasRef}
//         width={canvas ? canvas.width : 0}
//         height={canvas ? canvas.height : 0}
//         onMouseDown={handleMouseDown}
//       ></canvas>
//       <button onClick={updatePolygons}>Save Polygons</button>
//       {imageData && <img src={camera.video} alt="Processed Image" id="proccessed_image" />}
//     </div>
//   );
// };

// export default VideoAnalysis;

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";

// const VideoAnalysis = () => {
//   const [camera, setCamera] = useState({});
//   const [drawingMode, setDrawingMode] = useState(false);
//   const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(-1);
//   const [workplaces, setWorkplaces] = useState([]);
//   const [isDrawing, setIsDrawing] = useState(false);

//   const user = JSON.parse(localStorage.getItem("currentUser"));
//   const { cameraID } = useParams();
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`http://localhost:3000/cameraAPI/api/camera/${cameraID}`);
//         if (response.status === 403) {
//           const errorMessage = await response.json();
//           alert(errorMessage);
//           return;
//         } else {
//           const data = await response.json();
//           setCamera(data[0]);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchData();
//   }, [cameraID]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas ? canvas.getContext("2d") : null;
  
//     if (ctx) {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//       workplaces.forEach((workplace, index) => {
//         if (workplace.points.length > 2) {
//           ctx.strokeStyle = "blue";
//           ctx.lineWidth = 2;
//           ctx.beginPath();
//           ctx.moveTo(workplace.points[0].x, workplace.points[0].y);
//           for (let i = 1; i < workplace.points.length; i++) {
//             ctx.lineTo(workplace.points[i].x, workplace.points[i].y);
//           }
//           ctx.closePath();
//           ctx.stroke();
//         }
//       });
//     }
//   }, [workplaces]);
  
  
//   const handlePolygonDrawing = () => {
//     if (drawingMode) {
//       setDrawingMode(false);
//       setSelectedPolygonIndex(-1);
//     } else {
//       setDrawingMode(true);
//       setIsDrawing(true);
//       setWorkplaces((prevWorkplaces) => [...prevWorkplaces, []]);
//     }
//   };
  
  

//   const handleMouseDown = (e) => {
//     if (drawingMode) {
//       setIsDrawing(true);
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;
//       const newPoint = { x: mouseX, y: mouseY };
//       setWorkplaces((prevWorkplaces) => [...prevWorkplaces, [newPoint]]);
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//     const lastWorkplace = workplaces[workplaces.length - 1];
//     if (lastWorkplace && lastWorkplace.length > 2) {
//       drawPolygon(ctx, lastWorkplace);
//     }
//   };
  
//   const drawPolygon = (ctx, points) => {
//     ctx.strokeStyle = "blue";
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//       ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.closePath();
//     ctx.stroke();
//   };

//   const renderWorkplaces = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     workplaces.forEach((workplace, index) => {
//       drawPolygon(ctx, workplace);
//       if (index === selectedPolygonIndex) {
//         ctx.strokeStyle = "red";
//         drawPolygon(ctx, workplace);
//         ctx.strokeStyle = "blue";
//       }
//     });
//   };

//   return (
//     <div className="vid-container">
//       {user && (
//         <div className="background">
//           <h3 className="cam-item">Location: {camera.location}</h3>
//           <h4 className="cam-item">Junction: {camera.junction}</h4>
//         </div>
//       )}
//       <button onClick={handlePolygonDrawing}>
//         {drawingMode ? "Exit Polygon Drawing Mode" : "Enter Polygon Drawing Mode"}
//       </button>
//       <canvas
//         ref={canvasRef}
//         width={camera.video ? camera.video.width : 0}
//         height={camera.video ? camera.video.height : 0}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//       ></canvas>
//       <button onClick={renderWorkplaces}>Render Polygons</button>
//       {camera.video && <img src={camera.video} alt="Processed Image" id="proccessed_image" />}
//     </div>
//   );
// };

// export default VideoAnalysis;

import React, { useEffect, useState, useRef } from "react";
import { loadImage } from "canvas";
import { useParams } from "react-router-dom";


const VideoAnalysis = () => {
  
  const [camera, setCamera] = useState({});
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const { cameraID } = useParams();
  const [drawingMode, setDrawingMode] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const canvasRef = useRef(null);
  const [drawingPoints, setDrawingPoints] = useState([]); // משתנה לאחסון הנקודות של הפוליגון

  var clickPoints = [];
  var polygonsJSON = JSON.stringify(polygons);
  var workplaces = JSON.parse(polygonsJSON);
  var isDrawing = false;
  var isSelecting = false;
  var selectedPolygonIndex = -1;
  var selectedVertexIndex = -1;

  const handlePolygonDrawing = () => {
    setDrawingMode(!drawingMode);
    if (!drawingMode) {
      setDrawingPoints([]); // נקה את הנקודות כאשר נכנסים למצב ציור
    }
  };

  const addPointToPolygon = (x, y) => {
    if (drawingMode) {
      setDrawingPoints([...drawingPoints, { x, y }]);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3000/cameraAPI/api/camera/${cameraID}`
        );
        if (response.status === 403) {
          const errorMessage = await response.json();
          alert(errorMessage);
          return;
        } else {
          const data = await response.json();
          setCamera(data[0]);
          setImageSrc(data[0].video);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [cameraID]);

  useEffect(() => {
    if (camera.video && drawingMode) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      loadImage(camera.video)
        .then((image) => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0, image.width, image.height);

          var canvasLeft = canvas.getBoundingClientRect().left;
          var canvasRight = canvas.getBoundingClientRect().top;

          canvas.style.backgroundImage = `url("${camera.video.src}")`;
          canvas.style.backgroundSize = "cover";
          canvas.style.backgroundRepeat = "no-repeat";
          canvas.style.backgroundPosition = "center";
          

          //ctx.globalCompositeOperation = "source-atop";
          //ctx.fillStyle = "red";
          // ציור הפוליגון
        //   if (drawingPoints.length > 1) {
        //     ctx.beginPath();
           
        //     ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
        //     drawingPoints.slice(1).forEach((point) => {
        //       ctx.lineTo(point.x, point.y);
        //     });
        //     ctx.closePath();
        //     ctx.fill();
        //   }

        canvas.addEventListener("mousedown", e => {

          if (isDrawing) {
        
            var mouseX = e.clientX - canvasLeft + window.scrollX;
            var mouseY = e.clientY - canvasRight + window.scrollY; 
        
            clickPoints.push({
              x:  Math.round(mouseX),
              y:  Math.round(mouseY)
            });
            console.log(clickPoints);
            //drawDot(mouseX, mouseY);  
            renderWorkplaces();
            drawInsertedPolygon();
            drawInsertedPoints();
          } else if (isSelecting) {
            var mouseX = e.clientX - canvasLeft + window.scrollX;
            var mouseY = e.clientY - canvasRight + window.scrollY; 
        
            selectedPolygonIndex = getSelectedPolygonIndex(mouseX, mouseY);
            if (selectedPolygonIndex !== -1) {
               deleteBtn.disabled = false;
              selectModeBtn.textContent = "Exit Select Mode";
              //selectModeBtn.style.backgroundColor = "red";
              //canvas.addEventListener("mouseup", movePolygon);
              //canvas.addEventListener("mouseup", stopMovingPolygon);
            } else {
              selectModeBtn.textContent = "Enter Select Mode";
              //selectModeBtn.style.backgroundColor = "";
              //canvas.removeEventListener("mouseup", movePolygon);
        //canvas.removeEventListener("mouseup", stopMovingPolygon);
            }
          }
        });

        doneBtn.addEventListener('click', () => {
          isDrawing = false;
          workplaces.push({
            points: clickPoints,
            desc: polygonDesc.value
          });
          console.log(workplaces);
          clickPoints = [];
          renderWorkplaces();
        });

        cancelBtn.addEventListener('click', () => {
          clickPoints = [];
          renderWorkplaces();
        });

        deleteBtn.addEventListener('click', () => {
          if (isSelecting && selectedPolygonIndex !== -1) {
              workplaces.splice(selectedPolygonIndex,1)
          }
         selectedPolygonIndex = -1
         renderWorkplaces();
         deleteBtn.disabled = true;
       });

       function undo(){
        if(clickPoints.length > 0){
            clickPoints.splice(clickPoints.length -1,1)
              
              renderWorkplaces();
              drawInsertedPolygon();
             drawInsertedPoints();
            
          }
      }

      drawModeBtn.addEventListener('click', () => {
        isDrawing = !isDrawing;
        if (isDrawing) {
          drawModeBtn.textContent = "Exit Drawing Mode";
          selectModeBtn.disabled = true;
          selectModeBtn.textContent = "Enter Select Mode";
          isSelecting = false;
          selectModeBtn.style.backgroundColor = "";
          canvas.removeEventListener("mouseup", movePolygon);
         // canvas.removeEventListener("mouseup", stopMovingPolygon);
          canvas.removeEventListener("mousemove", moveVertex);
          canvas.removeEventListener("mouseup", stopMovingVertex);
        } else {
          drawModeBtn.textContent = "Enter Drawing Mode";
          selectModeBtn.disabled = false;
        }
      });

      selectModeBtn.addEventListener('click', () => {
        isSelecting = !isSelecting;
        if (isSelecting) {
          selectModeBtn.textContent = "Exit Select Mode";
          drawModeBtn.disabled = true;
          drawModeBtn.textContent = "Enter Drawing Mode";
          isDrawing = false;
          selectModeBtn.style.backgroundColor = "";
          canvas.removeEventListener("mouseup", movePolygon);
         // canvas.removeEventListener("mouseup", stopMovingPolygon);
          canvas.removeEventListener("mousemove", moveVertex);
          canvas.removeEventListener("mouseup", stopMovingVertex);
        } else {
          selectModeBtn.textContent = "Enter Select Mode";
          drawModeBtn.disabled = false;
        }
      });

      const drawPoly = (points, isSelected) => {
        ctx.lineWidth = isSelected ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
      
        // // Set fill style to semi-transparent red or green
        // ctx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.5)' : '#5eeb4863';
        // ctx.fill();
      
        ctx.stroke();
      };

      const renderWorkplaces = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        workplaces.forEach((workplace, index) => {
          if (workplace.points.length > 2) {
            const isSelected = (index === selectedPolygonIndex);
            drawPoly(workplace.points, isSelected);
          }
        });
      };
      
      const drawDot = (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2*Math.PI);
        ctx.fill();
      };
      
      function drawInsertedPolygon(){
        ctx.fillStyle = 'rgba(100,100,100,0.5)';
        ctx.strokeStyle = "#df4b26";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(clickPoints[0].x, clickPoints[0].y);
        for(var i=1; i < clickPoints.length; i++) { 
          ctx.lineTo(clickPoints[i].x,clickPoints[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };
      
      function drawInsertedPoints(){
        ctx.strokeStyle = "#df4b26"; 
        ctx.lineJoin = "round"; 
        ctx.lineWidth = 5; 
                    
        for(var i=0; i < clickPoints.length; i++){ 
          ctx.beginPath(); 
          ctx.arc(clickPoints[i].x, clickPoints[i].y, 3, 0, 2 * Math.PI, false); 
          ctx.fillStyle = '#ffffff'; 
          ctx.fill(); 
          ctx.lineWidth = 5; 
          ctx.stroke(); 
        }
      };
      
      
      const getSelectedPolygonIndex = (x, y) => {
        for (var i = 0; i < workplaces.length; i++) {
          if (isPointInPolygon(x, y, workplaces[i].points)) {
            return i;
          }
        }
        return -1;
      };
      
      const isPointInPolygon = (x, y, polygon) => {
        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          var xi = polygon[i].x,
              yi = polygon[i].y;
          var xj = polygon[j].x,
              yj = polygon[j].y;
      
          var intersect = ((yi > y) != (yj > y)) &&
              (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
      
        return inside;
      };
      
      const getSelectedVertexIndex = (polygonIndex, x, y) => {
        const polygon = workplaces[polygonIndex].points;
        for (var i = 0; i < polygon.length; i++) {
          var vertex = polygon[i];
          var distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
          if (distance <= 5) {
            return i;
          }
        }
        return -1;
      };
      
      const movePolygon = e => {
      
        var mouseX = e.clientX - canvasLeft + window.scrollX;
        var mouseY = e.clientY - canvasRight + window.scrollY; 
      
        const deltaX = mouseX - canvasLeft;
        const deltaY = mouseY - canvasRight;
      debugger
        workplaces[selectedPolygonIndex].points.forEach(point => {
          point.x += deltaX;
          point.y += deltaY;
        });
      
        renderWorkplaces();
      };
      
      const stopMovingPolygon = () => {
        canvas.removeEventListener("mousemove", movePolygon);
        canvas.removeEventListener("mouseup", stopMovingPolygon);
      };
      
      const moveVertex = e => {
        var mouseX = e.clientX - canvasLeft + window.scrollX;
        var mouseY = e.clientY - canvasRight + window.scrollY; 
      
        workplaces[selectedPolygonIndex].points[selectedVertexIndex].x = mouseX;
        workplaces[selectedPolygonIndex].points[selectedVertexIndex].y = mouseY;
      
        renderWorkplaces();
      };
      
      const stopMovingVertex = () => {
        canvas.removeEventListener("mousemove", moveVertex);
        canvas.removeEventListener("mouseup", stopMovingVertex);
      };
      
      function navigateToFirstPage() {
        window.location.href = '/';
      }
      
      // Function to send the updated array of polygons to the server
      function updatePolygons() {
        // Create an object with the image ID and polygons array
      
        if(workplaces[0]?.points.length < 1){
          workplaces.splice(0,1)
        }
        console.log(workplaces)
      
        const data = {
          imageId: {{id}},
          polygons: workplaces
        };
      
        // Send the data to the server using fetch
        fetch('/updatePolygons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          // Convert the array buffer to a Blob object
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      
          // Create an object URL for the Blob
          const imageURL = URL.createObjectURL(blob);
       
         
          proccessed_image.src = imageURL
          // Process the updated image received from the server
          // For example, you can display the updated image on the client side
          //displayUpdatedImage(updatedImage);


        
         })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
    }
    renderWorkplaces();
  }, [camera.video, drawingMode, drawingPoints]);



  return (
    <div className="vid-container">
      {user && (
        <div className="background">
          <h3 className="cam-item">Location: {camera.location}</h3>
          <h4 className="cam-item">Junction: {camera.junction}</h4>
          {imageSrc && (
            <div>
              <button onClick={handlePolygonDrawing}>
                {drawingMode ? "Exit Polygon Drawing Mode" : "Enter Polygon Drawing Mode"}
              </button>
              {drawingMode && (
                <canvas
                  ref={canvasRef}
                  style={{ border: "1px solid black" }}
                  onClick={(e) => {
                    addPointToPolygon(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                  }}
                ></canvas>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;



