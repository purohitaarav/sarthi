import React, { useState } from 'react';
import { BookOpen, Sparkles, Quote, ChevronDown, ChevronUp } from 'lucide-react';

const ResponseDisplay = ({ response }) => {
  const [expandedVerses, setExpandedVerses] = useState({});

  if (!response) return null;

  const { query, guidance, verses_referenced, timestamp } = response;

  const toggleVerse = (index) => {
    setExpandedVerses(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-slide-up">
      {/* Query Display */}
      <div className="bg-gradient-to-r from-spiritual-blue/10 to-spiritual-gold/10 rounded-xl p-6 mb-6 border border-spiritual-blue/20">
        <div className="flex items-start space-x-3">
          <Quote className="w-6 h-6 text-spiritual-blue flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Your Question:</p>
            <p className="text-lg font-medium text-gray-800">{query}</p>
          </div>
        </div>
      </div>

      {/* Guidance Response */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-spiritual-gold" />
          <h2 className="text-2xl font-display font-bold text-gray-800">
            Spiritual Guidance
          </h2>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {guidance}
          </p>
        </div>

        {/* Timestamp */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Received: {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Referenced Verses */}
      {verses_referenced && verses_referenced.length > 0 && (
        <div className="bg-gradient-serene rounded-2xl p-6 md:p-8 border border-spiritual-gold/30">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="w-6 h-6 text-spiritual-blue" />
            <h3 className="text-xl font-display font-bold text-gray-800">
              Referenced Verses
            </h3>
          </div>

          <div className="grid gap-4">
            {verses_referenced.map((verse, index) => (
              <div
                key={index}
                onClick={() => toggleVerse(index)}
                className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-spiritual-gold cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-spiritual text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-spiritual-blue">
                      Bhagavad Gita {verse.reference}
                    </span>
                  </div>
                  {expandedVerses[index] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-spiritual-blue transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-spiritual-blue transition-colors" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Translation
                    </span>
                    <p className="text-gray-900 leading-relaxed font-bold">
                      {verse.translation}
                    </p>
                  </div>

                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandedVerses[index] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}>
                    <div className="overflow-hidden">
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          Purport
                        </span>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {verse.purport || "No purport available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verse Count Badge */}
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white text-spiritual-blue text-sm font-medium shadow-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              {verses_referenced.length} verse{verses_referenced.length !== 1 ? 's' : ''} referenced
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
