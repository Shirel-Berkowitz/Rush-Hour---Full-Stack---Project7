import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  async function fetchData() {
    const user = {
      name: inputs.name,
      username: inputs.username,
      userRank: inputs.userRank,
    };
    console.log("1");


    try {
      const response = await fetch(`http://localhost:3000/userAPI/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log(data);
      //console.log(data[0]);

      const password = inputs.password;
      console.log("password");
      console.log(password);
      

      const userResponse = await fetch(
        `http://localhost:3000/userAPI/api/users/login/${inputs.username}`,
       
      );

      const userData = await userResponse.json();
      console.log(userData);
      console.log(userData[0].ID);

      const passwordResponse = await fetch(
        `http://localhost:3000/userAPI/api/users/${userData[0].ID}/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({password: password}),
        }
      );

      const passwordData = await passwordResponse.json();
      console.log(passwordData);

      
      navigate(`/Admin`);
      alert("The addition of the user has been recorded in the system");
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    if (inputs.password !== inputs.validationPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    fetchData();
  };


  return (
    <div className="background1">
      <form onSubmit={handleSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputs.email || ""}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* <div className="form-group">
          <label htmlFor="username">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={inputs.phone || ""}
            onChange={handleChange}
            required
          />
        </div> */}

<div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rank">Rank:</label>
          <input
            type="text"
            id="rank"
            name="userRank"
            value={inputs.userRank || ""}
            onChange={handleChange}
            required
          />
        </div>
        
       
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Validation Password:</label>
          <input
            type="password"
            id="validationPassword"
            name="validationPassword"
            value={inputs.validationPassword || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Register;
