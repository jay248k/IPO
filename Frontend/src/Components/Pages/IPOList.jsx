import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function IPOList() {
  const { id: ipo_id } = useParams();

  const [list, setList] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [unFiledPersons, setUnFiledPersons] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 STATUS ORDER (IMPORTANT)
  const statusPriority = {
    AWAIT: 1,
    ALLOTTED: 2,
    "NOT ALLOTTED": 3,
  };

  // 🔹 Fetch filed IPO applications
  const fetchIPOList = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/ipo/${ipo_id}/get-all/filed`
      );
      if (res.data.success) setList(res.data.message);
    } catch {
      toast.error("Failed to load IPO list");
    }
  };

  // 🔹 Fetch all persons
  const fetchPersons = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/customer/get-persons"
      );
      if (res.data.success) setAllPersons(res.data.message);
    } catch {
      toast.error("Failed to load persons");
    }
  };

  // 🔹 Remove filed persons from dropdown
  useEffect(() => {
    const filedIds = list.map((i) => i.person_id);
    setUnFiledPersons(
      allPersons.filter((p) => !filedIds.includes(p.person_id))
    );
  }, [list, allPersons]);

  useEffect(() => {
    fetchIPOList();
    fetchPersons();
  }, [ipo_id]);

  // 🔹 Fill IPO
  const fillIPO = async (person_id) => {
    if (!person_id) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/ipo/${ipo_id}/${person_id}/fillup`
      );
      if (res.data.success) {
        toast.success("IPO filled successfully");
        fetchIPOList();
        fetchPersons();
      }
    } catch {
      toast.error("Failed to fill IPO");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update IPO status (UNCHANGED)
  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/ipo/${appId}/update/status`,
        { status }
      );

      if (res.data.success) {
        toast.success("Status updated");
        fetchIPOList();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // 🔹 NEW: ACTIVE YES/NO HANDLER (ONLY ADDITION)
  const updateActive = async (appId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/ipo/${appId}/de-active`
      );

      if (res.data.success) {
        toast.success("Active status updated");

        setList((prev) =>
          prev.map((item) =>
            item.application_id === appId
              ? { ...item, active: !item.active }
              : { ...item, active: false } // only one YES allowed
          )
        );
      }
    } catch {
      toast.error("Failed to update active");
    }
  };

  const statusColor = (status) => {
    if (status === "ALLOTTED") return "text-green-600";
    if (status === "NOT ALLOTTED") return "text-red-600";
    return "text-yellow-600";
  };

  const hasActiveYes = list.some((i) => i.active);

  return (
    <div className="min-h-screen bg-navy p-6">
      <h1 className="text-3xl text-sky font-semibold mb-6">
        IPO Applications
      </h1>

      {/* 🔽 FILE IPO DROPDOWN */}
      <div className="mb-6">
        <select
          className="border rounded px-4 py-2 w-80"
          defaultValue=""
          onChange={(e) => fillIPO(e.target.value)}
        >
          <option value="" disabled>
            Select person to file IPO
          </option>
          {unFiledPersons.map((p) => (
            <option key={p.person_id} value={p.person_id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 TABLE */}
      <div className="bg-whitepure rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">PAN</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {[...list]
              .sort(
                (a, b) =>
                  statusPriority[a.status] -
                  statusPriority[b.status]
              )
              .map((item) => (
                <tr key={item.application_id} className="border-b">
                  <td className="px-4 py-2 font-medium">
                    {item.name}
                  </td>
                  <td className="px-4 py-2">{item.pan_id}</td>

                  <td
                    className={`px-4 py-2 font-semibold ${statusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </td>

                  {/* ✅ ACTIVE YES/NO DROPDOWN */}
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={item.active ? "Yes" : "No"}
                      disabled={!item.active && hasActiveYes}
                      onChange={() =>
                        updateActive(item.application_id)
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>

                  {/* EXISTING ACTION */}
                  <td className="px-4 py-2">
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
                        <option value="ALLOTTED">
                          ALLOTTED
                        </option>
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

            {list.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="text-whitepure text-center mt-6">
          Processing...
        </p>
      )}
    </div>
  );
}

export default IPOList;
