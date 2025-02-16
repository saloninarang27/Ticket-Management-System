import { useState } from "react";
import { db, storage } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const TicketForm = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Billing");
  const [contactEmail, setContactEmail] = useState(user.email);
  const [phone, setPhone] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (file) => {
    setUploading(true);
    setError("");

    const storageRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        setError("File upload failed. Please try again.");
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setAttachmentUrl(downloadURL);
        setUploading(false);
        setSuccess("File uploaded successfully!");
      }
    );
  };

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
        attachmentUrl,
        createdBy: user.uid,
        status: "Open",
        createdAt: serverTimestamp(),
      });

      setSuccess("Ticket submitted successfully!");
      setTitle("");
      setDescription("");
      setPriority("Low");
      setCategory("Billing");
      setPhone("");
      setAttachment(null);
      setAttachmentUrl("");
    } catch (err) {
      setError("Failed to submit ticket. Please try again.");
      console.error("Error adding ticket:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Submit a Ticket</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-md"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-md"
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="Billing">Billing</option>
          <option value="Technical">Technical</option>
          <option value="Account">Account</option>
        </select>

        <input
          type="email"
          placeholder="Contact Email"
          value={contactEmail}
          readOnly
          className="border p-2 rounded-md bg-gray-100"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded-md"
          required
        />

        {/* File Upload */}
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => {
            if (e.target.files[0]) {
              setAttachment(e.target.files[0]);
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="border p-2 rounded-md"
        />
        {uploading && <p className="text-blue-500">Uploading...</p>}
        {attachmentUrl && (
          <p className="text-green-500">
            File uploaded: <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">View</a>
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          disabled={uploading}
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
