import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h1>Profile</h1>
            <p>View your account information.</p>
          </div>

          <Link to="/dashboard" className="profile-back-link">
            Back to Dashboard
          </Link>
        </div>

        <div className="profile-avatar">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span>Name</span>
            <strong>{user?.name || "User"}</strong>
          </div>

          <div className="profile-detail">
            <span>Email</span>
            <strong>{user?.email || "Not available"}</strong>
          </div>

          <div className="profile-detail">
            <span>Account Status</span>
            <strong>Active</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;