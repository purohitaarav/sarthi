import React, { useState } from 'react';
import { Send } from 'lucide-react';

const GuidanceForm = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const sampleQueries = [
    "How can I find inner peace?",
    "What is my dharma?",
    "How to deal with anxiety?",
    "How to overcome fear?",
    "What does the Gita say about karma?"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleSampleClick = (sample) => {
    setQuery(sample);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Spiritual Guidance
        </h2>
        <p className="text-base text-gray-500 max-w-2xl mx-auto">
          Seek timeless wisdom from the scriptures!
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
          {/* Textarea */}
          <div className="mb-6">
            <label htmlFor="query" className="block text-sm font-semibold text-gray-700 mb-2">
              Explain your question or difficulty
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your question here... (e.g., How can I find inner peace?)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none transition-all duration-200 text-gray-800 placeholder-gray-400 bg-gray-50"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full bg-primary-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-primary-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Seeking Wisdom...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Seek Guidance</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sample Queries */}
      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-3 text-center">Try asking:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {sampleQueries.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(sample)}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidanceForm;
