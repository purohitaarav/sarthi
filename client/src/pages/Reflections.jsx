import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../services/api';

const Reflections = () => {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reflection_text: '',
    verse_id: '',
    chapter_id: '',
  });

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      const response = await api.get('/reflections');
      setReflections(response.data);
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reflections', formData);
      setFormData({ reflection_text: '', verse_id: '', chapter_id: '' });
      setShowForm(false);
      fetchReflections();
    } catch (error) {
      console.error('Error creating reflection:', error);
      alert('Failed to create reflection');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reflection?')) {
      try {
        await api.delete(`/reflections/${id}`);
        fetchReflections();
      } catch (error) {
        console.error('Error deleting reflection:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reflections...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reflections</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reflection
        </button>
      </div>

      {/* Add Reflection Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">New Reflection</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Reflection
              </label>
              <textarea
                value={formData.reflection_text}
                onChange={(e) => setFormData({ ...formData, reflection_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="4"
                required
                placeholder="Share your thoughts and reflections..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verse ID (optional)
                </label>
                <input
                  type="number"
                  value={formData.verse_id}
                  onChange={(e) => setFormData({ ...formData, verse_id: e.target.value, chapter_id: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter ID (if no verse)
                </label>
                <input
                  type="number"
                  value={formData.chapter_id}
                  onChange={(e) => setFormData({ ...formData, chapter_id: e.target.value, verse_id: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 1"
                  disabled={!!formData.verse_id}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reflections List */}
      <div className="space-y-4">
        {reflections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reflections yet. Add your first reflection!
          </div>
        ) : (
          reflections.map((reflection) => (
            <div key={reflection.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-700 whitespace-pre-line">{reflection.reflection_text}</p>
                  {reflection.verse_id && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Verse:</span> {reflection.verse_id}
                    </div>
                  )}
                  {reflection.chapter_id && (
                    <div className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">Chapter:</span> {reflection.chapter_id}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(reflection.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(reflection.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Delete reflection"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reflections;
