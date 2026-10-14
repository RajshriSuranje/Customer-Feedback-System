import "./../css/AdminDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminDashboard() {
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllFeedback = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/admin/feedback",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

      console.log("Admin Feedback Response:", data);
      console.log("Admin Feedback Status:", response.status);

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

      setFeedbackList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Admin Feedback Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFeedback();
  }, []);

  const handleView = (item) => {
    Swal.fire({
      title: "Feedback",
      html: `
        <p><strong>Username:</strong> ${item.user?.username || "N/A"}</p>
        <p><strong>Feedback:</strong></p>
        <p>${item.feedback}</p>
        <p><strong>Date:</strong> ${item.date || "N/A"}</p>
      `,
      icon: "info",
    });
  };

  const handleEdit = async (item) => {
    const result = await Swal.fire({
      title: "Edit Feedback",

      input: "textarea",

      inputLabel: "Feedback",

      inputValue: item.feedback,

      inputPlaceholder: "Enter feedback...",

      showCancelButton: true,

      confirmButtonText: "Update",

      cancelButtonText: "Cancel",

      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Feedback cannot be empty";
        }

        return null;
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const url =
        `http://localhost:8080/api/v1/admin/feedback/${item.id}` +
        `?feedback=${encodeURIComponent(result.value)}`;

      const response = await fetch(url, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          data = responseText;
        }
      }

      console.log("Update Response:", data);

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            typeof data === "string"
              ? data
              : data?.message || `Server returned ${response.status}`,
        });

        return;
      }

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Feedback updated successfully.",
      });

      // Refresh table
      getAllFeedback();
    } catch (error) {
      console.error("Update Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",

      text: "You want to delete this feedback?",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/feedback/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseText = await response.text();

      let data = responseText;

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data || `Server returned ${response.status}`,
        });

        return;
      }

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Feedback deleted successfully.",
      });

      // Refresh table
      getAllFeedback();
    } catch (error) {
      console.error("Delete Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    navigate("/");
  };

  return (
    <div className="admin-feedback-page">
      <div className="admin-feedback-container">
        <h1>Admin Feedback Dashboard</h1>

        {loading ? (
          <p>Loading feedback...</p>
        ) : feedbackList.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>

                <th>Username</th>

                <th>Feedback</th>

                <th>Date</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {feedbackList.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>{item.user?.username || "N/A"}</td>

                  <td className="feedback-text">{item.feedback}</td>

                  <td>{item.date || "N/A"}</td>

                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleView(item)}
                    >
                      View
                    </button>

                    <button
                      className="action-button"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="action-button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
