import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
  const API_BASE_URL = import.meta.env.VITE_URL;
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editIPO, setEditIPO] = useState(null);

  const navigate = useNavigate();

  const fetchIPOs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/ipo/all-ipos`);
      if (res.data.success) {
        setIpos(res.data.message || []);
      } else {
        setIpos([]);
      }
    } catch {
      toast.error("Server error while fetching IPOs");
      setIpos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPOs();
  }, []);

  const handleUpdateClick = (e, ipo) => {
    e.stopPropagation();
    setEditIPO({ ...ipo });
    setShowModal(true);
  };

  const updateIPO = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/ipo/${editIPO.ipo_id}/update`,
        editIPO,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("IPO updated successfully");
        setShowModal(false);
        fetchIPOs();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditIPO((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "price" || name === "gmp") {
        const price = Number(updated.price || 0);
        const gmpPercent = Number(updated.gmp || 0);
        updated.profit = ((price * gmpPercent) / 100).toFixed(2);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-black">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        IPO Dashboard
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-24 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : ipos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800">No IPOs Available</h2>
          <p className="text-gray-500 mt-2">There are currently no IPO listings in the database.</p>
          <button 
            onClick={fetchIPOs}
            className="mt-6 px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <>
          {/* WEB VIEW: TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase text-xs">Company</th>
                  <th className="px-6 py-4 font-semibold uppercase text-xs">Price</th>
                  <th className="px-6 py-4 font-semibold uppercase text-xs">GMP (%)</th>
                  <th className="px-6 py-4 font-semibold uppercase text-xs">Est. Profit</th>
                  <th className="px-6 py-4 font-semibold uppercase text-xs text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {ipos.map((ipo) => (
                  <tr 
                    key={ipo.ipo_id} 
                    className="border-b last:border-none hover:bg-blue-50/50 transition cursor-pointer"
                    onClick={() => navigate(`/ipo/${ipo.ipo_id}`)}
                  >
                    <td className="px-6 py-4 font-bold text-blue-600">{ipo.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">₹{ipo.price}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">{ipo.gmp}%</td>
                    <td className="px-6 py-4 text-gray-900 font-black">₹{ipo.profit}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => handleUpdateClick(e, ipo)}
                        className="px-4 py-1.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="block md:hidden space-y-4">
            {ipos.map((ipo) => (
              <div 
                key={ipo.ipo_id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition"
                onClick={() => navigate(`/ipo/${ipo.ipo_id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black text-blue-600">{ipo.name}</h3>
                  <button
                    onClick={(e) => handleUpdateClick(e, ipo)}
                    className="text-xs bg-black text-white px-4 py-2 rounded-xl font-bold uppercase tracking-tight"
                  >
                    Update
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                   <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
                      <p className="text-sm font-bold">₹{ipo.price}</p>
                   </div>
                   <div className="bg-green-50 p-2 rounded-xl border border-green-100">
                      <p className="text-[10px] text-green-500 font-bold uppercase">GMP</p>
                      <p className="text-sm font-bold text-green-600">{ipo.gmp}%</p>
                   </div>
                   <div className="bg-blue-50 p-2 rounded-xl border border-blue-100">
                      <p className="text-[10px] text-blue-500 font-bold uppercase">Profit</p>
                      <p className="text-sm font-black text-blue-700">₹{ipo.profit}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* UPDATE MODAL */}
      {showModal && editIPO && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-3xl md:rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden"></div>
            <h2 className="text-xl font-black mb-1">Update Listing</h2>
            <p className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-widest">{editIPO.name}</p>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Company Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editIPO.name} 
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={editIPO.price} 
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold" 
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">GMP (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="gmp" 
                      value={editIPO.gmp} 
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Est. Profit Return</span>
                  <span className="text-2xl font-black text-white">₹{editIPO.profit}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)} 
                className="order-2 md:order-1 flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={updateIPO} 
                className="order-1 md:order-2 flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;