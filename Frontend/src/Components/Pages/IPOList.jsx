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

  // ✅ ONLY CHANGE #1 (UI STATE)
  const [selectedPerson, setSelectedPerson] = useState("");

  const statusPriority = { AWAIT: 1, ALLOTTED: 2, "NOT ALLOTTED": 3 };

  const fetchIPOList = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/ipo/${ipo_id}/get-all/filed`
      );
      if (res.data.success) setList(res.data.message);
    } catch {
      toast.error("Failed to load IPO list");
    }
  };

  const fetchPersons = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/customer/get-persons`
      );
      if (res.data.success) setAllPersons(res.data.message);
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
      const res = await axios.post(
        `${API_BASE_URL}/api/ipo/${ipo_id}/${person_id}/fillup`
      );
      if (res.data.success) {
        toast.success("IPO filled successfully");
        setAllPersons((prev) =>
          prev.filter((p) => p.person_id !== person_id)
        );
        await fetchIPOList();

        // ✅ ONLY CHANGE #2 (RESET DROPDOWN)
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
      const res = await axios.put(
        `${API_BASE_URL}/api/ipo/${appId}/update/status`,
        { status }
      );
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
      const res = await axios.post(
        `${API_BASE_URL}/api/ipo/${appId}/de-active`
      );
      if (res.data.success) {
        toast.success("Active updated");
        setList((prev) =>
          prev.map((item) =>
            item.application_id === appId
              ? { ...item, active: !item.active }
              : item
          )
        );
      }
    } catch {
      toast.error("Failed to update active");
    }
  };

  const statusColor = (status) => {
    if (status === "ALLOTTED") return "text-green-600 font-semibold";
    if (status === "NOT ALLOTTED") return "text-red-600 font-semibold";
    return "text-yellow-500 font-semibold";
  };

  const hasActiveYes = list.some((i) => i.active);

  const unFiledPersons = !loadingData
    ? allPersons.filter(
        (p) =>
          !list.some(
            (l) => String(l.person_id) === String(p.person_id)
          )
      )
    : [];

  const sortedList = [...list].sort((a, b) => {
    if (a.active !== b.active) return b.active - a.active;
    return statusPriority[a.status] - statusPriority[b.status];
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        IPO Applications
      </h1>

      {loadingData ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* FILE IPO DROPDOWN */}
          <div className="mb-6">
            {unFiledPersons.length > 0 ? (
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                value={selectedPerson}
                onChange={(e) => {
                  const personId = e.target.value;
                  setSelectedPerson(personId);
                  fillIPO(personId);
                }}
              >
                <option value="" disabled>
                  Select person to file IPO
                </option>
                {unFiledPersons.map((p) => (
                  <option
                    key={p.person_id}
                    value={p.person_id}
                  >
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500 italic">
                All persons have already filed IPO
              </p>
            )}
          </div>

          {/* TABLE VIEW */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">PAN</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Active</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((item) => (
                  <tr key={item.application_id} className="border-b">
                    <td className="px-5 py-3">{item.name}</td>
                    <td className="px-5 py-3">{item.pan_id}</td>
                    <td className={`px-5 py-3 ${statusColor(item.status)}`}>
                      {item.status}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        className="border rounded px-2 py-1"
                        value={item.active ? "Yes" : "No"}
                        disabled={
                          item.status === "AWAIT" ||
                          (!item.active && hasActiveYes)
                        }
                        onChange={() =>
                          updateActive(item.application_id)
                        }
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      {item.status === "AWAIT" ? (
                        <select
                          className="border rounded px-3 py-1"
                          defaultValue=""
                          onChange={(e) =>
                            updateStatus(
                              item.application_id,
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="ALLOTTED">ALLOTTED</option>
                          <option value="NOT ALLOTTED">
                            NOT ALLOTTED
                          </option>
                        </select>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}

export default IPOList;
