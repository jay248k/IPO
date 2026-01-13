import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AllPerson() {
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

  // Fetch persons
  const fetchPersons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/customer/get-persons"
      );
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

  // Delete person
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/customer/${deleteId}/delete`
      );
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

  // Update person
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8080/api/customer/${updateData.person_id}/update`,
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
    <div className="min-h-screen bg-navy p-6">
      <h1 className="text-3xl text-sky font-semibold mb-6">All Persons</h1>

      {/* Table */}
      <div className="bg-whitepure rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">PAN ID</th>
              <th className="px-4 py-3 text-left">Percentage</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((p) => (
              <tr key={p.person_id} className="border-b">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.pan_id}</td>
                <td className="px-4 py-2">{p.percentage}%</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      setUpdateData(p);
                      setShowUpdate(true);
                    }}
                    className="px-3 py-1 bg-sky text-navy rounded-lg font-medium"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(p.person_id);
                      setShowDelete(true);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {persons.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No persons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="text-whitepure text-center mt-4">Loading...</p>
      )}

      {/* Delete Confirm Popup */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-whitepure p-6 rounded-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">
              Confirm Delete
            </h2>
            <p className="mb-5">Are you sure you want to delete?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Popup */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-whitepure p-6 rounded-xl w-96"
          >
            <h2 className="text-xl font-semibold mb-4 text-navy">
              Update Person
            </h2>

            <input
              className="w-full mb-3 px-4 py-2 border rounded"
              placeholder="Name"
              value={updateData.name}
              onChange={(e) =>
                setUpdateData({ ...updateData, name: e.target.value })
              }
            />

            <input
              className="w-full mb-3 px-4 py-2 border rounded"
              placeholder="PAN ID"
              value={updateData.pan_id}
              onChange={(e) =>
                setUpdateData({ ...updateData, pan_id: e.target.value })
              }
            />

            <input
              className="w-full mb-4 px-4 py-2 border rounded"
              placeholder="Percentage"
              type="number"
              value={updateData.percentage}
              onChange={(e) =>
                setUpdateData({ ...updateData, percentage: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowUpdate(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky text-navy rounded font-semibold"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AllPerson;
