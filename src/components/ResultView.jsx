import React, { useState } from 'react';
import { marked } from 'marked';

const ResultView = ({ content, onRefine, onFinalize, onReset }) => {
  const [refinement, setRefinement] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefine = async () => {
    setLoading(true);
    try {
      await onRefine(refinement);
      setRefinement('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Analysis Results</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Connected Narrative</h2>
        <div 
          className="prose max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: marked(content.connected_narrative) }}
        />
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Growth Points</h2>
        <div 
          className="prose max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: marked(content.growth_points) }}
        />
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">AI Contributions</h2>
        <div 
          className="prose max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: marked(content.ai_contributions) }}
        />
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-grow">
          <textarea 
            value={refinement}
            onChange={(e) => setRefinement(e.target.value)}
            placeholder="Enter refinement request..." 
            className="w-full p-4 border rounded mb-2 h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={handleRefine}
            disabled={loading || !refinement.trim()}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Refining...' : 'Refine'}
          </button>
        </div>
        <div className="flex items-end">
          <button 
            onClick={onFinalize}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 h-12"
          >
            Finalize to Blog
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Start New
      </button>
    </div>
  );
};

export default ResultView;