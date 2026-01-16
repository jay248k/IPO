import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const API_BASE_URL = import.meta.env.VITE_URL;
  const [profile, setProfile] = useState({
    invested: 0,
    geted: 0,
    profit: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatIndianMoney = (amount) =>
    Number(amount).toLocaleString("en-IN");

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/profile`);
      if (res.data.success) {
        setProfile(res.data.message[0] || { invested: 0, geted: 0, profit: 0 });
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
      const res = await axios.get(`${API_BASE_URL}/api/admin/profile/reset`);
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-black">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-5 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Profile Statement
        </h1>

        {/* SUMMARY SECTION - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Invested", value: profile.invested, color: "text-gray-800", bg: "bg-gray-50" },
            { label: "Received", value: profile.geted, color: "text-green-600", bg: "bg-green-50" },
            { label: "Net Profit", value: profile.profit, color: "text-blue-600", bg: "bg-blue-50" },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-6 text-center border border-transparent hover:border-gray-200 transition-all`}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{item.label}</p>
              <p className={`text-2xl font-black ${item.color}`}>
                ₹ {formatIndianMoney(item.value)}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📜</span> Recent Transactions
        </h2>

        {/* WEB VIEW: TABLE (Hidden on mobile) */}
        <div className="hidden md:block overflow-hidden border rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Company</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Amount</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b last:border-none hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{t.name}</td>
                  <td className={`px-6 py-4 font-bold ${t.transaction_status === "Credit" ? "text-green-600" : "text-red-600"}`}>
                    ₹ {formatIndianMoney(t.money)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.transaction_status === "Credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {t.transaction_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: CARDS (Hidden on Desktop) */}
        <div className="md:hidden space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">{t.name}</span>
                <span className="text-[10px] text-gray-400 font-medium">{formatDateTime(t.created_at)}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`font-black ${t.transaction_status === "Credit" ? "text-green-600" : "text-red-600"}`}>
                  {t.transaction_status === "Credit" ? "+" : "-"} ₹{formatIndianMoney(t.money)}
                </span>
                <span className={`text-[10px] font-bold uppercase ${t.transaction_status === "Credit" ? "text-green-400" : "text-red-400"}`}>
                  {t.transaction_status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {!loading && transactions.length === 0 && (
          <div className="text-center py-12 text-gray-400 italic">No transactions found.</div>
        )}

        {/* LOADER */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}

        {/* RESET BUTTON */}
        <div className="mt-10 flex justify-center md:justify-end">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full md:w-auto px-8 py-3 bg-white border-2 border-black font-bold rounded-xl hover:bg-black hover:text-white transition-all active:scale-95"
          >
            Reset Profile
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Final Warning</h2>
            <p className="text-gray-500 text-sm mb-8">This will erase all your transaction history and reset balances. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl font-bold text-gray-400">Cancel</button>
              <button onClick={handleReset} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;