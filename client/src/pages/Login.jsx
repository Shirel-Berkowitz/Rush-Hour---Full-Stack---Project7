import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login(){
  const [inputs, setInputs] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {
    try {
      const response = await fetch(
        "http://localhost:3000/userAPI/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: inputs.username,
            password: inputs.password,
          }),
        }
      );
      const data = await response.json();
      console.log("data");
      console.log(data);
      

      if (response.ok) {
        
        // Authentication successful
        
        const currentUser = {
          id: data.id,
          name: data.name,
        };
        console.log(currentUser);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        navigate(`/Users`);
      } else {
        // Authentication failed
        alert("Username or password is incorrect");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="background1">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
          />
        </div>
        <h2>Please enter your password:</h2>
        <div className="password-input">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
          <br />
          <div>
            <span> Don't have an account? </span>
            <Link to="/Register">Sign up</Link>
          </div>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}



// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./App.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// const Login = () => {
//   const [inputs, setInputs] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setInputs((values) => ({ ...values, [name]: value }));
//   };

//   async function fetchData() {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/users/${inputs.username}/password`
//       );
//       const data = await response.json();
//       console.log(data);
//       console.log(data[0]["password"]);

//       let exist = false;
//       console.log(inputs.password);

//       if (inputs.password === data[0]["password"]) {
//         try {
//           const response = await fetch(
//             `http://localhost:3000/api/users/${data[0]["username"]}/name`
//           );
//           const user = await response.json();
//           console.log(user);

//           // Fetching user's name was successful, proceed with navigation
//           const currentUser = {
//             id: data[0]["id"],
//             name: user,
//           };
//           localStorage.setItem("currentUser", JSON.stringify(currentUser));
      
//           exist = true;
//           navigate(`/Users`);
//         } catch (error) {
//           console.error(error);
//         }
//       }

//       if (exist === false) {
//         alert("Username or password is incorrect");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(inputs);
//     fetchData();
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       fetchData();
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="background1">
//       <form onSubmit={handleSubmit}>
//         <h1>Login</h1>
//         <div className="form-group">
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={inputs.username || ""}
//             onChange={handleChange}
//           />
//         </div>
//         <h2>Please enter your password:</h2>
//         <div className="password-input">
//           <label htmlFor="password">Password:</label>
//           <input
//             type={showPassword ? "text" : "password"}
//             id="password"
//             name="password"
//             value={inputs.password || ""}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//           />
//           <button
//             type="button"
//             className="password-toggle"
//             onClick={togglePasswordVisibility}
//           >
//             <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//           </button>
//           <br />
//           <div>
//             <span> Don't have an account? </span>
//             <Link to="/Register">Sign up</Link>
//           </div>
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
