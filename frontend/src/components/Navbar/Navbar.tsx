import { useNavigate } from "react-router-dom";

import "./Navbar.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { token } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div
        className="navbar-title"
        onClick={() => navigate("/", { replace: true })}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.code === "Space") {
            navigate("/", { replace: true });
          }
        }}
        tabIndex={0}
      >
        {!token ? "Link Locker" : "Your Link Locker"}
      </div>
      <ul className={`navbar-links`}>
        {!token ? (
          <>
            <li>
              <a href="/create-an-account">Create an Account</a>
            </li>
            <li>
              <a href="/login">Log In</a>
            </li>
          </>
        ) : (
          <li>
            <a href="/logout">Log Out</a>
          </li>
        )}
      </ul>
    </nav>
  );
}
