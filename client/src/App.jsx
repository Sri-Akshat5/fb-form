import { useEffect, useState } from "react";

const API_URL = "https://fb-form-eight.vercel.app/api/feedback";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [remarks, setRemarks] = useState("");


  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setFeedbackList(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    const newFeedback = await res.json();
    setFeedbackList([newFeedback, ...feedbackList]);
    setName("");
    setMessage("");
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
  <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8">
    <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Teacher Feedback Form</h1>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher's Name</label>
        <input
          type="text"
          placeholder="Enter teacher's name"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
        <textarea
          placeholder="Write your feedback here"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
        <input
          type="text"
          placeholder="Any remarks..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
      >
        Submit Feedback
      </button>
    </form>

    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Recent Feedback</h2>
      <ul className="space-y-4">
        {feedbackList.map((fb) => (
          <li key={fb._id} className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow">
            <div className="text-lg font-medium text-blue-800">{fb.name}</div>
            <div className="text-gray-700 mt-1">{fb.message}</div>
            {fb.remarks && <div className="text-sm text-gray-600 italic mt-1">Remarks: {fb.remarks}</div>}
            <div className="text-xs text-gray-500 mt-2">{new Date(fb.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

  );
}

export default App;
