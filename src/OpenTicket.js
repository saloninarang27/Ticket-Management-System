import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore"; // Importing updateDoc and doc
import { FaTicketAlt } from "react-icons/fa"; // Icon for tickets
import AgentSidebar from "./AgentSidebar"; // Import AgentSidebar

const OpenTicket = () => {
  const [openTickets, setOpenTickets] = useState([]);

  useEffect(() => {
    const ticketsQuery = query(
      collection(db, "tickets"),
      where("status", "==", "open")
    );
  
    const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
      const fetchedTickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log("Fetched Open Tickets:", fetchedTickets); // Log tickets for debugging
      setOpenTickets(fetchedTickets);
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
    <div className="min-h-screen bg-gray-100 flex">
      <AgentSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Open Tickets</h1>
        
        {openTickets.length === 0 ? (
          <p>No open tickets available.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Ticket ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b">
                  <td className="px-4 py-2">{ticket.id}</td>
                  <td className="px-4 py-2">{ticket.title}</td>
                  <td className="px-4 py-2">{ticket.description}</td>
                  <td className="px-4 py-2">{ticket.priority}</td>
                  <td className="px-4 py-2">{ticket.createdBy}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStatusChange(ticket.id, "in progress")}
                      className="text-blue-500 hover:underline"
                    >
                      Start Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(ticket.id, "closed")}
                      className="text-green-500 hover:underline ml-4"
                    >
                      Mark as Closed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default OpenTicket;
