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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setIpo({ ...ipo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const validate = () => {
    const newErrors = {};
    if (!ipo.name) newErrors.name = "Please enter company name";
    if (!ipo.price) newErrors.price = "Please enter price";
    if (!ipo.starting_date) newErrors.starting_date = "Please select starting date";
    if (!ipo.ending_date) newErrors.ending_date = "Please select ending date";
    if (!ipo.listing) newErrors.listing = "Please select listing date";
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
        "http://localhost:8080/api/ipo/register",
        ipo,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("IPO registered successfully!");
        setIpo({
          name: "",
          price: "",
          starting_date: "",
          ending_date: "",
          listing: "",
          gmp: "",
        });
      } else {
        toast.error(res.data.message || "Error registering IPO");
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
        <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 font-semibold text-gray-700">Registering IPO...</p>
        </div>
      )}

      {/* FORM CONTAINER */}
      <form
        onSubmit={handleRegister}
        className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 transition-all duration-300 ${
          loading ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-gray-800">New IPO</h2>
          <p className="text-gray-400 text-sm mt-1">Fill in the details to list a new IPO</p>
        </div>

        <div className="space-y-5">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={ipo.name}
              onChange={handleChange}
              placeholder="e.g. Tata Motors"
              className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.name ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.name}</p>}
          </div>

          {/* Price & GMP Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">
                IPO Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={ipo.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.price ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">
                GMP (Expected)
              </label>
              <input
                type="number"
                name="gmp"
                value={ipo.gmp}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          {/* Date Range Section */}
          <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">
                  Starting Date
                </label>
                <input
                  type="date"
                  name="starting_date"
                  value={ipo.starting_date}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-white border ${errors.starting_date ? 'border-red-400' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-black outline-none`}
                />
                {errors.starting_date && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.starting_date}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">
                  Ending Date
                </label>
                <input
                  type="date"
                  name="ending_date"
                  value={ipo.ending_date}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-white border ${errors.ending_date ? 'border-red-400' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-black outline-none`}
                />
                {errors.ending_date && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.ending_date}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">
                Listing Date
              </label>
              <input
                type="date"
                name="listing"
                value={ipo.listing}
                onChange={handleChange}
                className={`w-full px-5 py-3 bg-white border ${errors.listing ? 'border-red-400' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-black outline-none`}
              />
              {errors.listing && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.listing}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-10 px-6 py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Register IPO"}
        </button>
      </form>
    </div>
  );
}

export default RegisterIPO;