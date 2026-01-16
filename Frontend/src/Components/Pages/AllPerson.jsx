import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AllPerson() {
  const API_BASE_URL = import.meta.env.VITE_URL;
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const [updateData, setUpdateData] = useState({
    person_id: "",
    name: "",
    pan_id: "",
    percentage: "",
  });

  const fetchPersons = async () => {
    setLoading(true);
    
    try {
      const res = await axios.get(`${API_BASE_URL}/api/customer/get-persons`);
      if (res.data.success) {
        setPersons(res.data.message);
      }
    } catch {
      toast.error("Failed to fetch persons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/customer/${deleteId}/delete`);
      if (res.data.success) {
        toast.success("Person deleted");
        fetchPersons();
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDelete(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/customer/${updateData.person_id}/update`,
        {
          name: updateData.name,
          pan_id: updateData.pan_id,
          percentage: updateData.percentage,
        }
      );

      if (res.data.success) {
        toast.success("Person updated");
        setShowUpdate(false);
        fetchPersons();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Manage Persons
      </h1>

      {/* DESKTOP TABLE VIEW (Visible on md and up) */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm">PAN ID</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Percentage</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((p) => (
              <tr key={p.person_id} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-gray-600 uppercase">{p.pan_id}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-bold">
                    {p.percentage}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => { setUpdateData(p); setShowUpdate(true); }}
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => { setDeleteId(p.person_id); setShowDelete(true); }}
                      className="p-2 bg-gray-100 rounded-full hover:bg-red-100 transition"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW (Visible on small screens) */}
      <div className="block md:hidden space-y-4">
        {persons.map((p) => (
          <div key={p.person_id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{p.pan_id}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                {p.percentage}%
              </div>
            </div>
            
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { setUpdateData(p); setShowUpdate(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold border border-gray-100 active:bg-gray-200"
              >
                <span>✏️</span> Edit
              </button>
              <button
                onClick={() => { setDeleteId(p.person_id); setShowDelete(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold border border-red-50 active:bg-red-100"
              >
                <span>🗑️</span> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {persons.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-xl mt-4">
          <p className="text-gray-400 italic">No persons found in the database.</p>
        </div>
      )}

      {/* LOADER */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-10 space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🗑️
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              This action cannot be undone. This person will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                <input required className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">PAN Identification</label>
                <input required className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none uppercase" value={updateData.pan_id} onChange={(e) => setUpdateData({ ...updateData, pan_id: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ownership Percentage</label>
                <input required type="number" className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none" value={updateData.percentage} onChange={(e) => setUpdateData({ ...updateData, percentage: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setShowUpdate(false)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold text-gray-600">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-black text-white rounded-2xl font-bold shadow-lg">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AllPerson;