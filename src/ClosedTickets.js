import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AgentSidebar from "./AgentSidebar";

const ClosedTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tickets"), where("status", "==", "closed"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(fetchedTickets);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AgentSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Closed Tickets</h1>

        {tickets.length === 0 ? (
          <p className="text-gray-600">No closed tickets available.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 bg-white shadow rounded-lg">
                <h2 className="font-semibold">{ticket.title}</h2>
                <p>{ticket.description}</p>
                <p className="text-sm">Priority: {ticket.priority}</p>
                <p className="text-sm">Assigned To: {ticket.assignedTo || "Unassigned"}</p>
                <p className="text-sm">Customer Email: {ticket.customerEmail || "N/A"}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClosedTickets;
