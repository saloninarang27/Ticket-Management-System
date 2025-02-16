import { useState } from "react";
import "./index.css";
const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Clicked:", { email, password });
    // Add Firebase Authentication Logic Later
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
      <h2 className="text-2xl font-bold text-center text-blue-600">Ticket Management System</h2>
      
      <form className="mt-6">
        <label className="block mb-2 text-gray-700">Email</label>
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
  
        <label className="block mt-4 mb-2 text-gray-700">Password</label>
        <input 
          type="password" 
          placeholder="Enter your password" 
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
  
        <button className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Login
        </button>
      </form>
  
      <p className="mt-4 text-center text-gray-600">
        Don't have an account? <a href="#" className="text-blue-500 font-semibold hover:underline">Sign up</a>
      </p>
    </div>
  </div>
  
  );
};

export default Home;
