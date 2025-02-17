import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import useAuth
import Dashboard from "./Dashboard";
import SignUp from "./Signup";
import Login from "./Login";
import "./index.css";
import TicketDetail from "./TicketDetail";
// import Profile from "./Profile";
import Tickets from "./Tickets";
import AgentDashboard from "./AgentDashboard";
import Users from "./Users";
import Agents from "./Agents";
import OpenTicket from "./OpenTicket";
import ProgressTicket from "./ProgressTicket";
import ClosedTickets from "./ClosedTickets";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Use useAuth() from AuthContext

  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth(); // Use useAuth() from AuthContext

  if (loading) return <p>Loading...</p>;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRedirect><SignUp /></AuthRedirect>} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><SignUp /></AuthRedirect>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ticket/:ticketId" element={<TicketDetail />} />
        {/* <Route path="/profile" element={<Profile/>}/> */}
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/agentdashboard" element={<AgentDashboard/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/agents" element={<Agents/>}/>
        <Route path="/opentickets" element={<OpenTicket/>}/>
        <Route path="/progresstickets" element={<ProgressTicket/>}/>
        <Route path="/closedtickets" element={<ClosedTickets/>}/>

      </Routes>
    </Router>
    

  );
}

export default App;
