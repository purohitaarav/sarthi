import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

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
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-spiritual-gold animate-pulse-slow" />
          <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-spiritual bg-clip-text text-transparent mx-3">
            Spiritual Guidance
          </h2>
          <Sparkles className="w-6 h-6 text-spiritual-blue animate-pulse-slow" />
        </div>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Seek timeless wisdom from the scriptures!
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
          {/* Textarea */}
          <div className="mb-6">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Explain your question or difficulty
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your question here... (e.g., How can I find inner peace?)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spiritual-blue focus:border-transparent resize-none transition-all duration-200 text-gray-800 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full bg-gradient-spiritual text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
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
      <div className="mt-8 animate-fade-in">
        <p className="text-sm text-gray-600 mb-3 text-center">Try asking:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {sampleQueries.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(sample)}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-spiritual-blue/30 text-spiritual-blue rounded-full text-sm hover:bg-spiritual-blue/10 hover:border-spiritual-blue transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
