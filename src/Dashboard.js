import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import TicketForm from "./TicketForm";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // New state for filtering
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  // Filter tickets based on selected status
  const filteredTickets = tickets.filter((ticket) =>
    filterStatus === "all" ? true : ticket.status === filterStatus
  );

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Ticket System</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <button onClick={() => navigate("/dashboard")} className="w-full text-left">
                Dashboard
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => setFilterStatus("all")} className="w-full text-left">
                Tickets
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left text-red-400">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <TicketForm user={user} />

        {/* Status Filter Buttons */}
        <div className="mt-4">
          {["all", "open", "in progress", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 mr-2 text-white rounded ${
                filterStatus === status ? "bg-blue-600" : "bg-gray-400"
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Ticket List */}
        <h2 className="text-xl font-bold mt-6">Tickets</h2>
        {filteredTickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <ul className="mt-3">
            {filteredTickets.map((ticket) => (
              <li key={ticket.id} className="p-4 bg-gray-100 rounded-lg shadow mt-2">
                <strong>{ticket.title}</strong>
                <p>{ticket.description}</p>
                <p className="text-sm">Status: {ticket.status}</p>
                <p className="text-sm">Priority: {ticket.priority}</p>

                <select
                  className="mt-2 p-2 border rounded"
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
