import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Trash2, X, MessageSquare, Quote, ChevronRight, BookOpen } from 'lucide-react';
import ResponseDisplay from '../components/ResponseDisplay';

const REFLECTIONS_STORAGE_KEY = '@sarthi_reflections';

const Reflections = () => {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ reflection_text: '' });
  const [contextData, setContextData] = useState(null);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReflections();

    // Check for navigation state (from "Reflect on this")
    if (location.state?.query) {
      if (location.state.initialReflection !== undefined) {
        setFormData({ reflection_text: location.state.initialReflection || '' });
      }
      setContextData({
        query: location.state.query,
        timestamp: location.state.timestamp || new Date().toISOString(),
        response: location.state.response,
        verses: location.state.verses,
      });
      setShowForm(true);
      // Clear state so reload doesn't re-trigger? 
      // Actually React Router state persists on reload usually, but that's fine.
      // We might want to replace history to clear it, but let's keep it simple.
    }
  }, [location.state]);

  const fetchReflections = () => {
    try {
      const stored = localStorage.getItem(REFLECTIONS_STORAGE_KEY);
      if (stored) {
        setReflections(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reflection_text.trim()) return;

    try {
      const newReflection = {
        id: Date.now().toString(),
        reflection_text: formData.reflection_text,
        created_at: new Date().toISOString(),
        query: contextData?.query,
        response_data: contextData?.response ? {
          guidance: contextData.response,
          verses: contextData.verses || [],
          timestamp: contextData.timestamp
        } : undefined
      };

      const updatedReflections = [newReflection, ...reflections];
      localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updatedReflections));
      setReflections(updatedReflections);

      setFormData({ reflection_text: '' });
      setContextData(null);
      setShowForm(false);

      // Clear navigation state if any
      if (location.state?.query) {
        navigate(location.pathname, { replace: true, state: {} });
      }

    } catch (error) {
      console.error('Error creating reflection:', error);
      alert('Failed to save reflection');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reflection?')) {
      try {
        const updatedReflections = reflections.filter(r => r.id !== id);
        localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updatedReflections));
        setReflections(updatedReflections);
      } catch (error) {
        console.error('Error deleting reflection:', error);
      }
    }
  };

  const handleOpenContext = (data) => {
    if (data.query) {
      // Prepare preview data structure matching ResponseDisplay props
      setPreviewData({
        query: data.query,
        guidance: data.response || (data.response_data && data.response_data.guidance),
        verses_referenced: data.verses || (data.response_data && data.response_data.verses) || [],
        timestamp: data.timestamp
      });
      setModalVisible(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reflections</h1>
            <p className="text-gray-500 mt-1">Reflect on the teachings of the Gita</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setContextData(null);
            }}
            className={`flex items-center px-4 py-2 rounded-xl transition-colors font-medium ${showForm
                ? 'bg-gray-500 text-white hover:bg-gray-600'
                : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
          >
            {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {showForm ? 'Cancel' : 'Add'}
          </button>
        </div>

        {/* Add Reflection Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">New Reflection</h2>

            {contextData && (
              <div
                onClick={() => handleOpenContext(contextData)}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center mb-1 text-primary-700 font-semibold text-xs uppercase tracking-wide">
                  <Quote className="w-3 h-3 mr-1" />
                  Reflecting on Query:
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                </div>
                <p className="text-gray-800 italic text-sm mb-1 line-clamp-2">{contextData.query}</p>
                <p className="text-gray-500 text-xs">{new Date(contextData.timestamp).toLocaleDateString()}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={formData.reflection_text}
                onChange={(e) => setFormData({ ...formData, reflection_text: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all placeholder-gray-400"
                rows="4"
                placeholder="Share your thoughts and reflections..."
              />

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Save Reflection
              </button>
            </form>
          </div>
        )}

        {/* Reflections List */}
        <div className="space-y-6">
          {reflections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No reflections yet</h3>
              <p className="text-gray-500 max-w-sm">
                Write down your personal insights and realisations from the Gita.
              </p>
            </div>
          ) : (
            reflections.map((reflection) => (
              <div key={reflection.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {reflection.query && (
                  <div
                    onClick={() => reflection.response_data && handleOpenContext({
                      query: reflection.query,
                      response: reflection.response_data.guidance,
                      verses: reflection.response_data.verses,
                      timestamp: reflection.response_data.timestamp || reflection.created_at
                    })}
                    className={`bg-primary-50 border-l-4 border-primary-300 rounded-r-lg p-3 mb-4 ${reflection.response_data ? 'cursor-pointer hover:bg-primary-100/50' : ''} transition-colors relative group`}
                  >
                    <div className="flex items-center text-primary-800 font-semibold text-xs italic mb-1">
                      <Quote className="w-3 h-3 mr-1.5" />
                      Re: {reflection.query}
                    </div>
                    {reflection.response_data && (
                      <ChevronRight className="w-4 h-4 text-primary-400 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                )}

                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed flex-1">
                    {reflection.reflection_text}
                  </p>
                  <button
                    onClick={() => handleDelete(reflection.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                  {/* Tags if any (legacy compatibility) */}
                  <div className="flex gap-2">
                    {reflection.verse_id && (
                      <span className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                        <BookOpen className="w-3 h-3 mr-1" /> Verse {reflection.verse_id}
                      </span>
                    )}
                    {reflection.chapter_id && (
                      <span className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                        <BookOpen className="w-3 h-3 mr-1" /> Chapter {reflection.chapter_id}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-medium ml-auto">
                    {new Date(reflection.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Full Screen Modal for Context */}
      {modalVisible && previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white sm:p-0 overflow-hidden">
          <div className="w-full h-full bg-gray-50 flex flex-col relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Original Response</h2>
              <button
                onClick={() => setModalVisible(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-8">
              <div className="max-w-4xl mx-auto pb-20">
                <ResponseDisplay
                  response={previewData}
                  hideReflectButton={true}
                />
              </div>
            </div>

            {/* Floating Om */}
            <div className="absolute bottom-8 right-8 opacity-5 pointer-events-none">
              <span className="text-9xl text-gray-400">ॐ</span>
            </div>
          </div>
        </div>
      )}

      {/* Background Floating Om */}
      <div className="fixed bottom-8 right-8 opacity-5 pointer-events-none z-0">
        <span className="text-9xl text-gray-400">ॐ</span>
      </div>
    </div>
  );
};

export default Reflections;
