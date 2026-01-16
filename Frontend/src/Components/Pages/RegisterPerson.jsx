import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function RegisterPerson() {
  const API_BASE_URL = import.meta.env.VITE_URL;
  const [person, setPerson] = useState({
    name: "",
    pan_id: "",
    percentage: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!person.name) newErrors.name = "Please enter name";
    if (!person.pan_id) newErrors.pan_id = "Please enter PAN ID";
    if (!person.percentage) newErrors.percentage = "Please enter percentage";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/customer/register`,
        person,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("Person registered successfully!");
        setPerson({ name: "", pan_id: "", percentage: "" });
      } else {
        toast.error(res.data.message || "Error registering person");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      {/* FULL SCREEN LOADER */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 font-bold text-gray-800 tracking-tight">Registering Person...</p>
        </div>
      )}

      {/* RESPONSIVE FORM CONTAINER */}
      <form
        onSubmit={handleRegister}
        className={`w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 transition-all duration-300 ${
          loading ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800">
            Register Person
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">Add a new profile to the system</p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={person.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.name ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">{errors.name}</p>}
          </div>

          {/* PAN ID */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              PAN Identification
            </label>
            <input
              type="text"
              name="pan_id"
              value={person.pan_id}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className={`w-full px-5 py-3.5 bg-gray-50 border uppercase ${errors.pan_id ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all`}
            />
            {errors.pan_id && <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">{errors.pan_id}</p>}
          </div>

          {/* Percentage */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Share Percentage (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="percentage"
                value={person.percentage}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.percentage ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all`}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
            </div>
            {errors.percentage && <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">{errors.percentage}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-10 px-6 py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPerson;