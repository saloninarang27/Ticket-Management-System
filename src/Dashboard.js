import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TicketForm from "./TicketForm";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserRole(currentUser.uid);
      } else {
        setUser(null);
        setRole(null);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setRole(userSnap.data().role);
      } else {
        setRole("customer");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />  {/* ✅ Sidebar now handles ticket display */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Welcome, {user?.email}!</p>
          <TicketForm />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
