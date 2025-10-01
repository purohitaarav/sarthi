import React from 'react';
import { BookOpen, Sparkles, Quote } from 'lucide-react';

const ResponseDisplay = ({ response }) => {
  if (!response) return null;

  const { query, guidance, verses_referenced, timestamp } = response;

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
                className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-spiritual-gold"
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
                </div>
                
                {verse.chapter_title && (
                  <p className="text-sm text-gray-600 mb-2 italic">
                    {verse.chapter_title}
                  </p>
                )}
                
                <p className="text-gray-800 leading-relaxed">
                  {verse.translation}
                </p>
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
