import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Import Firebase Auth
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
      navigate("/dashboard"); // Redirect after successful signup
    } catch (err) {
      console.error("Signup Error:", err.message); // Debugging output
      setError(err.message); // Show actual error message
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> {/* Changed to flex column */}
    {/* Header Section */}
    <header className="bg-green-600 py-4 text-center text-white">
      <h1 className="text-3xl font-bold">Ticket Management System</h1> {/* Attractive heading */}
    </header>

    <div className="flex-grow flex items-center justify-center"> {/* Center the form */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 mt-8"> {/* Added margin-top */}
        <h2 className="text-2xl font-bold text-center text-green-600">Sign Up</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          {/* ... (your existing form elements) */}
          <label className="block mb-2 text-gray-700">Email</label>
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
