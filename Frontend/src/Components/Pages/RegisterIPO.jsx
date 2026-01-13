import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function RegisterIPO() {
  const [ipo, setIpo] = useState({
    name: "",
    price: "",
    starting_date: "",
    ending_date: "",
    listing: "",
    gmp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setIpo({ ...ipo, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/ipo/register",
        ipo,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("IPO registered successfully!", {
          style: { background: "#64FFDA", color: "#0A192F" },
        });
        setIpo({ name: "", price: "", starting_date: "", ending_date: "", listing: "", gmp: "" });
      } else {
        toast.error(res.data.message || "Error registering IPO", {
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
          Register IPO
        </h2>

        <div>
          <label className="block text-navy font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="name"
            value={ipo.name}
            onChange={handleChange}
            placeholder="ABC Technologies Ltd"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={ipo.price}
            onChange={handleChange}
            placeholder="15000"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">Starting Date</label>
          <input
            type="date"
            name="starting_date"
            value={ipo.starting_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">Ending Date</label>
          <input
            type="date"
            name="ending_date"
            value={ipo.ending_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">Listing Date</label>
          <input
            type="date"
            name="listing"
            value={ipo.listing}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-navy font-medium mb-1">GMP</label>
          <input
            type="number"
            name="gmp"
            value={ipo.gmp}
            onChange={handleChange}
            placeholder="45"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 rounded-xl bg-sky text-navy font-semibold hover:opacity-90 disabled:opacity-60 mt-4"
        >
          {loading ? "Submitting..." : "Register IPO"}
        </button>
      </form>
    </div>
  );
}

export default RegisterIPO;
