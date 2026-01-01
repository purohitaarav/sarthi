import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuidanceForm from '../components/GuidanceForm';
import ResponseDisplay from '../components/ResponseDisplay';
import { AlertCircle, Loader, Hourglass } from 'lucide-react';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

const HISTORY_STORAGE_KEY = '@sarthi_past_queries';

const SpiritualHome = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedScripture, setSelectedScripture] = useState('gita');

  const location = useLocation();
  const navigate = useNavigate();

  // Check for history navigation
  useEffect(() => {
    if (location.state?.historyResponse) {
      setResponse(location.state.historyResponse);
      // Clear state to avoid persistent history view on refresh if desired, 
      // but keeping it is fine. 
      // Maybe scroll to it?
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [location.state]);

  const handleSubmit = async (query) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const requestUrl = `${API_CONFIG.baseURL}${API_ENDPOINTS.guidanceAsk}`;
    const startTime = Date.now();

    try {
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

      if (result.data.success) {
        setResponse(result.data);

        // Save to History
        try {
          const newHistoryItem = {
            query: query,
            timestamp: new Date().toISOString(),
            response: result.data // Store full response structure
          };

          const existingHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
          const updatedHistory = [newHistoryItem, ...existingHistory];
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch (storageErr) {
          console.error('Failed to save to history:', storageErr);
        }

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
      console.error('Error fetching guidance:', err);
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Request timed out. Please try again with a simpler query.');
      } else if (err.response?.status === 503) {
        setError('AI service is currently unavailable. Please try again later.');
      } else {
        setError(`Failed to get guidance: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 relative">
      {/* Main Content */}
      <div className="relative z-10 px-4 py-8">

        {/* Scripture Selector */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Your Wisdom Source
            </label>
            <select
              value={selectedScripture}
              onChange={(e) => setSelectedScripture(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <option value="gita">📖 Bhagavad Gita</option>
              <option value="bible">✝️ Bible</option>
              <option value="quran">☪️ Quran</option>
              <option value="torah">🕍 Torah</option>
            </select>
          </div>
        </div>

        {selectedScripture === 'gita' ? (
          <>
            {/* Form Section */}
            <GuidanceForm onSubmit={handleSubmit} isLoading={isLoading} />

            {/* Loading State */}
            {isLoading && (
              <div className="w-full max-w-4xl mx-auto mt-12">
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    < Loader className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-lg text-gray-600 animate-pulse">
                      Consulting the wisdom of the Bhagavad Gita...
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
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-600 mb-2">
                    Spiritual guidance from timeless wisdom traditions
                  </p>
                  <p className="text-sm text-gray-500">
                    Powered by the Bhagavad Gita and AI • {' '}
                    <span className="text-primary-600 font-medium">653 verses</span> available
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Coming Soon Message for Bible/Quran/Torah */
          <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <Hourglass className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 capitalize">
                {selectedScripture} Coming Soon
              </h2>
              <p className="text-lg text-gray-600 max-w-lg mb-8 leading-relaxed">
                We're working on bringing wisdom from the <span className="capitalize">{selectedScripture}</span> to Sarthi.
                <br /><br />
                For now, explore guidance from the Bhagavad Gita.
              </p>
              {/* Back button removed to match iOS */}
            </div>
          </div>
        )}
      </div>

      {/* Floating Om Symbol */}
      <div className="fixed bottom-8 right-8 opacity-5 pointer-events-none">
        <div className="text-8xl text-gray-400 animate-float">
          ॐ
        </div>
      </div>
    </div>
  );
};

export default SpiritualHome;
