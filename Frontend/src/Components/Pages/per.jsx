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

  // 🔹 Fetch filed IPO applications
  const fetchIPOList = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/ipo/${ipo_id}/get-all/filed`
      );

      if (res.data.success) {
        setList(res.data.message);
      }
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

      if (res.data.success) {
        console.log("FetchPerson",res.data.message)
        setAllPersons(res.data.message);
      }
    } catch {
      toast.error("Failed to load persons");
    }
  };

  // 🔹 Compare & get un-filed persons
  useEffect(() => {
    const filedPersonIds = list.map((i) => i.person_id);
    console.log("filedPersonIds",filedPersonIds)
    const unFiled = allPersons.filter(
      (p) => !filedPersonIds.includes(p.person_id)
    );
    console.log("unFiled",unFiled)
    setUnFiledPersons(unFiled);
  }, [list, allPersons]);

  useEffect(() => {
    fetchIPOList();
    fetchPersons();
  }, [ipo_id]);

  // 🔹 Fill IPO for selected person
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

  const statusColor = (status) => {
    if (status === "ALLOTTED") return "text-green-600";
    if (status === "NOT ALLOTTED") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-navy p-6">
      <h1 className="text-3xl text-sky font-semibold mb-4">
        IPO Applications
      </h1>

      {/* 🔽 UN-FILED PEOPLE DROPDOWN */}
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
      <div className="bg-whitepure rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">PAN</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item) => (
              <tr key={item.application_id} className="border-b">
                <td className="px-4 py-2 font-medium">
                  {item.name}
                </td>

                <td className="px-4 py-2">
                  {item.pan_id}
                </td>

                <td className={`px-4 py-2 font-semibold ${statusColor(item.status)}`}>
                  {item.status}
                </td>

                <td className="px-4 py-2">
                  {item.active ? "Yes" : "No"}
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
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
