import { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext"; // Import useAuth

const TicketForm = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Billing");
  const [contactEmail, setContactEmail] = useState(user?.email || ""); // Use optional chaining
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !description || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "tickets"), {
        title,
        description,
        priority,
        category,
        contactEmail,
        phone,
        createdBy: user?.uid, // Ensure user is not null
        status: "Open",
        createdAt: serverTimestamp(),
      });

      setSuccess("Ticket submitted successfully!");
      setTitle("");
      setDescription("");
      setPriority("Low");
      setCategory("Billing");
      setPhone("");
    } catch (err) {
      setError("Failed to submit ticket. Please try again.");
      console.error("Error adding ticket:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* <div className="w-1/5 bg-gray-800 text-white p-6 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Ticket System</h2>
        <ul className="space-y-4">
          <li><button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded">Dashboard</button></li>
          <li><button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded">Tickets</button></li>
          <li><button className="w-full py-2 bg-red-600 hover:bg-red-500 rounded">Logout</button></li>
        </ul>
      </div> */}

      {/* Main Content */}
      <div className="w-4/5 p-8">
        <h1 className="text-3xl font-bold mb-6">Ticket Management System</h1>

        {/* Ticket Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Submit a Ticket</h2>

          {/* Error & Success Messages */}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              className="border p-3 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="border p-3 rounded col-span-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="border p-3 rounded"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              className="border p-3 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Billing</option>
              <option>Technical</option>
              <option>General Inquiry</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded bg-gray-100"
              value={contactEmail}
              readOnly // Prevents editing
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="border p-3 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              type="submit"
              className="col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
