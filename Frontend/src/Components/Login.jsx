import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const API_BASE_URL = import.meta.env.VITE_URL;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required", {
        style: {
          background: "#111111",
          color: "#ffffff",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/register`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        sessionStorage.setItem("isAuth", "true");
        navigate("/home")
      } else {
        toast.error("Incorrect password", {
          style: {
            background: "#111111",
            color: "#ffffff",
          },
        });
      }
    } catch (error) {
      toast.error("Server error", {
        style: {
          background: "#111111",
          color: "#ffffff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-white">
        <form
          onSubmit={handleLogin}
          className="w-[320px] bg-gray-100 p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-black text-center mb-8">
            Admin Login
          </h2>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-6 rounded-xl
                       bg-white text-black placeholder-gray-500
                       outline-none focus:ring-2 focus:ring-black/20"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl
                       bg-black text-white font-semibold
                       hover:opacity-90 transition disabled:opacity-60"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;