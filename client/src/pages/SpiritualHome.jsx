import React, { useState } from 'react';
import axios from 'axios';
import GuidanceForm from '../components/GuidanceForm';
import ResponseDisplay from '../components/ResponseDisplay';
import { AlertCircle, Loader } from 'lucide-react';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

const SpiritualHome = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (query) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.post(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.guidanceAsk}`,
        {
          query: query,
          maxVerses: 5
        },
        {
          timeout: API_CONFIG.timeout,
          headers: API_CONFIG.headers
        }
      );

      if (result.data.success) {
        setResponse(result.data);
        // Scroll to response
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        setError(result.data.message || 'Failed to get guidance');
      }
    } catch (err) {
      console.error('Error fetching guidance:', err);

      if (err.response?.status === 503) {
        setError('AI service is currently unavailable. Please try again later.');
      } else if (err.response?.status === 404) {
        setError('No relevant verses found for your query. Try different keywords.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to connect to the server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-serene relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8">
        {/* Form Section */}
        <GuidanceForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="w-full max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-2xl shadow-2xl p-12 border border-gray-100">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Loader className="w-16 h-16 text-spiritual-blue animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-spiritual-gold rounded-full animate-pulse-slow"></div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 animate-pulse">
                  Consulting the wisdom of the Bhagavad Gita...
                </p>
                <p className="text-sm text-gray-500">
                  This may take a few moments
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="w-full max-w-4xl mx-auto mt-12 animate-slide-up">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-1">
                    Unable to Provide Guidance
                  </h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && !isLoading && (
          <ResponseDisplay response={response} />
        )}

        {/* Footer Info */}
        {!response && !isLoading && !error && (
          <div className="w-full max-w-4xl mx-auto mt-16 text-center animate-fade-in">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-spiritual-blue/20">
              <p className="text-gray-600 mb-2">
                🙏 Welcome to Sarthi - Your Spiritual Guide
              </p>
              <p className="text-sm text-gray-500">
                Powered by the Bhagavad Gita and AI • {' '}
                <span className="text-spiritual-blue font-medium">653 verses</span> available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Om Symbol */}
      <div className="fixed bottom-8 right-8 opacity-10 pointer-events-none">
        <div className="text-8xl text-spiritual-gold animate-float">
          ॐ
        </div>
      </div>
    </div>
  );
};

export default SpiritualHome;
