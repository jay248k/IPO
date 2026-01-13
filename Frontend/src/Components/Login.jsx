import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required", {
        style: {
          background: "#0A192F",
          color: "#FFFFFF",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/admin/register",
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        sessionStorage.setItem("isAuth", "true");

        toast.success(res.data.message || "Login Success", {
          style: {
            background: "#64FFDA",
            color: "#0A192F",
          },
        });

        setTimeout(() => navigate("/home"), 1200);
      } else {
        toast.error("Incorrect password", {
          style: {
            background: "#0A192F",
            color: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      toast.error("Server error", {
        style: {
          background: "#0A192F",
          color: "#FFFFFF",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <form
        onSubmit={handleLogin}
        className="w-[320px] bg-whitepure p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-navy text-center mb-6">
          Admin Login
        </h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-5 rounded-xl bg-gray-100 text-navy
                     outline-none focus:ring-2 focus:ring-sky/60"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-sky text-navy
                     font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
