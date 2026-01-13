import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchIPOs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/ipo/all-ipos"
      );
      if (res.data.success) {
        setIpos(res.data.message);
      } else {
        toast.error("Failed to load IPOs");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPOs();
  }, []);

  // Indian money format
  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN").format(amount);

  // Days difference
  const daysText = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diff = Math.ceil(
      (target - today) / (1000 * 60 * 60 * 24)
    );

    if (diff > 0) return `${diff} Days Left`;
    if (diff === 0) return "Today";
    return `${Math.abs(diff)} Days Ago`;
  };

  return (
    <div className="min-h-screen bg-navy p-6">
      <h1 className="text-3xl font-semibold text-sky mb-6">
        IPO Dashboard
      </h1>

      <div className="bg-whitepure rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">GMP</th>
              <th className="px-4 py-3">Profit</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Listing</th>
            </tr>
          </thead>

          <tbody>
            {ipos.map((ipo) => (
              <tr
                key={ipo.ipo_id}
                onClick={() => navigate(`/ipo/${ipo.ipo_id}`)}
                className="border-b cursor-pointer hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2 font-medium text-navy">
                  {ipo.name}
                </td>
                <td className="px-4 py-2">
                  ₹ {formatMoney(ipo.price)}
                </td>
                <td className="px-4 py-2 text-green-600 font-semibold">
                  ₹ {formatMoney(ipo.gmp)}
                </td>
                <td className="px-4 py-2 text-sky font-semibold">
                  ₹ {formatMoney(ipo.profit)}
                </td>
                <td className="px-4 py-2">
                  {daysText(ipo.starting_date)}
                </td>
                <td className="px-4 py-2">
                  {daysText(ipo.ending_date)}
                </td>
                <td className="px-4 py-2">
                  {daysText(ipo.listing)}
                </td>
              </tr>
            ))}

            {ipos.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No IPOs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="text-whitepure text-center mt-6">
          Loading IPOs...
        </p>
      )}
    </div>
  );
}

export default Home;
