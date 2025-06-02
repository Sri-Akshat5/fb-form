import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "https://fb-form.onrender.com/api/feedback";

function App() {
  // Form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [remarks, setRemarks] = useState("");
  
  // Feedback data state
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Admin auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Fetch feedback data
  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched feedback data:", data);
      setFeedbackList(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch feedback data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when admin logs in
  useEffect(() => {
    if (isAdmin) {
      fetchFeedback();
    }
  }, [isAdmin]);

  // Handle admin login
  const handleLogin = (e) => {
  e.preventDefault();
  if (loginId.toLowerCase() === "admin" && loginPass.toLowerCase() === "admin@123") {
    setIsAdmin(true);
  } else {
    alert("Invalid admin credentials");
  }
};


  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, remarks }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const newFeedback = await res.json();
      setName("");
      setMessage("");
      setRemarks("");
      
      if (isAdmin) {
        setFeedbackList((prev) => [newFeedback, ...prev]);
      } else {
        alert("Thank you for your feedback!");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  // Export to Excel
  const downloadFeedback = () => {
    try {
      const dataToExport = feedbackList.map(({ name, message, remarks, createdAt }) => ({
        Name: name,
        Feedback: message,
        Remarks: remarks,
        Date: new Date(createdAt).toLocaleString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const fileBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

      saveAs(fileBlob, "teacher_feedback.xlsx");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("Failed to export feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6 text-center">
          Teacher Feedback Form
        </h1>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher's Name
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            >
              <option value="" disabled>Select a teacher</option>
              <option value="Sanjeev Kumar Rai">Sanjeev Kumar Rai</option>
              <option value="Ashwani Kumar Chauhan">Ashwani Kumar Chauhan</option>
              <option value="Naveen Yadav">Naveen Yadav</option>
              <option value="Saikat Sengupta">Saikat Sengupta</option>
              <option value="Amit Gairola">Amit Gairola</option>
              <option value="Sohail Ahmed">Sohail Ahmed</option>
              <option value="Jaswant Soni">Jaswant Soni</option>
              <option value="Nisha Bhakar">Nisha Bhakar</option>
              <option value="Sher Mohd">Sher Mohd</option>
              <option value="Abhishek Kaushik">Abhishek Kaushik</option>
              <option value="Mohd Hassan Abbas">Mohd Hassan Abbas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea
              placeholder="Write your feedback here"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
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

        {/* Admin Login and Feedback Section */}
        <div className="mt-10">
          {!isAdmin ? (
            <form onSubmit={handleLogin} className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Admin Login to View Responses
              </h2>
              <input
                type="text"
                placeholder="Admin ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition duration-300"
              >
                Login as Admin
              </button>
            </form>
          ) : (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Recent Feedback
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchFeedback()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setIsAdmin(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading feedback...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={fetchFeedback}
                    className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
                  >
                    Retry
                  </button>
                </div>
              ) : feedbackList.length > 0 ? (
                <>
                  <button
                    onClick={downloadFeedback}
                    className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
                  >
                    Download Feedback (Excel)
                  </button>

                  <ul className="space-y-4">
                    {feedbackList.map((fb) => (
                      <li
                        key={fb._id}
                        className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow hover:shadow-md transition duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-lg font-medium text-blue-800">
                            {fb.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(fb.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-gray-700 mt-2 whitespace-pre-wrap">
                          {fb.message}
                        </div>
                        {fb.remarks && (
                          <div className="text-sm text-gray-600 italic mt-2">
                            <span className="font-medium">Remarks:</span> {fb.remarks}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No feedback submissions yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;