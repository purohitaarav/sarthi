import React, { useState } from 'react';
import { BookOpen, Sparkles, Quote, ChevronDown, ChevronUp } from 'lucide-react';

const ResponseDisplay = ({ response }) => {
  const [expandedVerses, setExpandedVerses] = useState({});

  if (!response) return null;

  const { query, guidance, verses_referenced, timestamp } = response;

  const toggleVerse = (index) => {
    setExpandedVerses((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-slide-up">
      {/* Query */}
      <div className="bg-gradient-to-r from-spiritual-blue/10 to-spiritual-gold/10 rounded-xl p-6 mb-6 border border-spiritual-blue/20">
        <div className="flex items-start space-x-3">
          <Quote className="w-6 h-6 text-spiritual-blue mt-1" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Your Question:</p>
            <p className="text-lg font-medium text-gray-800">{query}</p>
          </div>
        </div>
      </div>

      {/* Guidance */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-spiritual-gold" />
          <h2 className="text-2xl font-display font-bold text-gray-800">
            Spiritual Guidance
          </h2>
        </div>

        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {guidance}
        </p>

        <p className="text-xs text-gray-500 mt-6 pt-4 border-t">
          Received: {new Date(timestamp).toLocaleString()}
        </p>
      </div>

      {/* Verses */}
      {verses_referenced?.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-white rounded-2xl p-6 border">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-spiritual-blue" />
            Referenced Verses
          </h3>

          <div className="space-y-4">
            {verses_referenced.map((verse, index) => (
              <div
                key={index}
                onClick={() => toggleVerse(index)}
                className="bg-white rounded-xl p-6 cursor-pointer"
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-spiritual-blue">
                    Bhagavad Gita {verse.reference}
                  </span>
                  {expandedVerses[index] ? <ChevronUp /> : <ChevronDown />}
                </div>

                <p className="mt-2 text-gray-700">{verse.translation}</p>

                {expandedVerses[index] && (
                  <p className="mt-3 text-gray-600">{verse.purport}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
