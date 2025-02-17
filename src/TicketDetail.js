import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

const TicketDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      const ticketRef = doc(db, "tickets", ticketId);
      const ticketSnap = await getDoc(ticketRef);
      if (ticketSnap.exists()) {
        setTicket({ id: ticketSnap.id, ...ticketSnap.data() });
      } else {
        console.log("Ticket not found");
      }
    };

    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    const commentsRef = query(collection(db, "tickets", ticketId, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [ticketId]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    const user = auth.currentUser;
    await addDoc(collection(db, "tickets", ticketId, "comments"), {
      text: newComment,
      createdBy: user.email,
      createdAt: new Date(),
    });
    setNewComment("");
  };

  if (!ticket) return <p>Loading ticket details...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <p className="text-gray-700">{ticket.description}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Priority:</strong> {ticket.priority}</p>
      <p><strong>Category:</strong> {ticket.category}</p>
      <p><strong>Contact Email:</strong> {ticket.contactEmail}</p>
      <p><strong>Phone:</strong> {ticket.phone}</p>

      <h2 className="text-xl font-bold mt-6">Comments</h2>
      <ul className="mt-3">
        {comments.map((comment) => (
          <li key={comment.id} className="p-2 bg-gray-100 rounded-lg shadow mt-2">
            <p><strong>{comment.createdBy}:</strong> {comment.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={addComment} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default TicketDetail;
