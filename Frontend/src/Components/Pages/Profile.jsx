import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState({
    invested: 0,
    geted: 0,
    profit: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Indian currency formatter
  const formatIndianMoney = (amount) => {
    return Number(amount).toLocaleString("en-IN");
  };

  // ✅ Date formatter DD-MM-YYYY HH:MM
  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/admin/profile");
      if (res.data.success) {
        setProfile(res.data.message[0]);
        setTransactions(res.data.transaction);
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setShowConfirm(false);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/profile/reset"
      );
      if (res.data.success) {
        toast.success("Profile reset successful");
        fetchProfile();
      }
    } catch {
      toast.error("Reset failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-navy p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-sky font-semibold">Profile</h1>
        <button
          onClick={() => setShowConfirm(true)}
          className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold"
        >
          Reset
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-whitepure rounded-2xl p-6 text-center">
          <h3 className="text-gray-500 mb-2">Invested</h3>
          <p className="text-2xl font-bold text-navy">
            ₹ {formatIndianMoney(profile.invested)}
          </p>
        </div>

        <div className="bg-whitepure rounded-2xl p-6 text-center">
          <h3 className="text-gray-500 mb-2">Geted</h3>
          <p className="text-2xl font-bold text-navy">
            ₹ {formatIndianMoney(profile.geted)}
          </p>
        </div>

        <div className="bg-whitepure rounded-2xl p-6 text-center">
          <h3 className="text-gray-500 mb-2">Profit</h3>
          <p className="text-2xl font-bold text-navy">
            ₹ {formatIndianMoney(profile.profit)}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="overflow-x-auto bg-whitepure rounded-2xl shadow-md p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="px-4 py-2">{t.name}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    t.transaction_status === "Credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹ {formatIndianMoney(t.money)}
                </td>
                <td
                  className={`px-4 py-2 ${
                    t.transaction_status === "Credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.transaction_status}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {formatDateTime(t.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="text-whitepure mt-4 text-center">Loading...</p>
      )}

      {/* Confirm Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-whitepure p-6 rounded-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">Confirm Reset</h2>
            <p className="mb-5">Are you sure you want to reset all numbers?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
