import React, { useEffect, useState, useRef, useCallback } from "react";
import { loadImage } from "canvas";
import { useParams } from "react-router-dom";

const VideoAnalysis = () => {
  const [camera, setCamera] = useState({});
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const { cameraID } = useParams();
  const [drawingMode, setDrawingMode] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const canvasRef = useRef(null);
  const [clickPoints, setClickPoints] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);
  const [descInput, setDescInput] = useState("");
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(-1);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);
  const [selectModeBtnDisabled, setSelectModeBtnDisabled] = useState(true);
  const [drawModeBtnDisabled, setDrawModeBtnDisabled] = useState(true);
  const [selectModeBtnText, setSelectModeBtnText] = useState("Enter Select Mode");
  const [drawModeBtnText, setDrawModeBtnText] = useState("Exit Drawing Mode");
  const [selectModeBtnBackgroundColor, setSelectModeBtnBackgroundColor] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedVertexIndex, setSelectedVertexIndex] = useState(-1);

  const handleDrawMode = () => {
    setIsDrawing((prevIsDrawing) => !prevIsDrawing);

    if (!isDrawing) {
      console.log("Entering Drawing Mode");
      setDrawModeBtnText("Exit Drawing Mode");
      setSelectModeBtnDisabled(true);
      setSelectModeBtnText("Enter Select Mode");
      setIsSelecting(false);
      setSelectModeBtnBackgroundColor("");
      canvas.removeEventListener("mouseup", movePolygon);
      canvas.removeEventListener("mousemove", moveVertex);
      canvas.removeEventListener("mouseup", stopMovingVertex);
    } else {
      
      setDrawModeBtnText("Enter Drawing Mode");
      setSelectModeBtnDisabled(false);
    }
  };

  const handleSelectMode = () => {
    setIsSelecting((prevIsSelecting) => !prevIsSelecting);

    if (!isSelecting) {
      setSelectModeBtnText("Exit Select Mode");
      setDrawModeBtnDisabled(true);
      setDrawModeBtnText("Enter Drawing Mode");
      setIsDrawing(false);
      setSelectModeBtnBackgroundColor("");
      canvas.removeEventListener("mouseup", movePolygon);
      canvas.removeEventListener("mousemove", moveVertex);
      canvas.removeEventListener("mouseup", stopMovingVertex);
    } else {
      setSelectModeBtnText("Enter Select Mode");
      setDrawModeBtnDisabled(false);
    }
  };

  const handleDone = () => {
    setWorkplaces((prevWorkplaces) => [
      ...prevWorkplaces,
      {
        points: clickPoints,
        desc: descInput,
      },
    ]);
    console.log(workplaces);
    setClickPoints([]);
    setDescInput("");
    renderWorkplaces();
  };

  const handleCancel = () => {
    setClickPoints([]);
    renderWorkplaces();
  };

  const undo = () => {
    if (clickPoints.length > 0) {
      const newClickPoints = [...clickPoints];
      newClickPoints.pop();
      setClickPoints(newClickPoints);
      renderWorkplaces();
      drawInsertedPolygon();
      drawInsertedPoints();
    }
  };

  const handleDelete = () => {
    if (isSelecting && selectedPolygonIndex !== -1) {
      setWorkplaces((prevWorkplaces) => {
        const newWorkplaces = [...prevWorkplaces];
        newWorkplaces.splice(selectedPolygonIndex, 1);
        return newWorkplaces;
      });
    }
    setSelectedPolygonIndex(-1);
    setDeleteBtnDisabled(true);
    renderWorkplaces();
  };

  const handleSaveClick = () => {
    if (workplaces.length > 0 && workplaces[0].points.length > 0) {
      updatePolygons();
    } else {
      console.log("No data to save.");
    }
  };


  useEffect(() => {
    async function fetchData()  {
      try {
        const response = await fetch(`http://localhost:3000/cameraAPI/api/camera/${cameraID}`);
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

  


  const loadAndDrawImage = useCallback(async () => {  
    const canvas = canvasRef.current;

    if (!canvas || !camera.video) {
      console.error("Canvas reference or camera video is not available.");
      return;
  }

    console.log(canvasRef);
    console.log(canvasRef.current);


    if (!canvas) {
      console.error("Canvas reference is not available.");
      return;
    }

    const ctx = canvas.getContext("2d");
     // Ensure that camera.video is defined before attempting to load the image
     
     if (!camera.video) {
        console.error("Camera video is not available.");
      return;
     }

     
      try {
        const image = await loadImage(camera.video);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        var canvasLeft = canvas.getBoundingClientRect().left;
        var canvasRight = canvas.getBoundingClientRect().top;

        canvas.style.backgroundImage = `url("${camera.video}")`;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundRepeat = "no-repeat";
        canvas.style.backgroundPosition = "center";

        canvas.addEventListener("mousedown", (e) => {
          const mouseX = e.clientX - canvasLeft + window.scrollX;
          const mouseY = e.clientY - canvasRight + window.scrollY;

          if (isDrawing) {
            setClickPoints((prevClickPoints) => [
              ...prevClickPoints,
              { x: Math.round(mouseX), y: Math.round(mouseY) },
            ]);
            console.log(clickPoints);
            renderWorkplaces();
            drawInsertedPolygon();
            drawInsertedPoints();
          } else if (isSelecting) {
            const selectedPolygonIndex = getSelectedPolygonIndex(mouseX, mouseY);
            setSelectedPolygonIndex(selectedPolygonIndex);
            if (selectedPolygonIndex !== -1) {
              setDeleteBtnDisabled(false);
              setSelectModeBtnText("Exit Select Mode");
            } else {
              setSelectModeBtnText("Enter Select Mode");
            }
          }
        });

        const drawPoly = (points, isSelected) => {
          ctx.lineWidth = isSelected ? 4 : 2;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.closePath();
          ctx.stroke();
        };

        const renderWorkplaces = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          workplaces.forEach((workplace, index) => {
            if (workplace.points.length > 2) {
              const isSelected = index === selectedPolygonIndex;
              drawPoly(workplace.points, isSelected);
            }
          });
        };

        const drawDot = (x, y) => {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "red";
          ctx.fill();
          //ctx.closePath();
        };

        const drawInsertedPoints = () => {
          clickPoints.forEach((point) => {
            drawDot(point.x, point.y);
          });
        };

        const drawInsertedPolygon = () => {
          if (clickPoints.length > 2) {
            drawPoly(clickPoints);
          }
        };

        // const updatePolygons = () => {
          
        //   console.log("Polygons updated:", workplaces);
        // };

        const getSelectedPolygonIndex = (x, y) => {
          // Loop through workplaces array
          for (let i = 0; i < workplaces.length; i++) {
            const polygon = workplaces[i].points;
        
            // Check if the point (x, y) is inside the current polygon
            if (isPointInPolygon(x, y, polygon)) {
              return i; // Return the index of the selected polygon
            }
          }
        
          return -1; // Return -1 if no polygon is selected
        };

        const movePolygon = (e) => {
          if (isSelecting && selectedPolygonIndex !== -1) {
            const mouseX = e.clientX - canvasLeft + window.scrollX;
            const mouseY = e.clientY - canvasRight + window.scrollY;
        
            const deltaX = mouseX - canvasLeft;
            const deltaY = mouseY - canvasRight;
        
            const updatedPolygon = workplaces[selectedPolygonIndex].points.map((point) => ({
              x: point.x + deltaX,
              y: point.y + deltaY,
            }));
        
            setWorkplaces((prevWorkplaces) => {
              const newWorkplaces = [...prevWorkplaces];
              newWorkplaces[selectedPolygonIndex] = {
                ...newWorkplaces[selectedPolygonIndex],
                points: updatedPolygon,
              };
              return newWorkplaces;
            });
        
            renderWorkplaces();
          }
        };
        

        const moveVertex = (e) => {
          const canvas = canvasRef.current;
          const canvasLeft = canvas.getBoundingClientRect().left + window.scrollX;
          const canvasTop = canvas.getBoundingClientRect().top + window.scrollY;
          
          const mouseX = e.clientX - canvasLeft;
          const mouseY = e.clientY - canvasTop;
        
          if (selectedPolygonIndex !== -1 && selectedVertexIndex !== -1) {
            const newWorkplaces = [...workplaces];
            const selectedPolygon = newWorkplaces[selectedPolygonIndex];
            const selectedVertex = selectedPolygon.points[selectedVertexIndex];
            
            selectedVertex.x = mouseX;
            selectedVertex.y = mouseY;
        
            setWorkplaces(newWorkplaces);
            renderWorkplaces();
          }
        };

        const stopMovingVertex = () => {
          canvasRef.current.removeEventListener("mousemove", moveVertex);
          canvasRef.current.removeEventListener("mouseup", stopMovingVertex);
        };
        
      } catch (error) {
        console.error("Error loading image:", error);
      }
    
  
  }, [cameraID, camera.video, clickPoints, workplaces, isDrawing, isSelecting, selectedPolygonIndex]);

  useEffect(() => {
    loadAndDrawImage();
  }, [loadAndDrawImage]);

  // return (
  //   <div>
  //     <canvas ref={canvasRef}></canvas>
  //     <div>
  //       <button onClick={handleDrawMode} disabled={drawModeBtnDisabled}>
  //         {drawModeBtnText}
  //       </button>
  //       <button onClick={handleSelectMode} disabled={selectModeBtnDisabled}>
  //         {selectModeBtnText}
  //       </button>
  //       <button onClick={handleDone}>Done</button>
  //       <button onClick={handleCancel}>Cancel</button>
  //       <button onClick={undo}>Undo</button>
  //       <button onClick={handleDelete} disabled={deleteBtnDisabled}>
  //         Delete
  //       </button>
  //       <button onClick={handleSaveClick}>Save</button>
  //     </div>
  //   </div>
  // );

  return (
        <div className="vid-container">
          {user && (
            <div className="background">
              <h3 className="cam-item">Location: {camera.location}</h3>
              <h4 className="cam-item">Junction: {camera.junction}</h4>
              {imageSrc && (
                <div>
                   <div style={{ display: "flex", margin: "10px 0" }}>
                   {/* <canvas ref={canvasRef}></canvas> */}
                    
                     {/* <input
                        type="text"
                        id="polygonDesc"
                        placeholder="desc"
                        value={descInput}
                        onChange={(e) => setDescInput(e.target.value)}
                      /> */}
                  </div>
                  <button onClick={handleDrawMode} disabled={drawModeBtnDisabled}>
                    {drawModeBtnText}
                  </button>
                 <button onClick={handleSelectMode} disabled={selectModeBtnDisabled}>
                 {selectModeBtnText}
                 </button>
          <button onClick={handleDone}>Done</button>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={undo}>Undo</button>
          <button onClick={handleDelete} disabled={deleteBtnDisabled}>
            Delete
          </button>
          <button onClick={handleSaveClick}>Save</button>
                   <br />
                   <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>

               </div>
              )}
            </div>
          )}
        </div>
      );
};

export default VideoAnalysis;





// import React, { useEffect, useState, useRef } from "react";
// import { loadImage } from "canvas";
// import { useParams } from "react-router-dom";


// const VideoAnalysis = () => {
  
//   const [camera, setCamera] = useState({});
//   const user = JSON.parse(localStorage.getItem("currentUser"));
//   const { cameraID } = useParams();
//   const [drawingMode, setDrawingMode] = useState(false);
//   const [imageSrc, setImageSrc] = useState("");
//   const canvasRef = useRef(null);
//   const [clickPoints, setClickPoints] = useState([]);
//   const [workplaces, setWorkplaces] = useState([]);
//   const [descInput, setDescInput] = useState("");
//   const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(-1);
//   const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);
//   const [selectModeBtnDisabled, setSelectModeBtnDisabled] = useState(true);
//   const [drawModeBtnDisabled, setDrawModeBtnDisabled] = useState(true);
//   const [selectModeBtnText, setSelectModeBtnText] = useState("Enter Select Mode");
//   const [drawModeBtnText, setDrawModeBtnText] = useState("Exit Drawing Mode");
//   const [selectModeBtnBackgroundColor, setSelectModeBtnBackgroundColor] = useState("");
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectedVertexIndex, setSelectedVertexIndex] = useState(-1);
  
          

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/cameraAPI/api/camera/${cameraID}`
//         );
//         if (response.status === 403) {
//           const errorMessage = await response.json();
//           alert(errorMessage);
//           return;
//         } else {
//           const data = await response.json();
//           setCamera(data[0]);
//           setImageSrc(data[0].video);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     useEffect(() => {
//       fetchData();
//     }, [cameraID]);

//     const handleDrawMode = () => {
//       setIsDrawing((prevIsDrawing) => !prevIsDrawing);
    
//       if (!isDrawing) {
//         setDrawModeBtnText("Exit Drawing Mode");
//         setSelectModeBtnDisabled(true);
//         setSelectModeBtnText("Enter Select Mode");
//         setIsSelecting(false);
//         setSelectModeBtnBackgroundColor("");
//         canvas.removeEventListener("mouseup", movePolygon);
//         canvas.removeEventListener("mousemove", moveVertex);
//         canvas.removeEventListener("mouseup", stopMovingVertex);
    
//       } else {
//         setDrawModeBtnText("Enter Drawing Mode");
//         setSelectModeBtnDisabled(false);
      
//       }
//     };
//     const handleSelectMode = () => {
//       setIsSelecting((prevIsSelecting) => !prevIsSelecting);
    
//       if (!isSelecting) {
//         setSelectModeBtnText("Exit Select Mode");
//         setDrawModeBtnDisabled(true);
//         setDrawModeBtnText("Enter Drawing Mode");
//         setIsDrawing(false);
//         setSelectModeBtnBackgroundColor("");
//         canvas.removeEventListener("mouseup", movePolygon);
//         canvas.removeEventListener("mousemove", moveVertex);
//         canvas.removeEventListener("mouseup", stopMovingVertex);
//       } else {
//         setSelectModeBtnText("Enter Select Mode");
//         setDrawModeBtnDisabled(false);
//       }
//     };

//     const handleDone = () => {
//       setWorkplaces((prevWorkplaces) => [
//         ...prevWorkplaces,
//         {
//           points: clickPoints,
//           desc: descInput,
//         },
//       ]);
//       console.log(workplaces);
//       setClickPoints([]);
//       setDescInput(""); // Clear the input value after clicking "Done"
//       renderWorkplaces();
//     };
  
//     const handleCancel = () => {
//       setClickPoints([]);
//       renderWorkplaces();
//     };
  
//     const undo = () => {
//       if (clickPoints.length > 0) {
//         const newClickPoints = [...clickPoints];
//         newClickPoints.pop();
//         setClickPoints(newClickPoints);
//         renderWorkplaces();
//         drawInsertedPolygon();
//         drawInsertedPoints();
//       }
//     };
  
//     const handleDelete = () => {
//       if (isSelecting && selectedPolygonIndex !== -1) {
//         setWorkplaces((prevWorkplaces) => {
//           const newWorkplaces = [...prevWorkplaces];
//           newWorkplaces.splice(selectedPolygonIndex, 1);
//           return newWorkplaces;
//         });
//       }
//       setSelectedPolygonIndex(-1);
//       setDeleteBtnDisabled(true);
//       renderWorkplaces();
//     };
    
  
//     const handleSaveClick = () => {
//       if (workplaces.length > 0 && workplaces[0].points.length > 0) {
//         updatePolygons();
//       } else {
//         console.log("No data to save.");
//       }
    
//       // const data = {
//       //   imageId: {{id}},
//       //   polygons: workplaces
//       // };
    
//       // Send the data to the server using fetch
//       // fetch('/updatePolygons', {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json'
//       //   },
//       //   body: JSON.stringify(data)
//       // }).then(response => response.arrayBuffer())
//       // .then(arrayBuffer => {
//       //   // Convert the array buffer to a Blob object
//       //   const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    
//       //   // Create an object URL for the Blob
//       //   const imageURL = URL.createObjectURL(blob);
     
       
//       //   proccessed_image.src = imageURL
//       //   // Process the updated image received from the server
//       //   // For example, you can display the updated image on the client side
//       //   //displayUpdatedImage(updatedImage);
  
  
      
//       //  })
//       // .catch((error) => {
//       //   console.error("Error loading image:", error);
//       // });
//    }
  

//     const canvas = canvasRef.current;

//      // הוספת בדיקה
//      if (!canvas) {
//       console.error("Canvas reference is not available.");
//      return;
//      }

//     const ctx = canvas.getContext("2d");

//       loadImage(camera.video)
//         .then((image) => {
//           canvas.width = image.width;
//           canvas.height = image.height;
//           ctx.drawImage(image, 0, 0, image.width, image.height);

//           var canvasLeft = canvas.getBoundingClientRect().left;
//           var canvasRight = canvas.getBoundingClientRect().top;

//           canvas.style.backgroundImage = `url("${camera.video.src}")`;
//           canvas.style.backgroundSize = "cover";
//           canvas.style.backgroundRepeat = "no-repeat";
//           canvas.style.backgroundPosition = "center";
          

          

        
//         canvas.addEventListener("mousedown", e => {
//           const mouseX = e.clientX - canvasLeft + window.scrollX;
//           const mouseY = e.clientY - canvasRight + window.scrollY;

//           if (isDrawing) {
            
  
//             setClickPoints((prevClickPoints) => [
//               ...prevClickPoints,
//               { x: Math.round(mouseX), y: Math.round(mouseY) },
//             ]);
//             console.log(clickPoints);
//             //drawDot(mouseX, mouseY);  
//             renderWorkplaces();
//             drawInsertedPolygon();
//             drawInsertedPoints();
//           } else if (isSelecting) {
            
        
//             const selectedPolygonIndex = getSelectedPolygonIndex(mouseX, mouseY);
//             setSelectedPolygonIndex(selectedPolygonIndex);
//             if (selectedPolygonIndex !== -1) {
//               setDeleteBtnDisabled(false);
//               setSelectModeBtnText("Exit Select Mode");
//             } else {
//               setSelectModeBtnText("Enter Select Mode");
//             }
//           }
//         });


//       const drawPoly = (points, isSelected) => {
//         ctx.lineWidth = isSelected ? 4 : 2;
//         ctx.beginPath();
//         ctx.moveTo(points[0].x, points[0].y);
//         points.slice(1).forEach(point => {
//           ctx.lineTo(point.x, point.y);
//         });
//         ctx.closePath();
//         ctx.stroke();
//       };

//       const renderWorkplaces = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         workplaces.forEach((workplace, index) => {
//           if (workplace.points.length > 2) {
//             const isSelected = (index === selectedPolygonIndex);
//             drawPoly(workplace.points, isSelected);
//           }
//         });
//       };
      
//       const drawDot = (x, y) => {
//         ctx.beginPath();
//         ctx.arc(x, y, 4, 0, 2*Math.PI);
//         ctx.fill();
//       };
      
//       function drawInsertedPolygon(){
//         ctx.fillStyle = 'rgba(100,100,100,0.5)';
//         ctx.strokeStyle = "#df4b26";
//         ctx.lineWidth = 1;
        
//         ctx.beginPath();
//         ctx.moveTo(clickPoints[0].x, clickPoints[0].y);
//         for(var i=1; i < clickPoints.length; i++) { 
//           ctx.lineTo(clickPoints[i].x,clickPoints[i].y);
//         }
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//       };
      
//       function drawInsertedPoints(){
//         ctx.strokeStyle = "#df4b26"; 
//         ctx.lineJoin = "round"; 
//         ctx.lineWidth = 5; 
                    
//         for(var i=0; i < clickPoints.length; i++){ 
//           ctx.beginPath(); 
//           ctx.arc(clickPoints[i].x, clickPoints[i].y, 3, 0, 2 * Math.PI, false); 
//           ctx.fillStyle = '#ffffff'; 
//           ctx.fill(); 
//           ctx.lineWidth = 5; 
//           ctx.stroke(); 
//         }
//       };
      
      
//       const getSelectedPolygonIndex = (x, y) => {
//         for (var i = 0; i < workplaces.length; i++) {
//           if (isPointInPolygon(x, y, workplaces[i].points)) {
//             return i;
//           }
//         }
//         return -1;
//       };
      
//       const isPointInPolygon = (x, y, polygon) => {
//         var inside = false;
//         for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//           var xi = polygon[i].x,
//               yi = polygon[i].y;
//           var xj = polygon[j].x,
//               yj = polygon[j].y;
      
//           var intersect = ((yi > y) != (yj > y)) &&
//               (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//           if (intersect) inside = !inside;
//         }
      
//         return inside;
//       };
      
//       const getSelectedVertexIndex = (polygonIndex, x, y) => {
//         const polygon = workplaces[polygonIndex].points;
//         for (var i = 0; i < polygon.length; i++) {
//           var vertex = polygon[i];
//           var distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
//           if (distance <= 5) {
//             return i;
//           }
//         }
//         return -1;
//       };
      
//       const movePolygon = e => {
      
//         var mouseX = e.clientX - canvasLeft + window.scrollX;
//         var mouseY = e.clientY - canvasRight + window.scrollY; 
      
//         const deltaX = mouseX - canvasLeft;
//         const deltaY = mouseY - canvasRight;
//       debugger
//         workplaces[selectedPolygonIndex].points.forEach(point => {
//           point.x += deltaX;
//           point.y += deltaY;
//         });
      
//         renderWorkplaces();
//       };
      
//       const stopMovingPolygon = () => {
//         canvas.removeEventListener("mousemove", movePolygon);
//         canvas.removeEventListener("mouseup", stopMovingPolygon);
//       };
      
//       const moveVertex = e => {
//         var mouseX = e.clientX - canvasLeft + window.scrollX;
//         var mouseY = e.clientY - canvasRight + window.scrollY; 
      
//         workplaces[selectedPolygonIndex].points[selectedVertexIndex].x = mouseX;
//         workplaces[selectedPolygonIndex].points[selectedVertexIndex].y = mouseY;
      
//         renderWorkplaces();
//       };
      
//       const stopMovingVertex = () => {
//         canvas.removeEventListener("mousemove", moveVertex);
//         canvas.removeEventListener("mouseup", stopMovingVertex);
//       };

      
//       // Function to send the updated array of polygons to the server
      
      
  
//     renderWorkplaces();
//     });
  
  



//   }, [cameraID]);

      




//   return (
//     <div className="vid-container">
//       {user && (
//         <div className="background">
//           <h3 className="cam-item">Location: {camera.location}</h3>
//           <h4 className="cam-item">Junction: {camera.junction}</h4>
//           {imageSrc && (
//             <div>
//                <div style={{ display: "flex", margin: "10px 0" }}>
//                <canvas ref={canvasRef}></canvas>
                
//                <button id="done" onClick={handleDone}>
//                  Done
//                </button>

//                 <input
//                     type="text"
//                     id="polygonDesc"
//                     placeholder="desc"
//                     value={descInput}
//                     onChange={(e) => setDescInput(e.target.value)}
//                   />
//               </div>
//               <button onClick={handleSaveClick} disabled={workplaces.length === 0 || workplaces[0].points.length === 0}>
//                   Save Polygons to DB
//               </button>
//               <br />
//               <button id="cancel" onClick={handleCancel}>
//                 cancel
//               </button>
//               <button id="delete" onClick={handleDelete} disabled={deleteBtnDisabled}>
//                       delete
//                </button>
//               <button id="undo" onClick={undo}>
//                 undo vertex
//               </button>
              
//               <button id="drawModeBtn" onClick={handleDrawMode}>
//                  {drawModeBtnText}
//               </button>
//               <button
//                   id="selectModeBtn"
//                   onClick={handleSelectMode}
//                   disabled={selectModeBtnDisabled}
//                   style={{ backgroundColor: selectModeBtnBackgroundColor }}
//                    >
//                  {selectModeBtnText}
//                </button>
//               <br />
//               <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoAnalysis;







// import React, { useEffect, useState, useRef } from "react";
// import { loadImage } from "canvas";
// import { useParams } from "react-router-dom";


// const VideoAnalysis = () => {
  
//   const [camera, setCamera] = useState({});
//   const user = JSON.parse(localStorage.getItem("currentUser"));
//   const { cameraID } = useParams();
//   const [drawingMode, setDrawingMode] = useState(false);
//   const [imageSrc, setImageSrc] = useState("");
//   const canvasRef = useRef(null);
//   //const [drawingPoints, setDrawingPoints] = useState([]); // משתנה לאחסון הנקודות של הפוליגון

//   const [clickPoints, setClickPoints] = useState([]);
//   const [workplaces, setWorkplaces] = useState([]);
//   const [descInput, setDescInput] = useState("");
//   const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(-1);
//   const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);
//   const [selectModeBtnDisabled, setSelectModeBtnDisabled] = useState(true);
//   const [drawModeBtnDisabled, setDrawModeBtnDisabled] = useState(true);
//   const [selectModeBtnText, setSelectModeBtnText] = useState("Enter Select Mode");
//   const [drawModeBtnText, setDrawModeBtnText] = useState("Exit Drawing Mode");
//   const [selectModeBtnBackgroundColor, setSelectModeBtnBackgroundColor] = useState("");
  
  
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectedVertexIndex, setSelectedVertexIndex] = useState(-1);
  
          
  






//   // var clickPoints = [];
//   // var polygonsJSON = JSON.stringify(polygons);
//   // var workplaces = JSON.parse(polygonsJSON);
 
  
  

  

//   // const handlePolygonDrawing = () => {
//   //   // setDrawingMode(!drawingMode);
//   //   // if (!drawingMode) {
//   //   //   setDrawingPoints([]); // נקה את הנקודות כאשר נכנסים למצב ציור
//   //   // }
//   // };

//   // const addPointToPolygon = (x, y) => {
//   //   // if (drawingMode) {
//   //   //   setDrawingPoints([...drawingPoints, { x, y }]);
//   //   // }
//   // };

//   const handleDone = () => {
//     setWorkplaces((prevWorkplaces) => [
//       ...prevWorkplaces,
//       {
//         points: clickPoints,
//         desc: descInput,
//       },
//     ]);
//     console.log(workplaces);
//     setClickPoints([]);
//     setDescInput(""); // Clear the input value after clicking "Done"
//     renderWorkplaces();
//   };

//   const handleCancel = () => {
//     setClickPoints([]);
//     renderWorkplaces();
//   };

//   const undo = () => {
//     if (clickPoints.length > 0) {
//       const newClickPoints = [...clickPoints];
//       newClickPoints.pop();
//       setClickPoints(newClickPoints);
//       renderWorkplaces();
//       drawInsertedPolygon();
//       drawInsertedPoints();
//     }
//   };

//   const handleDelete = () => {
//     if (isSelecting && selectedPolygonIndex !== -1) {
//       setWorkplaces((prevWorkplaces) => {
//         const newWorkplaces = [...prevWorkplaces];
//         newWorkplaces.splice(selectedPolygonIndex, 1);
//         return newWorkplaces;
//       });
//     }
//     setSelectedPolygonIndex(-1);
//     setDeleteBtnDisabled(true);
//     renderWorkplaces();
//   };
  

//   const handleSaveClick = () => {
//     if (workplaces.length > 0 && workplaces[0].points.length > 0) {
//       updatePolygons();
//     } else {
//       console.log("No data to save.");
//     }
  
//     // const data = {
//     //   imageId: {{id}},
//     //   polygons: workplaces
//     // };
  
//     // Send the data to the server using fetch
//     // fetch('/updatePolygons', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json'
//     //   },
//     //   body: JSON.stringify(data)
//     // }).then(response => response.arrayBuffer())
//     // .then(arrayBuffer => {
//     //   // Convert the array buffer to a Blob object
//     //   const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
  
//     //   // Create an object URL for the Blob
//     //   const imageURL = URL.createObjectURL(blob);
   
     
//     //   proccessed_image.src = imageURL
//     //   // Process the updated image received from the server
//     //   // For example, you can display the updated image on the client side
//     //   //displayUpdatedImage(updatedImage);


    
//     //  })
//     // .catch((error) => {
//     //   console.error("Error loading image:", error);
//     // });
//  }


//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/cameraAPI/api/camera/${cameraID}`
//         );
//         if (response.status === 403) {
//           const errorMessage = await response.json();
//           alert(errorMessage);
//           return;
//         } else {
//           const data = await response.json();
//           setCamera(data[0]);
//           setImageSrc(data[0].video);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }
//     fetchData();
//   }, [cameraID]);

//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       loadImage(camera.video)
//         .then((image) => {
//           canvas.width = image.width;
//           canvas.height = image.height;
//           ctx.drawImage(image, 0, 0, image.width, image.height);

//           var canvasLeft = canvas.getBoundingClientRect().left;
//           var canvasRight = canvas.getBoundingClientRect().top;

//           canvas.style.backgroundImage = `url("${camera.video.src}")`;
//           canvas.style.backgroundSize = "cover";
//           canvas.style.backgroundRepeat = "no-repeat";
//           canvas.style.backgroundPosition = "center";
          

//           //ctx.globalCompositeOperation = "source-atop";
//           //ctx.fillStyle = "red";
//           // ציור הפוליגון
//         //   if (drawingPoints.length > 1) {
//         //     ctx.beginPath();
           
//         //     ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
//         //     drawingPoints.slice(1).forEach((point) => {
//         //       ctx.lineTo(point.x, point.y);
//         //     });
//         //     ctx.closePath();
//         //     ctx.fill();
//         //   }

//         // const handleCanvasMouseDown = (e) => {
//         //   const mouseX = e.clientX - canvasLeft + window.scrollX;
//         //   const mouseY = e.clientY - canvasRight + window.scrollY;
        
//         //   if (isDrawing) {
//         //     setClickPoints((prevClickPoints) => [
//         //       ...prevClickPoints,
//         //       { x: Math.round(mouseX), y: Math.round(mouseY) },
//         //     ]);
//         //     renderWorkplaces();
//         //     drawInsertedPolygon();
//         //     drawInsertedPoints();
//         //   } else if (isSelecting) {
//         //     const selectedPolygonIndex = getSelectedPolygonIndex(mouseX, mouseY);
//         //     setSelectedPolygonIndex(selectedPolygonIndex);
        
//         //     if (selectedPolygonIndex !== -1) {
//         //       setDeleteBtnDisabled(false);
//         //       setSelectModeBtnText("Exit Select Mode");
//         //     } else {
//         //       setSelectModeBtnText("Enter Select Mode");
//         //     }
//         //   }
//         // };
        
//         // ובהמשך, כדי להשתמש בפונקציה, אתה יכול להוסיף את האזנה לאירוע בקוד שלך, דוגמא:
//         // canvas.addEventListener("mousedown", handleCanvasMouseDown);
        

        
//         canvas.addEventListener("mousedown", e => {
//           const mouseX = e.clientX - canvasLeft + window.scrollX;
//           const mouseY = e.clientY - canvasRight + window.scrollY;

//           if (isDrawing) {
            
  
//             setClickPoints((prevClickPoints) => [
//               ...prevClickPoints,
//               { x: Math.round(mouseX), y: Math.round(mouseY) },
//             ]);
//             console.log(clickPoints);
//             //drawDot(mouseX, mouseY);  
//             renderWorkplaces();
//             drawInsertedPolygon();
//             drawInsertedPoints();
//           } else if (isSelecting) {
            
        
//             const selectedPolygonIndex = getSelectedPolygonIndex(mouseX, mouseY);
//             setSelectedPolygonIndex(selectedPolygonIndex);
//             if (selectedPolygonIndex !== -1) {
//               setDeleteBtnDisabled(false);
//               setSelectModeBtnText("Exit Select Mode");
//             } else {
//               setSelectModeBtnText("Enter Select Mode");
//             }
//           }
//         });

//         // doneBtn.addEventListener('click', () => {
//         //   isDrawing = false;
//         //   workplaces.push({
//         //     points: clickPoints,
//         //     desc: polygonDesc.value
//         //   });
//         //   console.log(workplaces);
//         //   clickPoints = [];
//         //   renderWorkplaces();
//         // });

        
        
//         // cancelBtn.addEventListener('click', () => {
//         //   clickPoints = [];
//         //   renderWorkplaces();
//         // });

//       //   deleteBtn.addEventListener('click', () => {
//       //     if (isSelecting && selectedPolygonIndex !== -1) {
//       //         workplaces.splice(selectedPolygonIndex,1)
//       //     }
//       //    selectedPolygonIndex = -1
//       //    renderWorkplaces();
//       //    deleteBtn.disabled = true;
//       //  });

//       //  function undo(){
//       //   if(clickPoints.length > 0){
//       //       clickPoints.splice(clickPoints.length -1,1)
              
//       //         renderWorkplaces();
//       //         drawInsertedPolygon();
//       //        drawInsertedPoints();
            
//       //     }
//       // }

//       // drawModeBtn.addEventListener('click', () => {
//       //   isDrawing = !isDrawing;
//       //   if (isDrawing) {
//       //     drawModeBtn.textContent = "Exit Drawing Mode";
//       //     selectModeBtn.disabled = true;
//       //     selectModeBtn.textContent = "Enter Select Mode";
//       //     isSelecting = false;
//       //     selectModeBtn.style.backgroundColor = "";
//       //     canvas.removeEventListener("mouseup", movePolygon);
//       //    // canvas.removeEventListener("mouseup", stopMovingPolygon);
//       //     canvas.removeEventListener("mousemove", moveVertex);
//       //     canvas.removeEventListener("mouseup", stopMovingVertex);
//       //   } else {
//       //     drawModeBtn.textContent = "Enter Drawing Mode";
//       //     selectModeBtn.disabled = false;
//       //   }
//       // });
//       const handleDrawMode = () => {
//         setIsDrawing((prevIsDrawing) => !prevIsDrawing);
      
//         if (!isDrawing) {
//           setDrawModeBtnText("Exit Drawing Mode");
//           setSelectModeBtnDisabled(true);
//           setSelectModeBtnText("Enter Select Mode");
//           setIsSelecting(false);
//           setSelectModeBtnBackgroundColor("");
//           canvas.removeEventListener("mouseup", movePolygon);
//           canvas.removeEventListener("mousemove", moveVertex);
//           canvas.removeEventListener("mouseup", stopMovingVertex);

//         } else {
//           setDrawModeBtnText("Enter Drawing Mode");
//           setSelectModeBtnDisabled(false);
        
//         }
//       };
//       const handleSelectMode = () => {
//         setIsSelecting((prevIsSelecting) => !prevIsSelecting);
      
//         if (!isSelecting) {
//           setSelectModeBtnText("Exit Select Mode");
//           setDrawModeBtnDisabled(true);
//           setDrawModeBtnText("Enter Drawing Mode");
//           setIsDrawing(false);
//           setSelectModeBtnBackgroundColor("");
//           canvas.removeEventListener("mouseup", movePolygon);
//           canvas.removeEventListener("mousemove", moveVertex);
//           canvas.removeEventListener("mouseup", stopMovingVertex);
//         } else {
//           setSelectModeBtnText("Enter Select Mode");
//           setDrawModeBtnDisabled(false);
//         }
//       };

//       // selectModeBtn.addEventListener('click', () => {
//       //   isSelecting = !isSelecting;
//       //   if (isSelecting) {
//       //     selectModeBtn.textContent = "Exit Select Mode";
//       //     drawModeBtn.disabled = true;
//       //     drawModeBtn.textContent = "Enter Drawing Mode";
//       //     isDrawing = false;
//       //     selectModeBtn.style.backgroundColor = "";
//       //     canvas.removeEventListener("mouseup", movePolygon);
//       //    // canvas.removeEventListener("mouseup", stopMovingPolygon);
//       //     canvas.removeEventListener("mousemove", moveVertex);
//       //     canvas.removeEventListener("mouseup", stopMovingVertex);
//       //   } else {
//       //     selectModeBtn.textContent = "Enter Select Mode";
//       //     drawModeBtn.disabled = false;
//       //   }
//       // });

//       const drawPoly = (points, isSelected) => {
//         ctx.lineWidth = isSelected ? 4 : 2;
//         ctx.beginPath();
//         ctx.moveTo(points[0].x, points[0].y);
//         points.slice(1).forEach(point => {
//           ctx.lineTo(point.x, point.y);
//         });
//         ctx.closePath();
      
//         // // Set fill style to semi-transparent red or green
//         // ctx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.5)' : '#5eeb4863';
//         // ctx.fill();
      
//         ctx.stroke();
//       };

//       const renderWorkplaces = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         workplaces.forEach((workplace, index) => {
//           if (workplace.points.length > 2) {
//             const isSelected = (index === selectedPolygonIndex);
//             drawPoly(workplace.points, isSelected);
//           }
//         });
//       };
      
//       const drawDot = (x, y) => {
//         ctx.beginPath();
//         ctx.arc(x, y, 4, 0, 2*Math.PI);
//         ctx.fill();
//       };
      
//       function drawInsertedPolygon(){
//         ctx.fillStyle = 'rgba(100,100,100,0.5)';
//         ctx.strokeStyle = "#df4b26";
//         ctx.lineWidth = 1;
        
//         ctx.beginPath();
//         ctx.moveTo(clickPoints[0].x, clickPoints[0].y);
//         for(var i=1; i < clickPoints.length; i++) { 
//           ctx.lineTo(clickPoints[i].x,clickPoints[i].y);
//         }
//         ctx.closePath();
//         ctx.fill();
//         ctx.stroke();
//       };
      
//       function drawInsertedPoints(){
//         ctx.strokeStyle = "#df4b26"; 
//         ctx.lineJoin = "round"; 
//         ctx.lineWidth = 5; 
                    
//         for(var i=0; i < clickPoints.length; i++){ 
//           ctx.beginPath(); 
//           ctx.arc(clickPoints[i].x, clickPoints[i].y, 3, 0, 2 * Math.PI, false); 
//           ctx.fillStyle = '#ffffff'; 
//           ctx.fill(); 
//           ctx.lineWidth = 5; 
//           ctx.stroke(); 
//         }
//       };
      
      
//       const getSelectedPolygonIndex = (x, y) => {
//         for (var i = 0; i < workplaces.length; i++) {
//           if (isPointInPolygon(x, y, workplaces[i].points)) {
//             return i;
//           }
//         }
//         return -1;
//       };
      
//       const isPointInPolygon = (x, y, polygon) => {
//         var inside = false;
//         for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//           var xi = polygon[i].x,
//               yi = polygon[i].y;
//           var xj = polygon[j].x,
//               yj = polygon[j].y;
      
//           var intersect = ((yi > y) != (yj > y)) &&
//               (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//           if (intersect) inside = !inside;
//         }
      
//         return inside;
//       };
      
//       const getSelectedVertexIndex = (polygonIndex, x, y) => {
//         const polygon = workplaces[polygonIndex].points;
//         for (var i = 0; i < polygon.length; i++) {
//           var vertex = polygon[i];
//           var distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
//           if (distance <= 5) {
//             return i;
//           }
//         }
//         return -1;
//       };
      
//       const movePolygon = e => {
      
//         var mouseX = e.clientX - canvasLeft + window.scrollX;
//         var mouseY = e.clientY - canvasRight + window.scrollY; 
      
//         const deltaX = mouseX - canvasLeft;
//         const deltaY = mouseY - canvasRight;
//       debugger
//         workplaces[selectedPolygonIndex].points.forEach(point => {
//           point.x += deltaX;
//           point.y += deltaY;
//         });
      
//         renderWorkplaces();
//       };
      
//       const stopMovingPolygon = () => {
//         canvas.removeEventListener("mousemove", movePolygon);
//         canvas.removeEventListener("mouseup", stopMovingPolygon);
//       };
      
//       const moveVertex = e => {
//         var mouseX = e.clientX - canvasLeft + window.scrollX;
//         var mouseY = e.clientY - canvasRight + window.scrollY; 
      
//         workplaces[selectedPolygonIndex].points[selectedVertexIndex].x = mouseX;
//         workplaces[selectedPolygonIndex].points[selectedVertexIndex].y = mouseY;
      
//         renderWorkplaces();
//       };
      
//       const stopMovingVertex = () => {
//         canvas.removeEventListener("mousemove", moveVertex);
//         canvas.removeEventListener("mouseup", stopMovingVertex);
//       };
      
      
      
//       // Function to send the updated array of polygons to the server
      
      
  
//     renderWorkplaces();
//     });
  
  




//   return (
//     <div className="vid-container">
//       {user && (
//         <div className="background">
//           <h3 className="cam-item">Location: {camera.location}</h3>
//           <h4 className="cam-item">Junction: {camera.junction}</h4>
//           {imageSrc && (
//             <div>
//               {/* <button onClick={handlePolygonDrawing}>
//                 {drawingMode ? "Exit Polygon Drawing Mode" : "Enter Polygon Drawing Mode"}
//               </button> */}
//               {/* {drawingMode && (
//                 <canvas
//                   ref={canvasRef}
//                   style={{ border: "1px solid black" }}
//                   onClick={(e) => {
//                     addPointToPolygon(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                   }}
//                 ></canvas>
//               )} */}

//                <div style={{ display: "flex", margin: "10px 0" }}>
//                <button id="done" onClick={handleDone}>
//                  Done
//                </button>

//                 <input
//                     type="text"
//                     id="polygonDesc"
//                     placeholder="desc"
//                     value={descInput}
//                     onChange={(e) => setDescInput(e.target.value)}
//                   />
//               </div>
//               <button onClick={handleSaveClick} disabled={workplaces.length === 0 || workplaces[0].points.length === 0}>
//                   Save Polygons to DB
//               </button>
//               <br />
//               <button id="cancel" onClick={handleCancel}>
//                 cancel
//               </button>
//               <button id="delete" onClick={handleDelete} disabled={deleteBtnDisabled}>
//                       delete
//                </button>
//               <button id="undo" onClick={undo}>
//                 undo vertex
//               </button>
              
//               <button id="drawModeBtn" onClick={handleDrawMode}>
//                  {drawModeBtnText}
//               </button>
//               <button
//                   id="selectModeBtn"
//                   onClick={handleSelectMode}
//                   disabled={selectModeBtnDisabled}
//                   style={{ backgroundColor: selectModeBtnBackgroundColor }}
//                    >
//                  {selectModeBtnText}
//                </button>
//               <br />
//               <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoAnalysis;



