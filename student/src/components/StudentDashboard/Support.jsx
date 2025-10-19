import React, { useState } from 'react';

const Support = () => {
  const [form, setForm] = useState({
    subject: '',
    category: 'Courses',
    message: '',
  });

  const [queries, setQueries] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuery = {
      id: Date.now(),
      ...form,
      date: new Date().toLocaleString(),
      status: 'Pending',
    };

    setQueries([newQuery, ...queries]);

    // Clear form
    setForm({ subject: '', category: 'Courses', message: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Support</h2>

      {/* Raise a Query */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Raise a Query</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-md"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="Courses">Courses</option>
            <option value="Technical">Technical Issue</option>
            <option value="Payment">Payment Related</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="message"
            rows="5"
            placeholder="Describe your issue or question..."
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Query
          </button>
        </form>
      </div>

      {/* Past Queries */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Queries</h3>
        {queries.length === 0 ? (
          <p className="text-gray-600">No queries submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {queries.map((query) => (
              <div key={query.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{query.subject}</h4>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      query.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {query.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Category: {query.category}</p>
                <p className="text-gray-700 mb-2">{query.message}</p>
                <p className="text-xs text-gray-400">Submitted on: {query.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
 