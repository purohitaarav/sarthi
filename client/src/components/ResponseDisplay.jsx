import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Quote, ChevronDown, ChevronUp, PenTool } from 'lucide-react';

const ResponseDisplay = ({ response, hideReflectButton = false }) => {
  const [expandedVerses, setExpandedVerses] = useState({});
  const navigate = useNavigate();

  if (!response) return null;

  const { query, guidance, verses_referenced, timestamp } = response;

  const toggleVerse = (index) => {
    setExpandedVerses((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleReflect = () => {
    navigate('/reflections', {
      state: {
        initialReflection: '', // Empty draft
        query: query,
        timestamp: timestamp,
        response: guidance,
        verses: verses_referenced
      }
    });
  };

  // Basic Markdown Parsing Function
  const renderFormattedText = (text) => {
    if (!text) return null;

    // Split by newlines to handle paragraphs and lists
    const lines = text.split('\n');

    return lines.map((line, index) => {
      // Handle Bullet Points
      const bulletMatch = line.match(/^(\*|-)\s+(.+)/);
      if (bulletMatch) {
        return (
          <div key={index} className="flex items-start mb-2 ml-4">
            <span className="mr-2 text-primary-600">•</span>
            <span className="flex-1">
              {parseBold(bulletMatch[2])}
            </span>
          </div>
        );
      }

      // Handle Paragraphs
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }

      return (
        <p key={index} className="mb-2 leading-relaxed text-gray-700">
          {parseBold(line)}
        </p>
      );
    });
  };

  // Helper to parse **bold** inside a string
  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-slide-up">
      {/* Query */}
      <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-6 mb-6 border border-blue-100/50 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex items-start space-x-4">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <Quote className="w-5 h-5 text-primary-600 transform scale-x-[-1]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-700 uppercase tracking-wide mb-1">Your Question</p>
            <p className="text-lg font-medium text-gray-900 leading-snug">{query}</p>
          </div>
        </div>

        {/* Reflect Button inserted here if visible */}
        {!hideReflectButton && (
          <div className="mt-6 flex justify-end relative z-10">
            <button
              onClick={handleReflect}
              className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:bg-primary-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <PenTool className="w-4 h-4" />
              <span>Reflect on this</span>
            </button>
          </div>
        )}
      </div>

      {/* Guidance */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 mb-8 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Spiritual Guidance
            </h2>
          </div>

          <div className="text-gray-700 text-lg">
            {renderFormattedText(guidance)}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
            <span>AI-generated insights based on scripture</span>
            <span>{new Date(timestamp).toLocaleTimeString()} • {new Date(timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Verses */}
      {verses_referenced?.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/30 rounded-2xl p-1 border border-purple-100 shadow-lg shadow-purple-100/50">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
              <div className="bg-primary-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary-700" />
              </div>
              Referenced Verses
            </h3>

            <div className="space-y-4">
              {verses_referenced.map((verse, index) => (
                <div
                  key={index}
                  onClick={() => toggleVerse(index)}
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${expandedVerses[index]
                      ? 'shadow-md border-primary-200'
                      : 'shadow-sm border-gray-200 hover:border-primary-200 hover:shadow-md'
                    }`}
                >
                  <div className="p-5 flex justify-between items-center group">
                    <span className="font-bold text-gray-800 group-hover:text-primary-700 transition-colors">
                      Bhagavad Gita {verse.reference}
                    </span>
                    <div className={`p-1 rounded-full bg-gray-50 group-hover:bg-primary-50 transition-colors ${expandedVerses[index] ? 'rotate-180' : ''}`}>
                      <ChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-primary-600`} />
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${expandedVerses[index] ? 'max-h-[500px] opacity-100 px-5 pb-5' : 'max-h-0 opacity-0 px-5'
                      }`}
                  >
                    <p className="text-gray-900 font-medium leading-relaxed italic border-l-4 border-primary-300 pl-4 py-1 bg-gray-50 rounded-r-lg mb-4">
                      "{verse.translation}"
                    </p>
                    {verse.purport && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider block mb-1">Purport</span>
                        {verse.purport}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
