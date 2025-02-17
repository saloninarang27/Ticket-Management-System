import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, where } from "firebase/firestore";  
import { onAuthStateChanged } from "firebase/auth";  
import { useNavigate } from "react-router-dom";
import AgentSidebar from "./AgentSidebar";
import Sidebar from "./Sidebar";

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
          navigate("/login");
        } else {
          const userData = userSnap.data();
          setUser(userData);

          if (userData.role === "customer") {
            navigate("/dashboard");
          }
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(fetchedTickets);

      // Generate recent activity log
      const activityLog = fetchedTickets.slice(0, 5).map((ticket) => ({
        message: `Ticket "${ticket.title}" marked as ${ticket.status}`,
        timestamp: ticket.updatedAt || ticket.createdAt,
      }));
      setRecentActivity(activityLog);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const agentsQuery = query(collection(db, "users"), where("role", "==", "agent"));  
    const unsubscribe = onSnapshot(agentsQuery, (snapshot) => {
      const fetchedAgents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAgents(fetchedAgents);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });

      // Re-fetch tickets after status update
      const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedTickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTickets(fetchedTickets);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const openTickets = tickets.filter((ticket) => ticket.status === "open").length;
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "in progress").length;
  const closedTickets = tickets.filter((ticket) => ticket.status === "closed").length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {user?.role === "agent" ? <AgentSidebar /> : <Sidebar />}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>

        {/* Ticket Statistics Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-500 text-white text-center rounded-lg shadow">
            <h3 className="text-lg font-semibold">Open Tickets</h3>
            <p className="text-2xl font-bold">{openTickets}</p>
          </div>
          <div className="p-4 bg-green-500 text-white text-center rounded-lg shadow">
            <h3 className="text-lg font-semibold">In Progress</h3>
            <p className="text-2xl font-bold">{inProgressTickets}</p>
          </div>
          <div className="p-4 bg-green-500 text-white text-center rounded-lg shadow">
            <h3 className="text-lg font-semibold">Closed Tickets</h3>
            <p className="text-2xl font-bold">{closedTickets}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <ul className="list-disc list-inside">
              {recentActivity.map((activity, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {activity.message} - <span className="text-gray-400">{new Date(activity.timestamp?.toDate()).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </div>

        {/* Ticket List */}
        <h2 className="text-xl font-semibold">Tickets</h2>
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-4 bg-white shadow rounded-lg my-2">
            <strong>{ticket.title}</strong>
            <p>{ticket.description}</p>
            <p className="text-sm">Status: {ticket.status}</p>
            <select onChange={(e) => handleStatusChange(ticket.id, e.target.value)}>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AgentDashboard;
