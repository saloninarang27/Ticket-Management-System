import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(fetchedTickets);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-red-500">No tickets available.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold text-lg">{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p className="text-sm">Status: {ticket.status}</p>
              <p className="text-sm">Priority: {ticket.priority}</p>
              <button
                onClick={() => navigate(`/ticket/${ticket.id}`)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
              >
                View Details
              </button>

              {/* Status Update Dropdown for Agents */}
              {/* <select
                className="mt-2 p-2 border rounded w-full"
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </select> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tickets;
