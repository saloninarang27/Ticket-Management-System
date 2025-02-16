import { Link } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">Home</Link>
        <Link to="/tickets" className="hover:bg-gray-700 p-2 rounded">Tickets</Link>
        <Link to="/profile" className="hover:bg-gray-700 p-2 rounded">Profile</Link>
        <button onClick={handleLogout} className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
