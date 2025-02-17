import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig"; // Import Firebase Auth & Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // ✅ Define name state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("New User UID:", user.uid);

      // 🔥 Store user data in Firestore with UID as the document ID
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name, // ✅ Store name correctly
        role: "agent", // Set dynamically if needed
      });

      console.log("User added to Firestore with UID as document ID");
      navigate("/agentdashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-600 py-4 text-center text-white">
        <h1 className="text-3xl font-bold">Ticket Management System</h1>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 mt-8">
          <h2 className="text-2xl font-bold text-center text-green-600">Sign Up</h2>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form className="mt-6" onSubmit={handleSignUp}>
            <label className="block mb-2 text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <label className="block mt-4 mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <label className="block mt-4 mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
