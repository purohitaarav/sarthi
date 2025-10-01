import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Heart, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const SpiritualGuidance = () => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const responseRef = useRef(null);

  useEffect(() => {
    checkOllamaHealth();
  }, []);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [guidance]);

  const checkOllamaHealth = async () => {
    try {
      const response = await api.get('/spiritual/health');
      setOllamaStatus(response.data);
    } catch (error) {
      console.error('Failed to check Ollama health:', error);
      setOllamaStatus({ status: 'unavailable', ollama_available: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setGuidance('');

    try {
      const response = await api.post('/spiritual/ask', {
        question: question.trim(),
        context: context.trim() || undefined,
      });

      setGuidance(response.data.guidance);
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, {
        question: question,
        guidance: response.data.guidance,
        timestamp: response.data.timestamp,
      }]);

      // Clear form
      setQuestion('');
      setContext('');
    } catch (error) {
      console.error('Error getting guidance:', error);
      setError(
        error.response?.data?.message || 
        'Failed to get spiritual guidance. Please ensure Ollama is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'How can I find inner peace in difficult times?',
    'What does the Bhagavad Gita teach about handling stress?',
    'How do I balance my duties with my personal desires?',
    'What is the path to self-realization?',
  ];

  const handleSampleQuestion = (sample) => {
    setQuestion(sample);
  };

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary-600 mr-2" />
          <h1 className="text-4xl font-bold text-gray-900">Spiritual Guidance</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">
          Seek wisdom from the timeless teachings of the Bhagavad Gita
        </p>
        
        {/* Ollama Status */}
        {ollamaStatus && (
          <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
            ollamaStatus.ollama_available 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {ollamaStatus.ollama_available ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-700">
                  Ollama Connected ({ollamaStatus.current_model})
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">
                  Ollama Unavailable - Please start Ollama service
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask for spiritual guidance..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows="4"
              disabled={loading}
            />
          </div>

          {/* Context Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide any additional context about your situation..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows="2"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !ollamaStatus?.ollama_available}
            className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Seeking Guidance...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Ask for Guidance
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Sample Questions */}
      {conversationHistory.length === 0 && (
        <div className="bg-primary-50 rounded-lg border border-primary-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Heart className="w-5 h-5 text-primary-600 mr-2" />
            Sample Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {sampleQuestions.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestion(sample)}
                className="text-left p-3 bg-white rounded-lg border border-primary-200 hover:border-primary-400 hover:shadow-sm transition-all text-sm text-gray-700"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Guidance Response */}
      {guidance && (
        <div ref={responseRef} className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg border border-primary-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 text-primary-600 mr-2" />
            Spiritual Guidance
          </h3>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {guidance}
            </p>
          </div>
        </div>
      )}

      {/* Conversation History */}
      {conversationHistory.length > 1 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Previous Guidance</h3>
          <div className="space-y-4">
            {conversationHistory.slice(0, -1).reverse().map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="mb-3">
                  <p className="font-semibold text-gray-900 mb-1">Question:</p>
                  <p className="text-gray-700">{item.question}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Guidance:</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{item.guidance}</p>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualGuidance;
