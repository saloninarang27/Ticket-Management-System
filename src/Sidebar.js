import { Link, useLocation } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Tickets", path: "/tickets" },
    // { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="w-64 flex flex-col min-h-screen bg-green-700 text-white shadow-lg"> {/* min-h-screen is the key */}
      <div className="p-6 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-center">Dashboard</h2>
      </div>
      <nav className="flex flex-col flex-grow">
        <ul className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block p-3 rounded-lg transition-all duration-300 text-lg font-medium ${
                  location.pathname === item.path
                    ? "bg-green-900 text-white"
                    : "hover:bg-green-800"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg text-lg font-medium transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;