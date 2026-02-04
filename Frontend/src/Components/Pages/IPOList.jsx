import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function IPOList() {
  const API_BASE_URL = import.meta.env.VITE_URL;
  const { id: ipo_id } = useParams();

  const [list, setList] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState("");

  const statusPriority = { AWAIT: 1, ALLOTTED: 2, "NOT ALLOTTED": 3 };

  const fetchIPOList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/ipo/${ipo_id}/get-all/filed`);
      if (res.data.success) setList(res.data.message);
    } catch {
      toast.error("Failed to load IPO list");
    }
  };

  const fetchPersons = async () => {
    try {
      console.log(ipo_id)
      const res = await axios.get(`${API_BASE_URL}/api/customer/${ipo_id}/person`);
      console.log(res.data)
      if (Array.isArray(res.data.data)) {
        setAllPersons(res.data.data);
      } else if (res.data.success && Array.isArray(res.data.data)) {
        setAllPersons(res.data.data);
      }

    } catch {
      toast.error("Failed to load persons");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      await Promise.all([fetchIPOList(), fetchPersons()]);
      setLoadingData(false);
    };
    fetchData();
  }, [ipo_id]);

  const fillIPO = async (person_id) => {
    if (!person_id) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ipo/${ipo_id}/${person_id}/fillup`);
      if (res.data.success) {
        toast.success("IPO filled successfully");
        setAllPersons((prev) => prev.filter((p) => p.person_id !== person_id));
        await fetchIPOList();
        setSelectedPerson("");
      }
    } catch {
      toast.error("Failed to fill IPO");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/ipo/${appId}/update/status`, { status });
      if (res.data.success) {
        toast.success("Status updated");
        await fetchIPOList();
      }
    } catch {
      toast.error("Server error");
    }
  };

  const updateActive = async (appId) => {

    try {
      const res = await axios.post(`${API_BASE_URL}/api/ipo/${appId}/de-active`);
      if (res.data.success) {
        toast.success("Status Locked to No");
        setList((prev) =>
          prev.map((item) =>
            item.application_id === appId ? { ...item, active: false } : item
          )
        );
      }
    } catch {
      toast.error("Failed to update active");
    }
  };

  const statusColor = (status) => {
    if (status === "ALLOTTED") return "bg-green-100 text-green-700";
    if (status === "NOT ALLOTTED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const hasActiveYes = list.some((i) => i.active);

  // Replace your old unFiledPersons logic with this:
  const unFiledPersons = !loadingData && Array.isArray(allPersons)
    ? allPersons
    : [];

  const sortedList = [...list].sort((a, b) => {
    if (a.active !== b.active) return b.active - a.active;
    return statusPriority[a.status] - statusPriority[b.status];
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-30 px-4 py-4 md:px-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">IPO Applications</h1>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {loadingData ? (
          <div className="flex flex-col items-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading records...</p>
          </div>
        ) : (
          <>
            {/* FILE IPO SELECTOR */}
            {/* FILE IPO SELECTOR */}
            <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                File New Application
              </label>

              {/* Logic: Show dropdown if we have people, otherwise show a 'No data' message */}
              {unFiledPersons.length > 0 ? (
                <select
                  className="w-full md:max-w-xs bg-white border border-blue-200 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedPerson}
                  onChange={(e) => {
                    setSelectedPerson(e.target.value);
                    fillIPO(e.target.value);
                  }}
                >
                  <option value="" disabled>Choose a person...</option>
                  {unFiledPersons.map((p) => (
                    <option key={p.person_id} value={p.person_id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-blue-600 text-sm italic">
                  No persons found in the database.
                </p>
              )}
            </div>

            {/* MOBILE VIEW (Cards) - Shown on small screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {sortedList.map((item) => (
                <div key={item.application_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.pan_id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t pt-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Active State</p>
                      <select
                        className="w-full border rounded-lg px-2 py-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        value={item.active ? "Yes" : "No"}
                        disabled={item.status === "AWAIT" || (!item.active && hasActiveYes) || item.active === false}
                        onChange={() => updateActive(item.application_id)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Update Status</p>
                      {item.status === "AWAIT" ? (
                        <select
                          className="w-full border rounded-lg px-2 py-1.5 text-sm"
                          defaultValue=""
                          onChange={(e) => updateStatus(item.application_id, e.target.value)}
                        >
                          <option value="" disabled>Action</option>
                          <option value="ALLOTTED">ALLOTTED</option>
                          <option value="NOT ALLOTTED">NOT ALLOTTED</option>
                        </select>
                      ) : (
                        <p className="text-sm py-1.5 font-medium text-gray-400">Finalized</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW (Table) - Hidden on mobile */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name / PAN</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Active</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedList.map((item) => (
                    <tr key={item.application_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.pan_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={item.active ? "Yes" : "No"}
                          disabled={item.status === "AWAIT" || (!item.active && hasActiveYes) || item.active === false}
                          onChange={() => updateActive(item.application_id)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "AWAIT" ? (
                          <select
                            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            defaultValue=""
                            onChange={(e) => updateStatus(item.application_id, e.target.value)}
                          >
                            <option value="" disabled>Update Status</option>
                            <option value="ALLOTTED">ALLOTTED</option>
                            <option value="NOT ALLOTTED">NOT ALLOTTED</option>
                          </select>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* OVERLAY LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-3 font-semibold text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default IPOList;