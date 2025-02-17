import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { FaTicketAlt } from "react-icons/fa"; // Icon for tickets
import AgentSidebar from "./AgentSidebar"; // Import AgentSidebar

const ProgressTicket = () => {
  const [progressTickets, setProgressTickets] = useState([]);

  useEffect(() => {
    // Query to fetch only tickets that are in progress
    const ticketsQuery = query(
      collection(db, "tickets"),
      where("status", "==", "in progress")
    );

    const unsubscribe = onSnapshot(ticketsQuery, async (snapshot) => {
      const fetchedTickets = [];
      
      // Loop through the fetched tickets to get the customer's email
      for (let docSnap of snapshot.docs) {
        const ticketData = docSnap.data();
        const userRef = doc(db, "users", ticketData.createdBy);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userEmail = userSnap.data().email; // Get the email of the user
          fetchedTickets.push({ id: docSnap.id, ...ticketData, userEmail });
        }
      }
      setProgressTickets(fetchedTickets);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AgentSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Tickets In Progress</h1>
        
        {progressTickets.length === 0 ? (
          <p>No tickets in progress.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Ticket ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Customer Email</th> {/* Added column for customer email */}
              </tr>
            </thead>
            <tbody>
              {progressTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b">
                  <td className="px-4 py-2">{ticket.id}</td>
                  <td className="px-4 py-2">{ticket.title}</td>
                  <td className="px-4 py-2">{ticket.description}</td>
                  <td className="px-4 py-2">{ticket.priority}</td>
                  <td className="px-4 py-2">{ticket.createdBy}</td>
                  <td className="px-4 py-2">{ticket.userEmail}</td> {/* Displaying customer email */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default ProgressTicket;
