import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar/Navbar";

import "react-toastify/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default App;
