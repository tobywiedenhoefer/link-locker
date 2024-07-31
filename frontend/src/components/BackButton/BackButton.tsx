import { useNavigate } from "react-router";

import "./BackButton.css";
import { useEffect } from "react";

export default function BackButton() {
  const navigate = useNavigate();
  useEffect(() => {}, []);
  return navigate.length > 1 ? (
    <button className="floating-back-button" onClick={() => navigate(-1)}>
      Back
    </button>
  ) : null;
}
