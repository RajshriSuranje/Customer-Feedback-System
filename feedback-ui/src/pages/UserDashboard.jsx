import "./../css/UserDashboard.css";
import { useState } from "react";
import Swal from "sweetalert2";

function UserDashboard() {

  const [feedback, setFeedback] = useState("");
  const [activeButton, setActiveButton] = useState("add");
  const [feedbackId, setFeedbackId] = useState(null);


  // Get username from JWT
  const getUsernameFromToken = () => {

    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.username;

    } catch (error) {

      console.error("Invalid JWT:", error);

      return null;
    }
  };


  // ADD / EDIT SUBMIT
  const handleSubmit = async () => {

    if (feedback.trim() === "") {

      Swal.fire({
        icon: "warning",
        title: "Please enter your feedback",
      });

      return;
    }

    const token = localStorage.getItem("token");

    // First try localStorage
    let username = localStorage.getItem("username");

    // If username is null, get it from JWT
    if (!username) {
      username = getUsernameFromToken();
    }

    console.log("Username:", username);
    console.log("Token:", token);


    if (!token || !username) {

      Swal.fire({
        icon: "error",
        title: "Login information missing",
        text: "Please login again.",
      });

      return;
    }


    try {

      let response;


      // =========================
      // EDIT FEEDBACK
      // =========================

      if (activeButton === "edit" && feedbackId) {

        const url =
          `http://localhost:8080/api/v1/userfeedback/update/${feedbackId}` +
          `?username=${encodeURIComponent(username)}` +
          `&feedback=${encodeURIComponent(feedback)}`;

        console.log("EDIT URL:", url);

        response = await fetch(
          url,
          {
            method: "PUT",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      // =========================
      // ADD FEEDBACK
      // =========================

      else {

        const url =
          `http://localhost:8080/api/v1/userfeedback/add` +
          `?username=${encodeURIComponent(username)}` +
          `&feedback=${encodeURIComponent(feedback)}`;

        console.log("ADD URL:", url);

        response = await fetch(
          url,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      // =========================
      // RESPONSE HANDLE
      // =========================

      const responseText = await response.text();

      let data = null;

      if (responseText) {

        try {
          data = JSON.parse(responseText);
        } catch (error) {
          data = responseText;
        }
      }


      console.log("Feedback Response:", data);
      console.log("Status:", response.status);


      if (!response.ok) {

        Swal.fire({
          icon: "error",
          title: "Operation Failed",
          text:
            typeof data === "string"
              ? data
              : data?.message || `Server returned ${response.status}`,
        });

        return;
      }


      // =========================
      // EDIT SUCCESS
      // =========================

      if (activeButton === "edit") {

        Swal.fire({
          icon: "success",
          title: "Feedback Updated",
          text: "Your feedback has been updated successfully.",
        });
      }


      // =========================
      // ADD SUCCESS
      // =========================

      else {

        Swal.fire({
          icon: "success",
          title: "Feedback Submitted",
          text: "Your feedback has been submitted successfully.",
        });
      }


      setFeedback("");
      setFeedbackId(null);
      setActiveButton("add");

    } catch (error) {

      console.error("Feedback Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    }
  };


  // =========================
  // ADD BUTTON
  // =========================

  const handleAddFeedback = () => {

    setActiveButton("add");
    setFeedback("");
    setFeedbackId(null);
  };


  // =========================
  // EDIT BUTTON
  // =========================

  const handleEditFeedback = async () => {

    setActiveButton("edit");

    const token = localStorage.getItem("token");

    let username = localStorage.getItem("username");

    // Get username from JWT if localStorage is null
    if (!username) {
      username = getUsernameFromToken();
    }

    console.log("Edit Username:", username);


    if (!token || !username) {

      Swal.fire({
        icon: "error",
        title: "Login information missing",
        text: "Please login again.",
      });

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/v1/userfeedback/my?username=${encodeURIComponent(username)}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
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


      console.log("My Feedback:", data);


      if (!response.ok) {

        Swal.fire({
          icon: "error",
          title: "Failed to load feedback",
          text:
            typeof data === "string"
              ? data
              : data?.message || `Server returned ${response.status}`,
        });

        return;
      }


      if (!Array.isArray(data) || data.length === 0) {

        Swal.fire({
          icon: "info",
          title: "No Feedback Found",
        });

        setFeedback("");
        setFeedbackId(null);

        return;
      }


      // Latest feedback
      const latestFeedback = data[data.length - 1];

      console.log("Latest Feedback:", latestFeedback);


      setFeedback(latestFeedback.feedback);
      setFeedbackId(latestFeedback.id);

    } catch (error) {

      console.error("Feedback Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    }
  };


  return (

    <div className="feedback-page">

      <div className="feedback-container">

        <h2>Feedback</h2>


        <div className="feedback-buttons">

          <button
            className={activeButton === "add" ? "active" : ""}
            onClick={handleAddFeedback}
          >
            Add Feedback
          </button>


          <button
            className={activeButton === "edit" ? "active" : ""}
            onClick={handleEditFeedback}
          >
            Edit Feedback
          </button>

        </div>


        <label>Your Feedback:</label>


        <textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />


        <button
          className="submit-feedback"
          onClick={handleSubmit}
        >
          Submit
        </button>

      </div>

    </div>
  );
}

export default UserDashboard;