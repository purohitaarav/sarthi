import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Database, Code, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await api.get('/health');
      setHealth(response.data);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({ status: 'ERROR', message: 'Failed to connect to server' });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Code,
      title: 'React Frontend',
      description: 'Modern React application with React Router and Tailwind CSS',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Server,
      title: 'Express Backend',
      description: 'RESTful API built with Node.js and Express',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: Database,
      title: 'SQLite Database',
      description: 'Lightweight and efficient SQLite database integration',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Sarthi
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A full-stack web application template with React, Express, and SQLite
        </p>
        
        {/* Health Status */}
        <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            loading ? 'bg-yellow-500' : health?.status === 'OK' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium text-gray-700">
            {loading ? 'Checking...' : health?.status === 'OK' ? 'Server Online' : 'Server Offline'}
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
        <div className="space-y-4">
          <Link
            to="/users"
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            to="/items"
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900">Browse Items</h3>
              <p className="text-sm text-gray-600">Explore and manage items</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
