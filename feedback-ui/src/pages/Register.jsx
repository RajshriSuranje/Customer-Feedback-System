import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./../css/Register.css";

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {

    if (
      registerData.username.trim() === "" ||
      registerData.email.trim() === "" ||
      registerData.password === "" ||
      registerData.confirmPassword === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields",
      });

      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
      });

      return;
    }


    try {

      const response = await fetch(
        "http://localhost:8080/api/v1/user/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            confirmPassword: registerData.confirmPassword,
          }),
        }
      );

      const responseText = await response.text();

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          data = responseText;
        }
      }


      console.log("Registration Response:", data);
      console.log("Registration Status:", response.status);

      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text:
            typeof data === "string"
              ? data
              : data?.message || "User registered successfully.",
        }).then(() => {
          navigate("/");
        });

        return;
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          typeof data === "string"
            ? data
            : data?.message || `Server returned ${response.status}`,
      });

    } catch (error) {

      console.error("Registration Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    }
  };


  return (
    <div className="register-container">

      <div className="register-box">

        <h2>Register</h2>


        <input
          type="text"
          name="username"
          placeholder="Username"
          value={registerData.username}
          onChange={handleChange}
        />


        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleChange}
        />


        <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerData.password}
          onChange={handleChange}
        />


        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={registerData.confirmPassword}
          onChange={handleChange}
        />


        <button onClick={registerUser}>
          Register
        </button>


        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;