import React, { useState } from "react";
import { auth, db } from "./firebaseConfig"; // Ensure Firestore is imported
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore"; // ✅ Import missing Firestore functions
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged in User UID:", user.uid);
  
      // 🔍 Query Firestore to find user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log("User Data from Firestore:", userData);
  
        if (userData.role === "agent") {
          navigate("/agentdashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.error("Firestore document not found for user.");
        setError("User data not found in Firestore. Please contact support.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-600 py-4 text-center text-white">
        <h1 className="text-3xl font-bold">Ticket Management System</h1>
      </header>

      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 mt-8">
          <h2 className="text-2xl font-bold text-center text-green-600">Login</h2>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mt-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-500 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
