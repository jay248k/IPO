import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Pages/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import Layout from "./Components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterIPO from "./Components/Pages/RegisterIPO";
import RegisterPerson from "./Components/Pages/RegisterPerson";
import Profile from "./Components/Pages/Profile";
import AllPerson from "./Components/Pages/AllPerson";
import IPOList from "./Components/Pages/IPOList";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar closeButton={false} />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/register-ipo" element={<ProtectedRoute><Layout><RegisterIPO /></Layout></ProtectedRoute>} />
        <Route path="/register-person" element={<ProtectedRoute><Layout><RegisterPerson /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/all-person" element={<ProtectedRoute><Layout><AllPerson /></Layout></ProtectedRoute>} />
        <Route path="/ipo/:id" element={<ProtectedRoute><Layout><IPOList /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
