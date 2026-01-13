import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function RegisterPerson() {
  const [person, setPerson] = useState({
    name: "",
    pan_id: "",
    percentage: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/customer/register",
        person,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("Person registered successfully!", {
          style: { background: "#64FFDA", color: "#0A192F" },
        });
        setPerson({ name: "", pan_id: "", percentage: "" });
      } else {
        toast.error(res.data.message || "Error registering person", {
          style: { background: "#0A192F", color: "#FFFFFF" },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error", {
        style: { background: "#0A192F", color: "#FFFFFF" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg bg-whitepure rounded-2xl p-8 shadow-xl space-y-4"
      >
        <h2 className="text-2xl font-semibold text-navy text-center mb-4">
          Register Person
        </h2>

        <div>
          <label className="block text-navy font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={person.name}
            onChange={handleChange}
            placeholder="Parmar Pranjal"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">PAN ID</label>
          <input
            type="text"
            name="pan_id"
            value={person.pan_id}
            onChange={handleChange}
            placeholder="2563415463"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">Percentage</label>
          <input
            type="number"
            name="percentage"
            value={person.percentage}
            onChange={handleChange}
            placeholder="52"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 rounded-xl bg-sky text-navy font-semibold hover:opacity-90 disabled:opacity-60 mt-4"
        >
          {loading ? "Submitting..." : "Register Person"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPerson;
