import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login(){
  const [inputsName, setInputsName] = useState({});
  const [inputsPass, setInputsPass] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange1 = (event) => {
    const name = event.target.name;
    

    const value = event.target.value;
    

    setInputsName((values) => ({ ...values, [name]: value }));
    
  };
  const handleChange2 = (event) => {
    const name = event.target.name;
    

    const value = event.target.value;
    

    setInputsPass((values) => ({ ...values, [name]: value }));
    
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
            username: inputsName.username,
            password: inputsPass.password,
          }),
        }
      );
       const data = await response.json();
      //  console.log("data");
      //  console.log(data);
       
      

      if (response.ok) {
        
        // Authentication successful
         try{
           const response = await fetch(`http://localhost:3000/userAPI/api/users/login/${inputsName.username}`);

           const user = await response.json();
          //  console.log("user");
          //  console.log(user[0]);
           

           const currentUser = {
            
            id: user[0]["ID"],
            name: user[0]["name"],
            username:user[0]["username"],
            userRank:user[0]["userRank"]
          };
          console.log("currentUser");
          console.log(currentUser);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        navigate(`/Users`);
         }catch (error) {
          //           console.error(error);
           }
        
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
            value={inputsName.username || ""}
            onChange={handleChange1}
          />
        </div>
        <h2>Please enter your password:</h2>
        <div className="password-input">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={inputsPass.password || ""}
            onChange={handleChange2}
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



