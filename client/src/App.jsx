import { useEffect, useState } from "react";

const API_URL = "https://fb-form.onrender.com/api/feedback";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [remarks, setRemarks] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  // Admin login states
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => setFeedbackList(data));
    }
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginId === "admin" && loginPass === "admin") {
      setIsAdmin(true);
    } else {
      alert("Invalid admin credentials");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, remarks }),
    });
    const newFeedback = await res.json();
    setName("");
    setMessage("");
    setRemarks("");
    if (isAdmin) {
      setFeedbackList([newFeedback, ...feedbackList]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Teacher Feedback Form</h1>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher's Name</label>
            <input
              type="text"
              placeholder="Enter teacher's name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
            <textarea
              placeholder="Write your feedback here"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
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

        {/* Admin Login and Recent Feedback */}
        <div className="mt-10">
          {!isAdmin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Login to View Responses</h2>
              <input
                type="text"
                placeholder="Admin ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full p-2  rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full p-2  rounded"
              />
              <button type="submit" className="w-full py-2 bg-gray-800 text-white rounded">
                Login as Admin
              </button>
            </form>
          ) : (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Recent Feedback</h2>
              {feedbackList.length === 0 ? (
                <p className="text-gray-600">No feedback yet.</p>
              ) : (
                <ul className="space-y-4">
                  {feedbackList.map((fb) => (
                    <li key={fb._id} className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow">
                      <div className="text-lg font-medium text-blue-800">{fb.name}</div>
                      <div className="text-gray-700 mt-1">{fb.message}</div>
                      {fb.remarks && (
                        <div className="text-sm text-gray-600 italic mt-1">Remarks: {fb.remarks}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(fb.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
