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

    const requestUrl = `${API_CONFIG.baseURL}${API_ENDPOINTS.guidanceAsk}`;
    console.log('Making request to:', requestUrl);
    console.log('Base URL:', API_CONFIG.baseURL);
    console.log('Endpoint:', API_ENDPOINTS.guidanceAsk);
    console.log('Timeout set to:', API_CONFIG.timeout, 'ms');
    const startTime = Date.now();

    try {
      // Make request to guidance/ask endpoint (matches web version)
      const result = await axios.post(
        requestUrl,
        {
          query: query,
          maxVerses: 5
        },
        {
          timeout: API_CONFIG.timeout,
          headers: API_CONFIG.headers
        }
      );

      const duration = Date.now() - startTime;
      console.log('Request completed in:', duration, 'ms');

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
        setError(result.data.message || result.data.error || 'Failed to get guidance');
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error('Error fetching guidance:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Request duration before error:', duration, 'ms');
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);

      // Handle timeout errors
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Timeout')) {
        setError('Request timed out. The AI service is taking longer than expected. Please try again with a simpler query.');
      } else if (err.response?.status === 500) {
        // Server error - check for specific database errors
        const errorData = err.response?.data;
        if (errorData?.error?.includes('no such table') || errorData?.error?.includes('SQLITE_ERROR')) {
          setError('The server database is not fully set up. Please contact the administrator to initialize the database.');
        } else if (errorData?.error) {
          setError(`Server error: ${errorData.error}. Please try again later or contact support.`);
        } else {
          setError('The server encountered an error. Please try again later.');
        }
      } else if (err.response?.status === 503) {
        setError('AI service is currently unavailable. Please try again later.');
      } else if (err.response?.status === 404) {
        setError('No relevant verses found for your query. Try different keywords.');
      } else if (err.response?.status === 504) {
        setError('The server took too long to respond. Please try again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK' || err.code === 'ERR_INTERNET_DISCONNECTED') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(`Failed to get guidance: ${err.message || 'Unknown error'}. Please try again.`);
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
                Spiritual guidance from timeless wisdom traditions
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
