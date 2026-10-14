import "./../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

function Login() {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e) => {

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

  };

  const loginUser = async () => {

    // Check empty fields
    if (
      loginData.userName.trim() === "" ||
      loginData.password.trim() === ""
    ) {

      Swal.fire({
        icon: "warning",
        title: "Please fill all fields",
      });

      return;
    }

    try {

      const res = await fetch(
        "http://localhost:8080/api/v1/user/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        }
      );

      // Check HTTP response
      if (!res.ok) {

        const errorText = await res.text();

        console.log(
          "Login Error Status:",
          res.status
        );

        console.log(
          "Login Error Response:",
          errorText
        );

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: `Server returned ${res.status}`,
        });

        return;
      }

      // Convert response to JSON
      const data = await res.json();

      console.log(
        "Login Response:",
        data
      );

      // Successful login
      if (data.data && data.data.token) {

        // Store JWT
        localStorage.setItem(
          "token",
          data.data.token
        );

        // Store role
        localStorage.setItem(
          "role",
          data.data.role
        );

        // Store user id
        localStorage.setItem(
          "userId",
          data.data.id
        );

        // VERY IMPORTANT
        // Store username
        localStorage.setItem(
          "username",
          loginData.userName
        );

        console.log(
          "Username saved:",
          loginData.userName
        );

        console.log(
          "Role saved:",
          data.data.role
        );

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        // Navigate according to role
        if (data.data.role === "ADMIN") {

          console.log("Navigate Admin");

          navigate("/admin");

        } else {

          console.log("Navigate User");

          navigate("/UserDashboard");
        }

      } else {

        Swal.fire({
          icon: "error",
          title: data.message || "Login failed",
        });

      }

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    }
  };

  return (

    <div className="login-container">

      <div className="login-box">

        <h2>Login</h2>

        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={loginData.userName}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
        />

        <button onClick={loginUser}>
          Log In
        </button>

        <p>
          Don't have an account?
          <Link to="/register">
            {" "}Sign Up
          </Link>
        </p>

      </div>

    </div>

  );
}

export default Login;