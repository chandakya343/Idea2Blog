import React from 'react';
import { marked } from 'marked';

const BlogView = ({ content, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Final Blog Post</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div 
          className="prose max-w-none markdown-content"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
      </div>
      <button
        onClick={onReset}
        className="mt-8 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Start New
      </button>
    </div>
  );
};

export default BlogView;