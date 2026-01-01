import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Trash2, ChevronRight, Sparkles } from 'lucide-react';

const STORAGE_KEY = '@sarthi_past_queries';

const History = () => {
    const [pastQueries, setPastQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPastQueries();
    }, []);

    const loadPastQueries = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPastQueries(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Error loading past queries:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear all past queries?')) {
            try {
                localStorage.removeItem(STORAGE_KEY);
                setPastQueries([]);
            } catch (err) {
                console.error('Error clearing history:', err);
            }
        }
    };

    const handleQueryPress = (pastQuery) => {
        if (pastQuery.response) {
            // Navigate to Main "SplriutalHome" but with pre-filled state to show response
            // Since SpiritualHome doesn't natively support showing a response from state easily without logic changes,
            // we can update SpiritualHome to check for location.state.result

            // Actually, responseDisplay in SpiritualHome renders response if `response` state is set.
            // We can iterate on SpiritualHome to check for location state.

            navigate('/', {
                state: {
                    historyResponse: {
                        success: true,
                        query: pastQuery.query,
                        guidance: pastQuery.response.guidance,
                        verses_referenced: pastQuery.response.verses_referenced || [],
                        timestamp: pastQuery.timestamp
                    }
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 relative">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">History</h1>
                        <p className="text-gray-500 mt-1">Revisit the wisdom shared with you</p>
                    </div>
                    {pastQueries.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                            title="Clear History"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : pastQueries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <HistoryIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No past queries yet</h3>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Your previous questions and guidance will appear here
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Ask a Question
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 pb-20">
                        {pastQueries.map((pastQuery, index) => (
                            <div
                                key={index}
                                onClick={() => handleQueryPress(pastQuery)}
                                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-primary-700 transition-colors">
                                            {pastQuery.query}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {new Date(pastQuery.timestamp).toLocaleDateString()} at {new Date(pastQuery.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Om Symbol */}
            <div className="fixed bottom-8 right-8 opacity-5 pointer-events-none">
                <div className="text-9xl text-gray-400">
                    ॐ
                </div>
            </div>
        </div>
    );
};

export default History;
