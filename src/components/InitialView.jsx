import React, { useState } from 'react';

const InitialView = ({ onSubmit }) => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(idea);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Idea to Blog Pipeline</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Share Your Idea</h2>
        <textarea 
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter your brain dump here..." 
          className="w-full p-4 border rounded mb-4 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSubmit}
          disabled={loading || !idea.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              Processing...
              <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : 'Process'}
        </button>
      </div>
    </div>
  );
};

export default InitialView;