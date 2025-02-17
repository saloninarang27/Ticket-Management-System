import React from 'react';
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { Link } from 'react-router-dom';

const AgentSidebar = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-green-500 text-white p-4"> {/* Changed to flex column and h-screen */}
      <h2 className="text-xl font-semibold mb-6">Agent Dashboard</h2>
      <div className="space-y-4 flex-grow"> {/* Added flex-grow to push content to the top */}
        {/* Dashboard/Home Link */}
        <Link to="/agentdashboard" className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
          </svg>
          <span>Dashboard</span>
        </Link>

        {/* Users Link */}
        <Link to="/users" className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405 1.405a2 2 0 01-2.828 0L15 17zm-6 0h-5l1.405 1.405a2 2 0 002.828 0L9 17zM5 8a2 2 0 10-2 2 2 2 0 002-2zm12 0a2 2 0 10-2 2 2 2 0 002-2z" />
          </svg>
          <span>Users</span>
        </Link>

        {/* Agents Link */}
        <Link to="/agents" className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6zm0-12C8.686 2 6 4.686 6 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" />
          </svg>
          <span>Agents</span>
        </Link>

        {/* Open Tickets Link */}
        <Link to="/opentickets" className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4m0 4L8 9l4 1.5L16 9l-4-1.5L12 8z" />
          </svg>
          <span>Open Tickets</span>
        </Link>

        {/* Progress Tickets Link */}
        <Link to="/progresstickets" className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4m0 4L8 9l4 1.5L16 9l-4-1.5L12 8z" />
          </svg>
          <span>Progress Tickets</span>
        </Link>

        {/* Closed Tickets Link */}
        <Link to="/closedtickets" className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Closed Tickets</span>
        </Link>
      </div>

      <div className="mt-auto p-4"> {/* Added mt-auto to push to bottom */}
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

export default AgentSidebar;