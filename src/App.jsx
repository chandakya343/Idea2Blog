import { useState } from 'react';
import InitialView from './components/InitialView';
import ResultView from './components/ResultView';
import BlogView from './components/BlogView';

const App = () => {
  const [view, setView] = useState('initial');
  const [error, setError] = useState(null);
  const [content, setContent] = useState({
    connected_narrative: '',
    growth_points: '',
    ai_contributions: ''
  });
  const [blogContent, setBlogContent] = useState('');

  const handleError = (error) => {
    console.error('Error:', error);
    setError(error.message);
    setTimeout(() => setError(null), 5000);
  };

  const processIdea = async (idea) => {
    try {
      const response = await fetch('/.netlify/functions/processIdea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      
      if (!response.ok) throw new Error('Failed to process idea');
      
      const data = await response.json();
      setContent(data);
      setView('result');
    } catch (error) {
      handleError(error);
    }
  };

  const refineContent = async (refinement) => {
    try {
      const response = await fetch('/.netlify/functions/refineContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          refinement,
          currentNarrative: content.connected_narrative
        })
      });

      if (!response.ok) throw new Error('Failed to refine content');

      const data = await response.json();
      setContent(data);
    } catch (error) {
      handleError(error);
    }
  };

  const finalizeBlog = async () => {
    try {
      const response = await fetch('/.netlify/functions/finalizeBlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          narrative: content.connected_narrative
        })
      });

      if (!response.ok) throw new Error('Failed to finalize blog');

      const data = await response.json();
      setBlogContent(data.blog_post);
      setView('blog');
    } catch (error) {
      handleError(error);
    }
  };

  const resetApp = () => {
    setView('initial');
    setContent({
      connected_narrative: '',
      growth_points: '',
      ai_contributions: ''
    });
    setBlogContent('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg">
          {error}
        </div>
      )}

      {/* Views */}
      {view === 'initial' && (
        <InitialView onSubmit={processIdea} />
      )}

      {view === 'result' && (
        <ResultView 
          content={content}
          onRefine={refineContent}
          onFinalize={finalizeBlog}
          onReset={resetApp}
        />
      )}

      {view === 'blog' && (
        <BlogView 
          content={blogContent}
          onReset={resetApp}
        />
      )}
    </div>
  );
};

export default App;