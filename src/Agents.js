import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa"; // Icon for users
import Sidebar from "./AgentSidebar"; // Import the AgentSidebar

const Agents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Fetch users from Firestore
    const usersQuery = query(collection(db, "users"));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      // Filter only agents (users with role 'agent')
      const fetchedAgents = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role === "agent"); // Filter only agents

      setAgents(fetchedAgents);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar is included here */}
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Agents</h1>
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              {/* <th className="px-4 py-2 text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {agents.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">
                  <FaUserCircle className="inline-block mr-2 text-xl" />
                  {user.name}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {/* You can add actions like View or Edit here */}
                  {/* <button className="text-blue-500 hover:underline">View</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Agents;
